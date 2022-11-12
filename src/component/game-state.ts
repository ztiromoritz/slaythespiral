
export class GameState {
  readonly spiralRadius = 100;
  readonly cartLength = Math.PI * 6;
  readonly magicNumber = 0.000071; // 0.00004 for 4 cycles, 0.00007 for 3 cycles
  readonly minX = -600;

  playerSpeed = 5;
  pow = 1;
}
