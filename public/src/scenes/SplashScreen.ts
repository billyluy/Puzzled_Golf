export class SplashScreen extends Phaser.Scene{
    private cloud;
    private hill;
    private grass;
    private music;

    constructor(){
        super("splashScreen");
    }
    init(){

    }
    preload(){
        this.load.image("logo", "../dist/assets/puzzled_golf_logo.png");
 
        this.load.image("clouds", "../dist/assets/clouds.png");
        this.load.image("hills", "../dist/assets/hills.png");
        this.load.image("ground", "../dist/assets/ground.png");

        this.load.audio("summer", "../dist/assets/audio/bensound-summer.mp3");
        this.load.spritesheet("golfer", "../dist/assets/male_golfer.png",{frameWidth: 256,
            frameHeight: 256
        });
    }
    create(){
        localStorage.setItem("golfLevel1HighScore", "1000");
        localStorage.setItem("golfLevel2HighScore", "1000");
        this.cameras.main.setBackgroundColor(0x9ce1e1);//sky background color 

        var game_width = this.game.renderer.width;
        var game_height = this.game.renderer.height;

        //add background layers 
        this.cloud = this.add.tileSprite(0,0, game_width, game_height, "clouds").setScale(1.37);
        this.hill = this.add.tileSprite(0,0, game_width, game_height, "hills").setScale(1.37);
        this.grass = this.add.tileSprite(0,0, game_width, game_height, "ground").setScale(1.37);
        
        this.cloud.setOrigin(0,0);
        this.hill.setOrigin(0,0);
        this.grass.setOrigin(0,0);

        //person walking animation 
        const person = this.add.sprite(this.game.renderer.width/2 - 500, this.game.renderer.height * 0.55, "golfer", 0).setScale(2);
        this.anims.create({
            key: "walk",
            frames: this.anims.generateFrameNumbers("golfer", {start: 0, end: 4}),
            repeat: -1,
            frameRate: 5
        });
        person.play("walk");

        //audio 
        var music_config = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        this.music = this.sound.add("summer");
        this.music.play(music_config);

        //statics (logo and click here)
        var game_logo = this.add.image(this.game.renderer.width/2,this.game.renderer.height * 0.35,"logo");
        game_logo.setScale(0.9);

        let text = this.add.text(this.game.renderer.width/2 - 200,this.game.renderer.height * 0.85, "[Press Here To Continue]",
        { fontSize: '30px', color : '#000000', fontStyle: 'bold'}) //c4a727
        text
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            text.setStyle({ fill: '#FFFFFF'}); //ffff66
        })
        .on('pointerout', () => {
            text.setStyle({ fill: '#000000'});
        })
        .on('pointerdown', () => {
            this.music.stop();
            this.scene.start('mainMenu');
        });

        
    }

    update(){
        //background layers scroll (clouds scroll slower than hill)
        this.cloud.tilePositionX += 0.6;
        this.hill.tilePositionX += 0.85;
        
    }
}