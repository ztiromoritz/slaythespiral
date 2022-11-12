declare var sfxr: any;

const jump = sfxr.generate("jump");
const explosion = sfxr.generate("explosion");
export const sounds = {
  jump: () => sfxr.play(jump),
  explosion: () => sfxr.play(explosion),
};
