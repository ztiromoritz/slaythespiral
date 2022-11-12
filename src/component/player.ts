import { Container, Sprite } from "pixi.js";
import { GameState } from "./game-state";
import { Pos } from "./pos";

import { sounds } from "./sounds";

export class Player extends Container {
  sprite: Sprite;
  pos: Pos;

  readonly hitboxRadius = 10;

  private vy = 0;
  private readonly jumpVy = -6;
  private readonly gravity = 0.5;

  constructor(private KEYS: any, private anim_sprite: Sprite) {
    super();

    this.pos = {
      x: -0.25,
      y: 0,
    };

    this.sprite = anim_sprite;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1;
    this.addChild(this.sprite);
  }

  onTick(delta: number) {
    if (this.KEYS.up && this.pos.y == 0) {
      this.vy = this.jumpVy;
      sounds.jump();
    }

    this.vy += this.gravity;
    this.pos.y = Math.min(0, this.pos.y + this.vy);
  }
}
