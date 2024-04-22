document.addEventListener("DOMContentLoaded", function () {
  // Initializes audio
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();

  // Oscillator and volume
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

  // Note playing function
  function playNote() {
    const frequency = this.dataset.note;
    const volumeSlider = document.getElementById(`${frequency}_volume`);
    const volume = volumeSlider.value;

    const { oscillator, gainNode } = createOscillatorWithVolume(
      frequencies[frequency],
      volume / 10 // makes volume between 0 and 1
    );

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 1000);
  }

  // Buttons and sliders for specific tunings
  function assignButtonsAndSliders(tuning) {
    const tuningHeading = document.createElement("h2");
    tuningHeading.textContent =
      tuning
        .split(/(?=[A-Z])/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ") + " Tuning"; // Capitalization and spacing corrections for headings
    document.body.appendChild(tuningHeading);

    Object.keys(frequencies)
      .filter((note) => note.includes(`_${tuning}`))
      .forEach((note) => {
        const container = document.createElement("div");
        container.classList.add("note-container");

        const button = document.createElement("button");
        button.classList.add("play-btn");
        button.dataset.note = `${note}`;
        button.textContent = `Play ${note.split("_")[0]}`;
        button.addEventListener("click", playNote);
        container.appendChild(button);

        const label = document.createElement("label");
        label.textContent = "Volume: ";

        const volumeSlider = document.createElement("input");
        volumeSlider.type = "range";
        volumeSlider.classList.add("volume-slider");
        volumeSlider.id = `${note}_volume`;
        volumeSlider.min = 0;
        volumeSlider.max = 10;
        volumeSlider.step = 1;
        volumeSlider.value = 5;

        label.appendChild(volumeSlider);
        container.appendChild(label);

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
    D2_dropD: 73.42,
    A2_dropD: 110.0,
    D3_dropD: 146.83,
    G3_dropD: 196.0,
    B3_dropD: 246.94,
    E4_dropD: 329.63,
    D2_openG: 73.42,
    G2_openG: 98.0,
    D3_openG: 146.83,
    G3_openG: 196.0,
    B3_openG: 246.94,
    D4_openG: 293.66,
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
});
