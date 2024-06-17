class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.coins = 0;
    this.totalCoins = 0;
    this.gameOverFlag = false; // To check if the game is over
  }

  create() {
    this.createBoard();
    this.createBombIndicators();
    this.createCoinsText();
    this.createButtons();
  }

  createBoard() {
    const rows = 5;
    const cols = 5;
    const tileSize = 100;
    const margin = 10; // Margin between tiles
    const board = [];

    const totalWidth = cols * (tileSize + margin) - margin;
    const totalHeight = rows * (tileSize + margin) - margin;
    const offsetX = (this.cameras.main.width - totalWidth) / 2;
    const offsetY = (this.cameras.main.height - totalHeight) / 2 + 50; // Adjusted for top padding

    for (let row = 0; row < rows; row++) {
      board[row] = [];
      for (let col = 0; col < cols; col++) {
        const tile = this.add.image(offsetX + col * (tileSize + margin), offsetY + row * (tileSize + margin), 'tile').setOrigin(0);
        tile.setDisplaySize(tileSize, tileSize); // Adjust tile size
        tile.setInteractive();
        tile.on('pointerdown', () => this.revealTile(tile, row, col));
        board[row][col] = {
          tile: tile,
          isRevealed: false,
          isBomb: Math.random() < 0.2, // 20% chance of being a bomb
          points: Math.floor(Math.random() * 3) + 1 // Random points between 1 and 3
        };
      }
    }

    this.board = board;
  }

  createBombIndicators() {
    const rows = this.board.length;
    const cols = this.board[0].length;
    const margin = 10; // Margin between tiles
    const offsetX = (this.cameras.main.width - cols * (100 + margin) + margin) / 2;
    const offsetY = (this.cameras.main.height - rows * (100 + margin) + margin) / 2 + 50; // Adjusted for top padding

    // Create row indicators
    for (let row = 0; row < rows; row++) {
      let bombCount = this.board[row].filter(cell => cell.isBomb).length;
      this.add.text(offsetX - 20, offsetY + row * (100 + margin) + 40, bombCount, { fontSize: '32px', fill: '#000' }).setOrigin(1, 0.5); // Changed fill color to black for contrast
    }

    // Create column indicators
    for (let col = 0; col < cols; col++) {
      let bombCount = this.board.map(row => row[col]).filter(cell => cell.isBomb).length;
      this.add.text(offsetX + col * (100 + margin) + 40, offsetY - 20, bombCount, { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 1); // Changed fill color to black for contrast
    }
  }

  createCoinsText() {
    this.coinsText = this.add.text(this.cameras.main.width / 2, 20, 'Coins: 0', { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0); // Changed fill color to black for contrast
    this.totalCoinsText = this.add.text(this.cameras.main.width / 2, 60, 'Total Coins: 0', { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0); // Changed fill color to black for contrast
  }

  createButtons() {
    // Add "Cash Out" button
    let cashOutButton = this.add.text(this.cameras.main.width - 150, this.cameras.main.height - 100, 'Cash Out', { fontSize: '32px', fill: '#fff', backgroundColor: '#008000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.cashOut());

    // Add "Restart" button
    let restartButton = this.add.text(150, this.cameras.main.height - 100, 'Restart', { fontSize: '32px', fill: '#fff', backgroundColor: '#ff0000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.restartGame());
  }

  restartGame() {
    this.gameOverFlag = false;
    this.scene.restart();
  }

  revealTile(tile, row, col) {
    if (this.board[row][col].isRevealed || this.gameOverFlag) return;

    this.board[row][col].isRevealed = true;
    if (this.board[row][col].isBomb) {
      tile.setTexture('bomb');
      this.coins -= 5; // Deduct points when a bomb is clicked
      this.coinsText.setText('Coins: ' + this.coins);
      this.gameOver();
    } else {
      // Logic to reveal a safe cell with points
      let points = this.board[row][col].points;
      this.incrementCoins(points);
      tile.setTexture('tile'); // You can replace this with a texture representing points, if available
      tile.setTint(0x00ff00); // Optional: change tile color to indicate it's revealed
      this.add.text(tile.x + 50, tile.y + 50, points, { fontSize: '32px', fill: '#000' }).setOrigin(0.5); // Changed fill color to black for contrast
    }
  }

  incrementCoins(points) {
    this.coins += points;
    this.coinsText.setText('Coins: ' + this.coins);
  }

  cashOut() {
    this.totalCoins += this.coins;
    this.coins = 0;
    this.coinsText.setText('Coins: ' + this.coins);
    this.totalCoinsText.setText('Total Coins: ' + this.totalCoins);
    this.restartGame();
  }

  gameOver() {
    console.log('Game Over!');
    this.gameOverFlag = true;

    for (let row = 0; row < this.board.length; row++) { // Reveal bombs
      for (let col = 0; col < this.board[row].length; col++) {
        let cell = this.board[row][col];
        if (!cell.isRevealed) {
          if (cell.isBomb) {
            cell.tile.setTexture('bomb');
          } else {
            cell.tile.setTexture('tile'); // Use appropriate texture for points if available
            cell.tile.setTint(0x00ff00);
            this.add.text(cell.tile.x + 50, cell.tile.y + 50, cell.points, { fontSize: '32px', fill: '#000' }).setOrigin(0.5);
          }
          cell.isRevealed = true;
        }
      }
    }

    // Create a semi-transparent background
    let gameOverBackground = this.add.graphics();
    gameOverBackground.fillStyle(0x000000, 0.7);
    gameOverBackground.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // Display game over text
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Game Over!', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);

    // Create a restart button
    let restartButton = this.add.text(this.cameras.main.centerX, 100, 'Restart', { fontSize: '32px', fill: '#ffffff', backgroundColor: '#ff0000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.restartGame());
  }
}
