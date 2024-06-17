window.onload = function() {
  var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#ffffff', // Set background color to white
    scene: [BootScene, PreloadScene, GameScene]
  };
  var game = new Phaser.Game(config);
  window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
  });
}
