(() => {
  const byId = id => document.getElementById(id);
  const whiteKeys = [[60,'C','Z'],[62,'D','X'],[64,'E','C'],[65,'F','V'],[67,'G','B'],[69,'A','N'],[71,'B','M'],[72,'C',','],[74,'D','Q'],[76,'E','W'],[77,'F','E'],[79,'G','R']];
  const blackKeys = [[61,'C♯','S',4.8],[63,'D♯','D',13.2],[66,'F♯','G',29.8],[68,'G♯','H',38.2],[70,'A♯','J',46.5],[73,'C♯','L',63.2],[75,'D♯','P',71.5],[78,'F♯','T',88.2]];
  const leftWhiteKeys = [[48,'C','Z'],[50,'D','X'],[52,'E','C'],[53,'F','V'],[55,'G','B'],[57,'A','N'],[59,'B','M']];
  const leftBlackKeys = [[49,'C♯','S',9.8],[51,'D♯','D',24.1],[54,'F♯','G',52.6],[56,'G♯','H',66.9],[58,'A♯','J',81.2]];
  const duetWhiteKeys = [[60,'C','Q'],[62,'D','W'],[64,'E','E'],[65,'F','R'],[67,'G','T'],[69,'A','Y'],[71,'B','U'],[72,'C','I'],[74,'D','O'],[76,'E','P'],[77,'F','['],[79,'G',']']];
  const duetBlackKeys = [[61,'C♯','2',4.8],[63,'D♯','3',13.2],[66,'F♯','5',29.8],[68,'G♯','6',38.2],[70,'A♯','7',46.5],[73,'C♯','9',63.2],[75,'D♯','0',71.5],[78,'F♯','=',88.2]];
  let keyboardMap = new Map();
  const positions = {60:[150,''],61:[150,'♯'],62:[140,''],63:[140,'♯'],64:[130,''],65:[120,''],66:[120,'♯'],67:[110,''],68:[110,'♯'],69:[100,''],70:[100,'♯'],71:[90,''],72:[80,''],73:[80,'♯'],74:[70,''],75:[70,'♯'],76:[60,''],77:[50,''],78:[50,'♯'],79:[40,'']};
  const n = (midi,duration=1) => ({midi,duration});
  const r = {rest:true,duration:1};
  const eliseBars = [
    [n(76),n(75)],
    [n(76),n(75),n(76),n(71),n(74),n(72)],
    [n(69,2),r,n(60),n(64),n(69)],
    [n(71,2),r,n(64),n(68),n(71)],
    [n(72,2),r,n(64),n(76),n(75)],
    [n(76),n(75),n(76),n(71),n(74),n(72)],
    [n(69,2),r,n(60),n(64),n(69)]
  ];
  const q = notes => notes.map(midi => n(midi,2));
  const songs = {
    moon: {title:'Au clair de la lune',composer:'Traditional',meter:'4/4',bars:[q([60,60,60,62]),q([64,62,60,64]),q([62,62,60,62]),[n(60,8)],q([60,60,60,62]),q([64,62,60,64]),q([62,62,60,62]),[n(60,8)]],bass:[48,55,48,48,48,55,48,48]},
    mary: {title:'Mary Had a Little Lamb',composer:'Traditional',meter:'4/4',bars:[q([64,62,60,62]),[n(64,2),n(64,2),n(64,4)],[n(62,2),n(62,2),n(62,4)],[n(64,2),n(67,2),n(67,4)],q([64,62,60,62]),[n(64,2),n(64,2),n(64,2),n(64,2)],q([62,62,64,62]),[n(60,8)]],bass:[48,48,55,48,48,53,55,48]},
    brother: {title:'Frère Jacques',composer:'Traditional',meter:'4/4',bars:[q([60,62,64,60]),q([60,62,64,60]),[n(64,2),n(65,2),n(67,4)],[n(64,2),n(65,2),n(67,4)],q([67,69,67,65]),q([64,60,67,69]),q([67,65,64,60]),[n(60,8)]],bass:[48,48,53,48,55,48,55,48]},
    joy: {title:'Ode to Joy',composer:'Beethoven',meter:'4/4',bars:[q([64,64,65,67]),q([67,65,64,62]),q([60,60,62,64]),[n(64,2),n(62,2),n(62,4)],q([64,64,65,67]),q([67,65,64,62]),q([60,60,62,64]),[n(62,2),n(60,2),n(60,4)]],bass:[48,55,48,55,48,55,48,48]},
    twinkle: {title:'Twinkle, Twinkle, Little Star',composer:'Traditional',meter:'4/4',bars:[q([60,60,67,67]),[n(69,2),n(69,2),n(67,4)],q([65,65,64,64]),[n(62,2),n(62,2),n(60,4)],q([67,67,65,65]),[n(64,2),n(64,2),n(62,4)],q([67,67,65,65]),[n(64,2),n(64,2),n(62,4)],q([60,60,67,67]),[n(69,2),n(69,2),n(67,4)],q([65,65,64,64]),[n(62,2),n(62,2),n(60,4)]],bass:[48,48,53,48,55,48,55,48,48,48,53,48]},
    elise: {title:'Für Elise',composer:'Beethoven',meter:'3/8',bars:eliseBars,bass:[null,57,57,52,57,57,57]},
    jingle: {title:'Jingle Bells',composer:'James Pierpont',meter:'4/4',bars:[[n(64,2),n(64,2),n(64,4)],[n(64,2),n(64,2),n(64,4)],q([64,67,60,62]),[n(64,8)],q([65,65,65,65]),q([65,64,64,64]),q([64,62,62,64]),[n(62,4),n(67,4)]],bass:[48,48,55,48,53,48,55,48]},
    bridge: {title:'London Bridge',composer:'Traditional',meter:'4/4',bars:[q([67,69,67,65]),[n(64,2),n(65,2),n(67,4)],[n(62,2),n(64,2),n(65,4)],[n(64,2),n(65,2),n(67,4)],q([67,69,67,65]),[n(64,2),n(65,2),n(67,4)],q([62,67,64,60]),[n(60,8)]],bass:[48,48,55,48,48,55,48,48]},
    saints: {title:'When the Saints Go Marching In',composer:'Traditional',meter:'4/4',bars:[q([60,64,65,67]),q([60,64,65,67]),q([60,64,65,67]),q([64,60,64,62]),q([64,64,62,60]),q([60,64,67,67]),q([67,65,64,62]),[n(60,8)]],bass:[48,48,53,55,48,55,53,48]},
    hallelujah: {title:'Hallelujah',composer:'Leonard Cohen',arrangement:'practice arrangement',meter:'4/4',bars:[q([60,64,67,64]),q([57,60,64,60]),q([60,64,67,72]),q([67,64,62,60]),q([65,69,72,69]),q([67,71,74,71]),q([60,64,67,64]),[n(60,8)]],bass:[48,45,48,55,53,55,48,48]}
  };
  const fullSongRepeats = {moon:3,mary:4,brother:2,joy:2,twinkle:1,elise:4,jingle:3,bridge:3,saints:3,hallelujah:4};
  const piano = byId('practice-piano');
  const leftPiano = byId('practice-left-piano');
  const keyboardRoot = byId('practice-keyboard-wrap');
  const card = byId('practice-card');
  const mapDialog = byId('keyboard-map-dialog');
  let level = 1, sampleIndex = 0, currentStep = 0, wrongNote = null, wrongTimer, hintEnabled = true, fullSongId = null;
  let passage, previewPlaying = false, previewIndex = -1, noteCoordinates = [];
  let completedNotes = new Set();
  const previewTimers = [];
  let microphoneStream, microphoneContext, microphoneSource, microphoneAnalyser, microphoneFrame;
  let lastDetectedNote = -1, stableFrames = 0, lastMicrophonePlay = 0;

  function appendKeyboard(target,whiteList,blackList) {
    target.replaceChildren();
    for (const [midi,note,key] of whiteList) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'practice-white';
      button.dataset.midi = midi;
      button.setAttribute('aria-label',key ? `${note} note, ${key === ',' ? 'comma' : key} key` : `${note} piano key`);
      button.innerHTML = key ? `<span class="key-label">${key}</span>` : '';
      button.addEventListener('click',() => playNote(midi));
      target.append(button);
    }
    target.children[whiteList.length-1].style.borderTopRightRadius = '8px';
    const blackWidth = target.classList.contains('full-88') ? 1.25 : target.classList.contains('is-wide') ? 6.5 : whiteList.length <= 7 ? 9 : 7;
    for (const [midi,note,key] of blackList) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'practice-black';
      button.dataset.midi = midi;
      const precedingWhites = whiteList.filter(([whiteMidi]) => whiteMidi < midi).length;
      button.style.left = `${precedingWhites / whiteList.length * 100 - blackWidth / 2}%`;
      button.style.width = `${blackWidth}%`;
      button.setAttribute('aria-label',key ? `${note} note, ${key} key` : `${note} piano key`);
      button.innerHTML = key ? `<span class="key-label">${key}</span>` : '';
      button.addEventListener('click',() => playNote(midi));
      target.append(button);
    }
  }

  function noteName(midi) {
    return `${['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'][midi%12]}${Math.floor(midi/12)-1}`;
  }

  function buildFullKeyboard() {
    const whitePitches = new Set([0,2,4,5,7,9,11]);
    const whites = [], blacks = [];
    for (let midi=21; midi<=108; midi++) {
      const key = [midi,noteName(midi),''];
      (whitePitches.has(midi%12) ? whites : blacks).push(key);
    }
    appendKeyboard(byId('midi-full-piano'),whites,blacks);
  }

  function keyboardOverview(leftRange,rightRange,expanded=false) {
    const whitePitches = new Set([0,2,4,5,7,9,11]);
    const whites = [], blacks = [];
    let whiteIndex = 0;
    for (let midi=21; midi<=108; midi++) {
      if (whitePitches.has(midi%12)) whites.push({midi,x:whiteIndex++*10});
      else blacks.push({midi,x:whiteIndex*10-3});
    }
    const inRange = (midi,range) => range && midi>=range[0] && midi<=range[1];
    const whiteColor = midi => midi===60 ? '#3B94D9' : inRange(midi,leftRange) ? '#e6a78d' : inRange(midi,rightRange) ? '#74cfc3' : '#fff';
    const blackColor = midi => inRange(midi,leftRange) ? '#a95439' : inRange(midi,rightRange) ? '#148f82' : '#252525';
    const whiteShapes = whites.map(key => `<rect x="${key.x+.25}" y="1" width="9.5" height="64" rx="1.4" fill="${whiteColor(key.midi)}" stroke="#d7d2c9" stroke-width=".7"/>`).join('');
    const blackShapes = blacks.map(key => `<rect x="${key.x}" y="1" width="6" height="41" rx="1" fill="${blackColor(key.midi)}"/>`).join('');
    const labels = expanded ? `<text x="5" y="85" text-anchor="middle">A0</text>${whites.filter(key => key.midi%12===0).map(key => `<text x="${key.x+5}" y="85" text-anchor="middle"${key.midi===60 ? ' fill="#3B94D9" font-weight="700"' : ''}>C${Math.floor(key.midi/12)-1}</text>`).join('')}` : '';
    return `<svg viewBox="0 0 520 ${expanded ? 92 : 66}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${whiteShapes}${blackShapes}${expanded ? `<g fill="#777168" font-family="JetBrains Mono,monospace" font-size="9">${labels}</g>` : ''}</svg>`;
  }

  function setKeyboardReference(leftWhiteList=null,rightWhiteList=null) {
    const range = whiteList => whiteList ? [whiteList[0][0],whiteList.at(-1)[0]] : null;
    const leftRange = range(leftWhiteList), rightRange = range(rightWhiteList);
    const both = leftRange && rightRange;
    const activeRange = leftRange || rightRange;
    const button = byId('practice-keyboard-map');
    button.innerHTML = keyboardOverview(leftRange,rightRange) + (both ? '<span class="keyboard-map-legend" aria-hidden="true"><span class="map-left">L</span><span class="map-right">R</span></span>' : '');
    button.setAttribute('aria-label',both ? `Show keyboard position: left hand ${noteName(leftRange[0])} to ${noteName(leftRange[1])}, right hand ${noteName(rightRange[0])} to ${noteName(rightRange[1])}, middle C in blue` : `Show ${leftRange ? 'left' : 'right'}-hand position, ${noteName(activeRange[0])} to ${noteName(activeRange[1])}, on the full keyboard; middle C is blue`);
    button.onclick = () => {
      const title = byId('keyboard-map-title');
      title.innerHTML = `${leftRange ? `<span class="map-left">Left hand · ${noteName(leftRange[0])}–${noteName(leftRange[1])}</span>` : ''}${rightRange ? `<span class="map-right">Right hand · ${noteName(rightRange[0])}–${noteName(rightRange[1])}</span>` : ''}`;
      title.setAttribute('aria-label',`${leftRange ? `Left hand ${noteName(leftRange[0])} to ${noteName(leftRange[1])}` : ''}${both ? '; ' : ''}${rightRange ? `Right hand ${noteName(rightRange[0])} to ${noteName(rightRange[1])}` : ''}`);
      byId('keyboard-map-large').innerHTML = keyboardOverview(leftRange,rightRange,true);
      byId('keyboard-map-large').setAttribute('aria-label',`Full piano keyboard from A0 to C8, with ${leftRange ? `left hand ${noteName(leftRange[0])} through ${noteName(leftRange[1])} in orange` : ''}${both ? ', ' : ''}${rightRange ? `right hand ${noteName(rightRange[0])} through ${noteName(rightRange[1])} in teal` : ''}, and middle C in blue`);
      mapDialog.showModal();
    };
  }

  function buildKeyboard() {
    const leftOnly = passage.soloHand === 'left';
    const both = !!passage.leftBars;
    keyboardRoot.classList.toggle('is-both',both);
    byId('practice-left-hand').hidden = !leftOnly && !both;
    byId('practice-right-hand').hidden = leftOnly;
    piano.classList.toggle('is-right',!both);
    piano.classList.toggle('is-wide',both);
    leftPiano.classList.add('is-seven');
    const highestNote = Math.max(...passage.bars.flat().filter(note => !note.rest).map(note => note.midi));
    const rightWhites = (both ? duetWhiteKeys : whiteKeys).filter(([midi]) => midi <= Math.max(71,highestNote));
    const rightBlacks = (both ? duetBlackKeys : blackKeys).filter(([midi]) => midi < rightWhites.at(-1)[0]);
    piano.classList.toggle('is-seven',rightWhites.length <= 7);
    if (!leftOnly) appendKeyboard(piano,rightWhites,rightBlacks);
    else piano.replaceChildren();
    if (leftOnly || both) appendKeyboard(leftPiano,leftWhiteKeys,leftBlackKeys);
    else leftPiano.replaceChildren();
    setKeyboardReference(leftOnly || both ? leftWhiteKeys : null,leftOnly ? null : rightWhites);
    keyboardMap = new Map((leftOnly ? [...leftWhiteKeys,...leftBlackKeys] : both ? [...rightWhites,...rightBlacks,...leftWhiteKeys,...leftBlackKeys] : [...whiteKeys,...blackKeys]).map(([midi,,key]) => [key.toLowerCase(),midi]));
  }

  function keyFor(midi) {
    const root = document.body.classList.contains('midi-connected') ? byId('midi-full-piano') : keyboardRoot;
    return root.querySelector(`[data-midi="${midi}"]`);
  }

  function sampleKeys() {
    if (level === 1) return ['moon','mary','brother'];
    if (level === 2) return ['elise','joy','twinkle'];
    const keys = ['joy','twinkle','brother','mary','elise','jingle','bridge','saints'];
    const offset = (level-3)%keys.length;
    return keys.slice(offset).concat(keys.slice(0,offset));
  }

  function bassBar(root,duration) {
    if (root === null) return [{rest:true,duration:2}];
    const fifth = {48:55,50:57,52:59,53:48,55:50,57:52}[root] || root;
    const third = {48:52,50:53,52:55,53:57,55:59,57:52}[root] || root;
    if (level < 5) return [n(root,duration)];
    if (level < 7) return [n(root,duration/2),n(fifth,duration/2)];
    if (level < 9) return duration === 8 ? [n(root,2),n(third,2),n(fifth,4)] : [n(root,2),n(third,2),n(fifth,2)];
    return duration === 8 ? [n(root,2),n(third,2),n(fifth,2),n(third,2)] : [n(root,1),n(third,2),n(fifth,1),n(third,2)];
  }

  function makePassage() {
    const key = fullSongId || sampleKeys()[sampleIndex];
    const song = songs[key];
    const soloHand = level >= 3 ? 'both' : level === 1 && sampleIndex !== 1 ? 'left' : 'right';
    const repeats = fullSongId ? fullSongRepeats[key] || 1 : 1;
    const songBars = Array.from({length:repeats},() => song.bars).flat();
    const songBass = Array.from({length:repeats},() => song.bass).flat();
    const fitRightHand = note => {
      if (note.rest) return {...note};
      let midi = note.midi;
      while (midi < 60) midi += 12;
      while (midi > 79) midi -= 12;
      return n(midi,note.duration);
    };
    const bars = soloHand === 'left' ? songBars.map(bar => bar.map(note => note.rest ? {...note} : n(note.midi-12,note.duration))) : soloHand === 'right' ? songBars.map(bar => bar.map(fitRightHand)) : songBars;
    const duration = song.meter === '3/8' ? 6 : 8;
    const leftBars = soloHand === 'both' ? songBass.map(root => bassBar(root,duration)) : null;
    const subtitle = `${song.composer} · ${fullSongId ? song.arrangement || 'full song' : soloHand === 'both' ? 'simplified · both hands' : `${soloHand} hand`} · ${song.meter}`;
    const events = [];
    const collect = (voiceBars,hand) => {
      let tick = 0, ordinal = 0;
      voiceBars?.forEach((bar,barIndex) => bar.forEach(event => {
        if (!event.rest) events.push({id:`${hand}-${ordinal++}`,midi:event.midi,time:tick,hand,barIndex});
        tick += event.duration;
      }));
      return tick;
    };
    const rightTicks = collect(bars,soloHand === 'left' ? 'left' : 'right');
    const leftTicks = collect(leftBars,'left');
    events.sort((a,b) => a.time-b.time || (a.hand === 'left' ? -1 : 1));
    const steps = [];
    events.forEach(event => {
      if (steps.at(-1)?.time !== event.time) steps.push({time:event.time,notes:[]});
      steps.at(-1).notes.push(event);
    });
    return {bars,leftBars,steps,events,totalTicks:Math.max(rightTicks,leftTicks),title:song.title,subtitle,soloHand,meter:song.meter,key:key === 'elise' ? 'Am' : 'C'};
  }

  function updateHint() {
    keyboardRoot.querySelectorAll('.hint').forEach(key => key.classList.remove('hint'));
    if (hintEnabled && !previewPlaying && !wrongNote && currentStep < passage.steps.length) {
      passage.steps[currentStep].notes.filter(note => !completedNotes.has(note.id)).forEach(note => keyFor(note.midi)?.classList.add('hint'));
    }
  }

  function abcPitch(midi) {
    const names = ['C','^C','D','^D','E','F','^F','G','^G','A','^A','B'];
    const name = names[midi%12];
    const octave = Math.floor(midi/12)-1;
    if (octave < 4) return name + ','.repeat(4-octave);
    if (octave > 4) return name.toLowerCase() + "'".repeat(octave-5);
    return name;
  }
  let renderedPassage = null;
  let scoreNotes = new Map();

  function scoreAbc() {
    const voiceAbc = bars => bars.map(bar => {
      const sharps = new Set();
      return bar.map(event => {
        if (event.rest) return 'z' + (event.duration === 1 ? '' : event.duration);
        let pitch = abcPitch(event.midi);
        if (pitch.startsWith('^')) {
          if (sharps.has(event.midi)) pitch = pitch.slice(1);
          sharps.add(event.midi);
        }
        return pitch + (event.duration === 1 ? '' : event.duration);
      }).join('');
    });
    const notes = voiceAbc(passage.bars).join('|') + '|';
    if (passage.leftBars) {
      const bass = voiceAbc(passage.leftBars).join('|') + '|';
      return `X:1\n%%score {R|L}\n%%stretchlast 1\nM:${passage.meter}\nL:1/16\nV:R clef=treble\nV:L clef=bass\nK:${passage.key}\n[V:R] ${notes}\n[V:L] ${bass}`;
    }
    if (passage.soloHand === 'left') return `X:1\n%%stretchlast 1\nM:${passage.meter}\nL:1/16\nK:${passage.key} clef=bass\n${notes}`;
    return `X:1\n%%stretchlast 1\nM:${passage.meter}\nL:1/16\nK:${passage.key}\n${notes}`;
  }

  function drawStaff() {
    const container = byId('practice-staff');
    if (renderedPassage !== passage) {
      if (!window.ABCJS) { container.textContent = 'Music notation is unavailable.'; return; }
      const scoreScale = fullSongId ? 1.55 : 1.38;
      const staffWidth = Math.max(1900,passage.bars.length*(fullSongId ? 285 : 250));
      container.style.width = `${staffWidth}px`;
      container.style.minWidth = `${staffWidth}px`;
      window.ABCJS.renderAbc(container,scoreAbc(),{
        add_classes:true,staffwidth:staffWidth,scale:scoreScale,paddingtop:0,paddingbottom:0,
        paddingleft:0,paddingright:0,oneSvgPerLine:false
      });
      const svg = container.querySelector('svg');
      if (svg) svg.setAttribute('viewBox',`0 0 ${svg.getAttribute('width')} ${svg.getAttribute('height')}`);
      scoreNotes = new Map();
      const allNotes = [...container.querySelectorAll('.abcjs-note')];
      const rightNotes = [...container.querySelectorAll('.abcjs-note.abcjs-v0')];
      const leftNotes = [...container.querySelectorAll('.abcjs-note.abcjs-v1')];
      passage.events.forEach(event => {
        const ordinal = Number(event.id.split('-')[1]);
        scoreNotes.set(event.id,(passage.leftBars ? event.hand === 'left' ? leftNotes : rightNotes : allNotes)[ordinal] || null);
      });
      renderedPassage = passage;
    }
    const previewNotes = new Set(previewPlaying ? passage.steps.slice(0,previewIndex+1).flatMap(step => step.notes.map(note => note.id)) : []);
    scoreNotes.forEach((note,id) => {
      if (!note) return;
      note.classList.toggle('is-done',previewPlaying ? previewNotes.has(id) : completedNotes.has(id));
      note.classList.toggle('is-wrong',!previewPlaying && id === wrongNote);
    });
    container.setAttribute('aria-label',previewPlaying ? `Playing ${passage.title}, step ${previewIndex+1} of ${passage.steps.length}` : `${passage.title}, step ${Math.min(currentStep+1,passage.steps.length)} of ${passage.steps.length}`);
  }

  function render() {
    byId('practice-title').textContent = passage.title;
    byId('practice-subtitle').textContent = passage.subtitle;
    const playLabel = fullSongId ? 'Play full song' : 'Play passage';
    byId('practice-play').setAttribute('aria-label',playLabel);
    byId('practice-play').title = playLabel;
    byId('practice-complete').querySelector('strong').textContent = fullSongId ? 'Nicely played — song complete.' : 'Nicely played — passage complete.';
    byId('practice-level-value').textContent = `Level ${level}`;
    byId('practice-level-prev').disabled = level === 1;
    byId('practice-level-next').disabled = level === 10;
    byId('practice-sample-prev').disabled = !!fullSongId || sampleIndex === 0;
    byId('practice-sample-next').disabled = !!fullSongId || sampleIndex === sampleKeys().length-1;
    byId('practice-complete').hidden = previewPlaying || currentStep < passage.steps.length;
    drawStaff();
    updateHint();
  }

  function stopPreview() {
    previewTimers.forEach(clearTimeout);
    previewTimers.length = 0;
    previewPlaying = false;
    previewIndex = -1;
    keyboardRoot.querySelectorAll('.is-preview-correct').forEach(key => key.classList.remove('is-preview-correct'));
  }

  function resetPassage() {
    stopPreview();
    clearTimeout(wrongTimer);
    currentStep = 0;
    wrongNote = null;
    completedNotes = new Set();
    passage = makePassage();
    buildKeyboard();
    render();
    byId('practice-score-viewport').scrollLeft = 0;
  }

  function keepNoteVisible(index) {
    const viewport = byId('practice-score-viewport');
    const event = passage.steps[Math.min(index,passage.steps.length-1)]?.notes[0];
    const note = event && scoreNotes.get(event.id);
    if (!note || viewport.scrollWidth <= viewport.clientWidth+1) return;
    const x = note.getBoundingClientRect().left-viewport.getBoundingClientRect().left+viewport.scrollLeft;
    viewport.scrollTo({left:Math.max(0,x-viewport.clientWidth*.42),behavior:'smooth'});
  }

  function showPreviewNote(index) {
    previewIndex = index;
    keyboardRoot.querySelectorAll('.is-preview-correct').forEach(key => key.classList.remove('is-preview-correct'));
    passage.steps[index].notes.forEach(note => {
      keyFor(note.midi)?.classList.add('is-preview-correct');
      window.playStaveNote?.(note.midi,.33);
    });
    drawStaff();
    updateHint();
    keepNoteVisible(index);
  }

  function playPreview() {
    stopPreview();
    if (microphoneStream) stopMicrophone();
    window.practiceMidiActive = true;
    previewPlaying = true;
    showPreviewNote(0);
    for (let index=1; index<passage.steps.length; index++) previewTimers.push(setTimeout(() => showPreviewNote(index),passage.steps[index].time*155));
    previewTimers.push(setTimeout(() => { stopPreview(); render(); keepNoteVisible(currentStep); },passage.totalTicks*155+150));
  }

  function playNote(midi,fromMicrophone=false) {
    window.practiceMidiActive = true;
    if (previewPlaying) stopPreview();
    if (currentStep === passage.steps.length) return;
    if (!fromMicrophone) window.playStaveNote?.(midi);
    const key = keyFor(midi);
    key?.classList.add('is-pressed');
    setTimeout(() => key?.classList.remove('is-pressed'),160);
    clearTimeout(wrongTimer);
    keyboardRoot.querySelectorAll('.is-correct,.is-wrong').forEach(button => button.classList.remove('is-correct','is-wrong'));
    const step = passage.steps[currentStep];
    const matched = step.notes.find(note => note.midi === midi && !completedNotes.has(note.id));
    if (!matched) {
      wrongNote = step.notes.find(note => !completedNotes.has(note.id))?.id || null;
      key?.classList.add('is-wrong');
      render();
      wrongTimer = setTimeout(() => { wrongNote = null; key?.classList.remove('is-wrong'); render(); },550);
      return;
    }
    wrongNote = null;
    key?.classList.add('is-correct');
    completedNotes.add(matched.id);
    if (step.notes.every(note => completedNotes.has(note.id))) currentStep++;
    render();
    keepNoteVisible(currentStep);
    setTimeout(() => key?.classList.remove('is-correct'),200);
  }

  byId('practice-level-prev').addEventListener('click',() => { if (level > 1) { level--; sampleIndex = 0; resetPassage(); } });
  byId('practice-level-next').addEventListener('click',() => { if (level < 10) { level++; sampleIndex = 0; resetPassage(); } });
  byId('practice-sample-prev').addEventListener('click',() => { if (sampleIndex > 0) { sampleIndex--; resetPassage(); } });
  byId('practice-sample-next').addEventListener('click',() => { if (sampleIndex < sampleKeys().length-1) { sampleIndex++; resetPassage(); } });
  byId('practice-hints').addEventListener('click',() => {
    hintEnabled = !hintEnabled;
    byId('practice-hints').setAttribute('aria-checked',String(hintEnabled));
    byId('practice-hints').title = hintEnabled ? 'Hints on' : 'Hints off';
    updateHint();
  });
  byId('practice-play').addEventListener('click',playPreview);
  window.playPracticePreview = playPreview;
  byId('practice-expand').addEventListener('click',async () => {
    try { if (document.fullscreenElement === card) await document.exitFullscreen(); else await card.requestFullscreen(); }
    catch (_) { /* Fullscreen is unavailable in this browser. */ }
  });
  byId('practice-connect-menu').querySelector('summary').addEventListener('click',event => {
    event.preventDefault();
    window.practiceMidiActive = true;
    const menu = byId('practice-connect-menu');
    if (menu.classList.contains('is-connected')) { menu.open = false; return; }
    byId('midi-dialog').showModal();
  });
  byId('keyboard-map-close').addEventListener('click',() => mapDialog.close());
  mapDialog.addEventListener('click',event => { if (event.target === mapDialog) mapDialog.close(); });
  const songPicker = byId('song-picker-dialog');
  document.querySelector('.screen').append(songPicker);
  const songLocations = {moon:[1,0],mary:[1,1],brother:[1,2],elise:[2,0],joy:[2,1],twinkle:[2,2],hallelujah:[2,3],jingle:[3,5],bridge:[3,6],saints:[3,7]};
  function renderRelatedSongs(songId) {
    const current = songs[songId];
    const ids = Object.keys(songLocations).filter(id => id !== songId);
    ids.sort((a,b) => Number(songs[b].composer === current.composer)-Number(songs[a].composer === current.composer));
    const related = ids.slice(0,4);
    const sameArtistCount = related.filter(id => songs[id].composer === current.composer).length;
    byId('related-songs-title').textContent = sameArtistCount ? `More by ${current.composer}` : 'More songs';
    byId('related-song-grid').innerHTML = related.map((id,index) => `<button class="related-song-tile" type="button" data-song="${id}"><span class="song-disc has-art" style="--spin-offset:-${index*9+4}s"><img src="assets/songs/${id}.webp" alt=""></span><strong>${songs[id].title}</strong><small>${songs[id].composer}</small></button>`).join('');
    byId('related-songs').hidden = false;
  }
  function showSongLibrary(push=true) {
    songPicker.hidden = false;
    byId('related-songs').hidden = true;
    document.body.classList.add('library-page');
    document.body.classList.remove('song-page','practice-only-page');
    if (push) history.pushState({view:'songs'},'', '?view=songs');
    byId('song-search').focus({preventScroll:true});
  }
  function showSong(songId,push=true) {
    const location = songLocations[songId];
    if (!location) return;
    [level,sampleIndex] = location;
    fullSongId = songId;
    resetPassage();
    songPicker.hidden = true;
    document.body.classList.remove('library-page','practice-only-page');
    document.body.classList.add('song-page');
    renderRelatedSongs(songId);
    if (push) history.pushState({song:songId},'', `?song=${songId}`);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function showPracticePage(push=true) {
    fullSongId = null;
    resetPassage();
    songPicker.hidden = true;
    document.body.classList.remove('library-page');
    document.body.classList.add('song-page','practice-only-page');
    byId('related-songs').hidden = true;
    if (push) history.pushState({view:'practice'},'', '?view=practice');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  byId('practice-nav').addEventListener('click',event => { event.preventDefault(); showPracticePage(); });
  byId('pick-song').addEventListener('click',event => { event.preventDefault(); showSongLibrary(); });
  byId('related-practice-link').addEventListener('click',event => { event.preventDefault(); showPracticePage(); });
  byId('related-all-songs').addEventListener('click',event => { event.preventDefault(); showSongLibrary(); });
  byId('song-grid').addEventListener('click',event => {
    const tile = event.target.closest('.song-tile');
    if (!tile) return;
    showSong(tile.dataset.song);
  });
  byId('related-song-grid').addEventListener('click',event => {
    const tile = event.target.closest('.related-song-tile');
    if (tile) showSong(tile.dataset.song);
  });
  window.addEventListener('popstate',() => applyRoute());
  function applyRoute() {
    const params = new URLSearchParams(location.search);
    const songId = params.get('song');
    if (songId && songLocations[songId]) showSong(songId,false);
    else if (params.get('view') === 'songs') showSongLibrary(false);
    else if (params.get('view') === 'practice') showPracticePage(false);
    else {
      songPicker.hidden = true;
      byId('related-songs').hidden = true;
      document.body.classList.remove('library-page','song-page','practice-only-page');
    }
  }
  let libraryView = 'songs';
  function filterSongs() {
    const query = byId('song-search').value.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll('.song-tile').forEach(tile => {
      const show = !query || tile.dataset.search.includes(query);
      tile.hidden = !show;
      if (show) visible++;
    });
    let artists = 0;
    document.querySelectorAll('.artist-tile').forEach(tile => {
      const show = !query || tile.dataset.artist.includes(query);
      tile.hidden = !show;
      if (show) artists++;
    });
    const count = libraryView === 'artists' ? artists : visible;
    byId('song-count').textContent = `${count} ${libraryView === 'artists' ? (count === 1 ? 'artist' : 'artists') : (count === 1 ? 'song' : 'songs')}`;
    byId('song-empty').hidden = count > 0;
  }
  byId('song-search').addEventListener('input',filterSongs);
  document.querySelector('.library-tabs').addEventListener('click',event => {
    const tab = event.target.closest('[data-library-tab]');
    if (!tab) return;
    libraryView = tab.dataset.libraryTab;
    document.querySelectorAll('[data-library-tab]').forEach(item => {
      const active = item === tab;
      item.classList.toggle('is-active',active);
      item.setAttribute('aria-selected',String(active));
    });
    byId('artist-grid').hidden = libraryView !== 'artists';
    byId('song-grid').hidden = libraryView !== 'songs';
    filterSongs();
  });
  byId('artist-grid').addEventListener('click',event => {
    const artist = event.target.closest('.artist-tile')?.dataset.artist;
    if (!artist) return;
    byId('song-search').value = artist;
    document.querySelector('[data-library-tab="songs"]').click();
  });
  function chooseSheetFile(input) {
    const files = [...(input.files || [])];
    if (!files.length) return;
    byId('sheet-file-status').textContent = files.length === 1
      ? `Added: ${files[0].name}`
      : `Added ${files.length} sheet-music pages`;
    const preview = byId('sheet-preview');
    preview.replaceChildren();
    files.forEach((file,index) => {
      const item = document.createElement('div');
      item.className = 'sheet-preview-page';
      if (file.type.startsWith('image/')) {
        const image = document.createElement('img');
        image.src = URL.createObjectURL(file);
        image.alt = `Uploaded sheet music page ${index+1}`;
        image.onload = () => URL.revokeObjectURL(image.src);
        item.append(image);
      } else {
        item.innerHTML = `<span class="sheet-pdf-icon">PDF</span><small>${file.name}</small>`;
      }
      const number = document.createElement('span');
      number.className = 'sheet-page-number';
      number.textContent = `Page ${index+1}`;
      item.append(number);
      preview.append(item);
    });
    preview.hidden = false;
    preview.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  byId('upload-sheet').addEventListener('click',() => byId('sheet-file-input').click());
  byId('sheet-file-input').addEventListener('change',event => chooseSheetFile(event.currentTarget));
  document.addEventListener('keydown',event => {
    if (event.repeat || event.altKey || event.metaKey || event.ctrlKey || document.querySelector('dialog[open]') || !songPicker.hidden) return;
    const midi = keyboardMap.get(event.key.toLowerCase());
    if (midi === undefined) return;
    event.preventDefault();
    playNote(midi);
  });
  window.practiceMidiInput = midi => {
    const expected = passage.steps[currentStep]?.notes.find(note => !completedNotes.has(note.id) && note.midi % 12 === midi % 12);
    playNote(expected?.midi ?? midi);
  };
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) window.practiceMidiActive = true;
  },{root:window.innerWidth < 960 ? byId('home') : null,threshold:.55}).observe(byId('practice'));

  function detectPitch(samples,sampleRate) {
    let energy = 0;
    for (let i=0; i<samples.length; i++) energy += samples[i]*samples[i];
    if (Math.sqrt(energy/samples.length) < .014) return null;
    const minLag = Math.floor(sampleRate/800), maxLag = Math.floor(sampleRate/125);
    let bestLag = 0, bestError = Infinity;
    for (let lag=minLag; lag<=maxLag; lag++) {
      let error = 0;
      for (let i=0; i<900; i++) { const difference = samples[i]-samples[i+lag]; error += difference*difference; }
      if (error < bestError) { bestError = error; bestLag = lag; }
    }
    if (bestError > energy*.42 || !bestLag) return null;
    return Math.round(69+12*Math.log2(sampleRate/bestLag/440));
  }

  function listenToMicrophone() {
    if (!microphoneAnalyser) return;
    const data = new Float32Array(microphoneAnalyser.fftSize);
    microphoneAnalyser.getFloatTimeDomainData(data);
    const midi = detectPitch(data,microphoneContext.sampleRate);
    if (midi === lastDetectedNote) stableFrames++;
    else { lastDetectedNote = midi; stableFrames = 0; }
    if (midi !== null && midi >= 48 && midi <= 79 && stableFrames >= 3 && performance.now()-lastMicrophonePlay > 200) {
      lastMicrophonePlay = performance.now();
      playNote(midi,true);
    }
    microphoneFrame = requestAnimationFrame(listenToMicrophone);
  }

  function stopMicrophone() {
    cancelAnimationFrame(microphoneFrame);
    microphoneSource?.disconnect();
    microphoneStream?.getTracks().forEach(track => track.stop());
    microphoneContext?.close();
    microphoneStream = microphoneContext = microphoneSource = microphoneAnalyser = null;
    byId('practice-mic').querySelector('strong').textContent = 'Use your microphone';
  }

  byId('practice-mic').addEventListener('click',async () => {
    window.practiceMidiActive = true;
    if (microphoneStream) { stopMicrophone(); return; }
    try {
      microphoneStream = await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
      microphoneContext = new (window.AudioContext || window.webkitAudioContext)();
      microphoneSource = microphoneContext.createMediaStreamSource(microphoneStream);
      microphoneAnalyser = microphoneContext.createAnalyser();
      microphoneAnalyser.fftSize = 2048;
      microphoneSource.connect(microphoneAnalyser);
      byId('practice-mic').querySelector('strong').textContent = 'Stop microphone';
      listenToMicrophone();
      byId('midi-dialog').close();
    } catch (_) {
      stopMicrophone();
      window.alert('Microphone access is unavailable in this browser.');
    }
  });

  buildFullKeyboard();
  resetPassage();
  applyRoute();
})();
