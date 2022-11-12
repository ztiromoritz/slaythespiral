import { Container, DisplayObject, Sprite, Text, TextStyle } from "pixi.js";
import { Entity } from "./entity";
import { GameState } from "./game-state";
import { Player } from "./player";
import { Pos } from "./pos";

export class SpiralField extends Container {
  private gameState = new GameState();

  private player: Player;
  private entities: Entity[] = [];

  private nextStar = 0;

  constructor(
    private KEYS: any,
    private anim_sprite: Sprite,
    private killerEye: Sprite
  ) {
    super();

    this.player = new Player(this.KEYS, anim_sprite);
    this.addChild(this.player);

    for (
      let x = -this.gameState.cartLength;
      x < this.gameState.cartLength;
      x += this.gameState.cartLength / 100
    ) {
      let sprite = Sprite.from("public/char.png");
      sprite.anchor.y = 1;
      sprite.anchor.x = 0.5;
      // sprite.position.x = x;

      // const pos = this.project({ x, y: -Math.pow(Math.sin(x * 10), 2) * 37});
      const pos = this.project({ x, y: 0 });
      sprite.position.set(pos.x, pos.y);
      sprite.scale.set(pos.r * 0.05);
      sprite.rotation = pos.rot;
      this.addChild(sprite);
    }

    new Text("asdf", new TextStyle());
  }

  spawnStar() {
    const entity = new Entity(this.gameState);
    entity.hitboxRadius = 10;
    entity.hitboxHandler = () => {
      return false;
    };

    entity.pos.y = Math.random() * -50;
    entity.setScale(Math.random() * 0.1 + 0.1);
    this.entities.push(entity);
    this.addChild(entity);
  }

  onTick(delta: number) {
    if (this.nextStar <= 0) {
      this.spawnStar();
      this.nextStar += Math.random() * 12;
    }
    this.nextStar -= delta;

    // update player
    this.player.onTick(delta);
    this.projectEntity(this.player, this.player.pos);

    // Update entities and remove dead ones:
    this.entities = this.entities.filter((entity) => {
      const spriteAlive = entity.onTick(delta, this.player);
      if (!spriteAlive) {
        entity.destroy();
      }
      return spriteAlive;
    });

    // this.entities = this.entities.filter(entity => {
    //   if (entity.hitboxRadius && entity.hitboxHandler) {
    //     const playerCenter: Pos = {
    //       x: this.player.pos.x,
    //       y: this.player.pos.y - this.player.hitboxRadius,
    //     };

    //     const selfCenter: Pos = {
    //       x: entity.pos.x,
    //       y: entity.pos.y - entity.hitboxRadius,
    //     }

    //     const dx = playerCenter.x - selfCenter.x;
    //     const dy = playerCenter.y - selfCenter.y;
    //     const distance = Math.sqrt(dx * dx + dy * dy);

    //     if (distance <= this.player.hitboxRadius + entity.hitboxRadius) {
    //       console.log(distance, 'hit!');
    //       const result = entity.hitboxHandler();
    //       console.log('result', result);
    //       return result;
    //     }
    //   }
    // });

    // Project display positions
    for (const entity of this.entities) {
      this.projectEntity(entity, entity.pos);
    }
  }

  private projectEntity(disp: DisplayObject, pos: Pos) {
    const proj = this.project(pos);
    disp.position.set(proj.x, proj.y);
    disp.scale.set(proj.r);
    disp.rotation = proj.rot;
  }

  private project(pos: Pos) {
    // r = aeθ cot b
    // x = 2PI * θ

    if (pos.x < 0) {
      // negative: straight line
      return {
        x: pos.x * this.gameState.spiralRadius,
        y: this.gameState.spiralRadius + pos.y,
        r: 1, // r / this.gameState.spiralRadius,
        rot: 0,
      };
    } else {
      // positive: enter the spiral
      const pow = 1;
      const cx =
        this.gameState.cartLength *
        Math.pow(
          (this.gameState.cartLength - pos.x) / this.gameState.cartLength,
          pow
        );
      const theta = cx; // / Math.PI * 2;
      const rFloor =
        this.gameState.spiralRadius *
        this.gameState.magicNumber *
        Math.pow(cx * Math.PI * 2, 2); // TODO: why 0.00004?
      const r = rFloor + pos.y * (1 - pos.x / this.gameState.cartLength);
      return {
        x: -r * Math.sin(theta),
        y: r * Math.cos(theta),
        r: r / this.gameState.spiralRadius,
        rot: theta,
      };
    }
  }
}
