import Game from './game';

export default class RetroSnake {
  game: Game;
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;

  constructor(apiUrl: string | null) {
    this.canvas = document.getElementById(
      'canvas1'
    ) as HTMLCanvasElement | null;

    if (this.canvas == null) {
      throw new Error('Could not find canvas.');
    }

    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = 500;
    this.canvas.height = 400;

    this.game = new Game(this.canvas.width, this.canvas.height, apiUrl);

    this.canvas.addEventListener('click', (e: MouseEvent) => {
      if (this.game.running) {
        return;
      }

      let rect = this.canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      this.game.gameOver.handleClick(x, y)
    });

    this.game.setup();
  }

  Start() {
    this.animate(0);
  }

  animate(timestamp: number) {
    this.ctx.fillStyle = '#94d300';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = 4;
    this.ctx.fillStyle = '#131903';
    this.game.update(timestamp);
    this.game.draw(this.ctx);
    requestAnimationFrame((n) => this.animate(n));
  }
}
