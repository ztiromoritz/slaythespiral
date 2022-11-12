type SpiralOpts = {
  r: (phi: number) => number;
  s: (phi: number) => number;
};

export function createSpiral(options: SpiralOpts) {
  const { r, s } = options;

  const scaleFactor = 100;

  function project(x: number, y: number) {
    x = s(x);
    const X = -(r(x) + y * 0.001) * Math.cos(x) * scaleFactor;
    const Y = (r(x) + y * 0.001) * Math.sin(x) * scaleFactor;
    const SCALE = 1;
    return { X, Y, SCALE };
  }

  return { project };
}
