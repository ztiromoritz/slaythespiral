export function initControls() {
  const KEYS = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowLeft":
        KEYS.left = true;
        break;
      case "ArrowRight":
        KEYS.right = true;
        break;
      case "ArrowUp":
        KEYS.up = true;
        break;
      case "ArrowDown":
        KEYS.down = true;
        break;
    }
  });

  document.addEventListener("keyup", (event) => {
    switch (event.key) {
      case "ArrowLeft":
        KEYS.left = false;
        break;
      case "ArrowRight":
        KEYS.right = false;
        break;
      case "ArrowUp":
        KEYS.up = false;
        break;
      case "ArrowDown":
        KEYS.down = false;
        break;
    }
  });

  document.addEventListener("touchstart", () => {
    KEYS.up = true;
  });

  document.addEventListener("touchend", () => {
    KEYS.up = false;
  });

  return { KEYS };
}
