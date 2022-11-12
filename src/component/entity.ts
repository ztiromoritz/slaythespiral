import { Container, Sprite } from "pixi.js";
import { GameState } from "./game-state";
import { Player } from "./player";
import { Pos } from "./pos";

export class Entity extends Container {
  private sprite: Sprite;
  pos: Pos;

  hitboxRadius?: number;
  hitboxHandler?: () => boolean;

  constructor(
    private s: GameState,
  ) {
    super();

    this.pos = {
      x: s.cartLength,
      y: 0,
    };

    this.sprite = Sprite.from('star.png');
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1;
    this.addChild(this.sprite);
  }

  onTick(delta: number, player: Player) {
    this.pos.x -= delta / 1000 * this.s.playerSpeed;

    if (this.pos.x < this.s.minX) {
      return false;
    }

    return true;
  }

  setScale(scale: number) {
    this.sprite.scale.set(scale);
  }
}
