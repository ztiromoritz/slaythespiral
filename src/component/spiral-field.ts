import { AnimatedSprite, Container, DisplayObject, Sprite, Spritesheet, Text, TextStyle } from "pixi.js";
import { Entity } from "./entity";
import { GameState } from "./game-state";
import { Player } from "./player";
import { Pos } from "./pos";
import { makeNewSounds, sounds } from "./sounds";

export class SpiralField extends Container {
  private gameState = new GameState();

  private player: Player;
  private entities: Entity[] = [];

  private nextStar = 0;

  private nextEnemy = 0;
  private enemyIntervalMultiplier = 1;

  private score = 0;

  constructor(
    private KEYS: any,
    private anim_sprite: Sprite,
    private spritesheet: Spritesheet,
  ) {
    super();

    this.player = new Player(this.KEYS, anim_sprite);
    this.addChild(this.player);

    for ( let x = -this.gameState.cartLength; x < 0; x += this.gameState.cartLength / 67 ) {
        let sprite = Sprite.from("public/flat.png");
        sprite.anchor.y = 0;
        sprite.anchor.x = 0.5;
        // sprite.position.x = x;
  
        // const pos = this.project({ x, y: -Math.pow(Math.sin(x * 10), 2) * 37});
        const pos = this.project({ x, y: 0 });
        sprite.position.set(pos.x, pos.y);
        sprite.scale.set(pos.r * 0.35);
        sprite.rotation = pos.rot;
        this.addChild(sprite);
    }

    for (
      let x = 0;
      x < this.gameState.cartLength;
      x += this.gameState.cartLength / 70
    ) {
      let sprite = Sprite.from("public/ring.png");
      sprite.anchor.y = 0.2;
      sprite.anchor.x = 0.5;
      // sprite.position.x = x;

      // const pos = this.project({ x, y: -Math.pow(Math.sin(x * 10), 2) * 37});
      const pos = this.project({ x, y: 0 });
      sprite.position.set(pos.x, pos.y);
      sprite.scale.set(pos.r * 0.35);
      sprite.rotation = pos.rot - 0.12;
      this.addChild(sprite);
    }
  }

  spawnStar() {
    const sprite = Sprite.from('star.png');
    const entity = new Entity(this.gameState, sprite);
    entity.hitboxHeight = 10;
    entity.hitboxHandler = () => {
      return Math.random() < 0.75 ? true : false;
    };

    entity.pos.y = Math.random() * -50;
    entity.setScale(Math.random() * 0.1 + 0.1);
    entity.extraSpeed = (Math.random() - 0.5) * 0.02;
    this.entities.push(entity);
    this.addChild(entity);
  }

  spawnEnemy() {
    const killerEye = new AnimatedSprite(this.spritesheet.animations.killer_eye);
    killerEye.play();
    killerEye.animationSpeed = 0.5;
    killerEye.scale.x = 0.4;
    killerEye.scale.y = 0.4;

    const sprite = killerEye;
    const entity = new Entity(this.gameState, sprite);
    entity.hitboxHeight = 10;
    entity.hitboxHandler = () => {
      setTimeout(() => {
        alert('Score: ' + this.score);

        // reset
        this.gameState.playerSpeed = 5;
        this.gameState.pow = 1;
        this.nextStar = 0;
        this.nextEnemy = 0;
        this.enemyIntervalMultiplier = 0;
        this.score = 0;
        this.entities.forEach(entity => entity.destroy());
        this.entities = [];

        makeNewSounds();
      });
      sounds.explosion();
      return true;
    }

    this.entities.push(entity);
    this.addChild(entity);
  }

  onTick(delta: number) {
    if (this.nextStar <= 0) {
      this.spawnStar();
      this.nextStar += Math.random() * 50 + 50;
    }
    this.nextStar -= delta;

    if (this.nextEnemy <= 0) {
      this.spawnEnemy();
      this.nextEnemy += (Math.random() * (1000 * this.enemyIntervalMultiplier + 250) + 500);
    }
    this.nextEnemy -= delta;

    this.score += 1;
    this.enemyIntervalMultiplier *= 0.999;
    this.gameState.playerSpeed += 0.001

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

    this.entities = this.entities.filter(entity => {
      if (entity.hitboxHeight && entity.hitboxHandler) {
        if (
          Math.abs(entity.pos.x - this.player.pos.x) < 0.05
          && Math.abs((entity.pos.y - entity.sprite.height / 2) - (this.player.pos.y - this.player.sprite.height / 2)) < 15
        ) {
          const entityAlive = entity.hitboxHandler();
          if (!entityAlive) {
            entity.destroy();
            return false;
          }
        }
        
        return true;
      }
    });

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
      const pow = this.gameState.pow;
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
