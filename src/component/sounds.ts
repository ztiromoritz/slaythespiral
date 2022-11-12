declare var sfxr: any;

let jump: any;
let explosion: any;

export const sounds = {
  jump: () => sfxr.play(jump),
  explosion: () => sfxr.play(explosion),
};

export function makeNewSounds() {
  jump = sfxr.generate("jump");
  explosion = sfxr.generate("explosion");
}

makeNewSounds();
