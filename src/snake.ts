import Game from './game';
import { Direction } from './input';

export default class SnakeComponent {
  game: Game;
  x: number;
  y: number;
  direction: Direction;
  prev: SnakeComponent | null;
  next: SnakeComponent | null;
  flipConnectorSegment: boolean;
  index: number;
  constructor(
    game: Game,
    prev: SnakeComponent | null,
    index: number,
    x: number,
    y: number,
    direction: Direction
  ) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.prev = prev;
    this.next = null;
    this.direction = direction;
    this.flipConnectorSegment = true;
    this.index = index;
  }

  update(direction: Direction) {
    var [nextX, nextY] = this.nextPosition();
    this.x = nextX;
    this.y = nextY;

    this.next?.update(this.direction);
    this.direction = direction;
  }

  drawHead(ctx: CanvasRenderingContext2D) {
    // Head
    var [nextX, nextY] = this.nextPosition();
    var [x, y] = this.game.toPixelCoord(nextX, nextY)

    switch (this.direction) {
      case Direction.Up:
        ctx.fillRect(
          x,
          y + this.game.cellHeight / 2,
          this.game.cellWidth / 2,
          this.game.cellHeight / 2
        );
        ctx.fillRect(
          x + this.game.cellWidth / 2,
          y + this.game.cellHeight / 2,
          this.game.cellWidth / 2,
          this.game.cellHeight / 2
        );
        ctx.fillRect(
          x,
          y + this.game.cellHeight / 2,
          this.game.cellWidth / 2,
          this.game.cellHeight / 2
        );
        break;
      case Direction.Down:
        ctx.fillRect(x, y, this.game.cellWidth / 2, this.game.cellHeight / 2);
        ctx.fillRect(
          x + this.game.cellWidth / 2,
          y,
          this.game.cellWidth / 2,
          this.game.cellHeight / 2
        );
        break;
      case Direction.Left:
        ctx.fillRect(
          x + this.game.cellWidth / 2,
          y,
          this.game.cellWidth / 2,
          this.game.cellHeight / 2
        );
        ctx.fillRect(
          x + this.game.cellWidth / 2,
          y + this.game.cellHeight / 2,
          this.game.cellWidth / 2,
          this.game.cellHeight / 2
        );
        break;
      case Direction.Right:
        ctx.fillRect(x, y, this.game.cellWidth / 2, this.game.cellHeight / 2);
        ctx.fillRect(
          x,
          y + this.game.cellHeight / 2,
          this.game.cellWidth / 2,
          this.game.cellHeight / 2
        );
        break;
    }
  }

  drawBody(ctx: CanvasRenderingContext2D) {

    var [x, y] = this.game.toPixelCoord(this.x, this.y)

    if (this.index % 2 == 0) {
      // If even draw full body segment
      ctx.fillRect(x, y, this.game.cellWidth, this.game.cellHeight);
    } else {
      // Draw checkered body segment
      if (this.prev !== null) {
        this.flipConnectorSegment =
          this.prev.direction == this.direction
            ? this.prev.flipConnectorSegment
            : !this.prev.flipConnectorSegment;
      }

      if (this.flipConnectorSegment) {
        // Left checkered body segment
        ctx.fillRect(x, y, this.game.cellWidth / 2, this.game.cellHeight / 2);
        ctx.fillRect(
          x + this.game.cellWidth / 2,
          y + this.game.cellHeight / 2,
          this.game.cellWidth / 2,
          this.game.cellHeight / 2
        );
      } else {
        // Right checkered body segment
        ctx.fillRect(
          x,
          y + this.game.cellHeight / 2,
          this.game.cellWidth / 2,
          this.game.cellHeight / 2
        );
        ctx.fillRect(
          x + this.game.cellWidth / 2,
          y,
          this.game.cellWidth / 2,
          this.game.cellHeight / 2
        );
      }
    }
  }

  drawTail(ctx: CanvasRenderingContext2D) {
    var [nextX, nextY] = this.nextPositionReverse();

    var [x, y] = this.game.toPixelCoord(nextX, nextY)

    switch (this.direction) {
      case Direction.Up:
        ctx.fillRect(x, y, this.game.cellWidth / 2, this.game.cellHeight / 2);
        break;
      case Direction.Down:
        ctx.fillRect(
          x,
          y + this.game.cellHeight / 2,
          this.game.cellWidth / 2,
          this.game.cellHeight / 2
        );
        break;
      case Direction.Left:
        ctx.fillRect(x, y, this.game.cellWidth / 2, this.game.cellHeight / 2);
        break;
      case Direction.Right:
        ctx.fillRect(
          x + this.game.cellWidth / 2,
          y,
          this.game.cellWidth / 2,
          this.game.cellHeight / 2
        );
        break;
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    this.drawBody(ctx);

    if (this.prev === null) {
      this.drawHead(ctx);
    }

    if (this.next === null) {
      this.drawTail(ctx);
    }

    this.next?.draw(ctx);
  }

  nextPosition(): [number, number] {
    var nextX = this.x;
    var nextY = this.y;

    switch (this.direction) {
      case Direction.Up:
        nextY--;
        break;
      case Direction.Down:
        nextY++;
        break;
      case Direction.Left:
        nextX--;
        break;
      case Direction.Right:
        nextX++;
        break;
    }

    return [nextX, nextY];
  }

  nextPositionReverse(): [number, number] {
    var nextX = this.x;
    var nextY = this.y;

    switch (this.direction) {
      case Direction.Up:
        nextY++;
        break;
      case Direction.Down:
        nextY--;
        break;
      case Direction.Left:
        nextX++;
        break;
      case Direction.Right:
        nextX--;
        break;
    }

    return [nextX, nextY];
  }

  grow() {
    if (this.next !== null) {
      // Only tail segment should grow
      this.next.grow();
      return;
    }

    // Add two components to tail segment
    var [nextX, nextY] = this.nextPositionReverse();
    this.next = new SnakeComponent(
      this.game,
      this,
      this.index + 1,
      nextX,
      nextY,
      this.direction
    );
    var [nextX, nextY] = this.next.nextPositionReverse();
    this.next.next = new SnakeComponent(
      this.game,
      this,
      this.next.index + 1,
      nextX,
      nextY,
      this.direction
    );
  }

  Collides(x: number, y: number): boolean {
    if (this.x == x && this.y == y) {
      // This segment collides
      return true;
    }

    if (this.next === null) {
      // Last segment didn't collide
      return false;
    }
    // Check if next segment collides
    return this.next.Collides(x, y);
  }
}
