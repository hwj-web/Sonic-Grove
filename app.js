/* =========================================================
   声息花园 Sonic Grove · app.js
   7 个连续状态页 / 长按刻录 / A-B 面音频时间线
   ========================================================= */
(function () {
  'use strict';

  const app = document.getElementById('app');
  const cvs = document.getElementById('fireflies');
  const ctx = cvs.getContext('2d');
  const screens = Array.from(document.querySelectorAll('.screen'));

  const mockRecord = {
    recordNo: 'No.0006',
    title: '灯熄以后，光还在',
    plant: '月见草',
    flowerWords: '没人看，也会开',
    note: '月见草是夜里才开的花。没人看，它也开。今天没有被谁看见，可你也好好地活过了一天。',
    anchorSong: {
      title: '光',
      artist: '陈粒'
    },
    sideA: '落地',
    sideB: '留白',
    mood: {
      emotion: '停不下来的思考',
      energy: '困但很清醒',
      goal: '平静下来',
      tension: 72
    }
  };

  const state = {
    currentScreen: 'home',
    selectedElf: 'yedu',
    answers: { mood: '', energy: '', goal: '', tension: mockRecord.mood.tension },
    chatFlow: {
      stage: 'idle',
      tensionTouched: false,
      matchPhase: 'idle',
      matchMode: 'auto',
      manualConfirmed: false,
      diaryResponded: false,
      finalHintShown: false
    },
    playbackVolume: 0.78,
    playbackStartedAt: 0,
    playbackRaf: 0,
    playbackTimeout: 0,
    holding: false,
    holdStartAt: 0,
    holdRaf: 0,
    audioReady: false,
    bgmMuted: false,
    playbackEnding: false,
    yeduWhisperTimeout: 0
  };

  let W = 0;
  let H = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let far = [];
  let near = [];

  const ui = {
    chooseTip: document.getElementById('choose-tip'),
    elfBubble: document.getElementById('elf-bubble'),
    elfTitle: document.getElementById('elf-title'),
    elfDesc: document.getElementById('elf-desc'),
    chatTip: document.getElementById('chat-tip'),
    tensionSlider: document.getElementById('tension-slider'),
    tensionValue: document.getElementById('tension-value'),
    chatNext: document.getElementById('btn-to-engrave'),
    engraveCore: document.getElementById('engrave-core'),
    engraveTip: document.getElementById('engrave-tip'),
    sideNote: document.getElementById('side-note'),
    recordNo: document.getElementById('record-no'),
    recordTitle: document.getElementById('record-title'),
    recordPlant: document.getElementById('record-plant'),
    recordAnchor: document.getElementById('record-anchor'),
    recordSideA: document.getElementById('record-side-a'),
    recordSideB: document.getElementById('record-side-b'),
    recordWords: document.getElementById('record-words'),
    recordNote: document.getElementById('record-note'),
    playbackPhase: document.getElementById('playback-phase'),
    playbackClock: document.getElementById('playback-clock'),
    playbackSub: document.getElementById('playback-sub'),
    markerA: document.getElementById('marker-a'),
    markerB: document.getElementById('marker-b'),
    volumeSlider: document.getElementById('volume-slider'),
    goodnight: document.getElementById('yedu-goodnight'),
    shelfNote: document.getElementById('shelf-note'),
    diaryOverlay: document.getElementById('diary-overlay'),
    diaryPanel: document.getElementById('diary-panel'),
    diaryClose: document.getElementById('diary-close'),
    diarySkip: document.getElementById('diary-skip'),
    diaryRec: document.getElementById('diary-rec'),
    diaryRecText: document.getElementById('diary-rec-text'),
    diaryHint: document.getElementById('diary-hint'),
    diaryTextarea: document.getElementById('diary-textarea'),
    diarySave: document.getElementById('diary-save')
  };

  const elfCopy = {
    yedu: {
      title: '夜渡猫',
      desc: '小猫只希望你每天睡个好觉。守夜的时候，它会把你说不出口的疲惫，轻轻放进一盏小灯里。'
    },
    qiguang: {
      title: '栖光狐',
      desc: '当你想要专注做事情的时候，它擅长把所有惊惶的情绪照成一小片暖光，也将这份光轻轻寄到你的身边。'
    },
    taisheng: {
      title: '苔生团',
      desc: '花园里的人生导师，冥想是它最擅长的事情。它总是安安静静地长在潮湿的角落，帮你把心事养软一点。'
    },
    xuan: {
      title: '絮安羊',
      desc: '乐于分享的解压小游戏能手，还会ASMR。它像一团会呼吸的云，把过于锋利的思绪裹得柔和。'
    }
  };

  const timeline = {
    total: 90,
    aEnd: 35,
    bridgeEnd: 50,
    bEnd: 85
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function resize() {
    const rect = app.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cvs.width = W * dpr;
    cvs.height = H * dpr;
    cvs.style.width = W + 'px';
    cvs.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeFireflies(count, minRadius, maxRadius, velocity) {
    return Array.from({ length: count }, function () {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        baseX: Math.random() * W,
        baseY: Math.random() * H,
        radius: minRadius + Math.random() * (maxRadius - minRadius),
        angle: Math.random() * Math.PI * 2,
        speed: 0.0015 + Math.random() * 0.0036,
        driftX: (Math.random() - 0.5) * velocity,
        driftY: (Math.random() - 0.5) * velocity,
        orbit: 10 + Math.random() * 26
      };
    });
  }

  function buildFireflies() {
    far = makeFireflies(14, 0.6, 1.15, 0.05);
    near = makeFireflies(9, 1.3, 2.4, 0.1);
  }

  function drawFireflySet(list, glow, clusterStrength) {
    const targetX = W * 0.5;
    const targetY = H * 0.52;

    ctx.shadowColor = 'rgba(241,185,104,0.9)';
    list.forEach(function (item) {
      item.angle += item.speed;
      item.baseX += item.driftX;
      item.baseY += item.driftY;

      if (item.baseX < -18) item.baseX = W + 18;
      if (item.baseX > W + 18) item.baseX = -18;
      if (item.baseY < -18) item.baseY = H + 18;
      if (item.baseY > H + 18) item.baseY = -18;

      const orbitX = item.baseX + Math.cos(item.angle * 2) * item.orbit;
      const orbitY = item.baseY + Math.sin(item.angle * 1.6) * item.orbit * 0.4;
      const x = orbitX + (targetX - orbitX) * clusterStrength;
      const y = orbitY + (targetY - orbitY) * clusterStrength;
      const alpha = 0.18 + 0.5 * (0.5 + 0.5 * Math.sin(item.angle * 5.6));

      ctx.globalAlpha = alpha;
      ctx.shadowBlur = glow + clusterStrength * 9;
      ctx.fillStyle = '#FBE6B0';
      ctx.beginPath();
      ctx.arc(x, y, item.radius + clusterStrength * 0.45, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function renderFireflies() {
    const clusterStrength = state.currentScreen === 'engrave'
      ? clamp(parseFloat(getComputedStyle(app).getPropertyValue('--engrave-progress')) || 0, 0, 1)
      : 0;

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    drawFireflySet(far, 5, clusterStrength);
    drawFireflySet(near, 10, clusterStrength);
    ctx.restore();
    requestAnimationFrame(renderFireflies);
  }

  const Sound = {
    unlocked: false,
    context: null,
    master: null,
    pool: {},
    files: {
      voice: 'assets/yedu_voice.mp3',
      music: 'assets/anchor_guang_sleep_edit.mp3',
      pink: 'assets/pink_noise_loop.mp3',
      rain: 'assets/rain_loop.mp3',
      chime: 'assets/soft_magical_chime.mp3',
      needle: 'assets/falling_needle.mp3',
      bgm: 'assets/BGM_Sonic_Grove.mp3'
    },
    ensureContext: function () {
      if (!this.context) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          this.context = new AudioContextClass();
          this.master = this.context.createGain();
          this.master.gain.value = 0.35;
          this.master.connect(this.context.destination);
        }
      }
      return this.context;
    },
    createAudio: function (key, loop) {
      const url = this.files[key];
      if (!url) return null;
      const audio = new Audio(url);
      audio.preload = 'none';
      audio.loop = !!loop;
      audio.crossOrigin = 'anonymous';
      return audio;
    },
    unlock: function () {
      if (this.unlocked) return;
      this.unlocked = true;
      this.ensureContext();
      if (this.context && this.context.state === 'suspended') {
        this.context.resume().catch(function () {});
      }

      this.pool.voice = this.createAudio('voice', false);
      this.pool.music = this.createAudio('music', false);
      this.pool.pink = this.createAudio('pink', true);
      this.pool.rain = this.createAudio('rain', true);
      this.pool.needle = this.createAudio('needle', false);
      this.pool.chime = this.createAudio('chime', false);
      this.pool.bgm = this.createAudio('bgm', true);

      // 预热所有音频：在用户手势中 play→pause 一次，浏览器释放播放权限
      Object.keys(this.pool).forEach(function (name) {
        const audio = Sound.pool[name];
        if (!audio) return;
        audio.volume = 0;
        audio.muted = true;
        audio.play().then(function () {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = name === 'bgm' ? 0.18 : 1;
          audio.muted = false;
        }).catch(function () {});
      });
    },
    playFile: function (name, volume, loop) {
      if (!this.unlocked) return null;
      var audio = this.pool[name];
      if (audio) {
        audio.currentTime = 0;
        audio.volume = volume == null ? 1 : volume;
        audio.loop = !!loop;
        audio.play().catch(function () {});
        return audio;
      }
      audio = this.createAudio(name, !!loop);
      if (!audio) return null;
      audio.volume = volume == null ? 1 : volume;
      audio.muted = true;
      audio.play().then(function () {
        audio.muted = false;
      }).catch(function () {});
      return audio;
    },
    playAmbient: function () {
      this.unlock();
      if (this.pool.rain) {
        this.pool.rain.loop = true;
        this.pool.rain.currentTime = 0;
        this.pool.rain.play().catch(function () {});
      }
      if (this.pool.pink) {
        this.pool.pink.loop = true;
        this.pool.pink.currentTime = 0;
        this.pool.pink.play().catch(function () {});
      }
      if (this.pool.music) {
        this.pool.music.loop = false;
        this.pool.music.currentTime = 0;
        this.pool.music.play().catch(function () {});
      }
    },
    stopAmbient: function () {
      ['music', 'pink', 'rain', 'voice'].forEach(function (name) {
        const audio = Sound.pool[name];
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
      });
    },
    startBgm: function () {
      if (state.bgmMuted) return;
      if (!this.pool.bgm) return;
      this.pool.bgm.volume = 0.18;
      this.pool.bgm.loop = true;
      if (this.pool.bgm.paused) {
        this.pool.bgm.play().catch(function () {});
      }
    },
    pauseBgm: function () {
      if (this.pool.bgm) {
        this.pool.bgm.pause();
      }
    },
    toggleBgm: function () {
      state.bgmMuted = !state.bgmMuted;
      if (state.bgmMuted) {
        this.pauseBgm();
      } else {
        this.startBgm();
      }
      var btn = document.getElementById('btn-mute');
      if (btn) {
        btn.classList.toggle('muted', state.bgmMuted);
        btn.textContent = state.bgmMuted ? '♪' : '♪';
      }
    },
    setAmbientVolumes: function (musicVolume, rainVolume, pinkVolume) {
      if (this.pool.music) this.pool.music.volume = clamp(musicVolume * state.playbackVolume, 0, 1);
      if (this.pool.rain) this.pool.rain.volume = clamp(rainVolume * state.playbackVolume, 0, 1);
      if (this.pool.pink) this.pool.pink.volume = clamp(pinkVolume * state.playbackVolume, 0, 1);
    },
    playVoice: function () {
      if (!this.unlocked || !this.pool.voice) return;
      this.pool.voice.pause();
      this.pool.voice.currentTime = 0;
      this.pool.voice.volume = 0.85;
      this.pool.voice.play().catch(function () {});
    },
    synth: function (kind, freq) {
      if (!this.unlocked) return;
      const audioContext = this.ensureContext();
      if (!audioContext || !this.master) return;
      if (audioContext.state === 'suspended') {
        audioContext.resume().catch(function () {});
      }

      const now = audioContext.currentTime;
      const gain = audioContext.createGain();
      gain.connect(this.master);

      function tone(type, frequency, start, duration, volume) {
        const osc = audioContext.createOscillator();
        const oscGain = audioContext.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, start);
        osc.connect(oscGain);
        oscGain.connect(gain);
        oscGain.gain.setValueAtTime(0.0001, start);
        oscGain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.start(start);
        osc.stop(start + duration + 0.03);
      }

      if (kind === 'click') {
        tone('triangle', 620, now, 0.08, 0.18);
        tone('sine', 930, now + 0.02, 0.06, 0.08);
      } else if (kind === 'reveal') {
        tone('sine', 540, now, 0.28, 0.08);
        tone('triangle', 810, now + 0.08, 0.38, 0.1);
        tone('sine', 1080, now + 0.16, 0.44, 0.07);
      } else if (kind === 'needle') {
        tone('square', 180, now, 0.08, 0.03);
        tone('triangle', 320, now + 0.04, 0.12, 0.08);
      } else if (kind === 'scratch') {
        tone('sine', freq || 400, now, 0.14, 0.06);
      }

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(1, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    }
  };

  function formatTime(seconds) {
    const value = Math.max(0, Math.floor(seconds));
    const minutes = String(Math.floor(value / 60)).padStart(2, '0');
    const secs = String(value % 60).padStart(2, '0');
    return minutes + ':' + secs;
  }

  function applyMockRecord() {
    if (ui.tensionSlider) ui.tensionSlider.value = String(mockRecord.mood.tension);
    if (ui.tensionValue) ui.tensionValue.textContent = String(mockRecord.mood.tension);
    ui.recordNo.textContent = mockRecord.recordNo;
    ui.recordTitle.textContent = mockRecord.title;
    ui.recordPlant.textContent = mockRecord.plant;
    ui.recordAnchor.textContent = '锚定歌《' + mockRecord.anchorSong.title + '》 · ' + mockRecord.anchorSong.artist;
    ui.recordSideA.textContent = 'A 面 · ' + mockRecord.sideA;
    ui.recordSideB.textContent = 'B 面 · ' + mockRecord.sideB;
    ui.recordWords.textContent = '“' + mockRecord.flowerWords + '”';
    ui.recordNote.textContent = mockRecord.note;
    ui.playbackSub.textContent = mockRecord.recordNo + ' · ' + mockRecord.title + ' · 《' + mockRecord.anchorSong.title + '》' + mockRecord.anchorSong.artist;
    ui.shelfNote.textContent = mockRecord.recordNo + ' · ' + mockRecord.plant + ' · ' + mockRecord.title;
  }

  var chatStage;

  function scrollChat() {
    if (!chatStage) chatStage = document.getElementById('chat-stage');
    if (!chatStage) return;
    requestAnimationFrame(function () { chatStage.scrollTop = chatStage.scrollHeight; });
  }

  function appendToChat(html, className) {
    if (!chatStage) chatStage = document.getElementById('chat-stage');
    if (!chatStage) return null;
    var el = document.createElement('div');
    el.className = 'stage-bubble' + (className ? ' ' + className : '');
    el.innerHTML = html;
    chatStage.appendChild(el);
    requestAnimationFrame(function () {
      el.classList.add('visible');
      scrollChat();
    });
    return el;
  }

  function appendYedu(text) {
    appendToChat('<article class="chat-bubble from-yedu"><img class="yedu-avatar" src="assets/YEDU_chatcover.png" alt="" aria-hidden="true"><div class="yedu-text"><p class="bubble-mark">YEDU</p><p>' + text + '</p></div></article>');
  }

  function appendUser(text) {
    appendToChat(text, 'user-bubble');
  }

  var optionReplies = {
    mood: {
      '停不下来的思考': '我听见了，和我一起到灯光下，你不用追上每个念头。',
      '反复出现的课题': '把声音调低一些。今晚先不解它，搁到灯下放一会儿。',
      '心情很乱说不清': '说不清也行，乱成一团的线，可以先放在我这里。',
      '心里空落落的': '夜晚很长，空着的地方，我先替你点一盏小灯。'
    },
    energy: {
      '生病难受': '身体已经很努力了。今晚我们不催它，只陪它慢一点。',
      '累到发沉': '沉一点也没关系，地面会接住你。',
      '困但很清醒': '眼睛困了，脑子还亮着。我们把那盏灯慢慢调暗。',
      '绷得紧紧的': '像一根拉太久的弦。先不用松开，我陪你一点点放轻。'
    },
    goal: {
      '有人陪伴': '我在的，整夜都在。你睡你的，我替你看着夜走。',
      '平静下来': '好，我们把今天的响声，一点点压低到听不见。',
      '被好好接住': '放心往后倒，这一张唱片，就是用来接住你的。',
      '什么都不想': '那就什么都不想，把今天交给我，我替你收着。'
    }
  };

  var Q1 = ['停不下来的思考', '反复出现的课题', '心情很乱说不清', '心里空落落的'];
  var Q2 = ['生病难受', '累到发沉', '困但很清醒', '绷得紧紧的'];
  var Q3 = ['有人陪伴', '平静下来', '被好好接住', '什么都不想'];

  function replyForTension(value) {
    if (value < 35) return '今晚的风还算轻。那我们把声音放得更软一点。';
    if (value > 70) return '慢慢来，我会把曲子调软一些，和你一起扫清思绪。';
    return '精神紧绷也没关系，我会把音乐的边缘磨圆一点。';
  }

  function renderQuestionHTML(num, label, group, options) {
    var buttons = options.map(function (o) {
      var active = state.answers[group] === o ? ' active' : '';
      return '<button type="button" class="choice-chip' + active + '" data-group="' + group + '" data-value="' + o + '">' + o + '</button>';
    }).join('');
    return '<div class="question-group"><div class="question-head"><span class="question-index">0' + num + '</span><p>' + label + '</p></div><div class="choice-row">' + buttons + '</div></div>';
  }

  function appendQuestion(num, label, group, options) {
    appendToChat(renderQuestionHTML(num, label, group, options), 'question-group');
  }

  function appendTensionPanel() {
    var html = '<div class="glass-panel tension-panel"><div class="tension-top"><p class="bubble-mark">TENSION</p><span id="tension-value">' + state.answers.tension + '</span></div><input id="tension-slider" type="range" min="0" max="100" value="' + state.answers.tension + '" aria-label="紧绷度"><div class="slider-labels"><span>放松</span><span>紧绷</span></div></div>';
    appendToChat(html, 'tension-wrap');
    var slider = document.getElementById('tension-slider');
    var valEl = document.getElementById('tension-value');
    if (!slider || !valEl) return;
    slider.addEventListener('input', function () {
      state.answers.tension = Number(slider.value);
      valEl.textContent = String(state.answers.tension);
    });
    slider.addEventListener('change', function () {
      state.answers.tension = Number(slider.value);
      valEl.textContent = String(state.answers.tension);
      if (!state.chatFlow.tensionTouched) {
        state.chatFlow.tensionTouched = true;
        Sound.synth('click');
        appendYedu(replyForTension(state.answers.tension));
        setTimeout(function () { appendRecordToday(); }, 1800);
      }
      refreshChatState();
    });
  }

  function appendRecordToday() {
    var html = '<button class="glass-panel record-today" id="btn-record-today" type="button"><span class="rt-icon">✎</span><span class="rt-text"><span class="rt-title">记录今天</span><span class="rt-sub">用语音或文字，写下今天的一句话 · 也可以跳过</span></span><span class="rt-arrow">›</span></button>';
    var el = appendToChat(html, 'record-today-wrap');
    var btn = el.querySelector('#btn-record-today');
    if (btn) {
      btn.addEventListener('click', function () {
        Sound.synth('click');
        ui.diaryOverlay.classList.remove('hidden');
        ui.diaryTextarea.value = '';
        ui.diaryPanel.classList.remove('recording');
        ui.diaryRecText.textContent = '按住录音';
        ui.diaryHint.textContent = '松手即保存，每一天都是独一无二的。';
        setTimeout(function () { ui.diaryTextarea.focus(); }, 320);
      });
    }
  }

  function appendMatchThinking() {
    appendToChat('<article class="glass-panel match-card"><p class="bubble-mark">LIGHT CARD</p><div class="match-thinking"><h3>夜渡正在为你选今晚的歌…</h3><p class="thinking-dots" aria-hidden="true"><span></span><span></span><span></span></p></div></article>', 'match-wrap');
  }

  function appendMatchAuto() {
    var artist = mockRecord.anchorSong.artist;
    var title = mockRecord.anchorSong.title;
    var html = '<article class="glass-panel match-card"><p class="bubble-mark">LIGHT CARD</p><div class="match-tabs" role="tablist"><button type="button" class="match-tab active" id="match-tab-auto" role="tab" aria-selected="true">自动匹配</button><button type="button" class="match-tab" id="match-tab-manual" role="tab" aria-selected="false">自主输入</button></div><div class="match-auto"><div class="album-line"><div class="album-thumb"><img src="assets/cover_GUANG.jpg" alt="光"></div><div class="album-copy"><p class="album-top">今天最适合陪伴你入睡的是</p><p class="album-main">' + artist + ' · 《' + title + '》</p></div></div><p class="album-bottom">《' + title + '》已经替你开出 ' + mockRecord.recordNo + ' 张花语唱片。</p></div></article>';
    var el = appendToChat(html, 'match-wrap');
    bindMatchTabs();
    return el;
  }

  function appendMatchManual() {
    var html = '<article class="glass-panel match-card"><p class="bubble-mark">LIGHT CARD</p><div class="match-tabs" role="tablist"><button type="button" class="match-tab" id="match-tab-auto" role="tab" aria-selected="false">自动匹配</button><button type="button" class="match-tab active" id="match-tab-manual" role="tab" aria-selected="true">自主输入</button></div><div class="match-manual"><form class="manual-form" id="manual-form"><label class="manual-field"><span>歌曲名<span class="req-star">*</span></span><input id="manual-song" type="text" autocomplete="off" required></label><label class="manual-field"><span>歌手名<span class="req-star">*</span></span><input id="manual-artist" type="text" autocomplete="off" required></label><label class="manual-field"><span>专辑名</span><input id="manual-album" type="text" autocomplete="off"></label><button class="glass-btn manual-submit" type="submit">确认</button></form><div class="manual-card hidden" id="manual-card"><div class="manual-cover" aria-hidden="true"></div><div><p class="manual-song" id="manual-card-song"></p><p class="manual-artist" id="manual-card-artist"></p></div></div></div></article>';
    var el = appendToChat(html, 'match-wrap');
    bindMatchTabs();
    bindManualForm();
    return el;
  }

  var chatStep = 0;

  function runChatStart() {
    appendYedu('怎么还没睡？和我聊聊吧，我会慢慢聆听。');
    chatStep = 1;
    setTimeout(function () { appendQuestion(1, '今晚，脑子里最吵的是', 'mood', Q1); chatStep = 2; }, 900);
  }

  function onQAnswered(group, value) {
    var reply = (optionReplies[group] && optionReplies[group][value]) ? optionReplies[group][value] : '嗯，记下了。';
    Sound.synth('click');
    state.answers[group] = value;
    appendUser(value);
    setTimeout(function () { appendYedu(reply); }, 700);

    if (group === 'mood') {
      setTimeout(function () { appendQuestion(2, '身体现在更像', 'energy', Q2); chatStep = 3; }, 2200);
    } else if (group === 'energy') {
      setTimeout(function () { appendQuestion(3, '今天的末尾，你真正期待的是什么', 'goal', Q3); chatStep = 4; }, 2200);
    } else if (group === 'goal') {
      setTimeout(function () { appendTensionPanel(); chatStep = 5; }, 2200);
    }
    refreshChatState();
  }

  function startMatchThinking() {
    if (state.chatFlow.matchPhase !== 'idle') return;
    state.chatFlow.matchPhase = 'thinking';
    appendMatchThinking();
    refreshChatState();
    setTimeout(function () {
      if (state.chatFlow.matchPhase !== 'thinking') return;
      state.chatFlow.matchPhase = 'revealed';
      state.chatFlow.matchMode = 'auto';
      lastMatchEl = appendMatchAuto();
      chatStep = 7;
      refreshChatState();
    }, 800);
  }

  var lastMatchEl = null;

  function setMatchMode(mode) {
    state.chatFlow.matchMode = mode;
    if (lastMatchEl && lastMatchEl.parentNode) lastMatchEl.remove();
    if (mode === 'auto') {
      lastMatchEl = appendMatchAuto();
    } else {
      lastMatchEl = appendMatchManual();
    }
    refreshChatState();
  }

  function bindMatchTabs() {
    var tabAuto = document.getElementById('match-tab-auto');
    var tabManual = document.getElementById('match-tab-manual');
    if (tabAuto) tabAuto.addEventListener('click', function () { setMatchMode('auto'); });
    if (tabManual) tabManual.addEventListener('click', function () { setMatchMode('manual'); });
  }

  function bindManualForm() {
    var form = document.getElementById('manual-form');
    if (!form) return;
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      Sound.synth('click');
      var song = String((document.getElementById('manual-song') || {}).value || '').trim();
      var artist = String((document.getElementById('manual-artist') || {}).value || '').trim();
      var album = String((document.getElementById('manual-album') || {}).value || '').trim();
      if (!song) { var sEl = document.getElementById('manual-song'); if (sEl) sEl.focus(); return; }
      if (!artist) { var aEl = document.getElementById('manual-artist'); if (aEl) aEl.focus(); return; }
      var card = document.getElementById('manual-card');
      var songEl = document.getElementById('manual-card-song');
      var artistEl = document.getElementById('manual-card-artist');
      if (songEl) songEl.textContent = album ? '《' + song + '》 · ' + album : '《' + song + '》';
      if (artistEl) artistEl.textContent = artist;
      if (card) card.classList.remove('hidden');
      state.chatFlow.manualConfirmed = true;
      refreshChatState();
    });
  }

  function refreshChatState() {
    var answersReady = Boolean(state.answers.mood && state.answers.energy && state.answers.goal);
    var tensionReady = state.chatFlow.tensionTouched;
    var matchReady = state.chatFlow.matchPhase === 'revealed';
    var manualOk = state.chatFlow.matchMode !== 'manual' || state.chatFlow.manualConfirmed;
    var canProceed = answersReady && tensionReady && matchReady && manualOk;

    if (!answersReady) {
      ui.chatTip.textContent = '先替夜渡回答完三句话吧。';
    } else if (!tensionReady) {
      ui.chatTip.textContent = '再拨一下紧绷度，让夜渡知道你现在的力度。';
    } else if (state.chatFlow.matchPhase === 'thinking') {
      ui.chatTip.textContent = '夜渡在想一拍。';
    } else if (!matchReady) {
      ui.chatTip.textContent = '夜渡正在替你定版今晚的歌。';
    } else if (!manualOk) {
      ui.chatTip.textContent = '把歌名和歌手名填上，就可以开始刻录。';
    } else {
      ui.chatTip.textContent = '好了。把这一晚交给唱片纹路吧。';
    }

    ui.chatTip.classList.toggle('hidden', !canProceed);
    ui.chatNext.classList.toggle('hidden', !canProceed);
    ui.chatNext.disabled = !canProceed;

    if (canProceed && !state.chatFlow.finalHintShown) {
      state.chatFlow.finalHintShown = true;
      setTimeout(function () { appendYedu('好，我把这些词收进灯里。等一下，它们会变成一圈一圈的纹路。'); }, 800);
    }
  }

  function resetChatFlow() {
    state.answers.mood = '';
    state.answers.energy = '';
    state.answers.goal = '';
    state.answers.tension = mockRecord.mood.tension;
    state.chatFlow.tensionTouched = false;
    state.chatFlow.matchPhase = 'idle';
    state.chatFlow.matchMode = 'auto';
    state.chatFlow.manualConfirmed = false;
    state.chatFlow.finalHintShown = false;
    chatStep = 0;

    var stage = document.getElementById('chat-stage');
    if (stage) stage.innerHTML = '';
    ui.chatTip.classList.add('hidden');
    ui.chatNext.classList.add('hidden');
    ui.chatNext.disabled = true;
    refreshChatState();
    setTimeout(function () { runChatStart(); }, 300);
  }

  function fadeOut(audio, fromVolume, progress) {
    if (!audio) return 0;
    return clamp(fromVolume * (1 - clamp(progress, 0, 1)), 0, 1);
  }

  function resetPlaybackVisuals() {
    app.style.setProperty('--playback-darkness', '0');
    app.style.setProperty('--curve-progress', '0');
    ui.goodnight.classList.add('hidden');
    ui.goodnight.classList.remove('show');
    ui.markerA.classList.add('active');
    ui.markerB.classList.remove('active');
    ui.playbackPhase.textContent = 'A 面 · 安放';
    ui.playbackClock.textContent = '00:00 / 01:30';
    document.getElementById('screen-playback').classList.remove('playing');
  }

  function stopPlayback() {
    cancelAnimationFrame(state.playbackRaf);
    clearTimeout(state.playbackTimeout);
    clearWhisper();
    state.playbackRaf = 0;
    state.playbackTimeout = 0;
    Sound.stopAmbient();
    resetPlaybackVisuals();
  }

  var whisperWords = ['晚安', '早点睡吧', '别看手机啦', '我在这儿'];
  var whisperIndex = 0;

  function scheduleWhisper() {
    if (state.currentScreen !== 'playback') return;
    clearTimeout(state.yeduWhisperTimeout);
    whisperIndex = (whisperIndex + 1) % whisperWords.length;
    var next = 25000 + Math.random() * 20000;
    state.yeduWhisperTimeout = setTimeout(function () {
      if (state.currentScreen !== 'playback') return;
      var bubble = document.getElementById('yedu-whisper');
      if (!bubble) return;
      bubble.textContent = whisperWords[whisperIndex];
      bubble.classList.add('show');
      setTimeout(function () { if (bubble) bubble.classList.remove('show'); }, 3800);
      scheduleWhisper();
    }, next);
  }

  function clearWhisper() {
    clearTimeout(state.yeduWhisperTimeout);
    state.yeduWhisperTimeout = 0;
    var bubble = document.getElementById('yedu-whisper');
    if (bubble) bubble.classList.remove('show');
  }

  function onPlaybackEnd() {
    state.playbackEnding = true;
    cancelAnimationFrame(state.playbackRaf);
    clearTimeout(state.playbackTimeout);
    clearWhisper();
    state.playbackRaf = 0;
    state.playbackTimeout = 0;
    Sound.stopAmbient();
    var breathEl = document.getElementById('breath-end');
    if (breathEl) {
      breathEl.classList.remove('hidden');
      requestAnimationFrame(function () { breathEl.classList.add('show'); });
    }
    window.setTimeout(function () {
      var pb = document.getElementById('screen-playback');
      if (pb) pb.classList.remove('eyes-closed');
      var hint = document.getElementById('eyes-closed-hint');
      if (hint) hint.classList.add('hidden');
      if (breathEl) { breathEl.classList.remove('show'); breathEl.classList.add('hidden'); }
      goTo('shelf');
      state.playbackEnding = false;
    }, 2400);
  }

  function updatePlaybackLoop() {
    const elapsed = (performance.now() - state.playbackStartedAt) / 1000;
    const progress = clamp(elapsed / timeline.total, 0, 1);
    app.style.setProperty('--curve-progress', String(progress));
    app.style.setProperty('--playback-darkness', String(clamp((elapsed - 18) / 58, 0, 1)));
    ui.playbackClock.textContent = formatTime(elapsed) + ' / 01:30';

    if (elapsed <= timeline.aEnd) {
      ui.playbackPhase.textContent = 'A 面 · 安放';
      ui.markerA.classList.add('active');
      ui.markerB.classList.remove('active');
      Sound.setAmbientVolumes(0.92, 0.38, 0.16);
    } else if (elapsed <= timeline.bridgeEnd) {
      const bridge = (elapsed - timeline.aEnd) / (timeline.bridgeEnd - timeline.aEnd);
      ui.playbackPhase.textContent = '过渡 · 夜色渐深';
      ui.markerA.classList.add('active');
      ui.markerB.classList.add('active');
      Sound.setAmbientVolumes(fadeOut(Sound.pool.music, 0.92, bridge), 0.42, 0.22);
    } else if (elapsed <= timeline.bEnd) {
      ui.playbackPhase.textContent = 'B 面 · 只剩呼吸与雨';
      ui.markerA.classList.remove('active');
      ui.markerB.classList.add('active');
      Sound.setAmbientVolumes(0, 0.48, 0.3);
    } else {
      const fade = clamp((elapsed - timeline.bEnd) / (timeline.total - timeline.bEnd), 0, 1);
      ui.playbackPhase.textContent = '晚安 · 渐隐';
      ui.markerA.classList.remove('active');
      ui.markerB.classList.add('active');
      if (fade >= 0.2) { ui.goodnight.classList.remove('hidden'); ui.goodnight.classList.add('show'); }
      else { ui.goodnight.classList.add('hidden'); ui.goodnight.classList.remove('show'); }
      Sound.setAmbientVolumes(0, fadeOut(Sound.pool.rain, 0.48, fade), fadeOut(Sound.pool.pink, 0.3, fade));
    }

    if (elapsed < timeline.total) {
      state.playbackRaf = requestAnimationFrame(updatePlaybackLoop);
    } else {
      onPlaybackEnd();
    }
  }

  function startPlayback() {
    stopPlayback();
    goTo('playback');
    var pb = document.getElementById('screen-playback');
    if (pb) pb.classList.remove('eyes-closed');
    var hint = document.getElementById('eyes-closed-hint');
    if (hint) hint.classList.add('hidden');
    var breathEl = document.getElementById('breath-end');
    if (breathEl) { breathEl.classList.remove('show'); breathEl.classList.add('hidden'); }
    document.getElementById('screen-playback').classList.add('playing');
    ui.goodnight.classList.add('hidden');
    ui.goodnight.classList.remove('show');
    Sound.playFile('needle', 0.85, false);
    Sound.playAmbient();
    Sound.setAmbientVolumes(0.92, 0.38, 0.16);
    state.playbackStartedAt = performance.now();
    state.playbackRaf = requestAnimationFrame(updatePlaybackLoop);
    state.playbackTimeout = window.setTimeout(function () {
      onPlaybackEnd();
    }, timeline.total * 1000);
    scheduleWhisper();
  }

  function setEngraveProgress(value) {
    const safe = clamp(value, 0, 1);
    app.style.setProperty('--engrave-progress', safe.toFixed(4));
    app.dataset.fireflies = safe > 0.08 ? 'cluster' : 'float';
  }

  var scratchAngles = [];
  var scratchSynthTimer = 0;
  var scratchCircleDone = false;

  function resetEngrave() {
    state.holding = false;
    cancelAnimationFrame(state.holdRaf);
    state.holdRaf = 0;
    ui.engraveCore.classList.remove('holding');
    ui.engraveTip.textContent = '按住不放，直到封面显影完整。';
    setEngraveProgress(0);
    clearScratchCanvas();
    scratchAngles = [];
    scratchCircleDone = false;
    document.getElementById('scratch-flower').classList.remove('show');
    document.getElementById('polaroid').classList.remove('bloomed');
  }

  function clearScratchCanvas() {
    var cvs = document.getElementById('scratch-canvas');
    if (!cvs) return;
    var ctx = cvs.getContext('2d');
    var size = cvs.offsetWidth || 210;
    cvs.width = size;
    cvs.height = size;
    ctx.clearRect(0, 0, size, size);
  }

  function drawScratchMark(cx, cy, size) {
    var cvs = document.getElementById('scratch-canvas');
    if (!cvs) return;
    var ctx = cvs.getContext('2d');
    var r = size / 2;
    var x = cx * r + r;
    var y = cy * r + r;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(241,185,104,.45)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(241,185,104,.12)';
    ctx.fill();
    setTimeout(function () {
      var ctx2 = cvs.getContext('2d');
      ctx2.clearRect(x - 10, y - 10, 20, 20);
      ctx2.globalAlpha = 1;
    }, 900);
  }

  function finishEngrave() {
    state.holding = false;
    cancelAnimationFrame(state.holdRaf);
    state.holdRaf = 0;
    setEngraveProgress(1);
    ui.engraveCore.classList.remove('holding');
    ui.engraveTip.textContent = '刻录完成。月见草已经发亮。';
    Sound.playFile('chime', 0.7, false);
    Sound.synth('reveal');
    document.getElementById('polaroid').classList.add('bloomed');
    window.setTimeout(function () {
      goTo('reveal');
    }, 1400);
  }

  function runHoldLoop() {
    if (!state.holding) return;
    const elapsed = performance.now() - state.holdStartAt;
    const progress = clamp(elapsed / 1500, 0, 1);
    setEngraveProgress(progress);
    ui.engraveTip.textContent = progress < 1
      ? '刻录中 ' + Math.round(progress * 100) + '%'
      : '刻录完成。月见草已经发亮。';

    if (progress >= 1) {
      finishEngrave();
      return;
    }
    state.holdRaf = requestAnimationFrame(runHoldLoop);
  }

  function getDiscAngle(clientX, clientY) {
    var el = ui.engraveCore;
    var rect = el.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    return Math.atan2(clientY - cy, clientX - cx);
  }

  function playScratchTone(angle) {
    var now = performance.now();
    if (now - scratchSynthTimer < 80) return;
    scratchSynthTimer = now;
    var freq = 280 + (Math.abs(angle) / Math.PI) * 420;
    Sound.synth('scratch', freq);
  }

  function trackScratchAngle(angle) {
    if (scratchAngles.length > 60) scratchAngles.shift();
    scratchAngles.push(angle);
    if (scratchAngles.length < 20 || scratchCircleDone) return;
    var minAngle = Math.min.apply(null, scratchAngles);
    var maxAngle = Math.max.apply(null, scratchAngles);
    var span = maxAngle - minAngle;
    if (span >= Math.PI * 1.8) {
      scratchCircleDone = true;
      var el = document.getElementById('scratch-flower');
      if (el) {
        el.classList.remove('hidden');
        requestAnimationFrame(function () { el.classList.add('show'); });
        setTimeout(function () { el.classList.remove('show'); setTimeout(function () { el.classList.add('hidden'); }, 600); }, 2200);
      }
    }
  }

  function startHold() {
    if (state.holding) return;
    state.holding = true;
    state.holdStartAt = performance.now();
    ui.engraveCore.classList.add('holding');
    Sound.playFile('chime', 0.3, false);
    clearScratchCanvas();
    scratchAngles = [];
    scratchCircleDone = false;
    runHoldLoop();
  }

  function onScratchMove(clientX, clientY) {
    var el = ui.engraveCore;
    var rect = el.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var r = rect.width / 2;
    var dx = (clientX - cx) / r;
    var dy = (clientY - cy) / r;
    if (dx * dx + dy * dy > 1) return;
    drawScratchMark(dx, dy, rect.width);
    var angle = getDiscAngle(clientX, clientY);
    playScratchTone(angle);
    trackScratchAngle(angle);
  }

  function cancelHold() {
    if (!state.holding) return;
    resetEngrave();
  }

  function updateElfBubble() {
    const info = elfCopy[state.selectedElf];
    ui.elfTitle.textContent = info.title;
    ui.elfDesc.textContent = info.desc;
    var enMark = { yedu: 'YEDU', qiguang: 'QIGUANG', taisheng: 'TAISHENG', xuan: 'XUAN' };
    ui.elfBubble.querySelector('.bubble-mark').textContent = (enMark[state.selectedElf] || 'YEDU') + ' IS LISTENING';
    ui.chooseTip.textContent = state.selectedElf === 'yedu'
      ? '已为你点亮夜渡，开启睡眠的旅途'
      : '其他精灵还在赶来的路上，先让夜渡来陪伴你吧。';
    document.getElementById('btn-choose-continue').textContent = state.selectedElf === 'yedu'
      ? '听夜渡说说话'
      : '回到夜渡';
  }

  function goTo(id) {
    const next = document.getElementById('screen-' + id);
    if (!next) return;

    if (state.currentScreen === 'playback' && id !== 'playback') {
      if (!state.playbackEnding) stopPlayback();
    }
    if (state.currentScreen === 'engrave' && id !== 'engrave') {
      resetEngrave();
    }

    screens.forEach(function (screen) {
      const active = screen === next;
      screen.classList.toggle('active', active);
      screen.setAttribute('aria-hidden', active ? 'false' : 'true');
      if (active) {
        screen.removeAttribute('inert');
      } else {
        screen.setAttribute('inert', '');
      }
    });
    state.currentScreen = id;
    app.dataset.fireflies = id === 'engrave' ? 'cluster' : 'float';

    if (id === 'engrave' || id === 'playback') {
      Sound.pauseBgm();
    } else {
      Sound.startBgm();
    }

    if (id === 'chat') {
      Sound.playVoice();
      resetChatFlow();
    }
    if (id === 'reveal') {
      Sound.synth('reveal');
    }
  }

  function bindEvents() {
    document.getElementById('btn-start').addEventListener('click', function () {
      Sound.unlock();
      Sound.synth('click');
      state.audioReady = true;
      Sound.startBgm();
      goTo('choose');
    });

    var muteBtn = document.getElementById('btn-mute');
    var mutePb = document.getElementById('btn-mute-pb');
    var muteShelf = document.getElementById('btn-mute-shelf');
    function syncMuteBtns() {
      [muteBtn, mutePb, muteShelf].forEach(function (btn) {
        if (!btn) return;
        btn.classList.toggle('muted', state.bgmMuted);
      });
    }
    if (muteBtn) {
      muteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!state.audioReady) {
          Sound.unlock();
          state.audioReady = true;
        }
        Sound.toggleBgm();
        syncMuteBtns();
      });
    }

    Array.from(document.querySelectorAll('.elf-option')).forEach(function (button) {
      button.addEventListener('click', function () {
        const elf = button.dataset.elf;
        state.selectedElf = elf;
        Sound.synth('click');
        document.querySelectorAll('.elf-option').forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        updateElfBubble();
      });
    });

    document.getElementById('btn-choose-continue').addEventListener('click', function () {
      if (state.selectedElf !== 'yedu') {
        state.selectedElf = 'yedu';
        document.querySelectorAll('.elf-option').forEach(function (item) {
          item.classList.toggle('active', item.dataset.elf === 'yedu');
        });
        updateElfBubble();
      }
      Sound.synth('click');
      goTo('chat');
    });

    document.getElementById('chat-stage').addEventListener('click', function (e) {
      var chip = e.target.closest('.choice-chip');
      if (!chip) return;
      var group = chip.dataset.group;
      var value = chip.dataset.value;
      var wasFilled = Boolean(state.answers[group]);
      if (wasFilled) return;
      onQAnswered(group, value);
    });

    ui.chatNext.addEventListener('click', function () {
      Sound.synth('click');
      goTo('engrave');
      resetEngrave();
    });

    if (ui.diaryOverlay) {
      ui.diaryOverlay.addEventListener('click', function (event) {
        if (event.target === ui.diaryOverlay) {
          closeDiary();
        }
      });
    }

    function closeDiary() {
      ui.diaryOverlay.classList.add('hidden');
      ui.diaryPanel.classList.remove('recording');
      if (state.chatFlow.matchPhase === 'idle') {
        setTimeout(function () { startMatchThinking(); }, 600);
      }
    }

    if (ui.diaryClose) ui.diaryClose.addEventListener('click', closeDiary);
    if (ui.diarySkip) ui.diarySkip.addEventListener('click', function () {
      if (!state.chatFlow.diaryResponded) {
        state.chatFlow.diaryResponded = true;
        appendYedu('不写也行。有些话，留着比说出来更轻。');
      }
      closeDiary();
    });

    if (ui.diaryRec) {
      const startRec = function () {
        ui.diaryPanel.classList.add('recording');
        ui.diaryRecText.textContent = '录音中…';
        ui.diaryHint.textContent = '松手就好，今晚这一句已被记下。';
      };
      const endRec = function () {
        if (!ui.diaryPanel.classList.contains('recording')) return;
        ui.diaryPanel.classList.remove('recording');
        ui.diaryRecText.textContent = '已记录今晚的小日记';
        ui.diaryHint.textContent = '这句话，夜渡会好好收着。';
      };

      ['pointerdown', 'mousedown', 'touchstart'].forEach(function (eventName) {
        ui.diaryRec.addEventListener(eventName, function (event) {
          event.preventDefault();
          startRec();
        });
      });
      ['pointerup', 'pointerleave', 'pointercancel', 'mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(function (eventName) {
        ui.diaryRec.addEventListener(eventName, function () {
          endRec();
        });
      });
    }

    if (ui.diarySave) {
      ui.diarySave.addEventListener('click', function () {
        Sound.synth('click');
        ui.diaryHint.textContent = '已记录今晚的小日记。';
        window.setTimeout(function () {
          if (!state.chatFlow.diaryResponded) {
            state.chatFlow.diaryResponded = true;
            appendYedu('记下了。今天的心情，我都替你压进唱片的纹路里。');
          }
          closeDiary();
        }, 420);
      });
    }

    var engraveWrap = document.getElementById('engrave-disc-wrap');

    ['pointerdown', 'mousedown', 'touchstart'].forEach(function (eventName) {
      engraveWrap.addEventListener(eventName, function (event) {
        event.preventDefault();
        startHold();
        if (event.touches && event.touches[0]) {
          onScratchMove(event.touches[0].clientX, event.touches[0].clientY);
        } else {
          onScratchMove(event.clientX, event.clientY);
        }
      });
    });
    ['pointermove', 'mousemove', 'touchmove'].forEach(function (eventName) {
      engraveWrap.addEventListener(eventName, function (event) {
        if (!state.holding) return;
        event.preventDefault();
        if (event.touches && event.touches[0]) {
          onScratchMove(event.touches[0].clientX, event.touches[0].clientY);
        } else {
          onScratchMove(event.clientX, event.clientY);
        }
      });
    });
    ['pointerup', 'pointerleave', 'pointercancel', 'mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(function (eventName) {
      engraveWrap.addEventListener(eventName, cancelHold);
    });
    document.addEventListener('pointerup', function () { if (state.holding) cancelHold(); });
    document.addEventListener('touchend', function () { if (state.holding) cancelHold(); });

    document.getElementById('btn-drop-needle').addEventListener('click', function () {
      Sound.synth('click');
      startPlayback();
    });

    var sideNoteTrigger = document.getElementById('side-note-trigger');
    if (sideNoteTrigger) {
      sideNoteTrigger.addEventListener('click', function () {
        Sound.synth('click');
        var visible = !ui.sideNote.classList.contains('hidden');
        ui.sideNote.classList.toggle('hidden');
        sideNoteTrigger.textContent = visible ? '翻看侧记 ›' : '收起侧记 ‹';
      });
    }

    ui.volumeSlider.addEventListener('input', function () {
      state.playbackVolume = Number(ui.volumeSlider.value) / 100;
      if (state.currentScreen === 'playback') {
        updatePlaybackLoop();
      }
    });

    var replayBtn = document.getElementById('btn-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', function () {
        Sound.synth('click');
        goTo('home');
      });
    }

    var eyesClosedBtn = document.getElementById('btn-eyes-closed');
    if (eyesClosedBtn) {
      eyesClosedBtn.addEventListener('click', function () {
        Sound.synth('click');
        var pb = document.getElementById('screen-playback');
        if (pb) pb.classList.add('eyes-closed');
        var hint = document.getElementById('eyes-closed-hint');
        if (hint) hint.classList.remove('hidden');
      });
    }

    if (mutePb) {
      mutePb.addEventListener('click', function (e) {
        e.stopPropagation();
        Sound.toggleBgm();
        syncMuteBtns();
      });
    }
    if (muteShelf) {
      muteShelf.addEventListener('click', function (e) {
        e.stopPropagation();
        Sound.toggleBgm();
        syncMuteBtns();
      });
    }
    syncMuteBtns();

    bindBloomCards();

    bindPlaybackSkips();
  }

  function bindBloomCards() {
    var overlay = document.getElementById('bloom-overlay');
    var card = document.getElementById('bloom-card');
    var closeBtn = document.getElementById('bloom-close');
    var coverImg = document.getElementById('bloom-cover-img');
    var noEl = document.getElementById('bloom-no');
    var plantEl = document.getElementById('bloom-plant');
    var wordsEl = document.getElementById('bloom-words');
    var bgmEl = document.getElementById('bloom-bgm');
    var playBtn = document.getElementById('bloom-play-btn');
    var bloomAudio = null;
    if (!overlay || !card) return;

    function open(no, plant, words, coverSrc, bgm) {
      if (noEl) noEl.textContent = no;
      if (plantEl) plantEl.textContent = plant;
      if (wordsEl) wordsEl.textContent = '“' + words + '”';
      if (bgmEl) bgmEl.textContent = bgm ? 'BGM：' + bgm : '';
      if (coverImg && coverSrc) {
        coverImg.innerHTML = '<img src="' + coverSrc + '" alt="' + plant + '" onerror="this.classList.add(\'img-fail\')">';
      }
      overlay.classList.remove('hidden');
      card.classList.remove('hidden');
      overlay.removeAttribute('aria-hidden');
      card.setAttribute('aria-hidden', 'false');
      Sound.synth('click');
    }

    function close() {
      overlay.classList.add('hidden');
      card.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
      card.setAttribute('aria-hidden', 'true');
      if (playBtn) { playBtn.textContent = '▶'; playBtn.classList.remove('playing'); }
      if (bloomAudio) { bloomAudio.pause(); bloomAudio = null; }
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);

    if (playBtn) {
      playBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (playBtn.classList.contains('playing')) {
          playBtn.textContent = '▶';
          playBtn.classList.remove('playing');
          if (bloomAudio) { bloomAudio.pause(); bloomAudio = null; }
        } else {
          playBtn.textContent = '⏸';
          playBtn.classList.add('playing');
          var no = (noEl && noEl.textContent) || '';
          if (no === 'No.0006' && Sound.unlocked) {
            bloomAudio = Sound.playFile('music', 0.65, false);
            if (bloomAudio) {
              bloomAudio.addEventListener('ended', function () {
                playBtn.textContent = '▶';
                playBtn.classList.remove('playing');
                bloomAudio = null;
              });
            }
          }
        }
      });
      card.addEventListener('transitionend', function () {
        if (card.classList.contains('hidden') && bloomAudio) {
          bloomAudio.pause(); bloomAudio = null;
        }
      });
    }

    var heroBtn = document.getElementById('hero-disc');
    if (heroBtn) {
      heroBtn.addEventListener('click', function () {
        open('No.0006', '月见草', '没人看，也会开。', 'assets/cover_evening_primrose.png', '光——陈粒');
      });
    }

    Array.from(document.querySelectorAll('.series-disc')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var no = btn.dataset.no || '';
        var plant = btn.dataset.plant || '';
        var words = btn.dataset.words || '';
        var bgm = btn.dataset.bgm || '';
        var img = btn.querySelector('img');
        var coverSrc = img ? (img.getAttribute('src') || '') : '';
        open(no, plant, words, coverSrc, bgm);
      });
    });
  }

  function bindPlaybackSkips() {

    var skipBBtn = document.getElementById('skip-b');
    var skipEndBtn = document.getElementById('skip-end');
    if (skipBBtn) skipBBtn.addEventListener('click', function () {
      if (state.currentScreen !== 'playback') return;
      state.playbackStartedAt = performance.now() - (timeline.bridgeEnd * 1000);
      scheduleWhisper();
    });
    if (skipEndBtn) skipEndBtn.addEventListener('click', function () {
      if (state.currentScreen !== 'playback') return;
      state.playbackStartedAt = performance.now() - (timeline.bEnd * 1000);
      scheduleWhisper();
    });

    window.addEventListener('resize', function () {
      resize();
      buildFireflies();
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden && state.currentScreen === 'playback') {
        onPlaybackEnd();
      }
    });
  }

  function init() {
    resize();
    buildFireflies();
    renderFireflies();
    bindEvents();
    applyMockRecord();
    screens.forEach(function (screen) {
      const active = screen.classList.contains('active');
      screen.setAttribute('aria-hidden', active ? 'false' : 'true');
      if (!active) {
        screen.setAttribute('inert', '');
      }
    });
    updateElfBubble();
    refreshChatState();
    resetEngrave();
    resetPlaybackVisuals();
    app.dataset.fireflies = 'float';
  }

  document.addEventListener('DOMContentLoaded', init);
  window.SonicGrove = {
    goTo: goTo,
    state: state,
    Sound: Sound,
    mockRecord: mockRecord,
    startPlayback: startPlayback,
    stopPlayback: stopPlayback,
    fadeOut: fadeOut,
    onPlaybackEnd: onPlaybackEnd
  };
})();
