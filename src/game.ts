import Snake from './snake';
import InputHandler from './input';
import Food from './food';
import GameOver from './gameover';
import Highscores from './highscores';

export default class Game {
  width: number;
  height: number;
  snake: Snake;
  input: InputHandler;
  cellWidth: number;
  cellHeight: number;
  horizontalCellCount: number;
  verticalCellCount: number;
  snakeHead: Snake;
  food: Food;
  lastTimeStamp: number;
  speed: number;
  score: number;
  running: boolean;
  headerHeight: number;
  borderThickness: number;
  gameOver: GameOver;
  highscores: Highscores;
  apiUrl: string | null;

  constructor(width: number, height: number, apiUrl: string | null) {
    this.width = width;
    this.height = height;
    this.food = new Food(this);
    this.input = new InputHandler();
    this.cellWidth = 12;
    this.cellHeight = 12;
    this.borderThickness = 10;
    this.headerHeight = this.borderThickness + 30;
    this.horizontalCellCount = Math.round(
      (width - 2 * this.borderThickness) / this.cellWidth
    );
    this.verticalCellCount = Math.round(
      (height - this.headerHeight - 2 * this.borderThickness) / this.cellHeight
    );
    this.lastTimeStamp = 0;
    this.gameOver = new GameOver(this, this.input);
    this.highscores = new Highscores(this);
    this.apiUrl = apiUrl;
    this.setup();
  }

  toPixelCoord(x: number, y: number): [x: number, y: number] {
    return [
      this.cellWidth * x + this.borderThickness,
      this.cellHeight * y + this.headerHeight + this.borderThickness
    ];
  }

  update(timestamp: number) {
    if (timestamp - this.lastTimeStamp <= Math.max(this.speed, 100)) {
      // Wait until next tick
      return;
    }
    this.lastTimeStamp = timestamp;

    if (!this.running) {
      return;
    }

    // Update snakes position / direction
    this.snake.update(this.input.getDirection());

    if (this.snake.Collides(this.food.x, this.food.y)) {
      // Snake eats food
      this.speed -= 5;
      this.snake.grow();
      this.food.move();
      this.score++;
    }

    if (this.snake.next?.Collides(this.snake.x, this.snake.y)) {
      this.endGame('Snake eat itself');
    } else if (this.snake.x < 0) {
      this.endGame('Snake hit west wall');
    } else if (this.snake.x >= this.horizontalCellCount) {
      this.endGame('Snake hit east wall');
    } else if (this.snake.y < 0) {
      this.endGame('Snake hit north wall');
    } else if (this.snake.y >= this.verticalCellCount) {
      this.endGame('Snake hit south wall');
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw game rect
    ctx.strokeRect(
      this.borderThickness,
      this.borderThickness + this.headerHeight,
      this.width - 2 * this.borderThickness,
      this.height - this.headerHeight - 2 * this.borderThickness
    );

    // Draw header seperator
    ctx.beginPath();
    ctx.moveTo(this.borderThickness - 1, this.headerHeight);
    ctx.lineTo(this.width - this.borderThickness + 2, this.headerHeight);
    ctx.stroke();

    if (this.running) {
      this.food.draw(ctx);
      this.snake.draw(ctx);
    }

    this.drawHeader(ctx);
    if (!this.running) {
      if (this.apiUrl == null) {
        this.setup();
        return;
      } else if (!this.gameOver.submitted) {
        this.gameOver.draw(ctx);
      } else {
        this.highscores.draw(ctx);
      }
    }
  }

  drawHeader(ctx: CanvasRenderingContext2D) {
    ctx.font = '30px pixel';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'top';
    var headerText = String(this.score).padStart(4, '0').toString();
    if (!this.running) {
      headerText += ' Game Over';
    }
    ctx.fillText(headerText, this.borderThickness, this.borderThickness);
  }

  drawCenteredText(ctx: CanvasRenderingContext2D, text: string, yPos: number) {
    ctx.fillText(text, (this.width - ctx.measureText(text).width) / 2, yPos);
  }

  endGame(reason: String) {
    console.log(`Game over!`);
    console.log(`------------------`);
    console.log(reason);
    console.log(`Score: ${this.score}`);
    console.log(`------------------`);

    this.running = false;
  }

  setup() {
    console.log('setup game');
    this.score = 0;
    this.speed = 150;
    var x = this.horizontalCellCount / 2;
    var y = this.verticalCellCount / 2;
    this.snake = new Snake(this, null, 0, x, y, this.input.getDirection());
    this.snake.grow();
    this.food.move();
    this.running = true;
  }
}
