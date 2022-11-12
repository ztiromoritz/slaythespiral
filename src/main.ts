import "./style.css";

import { Application, Sprite, Texture } from "pixi.js";

import { initControls } from "./controls";
const { KEYS } = initControls();

const app = new Application({ width: 640, height: 360 });
document.body.appendChild(app.view);

const sprite = Sprite.from("public/char.png");

sprite.anchor.set(0.5);
sprite.x = 40;
sprite.y = 40;
app.stage.addChild(sprite);

let x;

///
app.ticker.add((delta) => {
  if (KEYS.up) {
    sprite.x += delta * 4;
  }
});

console.log("hello worlddd");
