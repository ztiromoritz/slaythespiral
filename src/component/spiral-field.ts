import { Container, Sprite, Text, TextStyle } from "pixi.js";

export class SpiralField extends Container {
  // eventually should dynamically adjust to window size:
  private spiralRadius = 100;

  // logical space:
  private cartLength = Math.PI * 8;

  constructor() {
    super();

    for (let x = -this.cartLength; x < this.cartLength; x += this.cartLength / 2500) {
      let sprite = Sprite.from('public/char.png');
      sprite.anchor.y = 1;
      sprite.anchor.x = 0.5;
      // sprite.position.x = x;
      
      const pos = this.project(x, -Math.pow(Math.sin(x * 10), 2) * 37);
      sprite.position.set(pos.x, pos.y);
      sprite.scale.set(pos.r * 0.25);
      sprite.rotation = pos.rot;
      this.addChild(sprite);
    }

    new Text('asdf', new TextStyle())
  }

  project(cartX: number, cartY: number) {
    // r = aeθ cot b
    // x = 2PI * θ

    if (cartX < 0) {
      // negative: straight line
      return {
        x: cartX * this.spiralRadius,
        y: this.spiralRadius + cartY,
        r: 1,
        rot: 0,
      };
    } else {
      // positive: enter the spiral
      const cx = this.cartLength - cartX;
      const theta = cx;
      const rFloor = this.spiralRadius * 0.00004 * Math.pow(cx * Math.PI * 2, 2); // TODO: why 0.00004?
      const r = rFloor + cartY * (1 - cartX / this.cartLength);
      return {
        x: -r * Math.sin(theta),
        y: r * Math.cos(theta),
        r: r / this.spiralRadius,
        rot: theta,
      };
    }
  }
}

