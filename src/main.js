window.onload = function() {
    var config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [BootScene, PreloadScene, GameScene]
    }
    
    var game = new Phaser.Game(config)
  }
  