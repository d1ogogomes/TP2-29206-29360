class PreloadScene extends Phaser.Scene {
    constructor() {
      super({ key: 'PreloadScene' })
    }
  
    preload() {
      // Carregar todas as imagens necessárias
      this.load.image('tile', 'assets/tile.png')
      this.load.image('bomb', 'assets/bomb.png')
    }
  
    create() {
      this.scene.start('GameScene')
    }
  }
  