const $ = (id) => document.getElementById(id);
const home = $('home');
const practice = $('practice');

// The exercise uses the opening right-hand phrase of Für Elise.
const melody = [76, 75, 76, 75, 76, 71, 74, 72, 69];
const noteNames = {69:'A4', 70:'A♯4', 71:'B4', 72:'C5', 73:'C♯5', 74:'D5', 75:'D♯5', 76:'E5', 77:'F5', 78:'F♯5', 79:'G5'};
const staffY = {69:90, 71:80, 72:71, 74:61, 75:61, 76:52};
const homeWhites = [
  {midi:60,key:'Q',name:'C4'}, {midi:62,key:'W',name:'D4'},
  {midi:64,key:'E',name:'E4'}, {midi:65,key:'R',name:'F4'},
  {midi:67,key:'T',name:'G4'}, {midi:69,key:'Y',name:'A4'},
  {midi:71,key:'U',name:'B4'}
];
const homeBlacks = [
  {midi:61,key:'2',name:'C♯4'}, {midi:63,key:'3',name:'D♯4'},
  {midi:66,key:'5',name:'F♯4'}, {midi:68,key:'6',name:'G♯4'},
  {midi:70,key:'7',name:'A♯4'}
];
const practiceWhites = [
  {midi:69,key:'Q',name:'A4'}, {midi:71,key:'W',name:'B4'},
  {midi:72,key:'E',name:'C5'}, {midi:74,key:'R',name:'D5'},
  {midi:76,key:'T',name:'E5'}, {midi:77,key:'Y',name:'F5'},
  {midi:79,key:'U',name:'G5'}
];
const practiceBlacks = [
  {midi:70,key:'2',name:'A♯4'}, {midi:73,key:'3',name:'C♯5'},
  {midi:75,key:'5',name:'D♯5'}, {midi:78,key:'7',name:'F♯5'}
];
let audio;
let midiAccess;
let step = 0;

function makePiano(piano, whites, blacks) {
  for (const note of whites) {
    const button = document.createElement('button');
    button.className = 'white-key';
    button.type = 'button';
    button.dataset.midi = note.midi;
    button.setAttribute('aria-label', `${note.name} note, ${note.key} key`);
    button.innerHTML = `<span class="key-label">${note.key}</span>`;
    button.addEventListener('click', () => playNote(note.midi));
    piano.append(button);
  }
  for (const note of blacks) {
    const button = document.createElement('button');
    button.className = 'black-key';
    button.type = 'button';
    button.dataset.midi = note.midi;
    button.setAttribute('aria-label', `${note.name} note, ${note.key} key`);
    button.textContent = note.key;
    button.addEventListener('click', () => playNote(note.midi));
    piano.append(button);
  }
}
makePiano(document.querySelector('[data-piano="hero"]'), homeWhites, homeBlacks);
makePiano(document.querySelector('[data-piano="practice"]'), practiceWhites, practiceBlacks);

function sound(midi) {
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    gain.gain.setValueAtTime(0.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audio.currentTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.55);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.56);
  } catch (_) { /* The visual exercise still works if audio is unavailable. */ }
}

function playNote(midi) {
  sound(midi);
  document.querySelectorAll(`[data-midi="${midi}"]`).forEach((button) => {
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 200);
  });
  if (!practice.classList.contains('is-open') || step >= melody.length) return;
  if (midi === melody[step]) {
    step += 1;
    $('feedback').textContent = step === melody.length ? 'Well played! You finished the opening phrase.' : 'That’s it!';
    $('feedback').className = 'feedback good';
    if (step === melody.length) {
      $('practice-title').textContent = 'You did it!';
      $('progress').textContent = `${melody.length} of ${melody.length} notes`;
      $('practice-staff').innerHTML = '';
      try {
        const count = Number(localStorage.getItem('sight-reader-completed')) || 0;
        localStorage.setItem('sight-reader-completed', String(count + 1));
      } catch (_) {}
    } else renderNote();
  } else {
    $('feedback').textContent = `Try ${noteNames[melody[step]]} again.`;
    $('feedback').className = 'feedback try';
  }
}

function renderNote() {
  const midi = melody[step];
  const y = staffY[midi];
  const accidental = midi === 75 ? '<text x="174" y="76" font-family="Georgia,serif" font-size="38">♯</text>' : '';
  $('practice-title').textContent = 'Play the note you see.';
  $('progress').textContent = `${step + 1} of ${melody.length} notes`;
  $('practice-staff').setAttribute('aria-label', `Play ${noteNames[midi]}`);
  $('practice-staff').innerHTML = `<g stroke="#0b0b0b" stroke-width="1.7"><line x1="28" y1="42" x2="360" y2="42"/><line x1="28" y1="61" x2="360" y2="61"/><line x1="28" y1="80" x2="360" y2="80"/><line x1="28" y1="99" x2="360" y2="99"/><line x1="28" y1="118" x2="360" y2="118"/></g><text x="32" y="125" font-family="Georgia,serif" font-size="119">𝄞</text>${accidental}<ellipse cx="220" cy="${y}" rx="13" ry="9" transform="rotate(-22 220 ${y})" fill="#0b0b0b"/><path d="M232 ${y - 1}V${y + 56}" fill="none" stroke="#0b0b0b" stroke-width="2"/>`;
}

function startExercise() {
  step = 0;
  home.style.display = 'none';
  practice.classList.add('is-open');
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';
  renderNote();
  document.querySelectorAll('dialog[open]').forEach((dialog) => dialog.close());
  window.scrollTo({top:0, behavior:'smooth'});
}

function goHome() {
  practice.classList.remove('is-open');
  home.style.display = '';
  window.scrollTo({top:0, behavior:'smooth'});
}

$('start').onclick = startExercise;
$('play-song').onclick = startExercise;
$('watch-start').onclick = startExercise;
$('restart').onclick = startExercise;
$('back').onclick = goHome;
$('brand').onclick = (event) => { event.preventDefault(); goHome(); };
$('watch').onclick = () => $('watch-dialog').showModal();
$('account').onclick = () => {
  let count = 0;
  try { count = Number(localStorage.getItem('sight-reader-completed')) || 0; } catch (_) {}
  $('account-progress').textContent = `${count} opening phrases completed on this device.`;
  $('account-dialog').showModal();
};
document.querySelectorAll('[data-close]').forEach((button) => {
  button.onclick = () => button.closest('dialog').close();
});

document.addEventListener('keydown', (event) => {
  if (event.repeat || event.altKey || event.metaKey || event.ctrlKey || document.querySelector('dialog[open]')) return;
  const whites = practice.classList.contains('is-open') ? practiceWhites : homeWhites;
  const blacks = practice.classList.contains('is-open') ? practiceBlacks : homeBlacks;
  const note = [...whites, ...blacks].find((candidate) => candidate.key.toLowerCase() === event.key.toLowerCase());
  if (note) { event.preventDefault(); playNote(note.midi); }
});

$('connect-midi').onclick = () => $('midi-dialog').showModal();
$('midi-connect').onclick = async () => {
  const message = $('midi-message');
  if (!navigator.requestMIDIAccess) {
    message.textContent = 'MIDI is unavailable in this browser. You can still use the on-screen keys.';
    return;
  }
  try {
    midiAccess = await navigator.requestMIDIAccess();
    const bind = () => {
      for (const input of midiAccess.inputs.values()) {
        input.onmidimessage = (event) => {
          const [status, midi, velocity] = event.data;
          if ((status & 0xf0) === 0x90 && velocity > 0) playNote(midi);
        };
      }
    };
    bind();
    midiAccess.onstatechange = bind;
    message.textContent = 'Connected. Play a note on your piano to begin.';
  } catch (_) {
    message.textContent = 'MIDI access was not granted. You can still use the on-screen keys.';
  }
};

if (document.modelContext?.registerTool) {
  const register = (tool) => {
    try { Promise.resolve(document.modelContext.registerTool(tool)).catch(() => {}); } catch (_) {}
  };
  register({
    name: 'start_fur_elise_exercise',
    title: 'Start Für Elise exercise',
    description: 'Open the one-hand opening phrase of Für Elise for practice.',
    inputSchema: {type:'object', properties:{}, additionalProperties:false},
    annotations: {readOnlyHint:false, untrustedContentHint:false},
    execute(input) {
      if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw new Error('No inputs expected.');
      startExercise();
      return {status:'started', note:noteNames[melody[step]], totalNotes:melody.length};
    }
  });
  register({
    name: 'play_fur_elise_note',
    title: 'Play a note',
    description: 'Play one note in the active Für Elise exercise and receive feedback.',
    inputSchema: {type:'object', properties:{note:{type:'string', enum:['A4','B4','C5','D5','D♯5','E5','F5','G5']}}, required:['note'], additionalProperties:false},
    annotations: {readOnlyHint:false, untrustedContentHint:false},
    execute(input) {
      if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== 1 || typeof input.note !== 'string') throw new Error('Provide one note.');
      if (!practice.classList.contains('is-open') || step >= melody.length) throw new Error('Start the exercise first.');
      const midi = Number(Object.keys(noteNames).find((key) => noteNames[key] === input.note));
      if (!Number.isFinite(midi) || ![...practiceWhites, ...practiceBlacks].some((note) => note.midi === midi)) throw new Error('Unsupported note.');
      playNote(midi);
      return {correct:$('feedback').classList.contains('good'), progress:step, totalNotes:melody.length, nextNote:step < melody.length ? noteNames[melody[step]] : null};
    }
  });
}
