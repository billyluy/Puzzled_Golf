import { HelpMenu } from './HelpMenu';
import { Level1 } from "./Level1";

export class InGameMenu extends Phaser.Scene{
    private parent;
    private menuHeight;
    private menuWidth;
    private muted;
    constructor (handle, parent)
    {
        super(handle);
        this.parent = parent;
    }
    init(){
        this.menuHeight = 510;
        this.menuWidth = 336;
        this.muted = false;
    }
    preload(){
        this.load.image("menu_bg", "../dist/assets/menu_background.png");
        this.load.spritesheet("sound", "../dist/assets/sound_img.png", {frameWidth: 160, frameHeight: 78});
    }
    create ()
    {
        var background = this.add.image(0,0,"menu_bg").setOrigin(0);
        this.cameras.main.setViewport(this.game.renderer.width/2 - 168, this.game.renderer.height/2 - 255, this.menuWidth, this.menuHeight);
        var restart = this.add.image(this.menuWidth/2 , this.menuHeight/2 -60, "button", 5);
        var mainMenu = this.add.image(this.menuWidth/2 , this.menuHeight/2 , "button", 2);
        var help = this.add.image(this.menuWidth/2 , this.menuHeight/2 + 60, "button", 1);
        var mute = this.add.image(this.menuWidth/2 , this.menuHeight/2 + 120, "button", 4);
        var exit = this.add.image(this.menuWidth - 47, 27, "exit").setOrigin(0);
        var sound_img = this.add.sprite(this.menuWidth/2 , this.menuHeight/2 + 180, "sound", 0);
        sound_img.setScale(.5);
        
        restart.setInteractive();
        mainMenu.setInteractive();
        help.setInteractive();
        mute.setInteractive();
        exit.setInteractive();

        this.setHighLight(restart);
        this.setHighLight(mainMenu);
        this.setHighLight(help);
        this.setHighLight(mute);
        this.setHighLight(exit);

        exit.on('pointerdown', () => {
            this.scene.resume("level1");
            this.scene.setVisible(false);
        });
        
        restart.on('pointerdown', () => {
            console.log('restart');
            this.events.emit('goHome');
            this.scene.remove("hud");
            var level1 = this.scene.get('level1');
            level1.scene.restart();
        });
        
        mainMenu.on('pointerdown', () => {
            this.events.emit('goHome');
            this.scene.remove("hud");
            this.scene.remove("level1");
            this.scene.start("mainMenu");
            this.scene.remove("inGameMenu");
        });

        help.on('pointerdown', () => {
            this.scene.pause();
            this.createWindow(HelpMenu,"helpMenu",this.game.renderer.width/2 - 318, this.game.renderer.height/2 - 180);
        });
        
        mute.on('pointerdown', () => {
            if(this.muted){
                this.muted = false;
                sound_img.setFrame(0);
            }else{
                this.muted = true;
                sound_img.setFrame(1);
            }
        })   
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);
        this.scene.bringToTop();
    }

    createWindow(func, name, x, y){
        var win = this.add.zone(x,y, func.WIDTH, func.HEIGHT).setInteractive().setOrigin(0);
        var window = new func(name, win);
        this.scene.add(name, window, true);
    }

    setHighLight(obj){
        obj.on('pointerover', () => {
            obj.setTint( 1 * 0xffff66);
        })
        .on('pointerout', () => {
            obj.setTint( 1 * 0xffffff);
        })
    }
}