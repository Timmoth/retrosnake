export enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

export default class InputHandler {
  lastDirection: Direction;
  directions: Direction[]
  constructor() {
    this.lastDirection = Direction.Up;
    this.directions = [];
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') {
        this.directions.push(Direction.Up);
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        this.directions.push(Direction.Down);
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        this.directions.push(Direction.Left);
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        this.directions.push(Direction.Right);
        e.preventDefault();
      }
    });
  }

  getDirection(): Direction{
    if(this.directions.length > 0){
        return this.lastDirection = this.directions.shift();
    }else{
        return this.lastDirection;
    }
  }
}
