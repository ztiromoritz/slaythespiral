import Synthesizer from "portable-synthesizer";

export function playMusic() {
  const synth = Synthesizer(window.AudioContext || window.webkitAudioContext);

  synth.setTone({
    oscillators: [{ waveform: "triangle" }],
  });

  const repeat = () => {
    synth.play("C2"); // middle C
    synth.play("A2");
    setTimeout(() => {
      synth.play("E2");
      synth.stop("C2");
    }, 5000);

    setTimeout(() => {
      synth.play("C2");
      synth.stop("A2");
    }, 10000);

    setTimeout(() => {
      synth.play("C2");
      synth.stop("E2");
    }, 15000);

    setTimeout(() => {
      synth.stop("A2");
      repeat();
    }, 20000);
  };
  // repeat();
}
