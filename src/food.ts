import Game from './game';

export default class Food {
  game: Game;
  x: number;
  y: number;

  constructor(game: Game) {
    this.game = game;
  }

  move() {
    this.moveToRandomPosition();

    while (
      Math.abs(this.x - this.game.snake.x) +
        Math.abs(this.y - this.game.snake.y) <
        10 &&
      !this.game.snake.Collides(this.game.snake.x, this.game.snake.y)
    ) {
      // move to random position until we find a valid place where the snakes body isn't
      this.moveToRandomPosition();
    }

    console.log(`food position: (${this.x},${this.y})`);
  }

  moveToRandomPosition() {
    // Set x,y to random values 0 <= n < cellCount
    this.x = Math.floor(Math.random() * (this.game.horizontalCellCount - 1));
    this.y = Math.floor(Math.random() * (this.game.verticalCellCount - 1));
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Calculate canvas coordinates
    var [x, y] = this.game.toPixelCoord(this.x, this.y);

    var inverseMargin = 1; // Makes the food larger then a cell
    x -= inverseMargin;
    y -= inverseMargin;
    var w = (this.game.cellWidth + 2 * inverseMargin) / 3;
    var h = (this.game.cellHeight + 2 * inverseMargin) / 3;

    // Draw food
    ctx.fillRect(x + w, y, w, h);
    ctx.fillRect(x + w + w, y + h, w, h);
    ctx.fillRect(x + w, y + h + h, w, h);
    ctx.fillRect(x, y + h, w, h);
  }
}
