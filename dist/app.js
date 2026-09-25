const $ = (id) => document.getElementById(id);
const melody = [76, 75, 76, 75, 76, 71, 74, 72, 69]; // Für Elise, right hand
const names = {69:'A4',70:'A♯4',71:'B4',72:'C5',73:'C♯5',74:'D5',75:'D♯5',76:'E5',77:'F5',78:'F♯5',79:'G5'};
const positions = {69:90,71:80,72:71,74:61,75:61,76:52};
const whites = [[69,'Q'],[71,'W'],[72,'E'],[74,'R'],[76,'T'],[77,'Y'],[79,'U']];
const blacks = [[70,'2'],[73,'3'],[75,'5'],[78,'7']];
const piano = document.querySelector('[data-piano="hero"]');
let audio, pianoBus, midiAccess, step = 0, locked = false, feedback = '', wrongTimer, phase = 'intro';
let demoPlaying = false, demoIndex = -1;
const demoTimers = [];
const sampleNotes = [[48, 'C3.mp3'], [51, 'Ds3.mp3'], [54, 'Fs3.mp3'], [57, 'A3.mp3'], [60, 'C4.mp3'], [69, 'A4.mp3'], [72, 'C5.mp3'], [75, 'Ds5.mp3'], [78, 'Fs5.mp3']];
const sampleDownloads = sampleNotes.map(async ([midi, file]) => {
  const response = await fetch(`assets/piano/${file}`);
  if (!response.ok) throw new Error(`Could not load piano sample: ${file}`);
  return [midi, await response.arrayBuffer()];
});
let sampleReady;
const recordArt = document.querySelector('.record-art');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let recordAngle = 0, lastRecordFrame = 0, recordFlipUntil = 0;

function spinRecord(time) {
  if (!reducedMotion.matches) {
    if (lastRecordFrame && time >= recordFlipUntil) {
      recordAngle = (recordAngle + Math.min(time - lastRecordFrame, 100) * 360 / 30000) % 360;
    }
    recordArt.style.transform = `rotate(${recordAngle}deg)`;
  } else recordArt.style.transform = '';
  lastRecordFrame = time;
  requestAnimationFrame(spinRecord);
}
requestAnimationFrame(spinRecord);

for (const [midi, key] of [...whites, ...blacks]) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = whites.some(([pitch]) => pitch === midi) ? 'white-key' : 'black-key';
  button.dataset.midi = midi;
  button.setAttribute('aria-label', `${names[midi]} note, ${key} key`);
  button.innerHTML = `<span class="key-label">${key}</span>`;
  button.addEventListener('click', () => play(midi));
  piano.append(button);
}

function setupPiano() {
  audio = new (window.AudioContext || window.webkitAudioContext)();
  pianoBus = audio.createGain();
  pianoBus.gain.value = 0.8;
  pianoBus.connect(audio.destination);
  sampleReady = Promise.all(sampleDownloads).then(async downloads => {
    const decoded = await Promise.all(downloads.map(async ([midi, bytes]) =>
      [midi, await audio.decodeAudioData(bytes)]));
    return new Map(decoded);
  });
}

async function sound(midi, decay = 1) {
  try {
    if (!audio) setupPiano();
    if (audio.state === 'suspended') audio.resume();
    const samples = await sampleReady;
    const root = [...samples.keys()].reduce((best, note) =>
      Math.abs(note - midi) < Math.abs(best - midi) ? note : best);
    const source = audio.createBufferSource();
    const envelope = audio.createGain();
    source.buffer = samples.get(root);
    source.playbackRate.value = 2 ** ((midi - root) / 12);
    const now = audio.currentTime;
    const duration = decay < 1 ? 0.6 : 2.25;
    envelope.gain.setValueAtTime(0.85, now);
    envelope.gain.setValueAtTime(0.85, now + duration - 0.16);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(envelope).connect(pianoBus);
    source.start(now);
    source.stop(now + duration + 0.02);
  } catch (_) {}
}
window.playStaveNote = sound;
window.prepareStaveAudio = () => {
  try {
    if (!audio) setupPiano();
    if (audio.state === 'suspended') audio.resume();
  } catch (_) {}
};

function render() {
  const shownStep = demoPlaying && demoIndex >= 0 ? demoIndex : step;
  const bar = Math.floor(Math.min(shownStep, 8) / 3) * 3;
  $('bar-label').textContent = `BAR ${String(Math.floor(bar / 3) + 1).padStart(2, '0')} / 03`;
  $('progress-fill').style.width = `${(demoPlaying && demoIndex >= 0 ? demoIndex + 1 : step) / melody.length * 100}%`;
  const notes = melody.slice(bar, bar + 3).map((midi, offset) => {
    const index = bar + offset, x = (bar === 0 ? [178,248,318] : [88,202,316])[offset], y = positions[midi];
    const state = demoPlaying ? index <= demoIndex ? 'correct' : '' : index === step ? feedback : index < step ? 'correct' : '';
    const sharp = midi === 75 ? `<text x="${x-32}" y="${y+12}" font-family="Georgia,serif" font-size="36">♯</text>` : '';
    return `<g class="score-note ${state}" data-score-index="${index}">${sharp}<ellipse cx="${x}" cy="${y}" rx="12" ry="9" transform="rotate(-22 ${x} ${y})"/><path d="M${x+11} ${y-1}V${y+51}" fill="none" stroke-width="2"/></g>`;
  }).join('');
  const openingMark = bar === 0 ? '<text x="36" y="125" font-family="Georgia,serif" font-size="119">𝄞</text><text x="109" y="80" font-family="Georgia,serif" font-size="58" font-weight="700">3</text><text x="109" y="123" font-family="Georgia,serif" font-size="58" font-weight="700">4</text>' : '';
  $('home-staff').innerHTML = `<g stroke="#0b0b0b" stroke-width="1.6"><line x1="30" y1="42" x2="353" y2="42"/><line x1="30" y1="61" x2="353" y2="61"/><line x1="30" y1="80" x2="353" y2="80"/><line x1="30" y1="99" x2="353" y2="99"/><line x1="30" y1="118" x2="353" y2="118"/><line x1="30" y1="42" x2="30" y2="118"/><line x1="353" y1="42" x2="353" y2="118"/></g>${openingMark}${notes}`;
  $('home-staff').setAttribute('aria-label', demoPlaying && demoIndex >= 0 ? `Playing Für Elise, note ${demoIndex+1} of 9: ${names[melody[demoIndex]]}` : step === 9 ? 'Für Elise phrase completed' : `Für Elise, note ${step+1} of 9: ${names[melody[step]]}`);
  piano.querySelectorAll('.hint').forEach(key => key.classList.remove('hint'));
  if (phase === 'playing' && !demoPlaying && step < 9 && !locked) piano.querySelector(`[data-midi="${melody[step]}"]`)?.classList.add('hint');
}

function message(text, state = '') {
  $('home-feedback').textContent = text;
  $('home-feedback').className = `home-feedback ${state}`;
}

function stopDemo() {
  for (const timer of demoTimers) clearTimeout(timer);
  demoTimers.length = 0;
  demoPlaying = false;
  demoIndex = -1;
  piano.querySelectorAll('.demo-pressed,.demo-correct').forEach(key => key.classList.remove('demo-pressed', 'demo-correct'));
}

function startDemo() {
  stopDemo();
  // Create or resume audio within the Play click, before the delayed first note.
  try {
    if (!audio) setupPiano();
    if (audio.state === 'suspended') audio.resume();
  } catch (_) {}
  demoPlaying = true;
  let delay = reducedMotion.matches ? 0 : 850;
  const beatLengths = [250, 250, 250, 250, 310, 310, 310, 310, 650];
  melody.forEach((midi, index) => {
    demoTimers.push(setTimeout(() => {
      if (phase !== 'playing' || !demoPlaying) return;
      demoIndex = index;
      piano.querySelectorAll('.demo-correct').forEach(key => key.classList.remove('demo-correct'));
      sound(midi, 0.42);
      const key = piano.querySelector(`[data-midi="${midi}"]`);
      key?.classList.add('demo-correct');
      key?.classList.add('demo-pressed');
      demoTimers.push(setTimeout(() => key?.classList.remove('demo-pressed'), 180));
      render();
    }, delay));
    delay += beatLengths[index];
  });
  demoTimers.push(setTimeout(() => {
    stopDemo();
    render();
  }, delay));
}

function showSide(nextPhase) {
  const recordWasVisible = phase !== 'playing';
  if ((phase === 'playing') !== (nextPhase === 'playing')) recordFlipUntil = performance.now() + 800;
  if (nextPhase !== 'playing') stopDemo();
  phase = nextPhase;
  const recordVisible = phase !== 'playing';
  $('lesson').classList.toggle('is-intro', phase === 'intro');
  $('lesson').classList.toggle('is-preview', phase === 'preview');
  $('lesson').classList.toggle('is-complete', phase === 'complete');
  $('lesson-front').inert = recordVisible;
  $('lesson-front').toggleAttribute('aria-hidden', recordVisible);
  $('lesson-back').inert = !recordVisible;
  $('lesson-back').toggleAttribute('aria-hidden', !recordVisible);
  const label = phase === 'complete' ? 'Play again' : 'Play';
  $('record-action').setAttribute('aria-label', label);
  $('record-action-label').textContent = label;
  if (recordWasVisible && phase === 'playing') startDemo();
}

function play(midi) {
  if (phase !== 'playing' || locked || step === 9) return false;
  if (demoPlaying) stopDemo();
  sound(midi);
  const key = piano.querySelector(`[data-midi="${midi}"]`);
  key?.classList.add('pressed');
  setTimeout(() => key?.classList.remove('pressed'), 220);
  clearTimeout(wrongTimer);
  piano.querySelectorAll('.wrong').forEach(button => button.classList.remove('wrong'));
  piano.querySelectorAll('.correct').forEach(button => button.classList.remove('correct'));
  if (midi !== melody[step]) {
    feedback = 'wrong';
    key?.classList.add('wrong');
    message('Not quite. Try the flashing key.', 'try');
    render();
    wrongTimer = setTimeout(() => {
      key?.classList.remove('wrong');
      feedback = '';
      render();
    }, 720);
    return false;
  }
  feedback = 'correct';
  key?.classList.remove('hint');
  key?.classList.add('correct');
  message('Yes! That’s the note.', 'good');
  step += 1;
  feedback = '';
  render();
  setTimeout(() => key?.classList.remove('correct'), 180);
  if (step !== melody.length) return true;
  locked = true;
  setTimeout(() => {
    message('');
    showSide('complete');
    try { localStorage.setItem('sight-reader-completed', String((Number(localStorage.getItem('sight-reader-completed')) || 0) + 1)); } catch (_) {}
  }, 220);
  return true;
}

function startExercise() {
  window.practiceMidiActive = false;
  clearTimeout(wrongTimer);
  $('record-action').blur();
  step = 0;
  locked = false;
  feedback = '';
  piano.querySelectorAll('.wrong,.correct,.pressed').forEach(key => key.classList.remove('wrong','correct','pressed'));
  message('');
  showSide('playing');
  render();
}

function previewFlip() {
  if (locked) return;
  if (phase === 'playing') {
    clearTimeout(wrongTimer);
    piano.querySelectorAll('.wrong,.pressed').forEach(key => key.classList.remove('wrong','pressed'));
    feedback = '';
    message('');
    showSide('preview');
    render();
  } else if (phase === 'preview') {
    showSide('playing');
    render();
  } else startExercise();
}

$('record-action').onclick = () => {
  if (phase === 'preview') {
    showSide('playing');
    render();
  } else startExercise();
};
$('preview-flip').onclick = previewFlip;
function scrollToPractice(behavior) {
  $('practice-card').scrollIntoView({behavior, block:'center'});
}
let watchPreviewTimer;
$('start').onclick = () => {
  clearTimeout(watchPreviewTimer);
  scrollToPractice('smooth');
};
$('watch').onclick = () => {
  clearTimeout(watchPreviewTimer);
  window.prepareStaveAudio?.();
  scrollToPractice('smooth');
  watchPreviewTimer = setTimeout(() => window.playPracticePreview?.(), 1200);
};
$('account').onclick = () => {
  let count = 0;
  try { count = Number(localStorage.getItem('sight-reader-completed')) || 0; } catch (_) {}
  $('account-progress').textContent = `${count} opening phrases completed on this device.`;
  $('account-dialog').showModal();
};
document.querySelectorAll('[data-close]').forEach(button => button.onclick = () => button.closest('dialog').close());
document.addEventListener('keydown', event => {
  if (event.repeat || event.altKey || event.metaKey || event.ctrlKey || document.querySelector('dialog[open]')) return;
  const note = [...whites,...blacks].find(([,key]) => key.toLowerCase() === event.key.toLowerCase());
  if (note) { event.preventDefault(); play(note[0]); }
});

$('connect-midi').onclick = () => { if (!updateMidiConnectionState()) $('midi-dialog').showModal(); };
function updateMidiConnectionState() {
  const connected = midiAccess && [...midiAccess.inputs.values()].some(input => input.state === 'connected');
  document.body.classList.toggle('midi-connected',!!connected);
  const menu = $('practice-connect-menu');
  menu?.classList.toggle('is-connected',!!connected);
  if (connected && menu) menu.open = false;
  if ($('keyboard-connection-label')) $('keyboard-connection-label').textContent = connected ? 'KEYBOARD CONNECTED' : 'CONNECT KEYBOARD';
  if (connected && $('midi-dialog').open) $('midi-dialog').close();
  return connected;
}
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
        input.onmidimessage = event => {
          const [status, midi, velocity] = event.data;
          if ((status & 0xf0) === 0x90 && velocity > 0) {
            if (window.practiceMidiActive && window.practiceMidiInput) window.practiceMidiInput(midi);
            else {
              const expected = melody[step];
              play(expected !== undefined && expected % 12 === midi % 12 ? expected : midi);
            }
          }
        };
      }
      updateMidiConnectionState();
    };
    bind();
    midiAccess.onstatechange = bind;
    message.textContent = updateMidiConnectionState() ? 'Keyboard connected. Play a note to begin.' : 'MIDI access is ready. Connect or turn on your keyboard.';
  } catch (_) {
    message.textContent = 'MIDI access was not granted. You can still use the on-screen keys.';
  }
};
$('midi-bluetooth').onclick = () => {
  $('midi-message').textContent = 'Pair your piano in your device’s Bluetooth settings, then return here and choose Connect with a USB cable to allow MIDI access.';
};
$('midi-help').onclick = () => {
  $('midi-message').textContent = 'Turn on your piano, connect it by USB or Bluetooth MIDI, then allow MIDI access when your browser asks.';
};

showSide('intro');
render();

function fitDevice() {
  if (window.innerWidth >= 960) {
    $('device-slot').style.width = '';
    $('device-slot').style.height = '';
    $('device').style.transform = '';
    return;
  }
  const scale = Math.min(1, (window.innerWidth - 16) / 402, (window.innerHeight - 16) / 874);
  const slot = $('device-slot');
  slot.style.width = `${402 * scale}px`;
  slot.style.height = `${874 * scale}px`;
  $('device').style.transform = `scale(${scale})`;
}
fitDevice();
window.addEventListener('resize', fitDevice);
