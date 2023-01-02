import Game from './game';

export default class Highscores {
  game: Game;
  scores: Score[];

  constructor(game: Game) {
    this.game = game;
    this.scores = [];
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = '25px pixel';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'top';
    var textWidth = ctx.measureText('00000').width;

    this.drawCenteredText(
      ctx,
      'Highscores',
      this.game.headerHeight + this.game.borderThickness + 5
    );
    this.drawCenteredText(
      ctx,
      'Click to play again',
      this.game.height - 4 * this.game.borderThickness
    );

    ctx.font = '20px pixel';
    var textWidth = ctx.measureText('00000').width;
    var textHeight = 25;

    ctx.fillText(
      'rank',
      20,
      this.game.headerHeight + this.game.borderThickness + textHeight + 5
    );
    ctx.fillText(
      'name',
      this.game.width / 2 - textWidth,
      this.game.headerHeight + this.game.borderThickness + textHeight + 5
    );
    ctx.fillText(
      'score',
      this.game.width - textWidth - 20,
      this.game.headerHeight + this.game.borderThickness + textHeight + 5
    );

    for (var i = 0; i < this.scores.length; i++) {
      var score = this.scores[i];

      var formattedRank = String(score.rank).padStart(4, '0').toString();
      var formattedName = String(score.name).padEnd(5, ' ').toString();
      var formattedScore = String(score.score).padStart(4, '0').toString();

      var yPos =
        this.game.headerHeight +
        2 * this.game.borderThickness +
        (i + 2) * textHeight;
      ctx.fillText(formattedRank, 20, yPos);
      ctx.fillText(formattedName, this.game.width / 2 - textWidth, yPos);
      ctx.fillText(formattedScore, this.game.width - textWidth - 20, yPos);
    }
  }

  drawCenteredText(ctx: CanvasRenderingContext2D, text: string, yPos: number) {
    ctx.fillText(
      text,
      (this.game.width - ctx.measureText(text).width) / 2,
      yPos
    );
  }
}
