import { Hud } from '../Hud';
import { InGameMenu } from '../InGameMenu';
import { Ball } from '../../objects/ball';
import { MovingBlock } from '../../objects/MovingBlock';

export class Level1 extends Phaser.Scene{
    private ball;
    private hole;

    private moving_blocks = new Array();
    private boolWin;
    private menu;
    private wall_sound;
    private ball_hole;
    private win_sound;

    constructor(){
        super("level1");
    }
    init(){
        this.boolWin = false;
    }
    preload(){
        this.load.tilemapTiledJSON('map1', './assets/map/level1.json');
        this.load.image("bkgrnd1", "./assets/background/level1_background.png");
        this.load.image('moving_block', "./assets/obj/moving_block1.png");
    }
    create(){
        this.wall_sound = this.sound.add("wall_bounce")
        this.ball_hole = this.sound.add("ball_in_hole");
        this.win_sound = this.sound.add("win_music");
        //----------------------------------------------------------------------------
        //core level creation, hud and in game menu
        this.add.tileSprite(0,0, this.game.renderer.width, this.game.renderer.width, "bkgrnd1").setOrigin(0,0).setScale(1.37);
        console.log(this.scene.manager.keys);
        if(this.scene.manager.getScene("inGameMenu") != null){
            this.scene.remove("inGameMenu");
        }
        if(this.scene.manager.getScene("winScreen") != null){
            this.scene.remove("winScreen");
        }
        console.log(this.scene.manager.keys);
        this.createWindow(InGameMenu,"inGameMenu",this.game.renderer.width/2, this.game.renderer.height/2, {level : 1});
        this.createWindow(Hud, "hud", 0, 0, {level : 1});
        console.log(this.scene.manager.keys);
        this.scene.setVisible(false, "inGameMenu");
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
        var map = this.make.tilemap({ key: 'map1' });
        var tileset = map.addTilesetImage('Golf Tiles', 'tiles');
        var bgLayer = map.createStaticLayer('Grass', tileset, 0, 0);
        var mapX = this.game.renderer.width/2 - bgLayer.width/2;
        var mapY = this.game.renderer.height/2 - bgLayer.height/2;
        bgLayer.setPosition(mapX, mapY);
        var borderLayer = map.createStaticLayer('Border', tileset, 0, 0);
        borderLayer.setPosition(mapX, mapY);
        borderLayer.setCollisionByExclusion([-1],true);
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
        this.physics.add.collider(this.ball, borderLayer);
        //--------------------------------------------------------------------------------
        //create hole
        var holeLayer = map.getObjectLayer('Hole')['objects'];
        this.hole = this.physics.add.staticGroup();
        holeLayer.forEach(object => {
            let obj = this.hole.create(mapX + object.x - object.width/2, mapY + object.y - object.height/2, "hole"); 
        });
        this.children.bringToTop(this.ball);
        this.physics.add.overlap(this.ball, this.hole, this.checkWin, null, this);
        //--------------------------------------------------------------------------------
        //create moving block
        var movingLayer = map.getObjectLayer('Moving')['objects'];
        movingLayer.forEach(object => {
            var moving_block = new MovingBlock({
                scene : this,
                x : mapX + object.x - object.width/2, //x coordnate of moving_block
                y : mapY + object.y - object.height/2, //y coordnate of moving_block
                v : 200,
                start: 64,
                end: 64
            });
            this.moving_blocks.push(moving_block);
            this.physics.add.collider(this.ball, moving_block);
        });
    }

    update() {
        this.ball.update();
        if(this.boolWin == false && (this.ball.body.onFloor() || this.ball.body.onCeiling() || this.ball.body.onWall())){
            this.wall_sound.play();
        }
        for(var i = 0; i < this.moving_blocks.length; i++) {
            this.moving_blocks[i].update();
        }
    }

    createWindow(func, name, x, y, data){
        var win = this.add.zone(x,y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var window = new func(name, win);
        this.scene.add(name, window, true, data);
    }

    setHighLight(obj){
        obj.on('pointerover', () => {
            obj.setTint( 1 * 0xffff99);
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
                this.ball_hole.play();
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
}