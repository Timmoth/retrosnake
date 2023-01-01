import Snake from './snake';
import InputHandler from './input';
import Food from './food';

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

  headerHeight: number;
  borderThickness: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.food = new Food(this);
    this.input = new InputHandler();
    this.cellWidth = 12;
    this.cellHeight = 12;
    this.headerHeight = 70;
    this.borderThickness = 10;
    this.horizontalCellCount = (width - 2*this.borderThickness) / this.cellWidth;
    this.verticalCellCount = (height - this.headerHeight - 2*this.borderThickness) / this.cellHeight;
    this.lastTimeStamp = 0;
    this.setup();
  }

  toPixelCoord(x: number, y: number): [x: number, y: number]{
        return [this.cellWidth * x + this.borderThickness, this.cellHeight * y + this.headerHeight + this.borderThickness];
  }

  update(timestamp: number) {
    if (timestamp - this.lastTimeStamp <= Math.max(this.speed, 100)) {
      // Wait until next tick
      return;
    }
    this.lastTimeStamp = timestamp;

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
      this.gameOver('Snake eat itself');
    } else if (this.snake.x < 0) {
      this.gameOver('Snake hit west wall');
    } else if (this.snake.x >= this.horizontalCellCount) {
      this.gameOver('Snake hit east wall');
    }else if (this.snake.y < 0) {
      this.gameOver('Snake hit north wall');
    }else if (this.snake.y >= this.verticalCellCount) {
      this.gameOver('Snake hit south wall');
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw game rect
    ctx.strokeRect(this.borderThickness, this.borderThickness + this.headerHeight, this.width - 2*this.borderThickness, this.height - this.headerHeight - 2*this.borderThickness);

    // Draw header seperator
    ctx.beginPath();
    ctx.moveTo(this.borderThickness - 1, this.headerHeight);
    ctx.lineTo(this.width - this.borderThickness + 2, this.headerHeight);
    ctx.stroke();

    this.food.draw(ctx);
    this.snake.draw(ctx);
    ctx.font = '48px pixel';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'top';
    ctx.fillText(String(this.score).padStart(4, '0').toString(), this.borderThickness, this.borderThickness);
  }

  gameOver(reason: String) {
    console.log(`Game over!`);
    console.log(`------------------`);
    console.log(reason);
    console.log(`Score: ${this.score}`);
    console.log(`------------------`);
    // Reset
    this.setup();
  }

  setup() {
    this.score = 0;
    this.speed = 150;
    var x = Math.floor(Math.random() * (this.horizontalCellCount - 1));
    var y = Math.floor(Math.random() * (this.verticalCellCount - 1));
    this.snake = new Snake(this, null, 0, x, y, this.input.getDirection());
    this.snake.grow();
    this.food.move();
  }
}
