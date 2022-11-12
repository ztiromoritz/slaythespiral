import "./style.css";

import { Application, Sprite, Texture } from "pixi.js";

import { initControls } from "./controls";
import { SpiralField } from "./component/spiral-field";
const { KEYS } = initControls();

const app = new Application(
  {
    width: 640,
    height: 360,
  }
);
document.body.appendChild(app.view as any);

const sprite = Sprite.from("public/char.png");

sprite.anchor.set(0.5);
sprite.x = 40;
sprite.y = 40;
app.stage.addChild(sprite);

function onResize() {
  const elm = document.body;
  app.renderer.resize(elm.offsetWidth, elm.offsetHeight);
  
  field.position.set(elm.offsetWidth / 2, elm.offsetHeight / 2);
  field.scale.set((elm.offsetHeight - 50) / 200);
}

window.onresize = onResize;



const field = new SpiralField(KEYS);
field.position.set(500, 180);
app.stage.addChild(field);

field.spawnStar();


app.ticker.add((delta) => {
  if (KEYS.up) {
    sprite.x += delta * 4;
  }

  if (KEYS.down) {
    field.spawnStar();
  }

  field.onTick(app.ticker.deltaMS);
});

onResize();
