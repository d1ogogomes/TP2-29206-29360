class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
    this.coins = 0
    this.totalCoins = 0
    this.gameOverFlag = false // Para verificar se o jogo acabou
  }

  create() {
    this.createBoard()
    this.createBombIndicators()
    this.createCoinsText()
    this.createButtons()
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
          isBomb: Math.random() < 0.2, // 20% de chance de ser uma bomba
          points: Math.floor(Math.random() * 3) + 1 // Pontos aleatórios entre 1 e 3
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

    // Criar indicadores de linha
    for (let row = 0; row < rows; row++) {
      let bombCount = this.board[row].filter(cell => cell.isBomb).length
      this.add.text(offsetX - 20, offsetY + row * 100 + 40, bombCount, { fontSize: '32px', fill: '#fff' }).setOrigin(1, 0.5)
    }

    // Criar indicadores de coluna
    for (let col = 0; col < cols; col++) {
      let bombCount = this.board.map(row => row[col]).filter(cell => cell.isBomb).length
      this.add.text(offsetX + col * 100 + 40, offsetY - 20, bombCount, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5, 1)
    }
  }

  createCoinsText() {
    this.coinsText = this.add.text(16, 16, 'Coins: 0', { fontSize: '32px', fill: '#fff' })
    this.totalCoinsText = this.add.text(16, 56, 'Total de Coins: 0', { fontSize: '32px', fill: '#fff' })
  }

  createButtons() {
    // Adicionar imagem do botão "Cash Out"
    this.cashOutButton = this.add.image(100, 150, 'cashout').setInteractive()
    this.cashOutButton.setScale(0.5) // Ajustar o tamanho da imagem
    this.cashOutButton.on('pointerdown', () => this.cashOut())

    // Adicionar imagem do botão "Restart"
    this.restartButton = this.add.image(100, 250, 'restart').setInteractive()
    this.restartButton.setScale(0.5) // Ajustar o tamanho da imagem
    this.restartButton.on('pointerdown', () => this.scene.restart())
  }

  revealTile(tile, row, col) {
    if (this.board[row][col].isRevealed || this.gameOverFlag) return

    this.board[row][col].isRevealed = true
    if (this.board[row][col].isBomb) {
      tile.setTexture('bomb')
      this.coins -= 5 // Deduzir pontos quando uma bomba é clicada
      this.coinsText.setText('Coins: ' + this.coins)
      this.gameOver()
    } else {
      // Lógica para revelar uma célula segura com pontos
      let points = this.board[row][col].points
      this.incrementCoins(points)
      tile.setTexture('tile') // Você pode substituir isso por uma textura que represente pontos, se disponível
      tile.setTint(0x00ff00) // Opcional: mudar a cor da peça para indicar que foi revelada
      this.add.text(tile.x + 50, tile.y + 50, points, { fontSize: '32px', fill: '#000' }).setOrigin(0.5)
    }
  }

  incrementCoins(points) {
    this.coins += points
    this.coinsText.setText('Coins: ' + this.coins)
  }

  cashOut() {
    this.totalCoins += this.coins
    this.coins = 0
    this.coinsText.setText('Coins: ' + this.coins)
    this.totalCoinsText.setText('Total de Coins: ' + this.totalCoins)
    this.scene.restart()
  }

  gameOver() {
    console.log('Game Over!')
    this.gameOverFlag = true
    
    // Criar um fundo semitransparente
    let gameOverBackground = this.add.graphics()
    gameOverBackground.fillStyle(0x000000, 0.7)
    gameOverBackground.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height)

    // Exibir texto de fim de jogo
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Game Over!', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5)

    // Criar um botão de reinício
    let restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Restart', { fontSize: '32px', fill: '#ffffff', backgroundColor: '#ff0000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.restart())
  }
}
