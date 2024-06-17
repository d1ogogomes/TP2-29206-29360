class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
    this.coins = 0
    this.totalCoins = 0
    this.level = 1
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
    const margin = 10 // Margem entre as peças
    const board = []

    const totalWidth = cols * (tileSize + margin) - margin
    const totalHeight = rows * (tileSize + margin) - margin
    const offsetX = (this.cameras.main.width - totalWidth) / 2
    const offsetY = (this.cameras.main.height - totalHeight) / 2 + 50 // Ajustado para padding superior

    for (let row = 0; row < rows; row++) {
      board[row] = []
      for (let col = 0; col < cols; col++) {
        const tile = this.add.image(offsetX + col * (tileSize + margin), offsetY + row * (tileSize + margin), 'tile').setOrigin(0)
        tile.setDisplaySize(tileSize, tileSize) // Ajustar o tamanho da peça
        tile.setInteractive()
        tile.on('pointerdown', () => this.revealTile(tile, row, col))
        board[row][col] = {
          tile: tile,
          isRevealed: false,
          isBomb: Math.random() < 0.2 + 0.05 * this.level, // Aumentar a chance de ser uma bomba a cada nível
          points: Math.floor(Math.random() * 3) + 1 // Pontos aleatórios entre 1 e 3
        }
      }
    }

    this.board = board
  }

  createBombIndicators() {
    const rows = this.board.length
    const cols = this.board[0].length
    const margin = 10 // Margem entre as peças
    const offsetX = (this.cameras.main.width - cols * (100 + margin) + margin) / 2
    const offsetY = (this.cameras.main.height - rows * (100 + margin) + margin) / 2 + 50 // Ajustado para padding superior

    // Criar indicadores de linha
    for (let row = 0; row < rows; row++) {
      let bombCount = this.board[row].filter(cell => cell.isBomb).length
      this.add.text(offsetX - 20, offsetY + row * (100 + margin) + 40, bombCount, { fontSize: '32px', fill: '#000' }).setOrigin(1, 0.5) // Cor preta para contraste
    }

    // Criar indicadores de coluna
    for (let col = 0; col < cols; col++) {
      let bombCount = this.board.map(row => row[col]).filter(cell => cell.isBomb).length
      this.add.text(offsetX + col * (100 + margin) + 40, offsetY - 20, bombCount, { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 1) // Cor preta para contraste
    }
  }

  createCoinsText() {
    this.coinsText = this.add.text(this.cameras.main.width / 2, 20, `Coins: 0 | Level: ${this.level}`, { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0) // Cor preta para contraste
    this.totalCoinsText = this.add.text(this.cameras.main.width / 2, 60, 'Total Coins: 0', { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0) // Cor preta para contraste
  }

  createButtons() {
    // Adicionar botão "Cash Out"
    let cashOutButton = this.add.text(this.cameras.main.width - 150, this.cameras.main.height - 100, 'Cash Out', { fontSize: '32px', fill: '#fff', backgroundColor: '#008000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.cashOut())

    // Adicionar botão "Restart"
    let restartButton = this.add.text(150, this.cameras.main.height - 100, 'Restart', { fontSize: '32px', fill: '#fff', backgroundColor: '#ff0000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.restartGame())
  }

  restartGame() {
    this.gameOverFlag = false
    this.level = 1
    this.scene.restart()
  }

  revealTile(tile, row, col) {
    if (this.board[row][col].isRevealed || this.gameOverFlag) return

    this.board[row][col].isRevealed = true
    if (this.board[row][col].isBomb) {
      tile.setTexture('bomb')
      this.coins -= 5 // Deduzir pontos quando uma bomba é clicada
      this.coinsText.setText(`Coins: ${this.coins} | Level: ${this.level}`)
      this.gameOver()
    } else {
      // Lógica para revelar uma célula segura com pontos
      let points = this.board[row][col].points
      this.incrementCoins(points)
      tile.setTexture('tile') // Você pode substituir isso por uma textura que represente pontos, se disponível
      tile.setTint(0x00ff00) // Opcional: mudar a cor da peça para indicar que foi revelada
      this.add.text(tile.x + 50, tile.y + 50, points, { fontSize: '32px', fill: '#000' }).setOrigin(0.5) // Cor preta para contraste

      // Verificar se todas as células seguras foram reveladas
      if (this.checkLevelComplete()) {
        this.nextLevel()
      }
    }
  }

  incrementCoins(points) {
    this.coins += points
    this.coinsText.setText(`Coins: ${this.coins} | Level: ${this.level}`)
  }

  checkLevelComplete() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (!this.board[row][col].isRevealed && !this.board[row][col].isBomb) {
          return false
        }
      }
    }
    return true
  }

  nextLevel() {
    this.totalCoins += this.coins
    this.coins = 0
    this.level++
    this.coinsText.setText(`Coins: ${this.coins} | Level: ${this.level}`)
    this.totalCoinsText.setText('Total Coins: ' + this.totalCoins)
    this.scene.restart()
  }

  cashOut() {
    this.totalCoins += this.coins
    this.coins = 0
    this.coinsText.setText(`Coins: ${this.coins} | Level: ${this.level}`)
    this.totalCoinsText.setText('Total Coins: ' + this.totalCoins)
    this.restartGame()
  }

  gameOver() {
    console.log('Game Over!')
    this.gameOverFlag = true

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

    // Exibir texto de fim de jogo
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Game Over!', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5)

    // Criar um botão de reinício
    let restartButton = this.add.text(this.cameras.main.centerX, 100, 'Restart', { fontSize: '32px', fill: '#ffffff', backgroundColor: '#ff0000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.restartGame())
  }
}
