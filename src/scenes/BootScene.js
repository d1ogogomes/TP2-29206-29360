class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    // Load any assets needed before the PreloadScene
  }

  create() {
    this.scene.start('PreloadScene')
  }
}
