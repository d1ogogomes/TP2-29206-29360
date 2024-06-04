import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('card', 'assets/images/carta.png');
  this.load.image('bomb', 'assets/images/bomb.png');

  this.load.image('number1', 'assets/images/carta.png');
  this.load.image('number2', 'assets/images/carta.png');
  this.load.image('number3', 'assets/images/carta.png');
}

class create {
  constructor() {
    // Inicializar o tabuleiro do jogo e outros elementos
    this.gameBoard = new GameBoard(this);
    this.gameBoard.createBoard();

    this.score = 0;
    this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    this.resetButton = this.add.text(700, 10, 'Reset', { fontSize: '32px', fill: '#fff' });
    this.resetButton.setInteractive();
    this.resetButton.on('pointerdown', () => this.resetGame());
  }
}


function update() {

  this.gameBoard();
  
}

class GameBoard {
  constructor(scene) {
    this.scene = scene;
    this.boardSize = 5;
    this.grid = [];
    this.initializeGrid();
  }

  initializeGrid() {
    for (let row = 0; row < this.boardSize; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.boardSize; col++) {
        this.grid[row][col] = { value: 1, isBomb: false, revealed: false };
      }
    }
    this.assignValuesAndBombs();
  }
}

assignValuesAndBombs() {
  let totalBombs = 6; // Número de bombas
  let totalValues = 19; // Total de valores

  while (totalBombs > 0) {
    const row = Phaser.Math.Between(0, this.boardSize - 1);
    const col = Phaser.Math.Between(0, this.boardSize - 1);
    if (!this.grid[row][col].isBomb) {
      this.grid[row][col].isBomb = true;
      this.grid[row][col].value = 0;
      totalBombs--;
    }
  }

  while (totalValues > 0) {
    const row = Phaser.Math.Between(0, this.boardSize - 1);
    const col = Phaser.Math.Between(0, this.boardSize - 1);
    if (!this.grid[row][col].isBomb && this.grid[row][col].value === 1) {
      const value = Phaser.Math.Between(1, 3);
      this.grid[row][col].value = value;
      totalValues -= value;
    }
  }
}
