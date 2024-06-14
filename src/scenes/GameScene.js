class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  create() {
    this.createBoard()
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
        tile.setDisplaySize(tileSize, tileSize) // Ajustar o tamanho da peça
        tile.setInteractive()
        tile.on('pointerdown', () => this.revealTile(tile, row, col))
        board[row][col] = {
          tile: tile,
          isRevealed: false,
          isBomb: Math.random() < 0.2 // 20% de chance de ser uma bomba
        }
      }
    }

    this.board = board
  }

  revealTile(tile, row, col) {
    if (this.board[row][col].isRevealed) return

    this.board[row][col].isRevealed = true
    if (this.board[row][col].isBomb) {
      tile.setTexture('bomb')
      this.gameOver()
    } else {
      // Lógica para revelar uma célula segura
      tile.setTexture('tile') // Ajuste aqui se tiver uma textura diferente para células seguras
    }
  }

  gameOver() {
    console.log('Game Over!')
    // Lógica para lidar com o fim do jogo
  }
}
