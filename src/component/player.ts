import { Container, Sprite } from "pixi.js";
import { GameState } from "./game-state";
import { Pos } from "./pos";

export class Player extends Container {
  private sprite: Sprite;
  pos: Pos;

  readonly hitboxRadius = 10;

  private vy = 0;
  private readonly jumpVy = -6;
  private readonly gravity = 0.5;

  constructor(
    private KEYS: any,
    private s: GameState,
  ) {
    super();

    this.pos = {
      x: -0.25,
      y: 0,
    };

    this.sprite = Sprite.from('char.png');
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1;
    this.addChild(this.sprite);
  }

  onTick(delta: number) {
    if (this.KEYS.up && this.pos.y == 0) {
      this.vy = this.jumpVy;
    }

    this.vy += this.gravity;
    this.pos.y = Math.min(0, this.pos.y + this.vy);
  }
}
