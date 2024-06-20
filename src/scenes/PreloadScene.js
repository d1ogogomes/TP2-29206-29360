class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    // Carregar todas as imagens necessárias
    this.load.image('tile', 'assets/tile.png')
    this.load.image('bomb', 'assets/bomb.png')
    this.load.image('1', 'assets/1.png') 
    this.load.image('2', 'assets/2.png') 
    this.load.image('3', 'assets/3.png') 
    this.load.image('4', 'assets/4.png') 
    this.load.image('5', 'assets/5.png') 
    
  }

  create() {
    this.scene.start('GameScene')
  }
}
