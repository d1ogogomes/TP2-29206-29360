class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
    this.points = 0
    this.gameOverFlag = false // To check if the game is over
  }

  create() {
    this.createBoard()
    this.createBombIndicators()
    this.createPointsText()
  }

  createBoard() {
    const rows = 5
    const cols = 5
    const tileSize = 100
    const board = []

    const offsetX = (this.cameras.main.width - cols * tileSize) / 2
    const offsetY = (this.cameras.main.height - rows * tileSize) / 2

    for (let row = 0; row < rows; row++) {
      board[row] = []
      for (let col = 0; col < cols; col++) {
        const tile = this.add.image(offsetX + col * tileSize, offsetY + row * tileSize, 'tile').setOrigin(0)
        tile.setDisplaySize(tileSize, tileSize) // Adjust tile size
        tile.setInteractive()
        tile.on('pointerdown', () => this.revealTile(tile, row, col))
        board[row][col] = {
          tile: tile,
          isRevealed: false,
          isBomb: Math.random() < 0.2, // 20% chance of being a bomb
          points: Math.floor(Math.random() * 3) + 1 // Random points between 1 and 3
        }
      }
    }

    this.board = board
  }

  createBombIndicators() {
    const rows = this.board.length
    const cols = this.board[0].length
    const offsetX = (this.cameras.main.width - cols * 100) / 2
    const offsetY = (this.cameras.main.height - rows * 100) / 2

    // Create row indicators
    for (let row = 0; row < rows; row++) {
      let bombCount = this.board[row].filter(cell => cell.isBomb).length
      this.add.text(offsetX - 20, offsetY + row * 100 + 40, bombCount, { fontSize: '32px', fill: '#fff' }).setOrigin(1, 0.5)
    }

    // Create column indicators
    for (let col = 0; col < cols; col++) {
      let bombCount = this.board.map(row => row[col]).filter(cell => cell.isBomb).length
      this.add.text(offsetX + col * 100 + 40, offsetY - 20, bombCount, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5, 1)
    }
  }

  createPointsText() {
    this.pointsText = this.add.text(16, 16, 'Points: 0', { fontSize: '32px', fill: '#fff' })
  }

  revealTile(tile, row, col) {
    if (this.board[row][col].isRevealed || this.gameOverFlag) return

    this.board[row][col].isRevealed = true
    if (this.board[row][col].isBomb) {
      tile.setTexture('bomb')
      this.points -= 5 // Deduct points when a bomb is clicked
      this.pointsText.setText('Points: ' + this.points)
      this.gameOver()
    } else {
      // Logic to reveal a safe cell with points
      let points = this.board[row][col].points
      this.incrementPoints(points)
      tile.setTexture('tile') // You can replace this with a texture representing points, if available
      tile.setTint(0x00ff00) // Optional: change tile color to indicate it's revealed
      this.add.text(tile.x + 50, tile.y + 50, points, { fontSize: '32px', fill: '#000' }).setOrigin(0.5)
    }
  }

  incrementPoints(points) {
    this.points += points
    this.pointsText.setText('Points: ' + this.points)
  }

  gameOver() {
    console.log('Game Over!')
    this.gameOverFlag = true
    
    // Create a semi-transparent background
    let gameOverBackground = this.add.graphics()
    gameOverBackground.fillStyle(0x000000, 0.7)
    gameOverBackground.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height)

    // Display game over text
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Game Over!', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5)

    // Create a restart button
    let restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Restart', { fontSize: '32px', fill: '#ffffff', backgroundColor: '#ff0000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.restart())
  }
}
