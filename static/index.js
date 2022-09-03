const control = document.getElementById('control');
const light = document.getElementById('light');
const play = document.getElementById('play');
const pause = document.getElementById('pause');
const audioIn = document.getElementById('audioIn');
const playWords = document.getElementById('playWords');
const pauseWords = document.getElementById('pauseWords');
const wordsIn = document.getElementById('wordsIn');
const audio = new Audio();
let speech = new SpeechSynthesisUtterance();
speech.lang = "en";
let pickr;

const scenario1_1 = document.getElementById('scenario1_1');
const scenario1_2 = document.getElementById('scenario1_2');
const scenario1_3 = document.getElementById('scenario1_3');

const scenario2_1 = document.getElementById('scenario2_1');
const scenario2_2 = document.getElementById('scenario2_2');
const scenario2_3 = document.getElementById('scenario2_3');

const scenario3_1 = document.getElementById('scenario3_1');
const scenario3_2 = document.getElementById('scenario3_2');
const scenario3_3 = document.getElementById('scenario3_3');

const socket = io();

socket.on('connect', () => {
  socket.on('hex', (val) => {document.body.style.backgroundColor = val})
  socket.on('audio', (val) => {getSound(encodeURI(val));})
  socket.on('pauseAudio', (val) => {audio.pause();})
  socket.on('words', (val) => {getWords(val);})
  socket.on('pauseWords', (val) => {window.speechSynthesis.pause();})
  socket.on('scenario1_1', (val) => {
    document.body.style.backgroundColor = "blue"; 
    getWords("Take 1 Vitamin");
    setTimeout(function() {
      getWords("Take 1 Vitamin");
    }, 1000)
  })
  socket.on('scenario1_2', (val) => {
    document.body.style.backgroundColor = "orange"; 
    getWords("Take your Vitamin D3");
    setTimeout(function() {
      getWords("Take your Vitamin D3");
    }, 1000)
  })
  socket.on('scenario1_3', (val) => {
    document.body.style.backgroundColor = "black"; 
  })
  socket.on('scenario2_1', (val) => {
    scenario2_1_main();
  })
  socket.on('scenario2_2', (val) => {
    document.body.style.backgroundColor = "red"; 
    audio.pause();
  })
  socket.on('scenario2_3', (val) => {
    document.body.style.backgroundColor = "black"; 
  })
  socket.on('scenario3_1', (val) => {
    document.body.style.backgroundColor = "red"; 
  })
  socket.on('scenario3_2', (val) => {
    document.body.style.backgroundColor = "yellow"; 
    getSound("Countdown Intro");
  })
  socket.on('scenario3_3', (val) => {
    document.body.style.backgroundColor = "green"; 
    audio.pause();
  })

  socket.onAny((event, ...args) => {
  console.log(event, args);
});
});

// enter controller mode
control.onclick = () => {
  console.log('control')
  // make sure you're not in fullscreen
  if (document.fullscreenElement) {
    document.exitFullscreen()
      .then(() => console.log('exited full screen mode'))
      .catch((err) => console.error(err));
  }
  // make buttons and controls visible
  document.getElementById('user').classList.remove('fadeOut');
  document.getElementById('controlPanel').style.opacity = 0.6;
  if (!pickr) {
    // create our color picker. You can change the swatches that appear at the bottom
    pickr = Pickr.create({
      el: '.pickr',
      theme: 'classic',
      showAlways: true,
      swatches: [
        'rgba(255, 255, 255, 1)',
        'rgba(244, 67, 54, 1)',
        'rgba(233, 30, 99, 1)',
        'rgba(156, 39, 176, 1)',
        'rgba(103, 58, 183, 1)',
        'rgba(63, 81, 181, 1)',
        'rgba(33, 150, 243, 1)',
        'rgba(3, 169, 244, 1)',
        'rgba(0, 188, 212, 1)',
        'rgba(0, 150, 136, 1)',
        'rgba(76, 175, 80, 1)',
        'rgba(139, 195, 74, 1)',
        'rgba(205, 220, 57, 1)',
        'rgba(255, 235, 59, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(0, 0, 0, 1)',
      ],
      components: {
        preview: false,
        opacity: false,
        hue: true,
      },
    });

    pickr.on('change', (e) => {
      // when pickr color value is changed change background and send message on ws to change background
      const hexCode = e.toHEXA().toString();
      document.body.style.backgroundColor = hexCode;
      socket.emit('hex', hexCode)
    });
  }
};

light.onclick = () => {
  // safari requires playing on input before allowing audio
  audio.muted = true;
  audio.play().then(audio.muted=false)

  // in light mode make it full screen and fade buttons
  document.documentElement.requestFullscreen();
  document.getElementById('user').classList.add('fadeOut');
  // if you were previously in control mode remove color picker and hide controls
  if (pickr) {
    // this is annoying because of the pickr package
    pickr.destroyAndRemove();
    document.getElementById('controlPanel').append(Object.assign(document.createElement('div'), { className: 'pickr' }));
    pickr = undefined;
  }
  document.getElementById('controlPanel').style.opacity = 0;
};


const getSound = (query, loop = false, random = false) => {
  const url = `https://freesound.org/apiv2/search/text/?query=${query}+"&fields=name,previews&token=U5slaNIqr6ofmMMG2rbwJ19mInmhvCJIryn2JX89&format=json`;
  fetch(url)
    .then((response) => response.clone().text())
    .then((data) => {
      console.log(data);
      data = JSON.parse(data);
      if (data.results.length >= 1) var src = random ? choice(data.results).previews['preview-hq-mp3'] : data.results[0].previews['preview-hq-mp3'];
      audio.src = src;
      audio.play();
      console.log(src);
		  })
    .catch((error) => console.log(error));
};

const getWords = (words) => {
  speech.text = words
  window.speechSynthesis.speak(speech);
};

async function scenario2_1_main() {
  const [firstCall, secondCall] = await Promise.all([
    scenario2_1_flicker(),
    scenario2_1_horn()
  ])
}

async function scenario2_1_flicker() {
  return new Promise(resolve => {
    x = 1;
    myInterval = setInterval(scenario2_1_flicker_change, 500);
    setTimeout(function() {
      clearInterval(myInterval)
    }, 10000)
  })
}

const scenario2_1_flicker_change = () => {
  if (x == 1) {
    document.body.style.backgroundColor = "red"; 
    x = 2;
  }
  else {
    document.body.style.backgroundColor = "#900000"; 
    x = 1;
  }
}

async function scenario2_1_horn() {
  return new Promise(resolve => {
    getSound("Sirene horn 2 /long/");
  })
}

play.onclick = () => {
  socket.emit('audio', audioIn.value)
  getSound(encodeURI(audioIn.value));
};
pause.onclick = () => {
  socket.emit('pauseAudio', audioIn.value)
  audio.pause();
};
audioIn.onkeyup = (e) => { if (e.keyCode === 13) { play.click(); } };

window.speechSynthesis.onvoiceschanged = () => {
  // Get List of Voices and select one
  voices = window.speechSynthesis.getVoices();
  speech.voice = voices[2];
};

playWords.onclick = () => {
  socket.emit('words', wordsIn.value)
  speech.text = document.querySelector("#wordsIn").value;
  window.speechSynthesis.speak(speech);
};
pauseWords.onclick = () => {
  socket.emit('pauseWords', wordsIn.value)
  window.speechSynthesis.pause();
};
wordsIn.onkeyup = (e) => { if (e.keyCode === 13) { playWords.click(); } };

// Preset scenarios
scenario1_1.onclick = () => {
  document.body.style.backgroundColor = "blue"
  socket.emit('scenario1_1')
};
scenario1_2.onclick = () => {
  document.body.style.backgroundColor = "orange"
  socket.emit('scenario1_2')
};
scenario1_3.onclick = () => {
  document.body.style.backgroundColor = "black"
  socket.emit('scenario1_3')
};

scenario2_1.onclick = () => {
  document.body.style.backgroundColor = "red"
  socket.emit('scenario2_1')
};
scenario2_2.onclick = () => {
  document.body.style.backgroundColor = "red"
  socket.emit('scenario2_2')
};
scenario2_3.onclick = () => {
  document.body.style.backgroundColor = "black"
  socket.emit('scenario2_3')
};

scenario3_1.onclick = () => {
  document.body.style.backgroundColor = "red"
  socket.emit('scenario3_1')
};
scenario3_2.onclick = () => {
  document.body.style.backgroundColor = "yellow"
  socket.emit('scenario3_2')
};
scenario3_3.onclick = () => {
  document.body.style.backgroundColor = "green"
  socket.emit('scenario3_3')
};