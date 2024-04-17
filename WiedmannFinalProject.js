// Frequencies for standard tuning
const standardTuning = {
  E2: 82.41,
  A2: 110.0,
  D3: 147.0,
  G3: 196.0,
  B3: 247.0,
  E4: 330.0,
};

// Audio Playback
const audioContext = new (window.AudioContext || window.AudioContext)();

// Oscillator to play a sine wave and gain creation
function createOscillatorWithVolume(frequency, volume) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;

  return { oscillator, gainNode };
}

// Assigning buttons
function playNote() {
  const frequency = standardTuning[this.id];
  const volumeSlider = document.getElementById(`${this.id}_volume`);
  const volume = volumeSlider.value;

  const { oscillator, gainNode } = createOscillatorWithVolume(
    frequency,
    volume
  );

  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, 500);
}

// Assigning volume sliders to all pitches
Object.keys(standardTuning).forEach((note) => {
  const container = document.querySelector(`#${note}_container`);
  const button = container.querySelector(`#play${note}`);
  button.addEventListener("click", playNote);

  const volumeSlider = document.createElement("input");
  volumeSlider.type = "range";
  volumeSlider.min = "0";
  volumeSlider.max = "10";
  volumeSlider.step = "1";
  volumeSlider.value = "5";
  volumeSlider.id = `${note}_volume`;

  const label = document.createElement("label");
  label.textContent = "Volume: ";
  label.appendChild(volumeSlider);

  container.appendChild(label);
});
