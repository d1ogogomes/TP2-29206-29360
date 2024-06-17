class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    // Carregar todas as imagens necessárias
    this.load.image('tile', 'assets/tile.png')
    this.load.image('bomb', 'assets/bomb.png')
    this.load.image('1', 'assets/1.png') // Carregar imagem do número 1
    this.load.image('2', 'assets/2.png') // Carregar imagem do número 2
    this.load.image('3', 'assets/3.png') // Carregar imagem do número 3
  }

  create() {
    this.scene.start('GameScene')
  }
}
