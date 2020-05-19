import { Hud } from '../Hud';
import { InGameMenu } from '../InGameMenu';
import { Ball } from '../../objects/ball';
import { Door } from '../../objects/Door';

export class Level2 extends Phaser.Scene{
    private menu;

    private ball;
    private hole;    

    private boolWin;

    private wall_sound;
    private win_sound;
    private ball_in_hole;
    private water_spalsh;



    constructor(){
        super("level2");
    }
    init(){
        this.boolWin = false;
    }
    preload(){
        this.load.tilemapTiledJSON('map2', './assets/map/level2.json');
        this.load.image("bkgrnd2", "./assets/background/level2_background.png");
    }
    create(){
        //----------------------------------------------------------------------------
        // sound effects
        this.wall_sound = this.sound.add("wall_bounce");
        this.ball_in_hole = this.sound.add("ball_in_hole");
        this.win_sound = this.sound.add("win_music");
        this.water_spalsh = this.sound.add("water_splash");

        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        this.add.tileSprite(0,0, this.game.renderer.width, this.game.renderer.width, "bkgrnd2").setOrigin(0,0).setScale(1.37);
        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        if(this.scene.manager.getScene("winScreen") != null){
            this.scene.remove("winScreen");
        }
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 2});
        this.createWindow(Hud, "hud", 0, 0, {level : 2});
        this.scene.setVisible(false, "inGameMenu") ;
        this.events.emit('setLevel');
        this.menu = this.add.sprite(this.game.renderer.width - 100, 30, 'button', 3);
        this.menu.setInteractive();
        this.setHighLight(this.menu);
        this.menu.on('pointerup', function () {
            this.menu.setTint( 1 * 0xffffff);
            this.scene.pause();
            this.scene.resume("inGameMenu");
            this.scene.setVisible(true, "inGameMenu") ;
        }, this)
        //-----------------------------------------------------------------------------
        //map
        var map = this.make.tilemap({ key: 'map2' });
        var tileset = map.addTilesetImage('Golf Tiles', 'tiles');
        var bgLayer = map.createStaticLayer('Grass', tileset, 0, 0);
        var mapX = this.game.renderer.width/2 - bgLayer.width/2;
        var mapY = this.game.renderer.height/2 - bgLayer.height/2;
        bgLayer.setPosition(mapX, mapY);
        var borderLayer = map.createStaticLayer('Border', tileset, 0, 0);
        borderLayer.setPosition(mapX, mapY);
        borderLayer.setCollisionByExclusion([-1],true);

        //create water
        var waterLayer = map.createDynamicLayer('Water', tileset, 0, 0);
        waterLayer.setPosition(mapX, mapY);
        waterLayer.setTileIndexCallback([3,4,5,6,7,8,9,10,11], this.inwater, this);
        //-------------------------------------------------------------------------------
        //create ball
        var ballLayer = map.getObjectLayer('Ball')['objects'];
        ballLayer.forEach(object => {
            this.ball = new Ball({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of ball
                y : mapY + object.y - object.height/2 //y coordnate of ball
            });
        });
        //--------------------------------------------------------------------------------
        //create hole
        var holeLayer = map.getObjectLayer('Hole')['objects'];
        this.hole = this.physics.add.staticGroup();
        holeLayer.forEach(object => {
            this.hole.create(mapX + object.x - object.width/2, mapY + object.y - object.height/2, "hole"); 
        });
        //--------------------------------------------------------------------------------
        //add physics
        this.physics.add.collider(this.ball, borderLayer);
        this.physics.add.overlap(this.ball, waterLayer);
        this.physics.add.overlap(this.ball, this.hole, this.checkWin, null, this);
        this.children.bringToTop(this.ball);
    }

    update() {
        this.ball.update();
        if(this.boolWin == false && (this.ball.body.onFloor() || this.ball.body.onCeiling() || this.ball.body.onWall())){
            this.wall_sound.play();
        }
    }

    createWindow(func, name, x, y, data){
        var win = this.add.zone(x,y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var window = new func(name, win);
        this.scene.add(name, window, true, data);
    }

    setHighLight(obj){
        obj.on('pointerover', () => {
            obj.setTint( 1 * 0xffff66);
        })
        .on('pointerout', () => {
            obj.setTint( 1 * 0xffffff);
        })
    }

    checkWin(){
        let velocityX = this.ball.getVelocityX();
        let velocityY = this.ball.getVelocityY();
        let velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        if (velocity <= 150) {
            if(this.boolWin == false){
                this.boolWin = true;
                this.win();
            }
        }
    }
    win() {
        this.menu.removeInteractive();
        this.ball.hide();
        this.scene.pause();
        this.win_sound.play();
        this.events.emit('levelWin');
    }

    inwater() {
        
        this.ball.moveBack();
    }

    //--------------------------------------------------------------------------------
        //create plate
        // var plateLayer = map.getObjectLayer('plate')['objects'];
        // var plates = this.physics.add.staticGroup();
        // plateLayer.forEach(object => {
        //     let obj = plates.create(mapX + object.x - object.width/2, mapY + object.y - object.height/2, "plate"); 
        // });
        // this.physics.add.overlap(this.ball, plates, this.pressed, null, this);
        //--------------------------------------------------------------------------------
        //--------------------------------------------------------------------------------
        //create door
        // this.door = new Door({
        //     scene : this,
        //     x : this.scale.width - 556, //x coordnate of moving_block
        //     y : this.scale.height - 400 //y coordnate of moving_block
        // });
        // this.physics.add.collider(this.ball, this.door);
    
        // this.door.update();
        // this.checkPressed();
        // this.checkWater();
        // this.checkWin();
        // this.checkOpen();


    // pressed() {
    //     if (this.boolPressed == false) {
    //         this.boolPressed = true;
    //     }
    // }

    // checkOpen() {
    //     if (this.ball.stopped()) {
    //         if (this.boolPressed) {
    //             if (this.boolOpened == false) {
    //                 this.boolOpened = true;
    //                 this.door.setOpen();
    //             }
    //         }
    //     }
    // }
}