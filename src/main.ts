import "./style.css";

import {
  Application,
  Sprite,
  Texture,
  Spritesheet,
  BaseTexture,
  AnimatedSprite,
  settings,
  SCALE_MODES,
} from "pixi.js";

import { initControls } from "./controls";
import { SpiralField } from "./component/spiral-field";
import { createAtlas } from "./component/create-atlas";
import { playMusic } from "./music";

async function init() {
  playMusic();
  const { KEYS } = initControls();

  const atlasData = createAtlas();
  console.log(JSON.stringify(atlasData, null, 2));

  const spritesheet = new Spritesheet(
    BaseTexture.from(atlasData.meta.image),
    atlasData
  );
  await spritesheet.parse();

  const drivingPlayer = new AnimatedSprite(spritesheet.animations.drive);
  drivingPlayer.play();
  drivingPlayer.animationSpeed = 0.25;
  drivingPlayer.scale.x = 0.33;
  drivingPlayer.scale.y = 0.33;

  settings.SCALE_MODE = SCALE_MODES.NEAREST;

  const app = new Application({
    width: 640,
    height: 360,
  });
  document.getElementById("wrapper")!.appendChild(app.view as any);

  // app.stage.addChild(killerEye);

  function onResize() {
    const elm = document.getElementById("wrapper")!;
    app.renderer.resize(elm.offsetWidth, elm.offsetHeight);

    field.position.set(elm.offsetWidth / 2, elm.offsetHeight / 2);
    field.scale.set((elm.offsetHeight - 50) / 200);
  }

  window.onresize = onResize;

  const field = new SpiralField(KEYS, drivingPlayer, spritesheet);
  field.position.set(500, 180);
  app.stage.addChild(field);

  field.spawnStar();

  const debug = document.getElementById("debug");

  app.ticker.maxFPS = 60;
  app.ticker.add(() => {
    if (KEYS.down) {
      field.spawnStar();
    }
    field.onTick(app.ticker.deltaMS);
    // debug!.innerHTML = `${app.ticker.deltaMS}`;
  });

  onResize();
}

const start_button = document.getElementById("start_button");

start_button?.addEventListener("click", () => {
  document.body.removeChild(start_button);
  init();
});
