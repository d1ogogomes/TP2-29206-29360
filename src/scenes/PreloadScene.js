class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('tile', 'assets/tile.png')
    this.load.image('bomb', 'assets/bomb.png')
    this.load.image('cashout', 'assets/cashout.png') 
    this.load.image('restart', 'assets/restart.png') 
  }

  create() {
    this.scene.start('GameScene')
  }
}
