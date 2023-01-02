import Game from './game';
import InputHandler from './input';

type SubmitScoreResponse = {
  rank: number;
  total: number;
  scores: Score[];
};

export default class GameOver {
  game: Game;
  input: InputHandler;
  submitted: boolean;
  textHeight: number;

  constructor(game: Game, input: InputHandler) {
    this.game = game;
    this.input = input;
    this.submitted = false;
    this.textHeight = 30;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = '25px pixel';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'top';

    this.drawCenteredText(
      ctx,
      'Enter your name',
      this.game.headerHeight + 2 * this.game.borderThickness + this.textHeight
    );

    var nameText = String(this.input.getText()).padStart(5, '_').toString();

    this.drawCenteredText(
      ctx,
      nameText,
      this.game.headerHeight + 2 * this.game.borderThickness + 2 * this.textHeight
    );

    if (this.input.canSubmit()) {
      this.drawCenteredText(
        ctx,
        'Submit',
        this.game.height - 2 * this.game.borderThickness - 3 * this.textHeight
      );
    }

    this.drawCenteredText(
      ctx,
      'Click to play again',
      this.game.height - 4 * this.game.borderThickness
    );
  }

  drawCenteredText(ctx: CanvasRenderingContext2D, text: string, yPos: number) {
    ctx.fillText(
      text,
      (this.game.width - ctx.measureText(text).width) / 2,
      yPos
    );
  }

  async submit(): Promise<SubmitScoreResponse | null> {
    try {
      console.log('submitting score');
      const response = await fetch(`${this.game.apiUrl}/api/snake/highscores`, {
        method: 'POST',
        body: JSON.stringify({
          name: this.input.getText(),
          score: this.game.score
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          sessionid: '07daa504-864b-4055-a115-113a9d8d31d6',
          userid: '07daa504-864b-4055-a115-113a9d8d31d6'
        }
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = (await response.json()) as SubmitScoreResponse;

      console.log('result is: ', JSON.stringify(result, null, 4));
      return result;
    } catch (error) {
      console.log('unexpected error: ', error);
      return null;
    }
  }

  handleClick(x: number, y: number){
    var restartButtonLocation = this.game.height - 4 * this.game.borderThickness;
    var submitButtonLocation = this.game.height - 2 * this.game.borderThickness - 3 * this.textHeight;

    if (y - restartButtonLocation >= 0 && y - restartButtonLocation <= this.textHeight) {
        this.game.setup();
        this.game.gameOver.submitted = false;
    } else     if (y - submitButtonLocation >= 0 && y - submitButtonLocation <= this.textHeight && this.game.input.canSubmit()) {
        this.game.gameOver.submit().then((s) => {
          if (s.scores == null) {
            this.game.highscores.scores = [];
            this.game.highscores.scores.push(
              new Score(0, this.game.input.getText(), this.game.score)
            );
            alert('Oops, something went wrong submitting your highscore!');
          } else {
            this.game.highscores.scores = s.scores;
          }
          this.game.gameOver.submitted = true;
        });
      }
  }
}
