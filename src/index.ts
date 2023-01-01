import Game from './game';

window.addEventListener('load', function () {
  const canvas = this.document.getElementById(
    'canvas1'
  ) as HTMLCanvasElement | null;
  if (canvas == null) {
    throw new Error('Could not find canvas.');
  }
  const ctx = canvas.getContext('2d');  
  ctx.imageSmoothingEnabled = false;

  canvas.width = 500;
  canvas.height = 500;
  const game = new Game(canvas.width, canvas.height);

    canvas.onkeydown = function (e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.view.event.preventDefault();
        }
    }

  function animate(timestamp: number) {
    ctx.fillStyle = '#94d300';
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   // ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 4;
    ctx.fillStyle = '#131903';
    game.update(timestamp);
    game.draw(ctx);
    requestAnimationFrame(animate);
  }
  animate(0);
});
