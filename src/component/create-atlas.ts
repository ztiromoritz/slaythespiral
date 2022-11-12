export function createAtlas() {
  const spriteWidth = 64;
  const spriteHeight = 64;
  const cellsX = 16;
  const cellsY = 16;

  const createFrame = (i: number) => {
    const frame = {
      x: (i % 16) * spriteWidth,
      y: Math.floor(i / 16) * spriteHeight,
      w: spriteWidth,
      h: spriteHeight,
    };
    return {
      frame,
      sourceSize: { w: spriteWidth, h: spriteHeight },
      spriteSourceSize: {
        x: 0,
        y: 0,
        w: spriteWidth,
        h: spriteHeight,
      },
    };
  };

  const frame_name = (f: number) => `frame_${f}`;

  const frameCount = cellsX * cellsY;
  const frames: Record<string, ReturnType<typeof createFrame>> = {};

  for (let f = 0; f < frameCount; f++) {
    frames[frame_name(f)] = createFrame(f);
  }

  const animations = {
    drive: [3, 2, 1, 0].map(frame_name),
  };

  return {
    frames,
    animations,
    meta: {
      image: "public/sprites.png",
      format: "RGBA8888",
      size: { w: spriteWidth, h: spriteHeight },
      scale: 1, //`??
    },
  };
}
