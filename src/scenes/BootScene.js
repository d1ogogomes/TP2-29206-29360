class BootScene extends Phaser.Scene {
    constructor() {
      super({ key: 'BootScene' })
    }
  
    preload() {
      // Carregar qualquer asset que precisa ser carregado antes do PreloadScene
    }
  
    create() {
      this.scene.start('PreloadScene')
    }
  }
  