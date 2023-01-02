export enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

export default class InputHandler {
  lastDirection: Direction;
  directions: Direction[];
  textInput: string;
  constructor() {
    this.textInput = '';
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

      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (this.textInput.length > 0) {
          this.textInput = this.textInput.slice(0, -1);
        }
      }

      const key = e.key.toLowerCase();
      if (key.length === 1) {
        if (this.textInput.length >= 5) {
          return;
        }

        this.textInput += key;
      }
    });
  }

  getDirection(): Direction {
    if (this.directions.length > 0) {
      return (this.lastDirection = this.directions.shift());
    } else {
      return this.lastDirection;
    }
  }

  clearText() {
    this.textInput = '';
  }

  getText() {
    return this.textInput;
  }

  canSubmit(): boolean {
    return this.textInput.length >= 3;
  }
}
