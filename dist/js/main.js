// Init Speech Synth API
const synth = window.speechSynthesis;

// DOM elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");


// Init voices array
let voices = [];

// arrow function ES6 rip
const getVoices = () => {
  voices = synth.getVoices();
  console.log(voices); //devonly

  //Loop through voices and make an option for each voice
  voices.forEach(voice => {
    // Create option element
    const option = document.createElement("option");
    // Fill option with voice and language
    option.textContent = voice.name + "(" + voice.lang + ")";

    //Set needed option attr
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voiceSelect.appendChild(option);
  });
};

getVoices(); // <-- this wont work because of API change : Also you need this for firefox if you use firefox in 2019.
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices; //now this will work :)
}

// Text To Speech Functionality

const speak = () => {
  // Check if speaking , dev
  if (synth.speaking) {
    console.error("Already Speaking");
    return;
  }
  if (textInput.value !== "") {
    // Add background animation
    // body.style.background = "#141414 url(img/wave.gif)";
    // body.style.backgroundRepeat = "repeat-x";
    // body.style.backgroundSize = "100% 100%";
    // Get speaking text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    // speak end
    speakText.onend = e => {
      console.log("done speaking");
      // body.style.background = "#141414";
    };
    speakText.onerror = e => {
      console.error("something went wrong");
    };
    // current voice selection
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );
    //Loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });
    //Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    // speak to users
    synth.speak(speakText);
  }
};

// // // // // // // // //

// // Event Listeners// //

// // // // // // // // //

// text form submit
textForm.addEventListener("submit", e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate value change
rate.addEventListener("change", e => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener("change", e => (pitchValue.textContent = pitch.value));

// Voice selection change
voiceSelect.addEventListener("change", e => speak());