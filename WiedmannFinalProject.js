// Initializes audio
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

// Oscillator and volume
let currentOscillator = null;
let masterGainNodes = {};

// Creates master gain node for specific tunings
function createMasterGainNodeForTuning(tuning) {
  const masterGainNode = audioContext.createGain();
  masterGainNode.connect(audioContext.destination);
  masterGainNodes[tuning] = masterGainNode;
}

// Creates oscillator with volume for a specific tuning
function createOscillatorWithVolume(frequency, volume, waveType, tuning) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(masterGainNodes[tuning]); // Connects master gain nodes to tunings

  oscillator.type = waveType;
  oscillator.frequency.value = frequency;
  gainNode.gain.value = volume;

  return { oscillator, gainNode };
}

// Function to stop all audio
function stopAllAudio() {
  if (currentOscillator) {
    const now = audioContext.currentTime;
    currentOscillator.gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
    currentOscillator.oscillator.stop(now + 0.1);
  }
}

// Stop Button
const stopButtonContainer = document.createElement("div"); // Create a container for the stop button
stopButtonContainer.id = "stopButtonContainer"; // Assign an id to the container
document.body.appendChild(stopButtonContainer); // Append the container to the body

const stopButton = document.createElement("button");
stopButton.textContent = "Stop Audio";
stopButton.addEventListener("click", stopAllAudio);
stopButtonContainer.appendChild(stopButton); // Append the button to the container

// Function for note playing
function playNote() {
  const frequency = this.dataset.note;
  const volume = 5;

  const waveType = document.getElementById("waveType").value;
  const tuning = frequency.split("_")[1]; // Extract tuning from the note frequency

  if (!masterGainNodes[tuning]) {
    createMasterGainNodeForTuning(tuning);
  }

  if (currentOscillator) {
    currentOscillator.oscillator.stop();
  }

  currentOscillator = createOscillatorWithVolume(
    frequencies[frequency],
    volume / 10, // makes volume between 0 and 1
    waveType,
    tuning
  );

  currentOscillator.oscillator.start();
}

// Dropdown menu
document.getElementById("waveType").addEventListener("change", playNote);

// heading spacing and capitalization
function assignButtonsAndSliders(tuning) {
  const tuningHeading = document.createElement("h2");
  tuningHeading.textContent =
    tuning
      .split(/(?=[A-Z])/) //separates tuning headings based on capital letters
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") + " Tuning"; // Capitalization and spacing for headings
  document.body.appendChild(tuningHeading);

  // Master volume sliders
  const masterVolumeLabel = document.createElement("label");
  masterVolumeLabel.textContent = "Master Volume: ";

  const masterVolumeSlider = document.createElement("input");
  masterVolumeSlider.type = "range";
  masterVolumeSlider.classList.add("volume-slider");
  masterVolumeSlider.id = `master_${tuning}_volume`;
  masterVolumeSlider.min = 0;
  masterVolumeSlider.max = 10;
  masterVolumeSlider.step = 1;
  masterVolumeSlider.value = 5;

  masterVolumeSlider.addEventListener("input", function () {
    masterGainNodes[tuning].gain.value = this.value / 10; // Initial gain value
  });

  masterVolumeLabel.appendChild(masterVolumeSlider);
  document.body.appendChild(masterVolumeLabel);

  // Buttons for specific tunings
  Object.keys(frequencies)
    .filter((note) => note.includes(`_${tuning}`)) //makes sure buttons are assigned to proper names
    .forEach((note) => {
      const container = document.createElement("div"); //creates containers
      container.classList.add("note-container");

      const button = document.createElement("button");
      button.classList.add("play-btn");
      button.dataset.note = `${note}`;
      button.textContent = `Play ${note.split("_")[0]}`; //array to align a selected note to it's button
      button.addEventListener("click", playNote);
      container.appendChild(button);

      document.body.appendChild(container);
    });
}

// Tuning frequencies
const frequencies = {
  E2_standard: 82.41,
  A2_standard: 110.0,
  D3_standard: 146.83,
  G3_standard: 196.0,
  B3_standard: 246.94,
  E4_standard: 329.63,
  // drop D
  D2_dropD: 73.42,
  A2_dropD: 110.0,
  D3_dropD: 146.83,
  G3_dropD: 196.0,
  B3_dropD: 246.94,
  E4_dropD: 329.63,
  // open G
  D2_openG: 73.42,
  G2_openG: 98.0,
  D3_openG: 146.83,
  G3_openG: 196.0,
  B3_openG: 246.94,
  D4_openG: 293.66,
  // half step down
  Eb2_halfStepDown: 77.78,
  Ab2_halfStepDown: 103.83,
  Db3_halfStepDown: 138.59,
  Gb3_halfStepDown: 185.0,
  Bb3_halfStepDown: 233.08,
  Eb4_halfStepDown: 311.13,
};

// Buttons and volume sliders for each tuning
["standard", "dropD", "openG", "halfStepDown"].forEach((tuning) => {
  assignButtonsAndSliders(tuning);
});
