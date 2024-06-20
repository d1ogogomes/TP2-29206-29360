class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.coins = 0;
    this.totalCoins = 0;
    this.level = 1;
    this.highestLevel = 1; 
    this.gameOverFlag = false; 
  }

  create() {
    this.createBoard();
    this.createBombIndicators();
    this.createCoinsText();
    this.createButtons();
    this.createHelpButton();
    this.createTutorialButton();
  }

  createBoard() {
    const rows = 5;
    const cols = 5;
    const tileSize = 100;
    const margin = 10; // Margem entre as peças
    const board = [];

    const totalWidth = cols * (tileSize + margin) - margin;
    const totalHeight = rows * (tileSize + margin) - margin;
    const offsetX = (this.cameras.main.width - totalWidth) / 2;
    const offsetY = (this.cameras.main.height - totalHeight) / 2 + 50; 

    let bombCount;
    if (this.level === 1) {
      bombCount = 2;
    } else if (this.level === 2) {
      bombCount = 3;
    } else {
      bombCount = 4;
    }

    const bombPositions = new Set();

    while (bombPositions.size < bombCount) {
      const pos = Math.floor(Math.random() * rows * cols);
      bombPositions.add(pos);
    }

    for (let row = 0; row < rows; row++) {
      board[row] = [];
      for (let col = 0; col < cols; col++) {
        const tile = this.add.image(offsetX + col * (tileSize + margin), offsetY + row * (tileSize + margin), 'tile').setOrigin(0);
        tile.setDisplaySize(tileSize, tileSize); // Ajustar o tamanho da peça
        tile.setInteractive();
        tile.on('pointerdown', () => this.revealTile(tile, row, col));
        const isBomb = bombPositions.has(row * cols + col);
        board[row][col] = {
          tile: tile,
          isRevealed: false,
          isBomb: isBomb,
          points: this.getTilePoints(this.level, isBomb) // Ajustar pontos conforme o nível
        };
      }
    }

    this.board = board;
  }

  getTilePoints(level, isBomb) {
    if (isBomb) {
      return 0;
    }
    if (level === 1 || level === 2) {
      return Math.floor(Math.random() * 3) + 1; // Pontos aleatórios entre 1 e 3
    } else if (level === 3) {
      return Math.floor(Math.random() * 3) + 2; // Pontos aleatórios entre 2 e 4
    } else if (level === 4) {
      return Math.floor(Math.random() * 3) + 3; // Pontos aleatórios entre 3 e 5
    } else {
      return Math.floor(Math.random() * 2) + 4; // Pontos aleatórios entre 4 e 5
    }
  }

  createBombIndicators() {
    const rows = this.board.length;
    const cols = this.board[0].length;
    const margin = 10; // Margem entre as peças
    const offsetX = (this.cameras.main.width - cols * (100 + margin) + margin) / 2;
    const offsetY = (this.cameras.main.height - rows * (100 + margin) + margin) / 2 + 50; // Ajustado para padding superior

    // Criar indicadores de linha
    for (let row = 0; row < rows; row++) {
      let bombCount = this.board[row].filter(cell => cell.isBomb).length;
      this.add.text(offsetX - 20, offsetY + row * (100 + margin) + 40, bombCount, { fontSize: '32px', fill: '#000' }).setOrigin(1, 0.5); // Cor preta para contraste
    }

    // Criar indicadores de coluna
    for (let col = 0; col < cols; col++) {
      let bombCount = this.board.map(row => row[col]).filter(cell => cell.isBomb).length;
      this.add.text(offsetX + col * (100 + margin) + 40, offsetY - 20, bombCount, { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 1); // Cor preta para contraste
    }
  }

  createCoinsText() {
    this.coinsText = this.add.text(this.cameras.main.width / 2, 20, `Current Coins: ${this.coins} | Level: ${this.level}`, { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0); // Cor preta para contraste
    this.totalCoinsText = this.add.text(this.cameras.main.width / 2, 60, `Total Coins: ${this.totalCoins}`, { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0); // Cor preta para contraste
    this.highestLevelText = this.add.text(this.cameras.main.width / 2, 100, `Highest Level: ${this.highestLevel}`, { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0); // Cor preta para contraste
  }

  updateHighestLevel() {
    if (this.level > this.highestLevel) {
      this.highestLevel = this.level;
      this.highestLevelText.setText(`Highest Level: ${this.highestLevel}`);
    }
  }

  createButtons() {
    // Adicionar botão "Cash Out"
    let cashOutButton = this.add.text(this.cameras.main.width - 150, this.cameras.main.height - 100, 'Cash Out', { fontSize: '32px', fill: '#fff', backgroundColor: '#008000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.cashOut());

    // Adicionar botão "Restart"
    let restartButton = this.add.text(150, this.cameras.main.height - 100, 'Restart', { fontSize: '32px', fill: '#fff', backgroundColor: '#ff0000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.restartGame());
  }

  createHelpButton() {
    const boardWidth = 5 * (100 + 10) - 10; // 5 colunas, 100px cada, 10px margem, -10 para ajuste final
    const offsetX = (this.cameras.main.width - boardWidth) / 2;
    const buttonX = offsetX + boardWidth + 150; // 50px de distância do lado direito do tabuleiro
    const buttonY = (this.cameras.main.height - 50) / 2; // Centralizado verticalmente em relação ao tabuleiro
  
    let helpButton = this.add.text(buttonX, buttonY, 'Help Shop', { fontSize: '32px', fill: '#fff', backgroundColor: '#0000ff' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showHelp());
  }
  
  createTutorialButton() {
    let tutorialButton = this.add.text(this.cameras.main.width - 100, 20, 'Tutorial', { fontSize: '32px', fill: '#fff', backgroundColor: '#0000ff' })
      .setOrigin(0.5, 0) // Alinhar ao canto superior direito
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showTutorial());
  }

  showHelp() {
    const revealSafePrice = 100;
    const revealRowColPrice = 200;
  
    // Criar um fundo semitransparente
    let helpBackground = this.add.graphics();
    helpBackground.fillStyle(0x000000, 0.7);
    helpBackground.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
  
    // Exibir texto de ajuda
    let helpText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 150, 'Choose a help:', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
  
    // Botão para revelar uma célula segura
    let revealSafeButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, `Reveal safe cell (${revealSafePrice} coins)`, { fontSize: '32px', fill: '#fff', backgroundColor: '#008000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        if (this.totalCoins >= revealSafePrice) {
          this.totalCoins -= revealSafePrice;
          this.revealSafeCell();
          this.totalCoinsText.setText('Total Coins: ' + this.totalCoins);
          helpBackground.destroy();
          helpText.destroy();
          revealSafeButton.destroy();
          revealRowColButton.destroy();
          closeButton.destroy();
        } else {
          // Mostrar mensagem de erro
          let errorText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Not enough coins!', { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
          this.time.delayedCall(2000, () => errorText.destroy(), [], this); // Mensagem desaparece após 2 segundos
        }
      });
  
    // Botão para revelar uma linha ou coluna
    let revealRowColButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, `Reveal row/column (${revealRowColPrice} coins)`, { fontSize: '32px', fill: '#fff', backgroundColor: '#008000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        if (this.totalCoins >= revealRowColPrice) {
          this.totalCoins -= revealRowColPrice;
          this.chooseRowOrColumn();
          this.totalCoinsText.setText('Total Coins: ' + this.totalCoins);
          helpBackground.destroy();
          helpText.destroy();
          revealSafeButton.destroy();
          revealRowColButton.destroy();
          closeButton.destroy();
        } else {
          // Mostrar mensagem de erro
          let errorText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 150, 'Not enough coins!', { fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
          this.time.delayedCall(2000, () => errorText.destroy(), [], this); // Mensagem desaparece após 2 segundos
        }
      });
  
    // Botão para fechar a ajuda
    let closeButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 200, 'Close', { fontSize: '32px', fill: '#fff', backgroundColor: '#ff0000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        helpBackground.destroy();
        helpText.destroy();
        revealSafeButton.destroy();
        revealRowColButton.destroy();
        closeButton.destroy();
      });
  }

  revealSafeCell() {
    let safeCells = [];
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (!this.board[row][col].isRevealed && !this.board[row][col].isBomb) {
          safeCells.push({ row, col });
        }
      }
    }

    if (safeCells.length > 0) {
      let randomIndex = Math.floor(Math.random() * safeCells.length);
      let cell = safeCells[randomIndex];
      this.revealTile(this.board[cell.row][cell.col].tile, cell.row, cell.col);
    }
  }

  chooseRowOrColumn() {
    // Criar um fundo semitransparente
    let chooseBackground = this.add.graphics();
    chooseBackground.fillStyle(0x000000, 0.7);
    chooseBackground.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // Texto para escolher linha ou coluna
    let chooseText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Choose a row or column to reveal:', { fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);

    // Botão para escolher linha
    let chooseRowButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Row', { fontSize: '32px', fill: '#fff', backgroundColor: '#008000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        let row = parseInt(prompt('Enter Row (0-4):'));
        if (!isNaN(row) && row >= 0 && row <= 4) {
          this.revealRow(row);
          chooseBackground.destroy();
          chooseText.destroy();
          chooseRowButton.destroy();
          chooseColButton.destroy();
        } else {
          alert('Invalid input. Please enter a number between 0 and 4.');
        }
      });

    // Botão para escolher coluna
    let chooseColButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Column', { fontSize: '32px', fill: '#fff', backgroundColor: '#008000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        let col = parseInt(prompt('Enter Column (0-4):'));
        if (!isNaN(col) && col >= 0 && col <= 4) {
          this.revealColumn(col);
          chooseBackground.destroy();
          chooseText.destroy();
          chooseRowButton.destroy();
          chooseColButton.destroy();
        } else {
          alert('Invalid input. Please enter a number between 0 and 4.');
        }
      });
  }

  revealRow(row) {
    for (let col = 0; col < this.board[row].length; col++) {
      if (!this.board[row][col].isRevealed) {
        if (this.board[row][col].isBomb) {
          this.board[row][col].tile.setTint(0xff0000); // Highlight bomb tile in red
        } else {
          this.revealTile(this.board[row][col].tile, row, col, true);
        }
      }
    }
  }

  revealColumn(col) {
    for (let row = 0; row < this.board.length; row++) {
      if (!this.board[row][col].isRevealed) {
        if (this.board[row][col].isBomb) {
          this.board[row][col].tile.setTint(0xff0000); // Highlight bomb tile in red
        } else {
          this.revealTile(this.board[row][col].tile, row, col, true);
        }
      }
    }
  }

  restartGame() {
    this.gameOverFlag = false;
    this.level = 1;
    this.coins = 0;
    this.scene.restart();
  }

  revealTile(tile, row, col, skipGameOver = false) {
    if (this.board[row][col].isRevealed || (this.gameOverFlag && !skipGameOver)) return;

    this.board[row][col].isRevealed = true;
    if (this.board[row][col].isBomb) {
      tile.setTexture('bomb');
      if (!skipGameOver) {
        this.coins -= 5; // Deduzir pontos quando uma bomba é clicada
        this.coinsText.setText(`Coins: ${this.coins} | Level: ${this.level}`);
        this.gameOver();
      }
    } else {
      // Lógica para revelar uma célula segura com pontos
      let points = this.board[row][col].points;
      this.incrementCoins(points);
      tile.setTexture(points.toString()); // Ajustar a textura para mostrar a imagem do número correspondente
      tile.setDisplaySize(100, 100); // Garantir que a imagem do número tenha o mesmo tamanho da tile

      // Verificar se todas as células seguras foram reveladas
      if (this.checkLevelComplete() && !skipGameOver) {
        this.nextLevel();
      }
    }
  }

  incrementCoins(points) {
    this.coins += points;
    this.coinsText.setText(`Coins: ${this.coins} | Level: ${this.level}`);
  }

  checkLevelComplete() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (!this.board[row][col].isRevealed && !this.board[row][col].isBomb) {
          return false;
        }
      }
    }
    return true;
  }

  nextLevel() {
    this.level++;
    this.updateHighestLevel(); // Atualizar o nível mais alto alcançado
    this.scene.restart();
  }

  cashOut() {
    this.totalCoins += this.coins;
    this.coins = 0;
    this.coinsText.setText(`Coins: ${this.coins} | Level: ${this.level}`);
    this.totalCoinsText.setText('Total Coins: ' + this.totalCoins);

    // Reiniciar o nível e o tabuleiro
    this.level = 1;
    this.scene.restart();
  }

  revealAllBombs() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col].isBomb) {
          this.board[row][col].tile.setTexture('bomb');
        }
      }
    }
  }

  gameOver() {
    console.log('Game Over!');
    this.gameOverFlag = true;
    this.revealAllBombs();

    // Criar um fundo semitransparente
    let gameOverBackground = this.add.graphics();
    gameOverBackground.fillStyle(0x000000, 0.7);
    gameOverBackground.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // Exibir texto de fim de jogo
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'Game Over!', { fontSize: '64px', fill: '#ff0000' }).setOrigin(0.5);

    // Criar um botão de reinício
    let restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50, 'Restart', { fontSize: '32px', fill: '#ffffff', backgroundColor: '#ff0000' })
      .setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.restartGame());
  }

  showTutorial() {
    // Create a solid black background
    let tutorialBackground = this.add.graphics();
    tutorialBackground.fillStyle(0x000000); // Solid black color
    tutorialBackground.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // Detailed tutorial text
    let tutorialText = `
Tutorial:

1. Click on cells to reveal their content.
2. Avoid clicking on bombs! If you find a bomb, the game ends.
3. Revealed cells may contain numbers from 1 to 3, representing the coins you earn.
4. Use help if necessary:
   - "Reveal safe cell" costs 100 coins and guarantees a cell without a bomb.
5. Check bomb indicators in rows and columns to deduce bomb locations.
6. To advance to the next level, reveal all cells without bombs.
7. Click "Cash Out" to collect your accumulated coins and add them to your total.
8. If you do not "Cash Out" before finding a bomb, you lose coins collected in the current level.
9. To restart the game, click "Restart".

Tips:
- Plan your moves considering bomb indicators in rows and columns.
- Use help strategically to increase your chances of success.
- Cash Out regularly to secure your accumulated coins.
`;

    // Display tutorial text with formatting and word wrap
    let tutorialTextObject = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, tutorialText, {
        fontSize: '24px', 
        fill: '#ffffff', 
        align: 'center', 
        wordWrap: { width: this.cameras.main.width - 40 }
    }).setOrigin(0.5, 0.5);

    // Button to close the tutorial
    let closeButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 300, 'Close', {
        fontSize: '32px', 
        fill: '#ffffff', 
        backgroundColor: '#ff0000'
    }).setOrigin(0.5)
      .setPadding(10)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
          tutorialBackground.destroy();
          tutorialTextObject.destroy();
          closeButton.destroy();
      });
  }
}
