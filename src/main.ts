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

(async function () {
  const { KEYS } = initControls();

  settings.SCALE_MODE = SCALE_MODES.NEAREST;

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
  drivingPlayer.scale.x = 2;
  drivingPlayer.scale.y = 2;

  const app = new Application({
    width: 640,
    height: 360,
  });
  document.body.appendChild(app.view);

  const sprite = Sprite.from("public/char.png");

  sprite.anchor.set(0.5);
  sprite.x = 40;
  sprite.y = 40;
  app.stage.addChild(sprite);
  app.stage.addChild(drivingPlayer);

  let x;

  console.log(
    "animation",
    drivingPlayer.animationSpeed,
    spritesheet.animations.drive
  );

  ///
  app.ticker.add((delta) => {
    if (KEYS.up) {
      sprite.x += delta * 4;
    }
  });

  const field = new SpiralField();
  field.position.set(500, 180);
  app.stage.addChild(field);

  function onResize() {
    const elm = document.body;
    app.renderer.resize(elm.offsetWidth, elm.offsetHeight);

    field.position.set(elm.offsetWidth / 2, elm.offsetHeight / 2);
    field.scale.set((elm.offsetHeight - 50) / 200);
  }

  window.onresize = onResize;
  onResize();
})();
