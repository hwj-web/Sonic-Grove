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
    source: 'preset-fallback',
    isSeed: false,
    audioKey: 'anchor_guang_sleep_edit',
    audioMode: 'mapped-preview',
    previewLabel: '花语试听',
    matchReason: '你说今晚脑海里的念头一个接一个，眼睛困了，脑海里还亮着。夜渡想先替你留住一束熟悉的光。',
    mood: {
      emotion: '停不下来的思考',
      energy: '困但很清醒',
      goal: '平静下来',
      tension: 72
    }
  };

  const fallbackSongs = [
    {
      recordNo: 'No.0006',
      title: '灯熄以后，光还在',
      plant: '月见草',
      flowerWords: '没人看，也会开',
      note: '月见草是夜里才开的花。没人看，它也开。今天没有被谁看见，可你也好好地活过了一天。',
      anchorSong: { title: '光', artist: '陈粒' },
      sideA: '落地',
      sideB: '留白',
      source: 'preset-fallback',
      isSeed: false,
      audioKey: 'anchor_guang_sleep_edit',
      audioMode: 'mapped-preview',
      previewLabel: '花语试听',
      matchReason: '你说今晚脑海里的念头一个接一个，眼睛困了，脑海里还亮着。夜渡想先替你留住一束熟悉的光。',
      suitableMood: '停不下来的思考 / 困但很清醒 / 想平静下来',
      coverUrl: 'assets/cover_evening_primrose.webp'
    },
    {
      recordNo: 'No.0007',
      title: '慢一点，也会抵达',
      plant: '薰衣草',
      flowerWords: '等一等，香气会自己回来',
      note: '薰衣草并不是一下子香起来的。它晒过光，也等过风。今晚不必急着好起来，把呼吸放慢一点，香气自会从安静里回来。',
      anchorSong: { title: '慢慢喜欢你', artist: '莫文蔚' },
      sideA: '放慢',
      sideB: '回温',
      source: 'fallback',
      isSeed: false,
      audioMode: 'soundscape-preview',
      previewLabel: '夜渡声景试听',
      suitableMood: '疲惫 / 想被安慰 / 需要一点温柔陪伴',
      coverUrl: 'assets/cover_a_sprig_of_lavender.webp'
    },
    {
      recordNo: 'No.0008',
      title: '夜里也有花开',
      plant: '睡莲',
      flowerWords: '睡吧，水会将你托住',
      note: '睡莲浮在水面，却把根安静地留在深处。今晚不必再用力撑着，水会托住你，直到呼吸慢下来。',
      anchorSong: { title: 'The Rose', artist: 'Westlife' },
      sideA: '下沉',
      sideB: '托住',
      source: 'fallback',
      isSeed: false,
      audioMode: 'soundscape-preview',
      previewLabel: '夜渡声景试听',
      suitableMood: '撑太久 / 身体很累 / 想安心睡去',
      coverUrl: 'assets/cover_a_water_lily.webp'
    },
    {
      recordNo: 'No.0009',
      title: '把没说完的，留给夜里',
      plant: '蓝铃花',
      flowerWords: '低着头，也在轻轻奏响',
      note: '蓝铃花总低着头，风经过时，才有很轻的响声。那些没说完的话，不必今晚就找到答案，先留在这里。',
      anchorSong: { title: '小半', artist: '陈粒' },
      sideA: '低语',
      sideB: '回声',
      source: 'fallback',
      isSeed: false,
      audioMode: 'soundscape-preview',
      previewLabel: '夜渡声景试听',
      suitableMood: '心事很多 / 不想解释 / 需要被听见',
      coverUrl: 'assets/cover_a_cluster_of_hanging_bluebells.webp'
    },
    {
      recordNo: 'No.0010',
      title: '风来以前，先停一停',
      plant: '蒲公英',
      flowerWords: '松开一点，风才会经过',
      note: '蒲公英并不急着远行。风没来时，它只是安静地站着。今天先停在这里，剩下的路，等明天有风再走。',
      anchorSong: { title: '平凡之路', artist: '朴树' },
      sideA: '停步',
      sideB: '远风',
      source: 'fallback',
      isSeed: false,
      audioMode: 'soundscape-preview',
      previewLabel: '夜渡声景试听',
      suitableMood: '压力大 / 想逃离 / 需要一点释然',
      coverUrl: 'assets/cover_a_dandelion_seed_head.webp'
    },
    {
      recordNo: 'No.0011',
      title: '今天，到这里就好',
      plant: '洋甘菊',
      flowerWords: '慢慢散开，也能安睡',
      note: '洋甘菊的香气一点点散进水里，不争，也不催。今天到这里就好，把肩膀放下来，夜晚会替你收住剩下的事。',
      anchorSong: { title: '晚安', artist: '颜人中' },
      sideA: '松开',
      sideB: '安睡',
      source: 'fallback',
      isSeed: false,
      audioMode: 'soundscape-preview',
      previewLabel: '夜渡声景试听',
      suitableMood: '紧绷 / 自责 / 想停止反刍',
      coverUrl: 'assets/cover_evening_primrose.webp'
    },
    {
      recordNo: 'No.0012',
      title: '风停在雪松以外',
      plant: '雪松',
      flowerWords: '安静站着，也是一种陪伴',
      note: '雪松在冷夜里不急着低头，只把枝叶撑开，让风从身旁绕过去。你不用一直清醒，先在它的影子里坐一会儿。',
      anchorSong: { title: '给你一瓶魔法药水', artist: '告五人' },
      sideA: '回暖',
      sideB: '灯下',
      source: 'fallback',
      isSeed: false,
      audioMode: 'soundscape-preview',
      previewLabel: '夜渡声景试听',
      suitableMood: '有点低落 / 需要陪伴 / 想被保护一下',
      coverUrl: 'assets/cover_a_sprig_of_lavender.webp'
    },
    {
      recordNo: 'No.0013',
      title: '忽然之间，夜安静了',
      plant: '白茉莉',
      flowerWords: '轻轻的，也足够',
      note: '白茉莉不需要很亮的月光，一点夜风，就够它把香气送出去。你也不用证明很多，今晚这样，已经足够。',
      anchorSong: { title: '忽然之间', artist: '莫文蔚' },
      sideA: '安静',
      sideB: '微光',
      source: 'fallback',
      isSeed: false,
      audioMode: 'soundscape-preview',
      previewLabel: '夜渡声景试听',
      suitableMood: '突然难过 / 想哭 / 需要柔软安放',
      coverUrl: 'assets/cover_a_water_lily.webp'
    }
  ];

  const FlowerLibrary = {
    '月见草': 'assets/cover_evening_primrose.webp',
    '薰衣草': 'assets/cover_a_sprig_of_lavender.webp',
    '睡莲': 'assets/cover_a_water_lily.webp',
    '蓝铃花': 'assets/cover_a_cluster_of_hanging_bluebells.webp',
    '蒲公英': 'assets/cover_a_dandelion_seed_head.webp',
    '洋甘菊': 'assets/cover_evening_primrose.webp',
    '雪松': 'assets/cover_a_sprig_of_lavender.webp',
    '白茉莉': 'assets/cover_a_water_lily.webp'
  };

  const DemoPresets = {
    yeduGuang: {
      trigger: {
        mood: ['停不下来的思考', '想太多', '脑子停不下来'],
        energy: ['困但很清醒', '很困但睡不着'],
        goal: ['平静下来', '睡着', '不再想太多']
      },
      searchQuery: '陈粒 光',
      preferredSong: {
        title: '光',
        artist: '陈粒'
      },
      localAudio: 'anchor_guang_sleep_edit',
      record: {
        recordNo: 'No.0006',
        title: '灯熄以后，光还在',
        plant: '月见草',
        flowerWords: '没人看，也会开',
        sideA: '落地',
        sideB: '留白',
        source: 'preset-fallback',
        isSeed: false,
        audioKey: 'anchor_guang_sleep_edit',
        audioMode: 'mapped-preview',
        previewLabel: '花语试听',
        note: '月见草是夜里才开的花。没人看，它也开。今天没有被谁看见，可你也好好地活过了一天。'
      },
      matchReason: '你说今晚脑海里的念头一个接一个，眼睛困了，脑海里还亮着。夜渡想先替你留住一束熟悉的光。'
    }
  };

  const SeedAudioFiles = {
    seed_perfume_sleep_edit: 'assets/seed_perfume_sleep_edit.mp3',
    seed_zhenjiushu_sleep_edit: 'assets/seed_zhenjiushu_sleep_edit.mp3',
    seed_dream_sleep_edit: 'assets/seed_dream_sleep_edit.mp3',
    seed_chunlei_sleep_edit: 'assets/seed_chunlei_sleep_edit.mp3'
  };

  const SeedRecords = [
    {
      recordNo: 'No.0002',
      title: '香气走得很慢',
      plant: '薰衣草',
      flowerWords: '等一等，香气会自己回来',
      note: '薰衣草晒过白日的光，到了夜里，才把香气一点点还回来。有些事情也是这样，离远一些，反而在安静处显出轮廓。',
      anchorSong: { title: 'perfume', artist: 'mehro' },
      coverUrl: 'assets/cover_a_sprig_of_lavender.webp',
      sideA: '近闻',
      sideB: '余香',
      audioKey: 'seed_perfume_sleep_edit',
      audioMode: 'seed-preview',
      previewLabel: '花语试听',
      isSeed: true,
      source: 'seed'
    },
    {
      recordNo: 'No.0003',
      title: '旧书合上以后',
      plant: '睡莲',
      flowerWords: '睡吧，水会将你托住',
      note: '旧书翻到最后，纸页会自己安静下来。睡莲浮在水面，不问水底藏了什么。今晚把没读完的留在枕边，明天再翻。',
      anchorSong: { title: '枕旧书', artist: '鸦青' },
      coverUrl: 'assets/cover_a_water_lily.webp',
      sideA: '合页',
      sideB: '浮梦',
      audioKey: 'seed_zhenjiushu_sleep_edit',
      audioMode: 'seed-preview',
      previewLabel: '花语试听',
      isSeed: true,
      source: 'seed'
    },
    {
      recordNo: 'No.0004',
      title: '梦在低处轻响',
      plant: '蓝铃花',
      flowerWords: '低着头，也在轻轻奏响',
      note: '蓝铃花总低着头，风一来，整片花就有了很轻的声音。梦也未必要从高处开始，闭上眼，它会从耳边一点点长出来。',
      anchorSong: { title: 'DREAM', artist: 'SEVENTEEN' },
      coverUrl: 'assets/cover_a_cluster_of_hanging_bluebells.webp',
      sideA: '微响',
      sideB: '入梦',
      audioKey: 'seed_dream_sleep_edit',
      audioMode: 'seed-preview',
      previewLabel: '花语试听',
      isSeed: true,
      source: 'seed'
    },
    {
      recordNo: 'No.0005',
      title: '雷声过后，风会来',
      plant: '蒲公英',
      flowerWords: '松开一点，风才会经过',
      note: '蒲公英并不怕春雷。响声过去，它只等一阵风，把自己交给更远的地方。有些事可以松开一点，不必替明天攥得太紧。',
      anchorSong: { title: '春雷', artist: '米津玄师' },
      coverUrl: 'assets/cover_a_dandelion_seed_head.webp',
      sideA: '余响',
      sideB: '远风',
      audioKey: 'seed_chunlei_sleep_edit',
      audioMode: 'seed-preview',
      previewLabel: '花语试听',
      isSeed: true,
      source: 'seed'
    }
  ];

  var currentRecord = fallbackSongs[0];
  var lastSearchResult = null;
  var lastShelfArchiveKey = '';
  var openBloomCard = null;
  var stopBloomPreview = function () {};
  var syncBloomPreviewVolume = function () {};
  const SHELF_RECORDS_KEY = 'sonic_grove_shelf_records';

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
    playbackPhase: 'idle',
    yeduWhisperTimeout: 0,
    pendingDiaryEntry: null,
    playbackCompleted: false,
    justPlantedRecordKey: ''
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
    needleEnd: 3,
    aEnd: 35,
    bridgeEnd: 50,
    bEnd: 85
  };

  const defaultSoundRecipe = {
    mode: 'sleep-preview',
    music: 'anchor_guang_sleep_edit',
    ambience: ['rain', 'pink'],
    sideA: '落地',
    sideB: '留白',
    description: '90 秒花语黑胶试听'
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
      // Default Night Ferry Cat A-side sleep-preview anchor bed, not a QQ Music source track.
      music: 'assets/anchor_guang_sleep_edit.mp3',
      // Low-stimulation sleep bed.
      pink: 'assets/pink_noise_loop.mp3',
      // B-side ambience core.
      rain: 'assets/rain_loop.mp3',
      chime: 'assets/soft_magical_chime.mp3',
      needle: 'assets/falling_needle.mp3',
      bgm: 'assets/BGM_Sonic_Grove.mp3'
    },
    roles: {
      voice: 'yedu_voice',
      music: 'default_sleep_preview_anchor_bed',
      pink: 'low_stimulation_sleep_noise',
      rain: 'b_side_ambience_core',
      chime: 'ui_chime',
      needle: 'needle_drop',
      bgm: 'garden_bgm'
    },
    aliases: {
      anchor_guang_sleep_edit: 'music'
    },
    resolveAudioKey: function (name, fallback) {
      var key = this.aliases[name] || name || fallback || 'music';
      return this.files[key] ? key : (fallback || 'music');
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
      audio._sgLoaded = false;
      audio._sgFailed = false;
      audio._sgWarned = false;
      audio._sgName = key;
      audio._sgFile = url;
      audio.addEventListener('error', function () {
        Sound.warnAudio(key, url);
      });
      return audio;
    },
    warnAudio: function (name, file) {
      var audio = name ? this.pool[name] : null;
      if (audio && audio._sgWarned) return;
      if (audio) {
        audio._sgFailed = true;
        audio._sgWarned = true;
      }
      console.warn('[SonicGrove] audio missing or failed', file || name);
    },
    safeReset: function (audio) {
      if (!audio) return;
      try { audio.pause(); } catch (error) {}
      try { audio.currentTime = 0; } catch (error) {}
    },
    safeVolume: function (audio, volume) {
      if (!audio || audio._sgFailed) return;
      try { audio.volume = clamp(volume, 0, 1); } catch (error) {}
    },
    getAudio: function (name, loop) {
      var audio = this.pool[name];
      if (!audio) {
        audio = this.createAudio(name, !!loop);
        if (!audio) return null;
        this.pool[name] = audio;
      }
      audio.loop = !!loop;
      return audio;
    },
    loadAudio: function (audio) {
      if (!audio || audio._sgLoaded) return audio;
      try {
        audio.load();
        audio._sgLoaded = true;
      } catch (error) {
        this.warnAudio(audio._sgName, audio._sgFile);
      }
      return audio;
    },
    unlock: function () {
      if (this.unlocked) return;
      this.unlocked = true;
      this.ensureContext();
      if (this.context && this.context.state === 'suspended') {
        this.context.resume().catch(function () {});
      }

      this.getAudio('voice', false);
      this.getAudio('music', false);
      this.getAudio('pink', true);
      this.getAudio('rain', true);
      this.getAudio('needle', false);
      this.getAudio('chime', false);
      this.getAudio('bgm', true);
    },
    playFile: function (name, volume, loop) {
      if (!this.unlocked) return null;
      var audio = this.getAudio(name, !!loop);
      if (!audio || audio._sgFailed) return null;
      this.loadAudio(audio);
      this.safeReset(audio);
      this.safeVolume(audio, volume == null ? 1 : volume);
      audio.loop = !!loop;
      audio.play().catch(function () { Sound.warnAudio(name, Sound.files[name]); });
      return audio;
    },
    playAmbient: function () {
      this.unlock();
      var musicKey = this.resolveAudioKey(getSoundRecipe().music, 'music');
      var rain = this.getAudio('rain', true);
      var pink = this.getAudio('pink', true);
      var music = this.getAudio(musicKey, true);
      if (rain && !rain._sgFailed) {
        this.loadAudio(rain);
        rain.loop = true;
        this.safeReset(rain);
        this.safeVolume(rain, 0);
        rain.play().catch(function () { Sound.warnAudio('rain', Sound.files.rain); });
      }
      if (pink && !pink._sgFailed) {
        this.loadAudio(pink);
        pink.loop = true;
        this.safeReset(pink);
        this.safeVolume(pink, 0);
        pink.play().catch(function () { Sound.warnAudio('pink', Sound.files.pink); });
      }
      if (music && !music._sgFailed) {
        this.loadAudio(music);
        music.loop = true;
        this.safeReset(music);
        this.safeVolume(music, 0);
        music.play().catch(function () { Sound.warnAudio('music', Sound.files.music); });
      }
    },
    stopAmbient: function () {
      ['music', 'pink', 'rain', 'voice', 'needle'].forEach(function (name) {
        const audio = Sound.pool[name];
        if (!audio) return;
        Sound.safeReset(audio);
      });
    },
    stopAll: function () {
      Object.keys(this.pool).forEach(function (name) {
        Sound.safeReset(Sound.pool[name]);
      });
    },
    startBgm: function () {
      if (state.bgmMuted) return;
      var bgm = this.getAudio('bgm', true);
      if (!bgm) return;
      this.loadAudio(bgm);
      bgm.volume = 0.18;
      bgm.loop = true;
      if (bgm.paused) {
        bgm.play().catch(function () { Sound.warnAudio('bgm', Sound.files.bgm); });
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
      if (this.pool.music) this.safeVolume(this.pool.music, musicVolume * state.playbackVolume);
      if (this.pool.rain) this.safeVolume(this.pool.rain, rainVolume * state.playbackVolume);
      if (this.pool.pink) this.safeVolume(this.pool.pink, pinkVolume * state.playbackVolume);
    },
    playVoice: function () {
      if (!this.unlocked) return;
      var voice = this.getAudio('voice', false);
      if (!voice || voice._sgFailed) return;
      this.loadAudio(voice);
      this.safeReset(voice);
      this.safeVolume(voice, 0.6);
      voice.play().catch(function () { Sound.warnAudio('voice', Sound.files.voice); });
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

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function cleanDiaryLine(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  }

  function normalizeDiaryEntry(entry) {
    if (!entry || typeof entry !== 'object') return null;
    var userLine = cleanDiaryLine(entry.userLine);
    var source = userLine ? 'user' : 'generated';
    var normalized = {
      userLine: userLine,
      mood: String(entry.mood || ''),
      energy: String(entry.energy || ''),
      goal: String(entry.goal || ''),
      source: source
    };
    if (!normalized.userLine && !normalized.mood && !normalized.energy && !normalized.goal) return null;
    return normalized;
  }

  function createDiaryEntrySnapshot(userLine) {
    var line = cleanDiaryLine(userLine);
    return {
      userLine: line,
      mood: state.answers.mood || '',
      energy: state.answers.energy || '',
      goal: state.answers.goal || '',
      source: line ? 'user' : 'generated'
    };
  }

  function savePendingDiaryEntry(userLine) {
    state.pendingDiaryEntry = createDiaryEntrySnapshot(userLine);
    return state.pendingDiaryEntry;
  }

  function formatRecordDate(value) {
    if (!value) return '';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('.');
  }

  function normalizeCoverUrl(url, fallback) {
    return String(url || fallback || 'assets/cover_evening_primrose.webp').replace(/^http:\/\//, 'https://');
  }

  function resolveRecordCover(record) {
    var source = record || {};
    var anchor = source.anchorSong || {};
    return normalizeCoverUrl(
      source.coverUrl ||
      anchor.coverUrl ||
      FlowerLibrary[source.plant] ||
      'assets/cover_evening_primrose.webp'
    );
  }

  function normalizeRecordSnapshot(record, fallbackRecord) {
    var base = fallbackRecord || fallbackSongs[0] || mockRecord;
    var source = record || base;
    var baseAnchor = base.anchorSong || {};
    var sourceAnchor = source.anchorSong || {};
    var anchorSong = {
      title: sourceAnchor.title || source.songTitle || source.songName || baseAnchor.title || '',
      artist: sourceAnchor.artist || source.artist || baseAnchor.artist || '',
      coverUrl: sourceAnchor.coverUrl || source.coverUrl || baseAnchor.coverUrl || ''
    };
    var snapshot = {
      recordNo: source.recordNo || base.recordNo || 'No.0006',
      title: source.title || base.title || '',
      plant: source.plant || base.plant || '月见草',
      flowerWords: source.flowerWords || base.flowerWords || '',
      note: source.note || base.note || '',
      anchorSong: anchorSong,
      sideA: source.sideA || base.sideA || defaultSoundRecipe.sideA,
      sideB: source.sideB || base.sideB || defaultSoundRecipe.sideB,
      source: source.source || base.source || 'dynamic',
      isSeed: Boolean(source.isSeed || base.isSeed),
      audioKey: source.audioKey || base.audioKey || '',
      audioMode: source.audioMode || base.audioMode || '',
      previewLabel: source.previewLabel || base.previewLabel || '',
      suitableMood: source.suitableMood || base.suitableMood || '',
      matchReason: source.matchReason || base.matchReason || '',
      songId: source.songId || source.song_id || base.songId || '',
      songMid: source.songMid || source.song_mid || base.songMid || '',
      h5Url: source.h5Url || base.h5Url || '',
      previewUrl: source.previewUrl || base.previewUrl || '',
      playUrl: source.playUrl || base.playUrl || '',
      createdAt: source.createdAt || base.createdAt || '',
      plantedAt: source.plantedAt || base.plantedAt || '',
      diaryEntry: normalizeDiaryEntry(source.diaryEntry || base.diaryEntry),
      soundRecipe: Object.assign({}, defaultSoundRecipe, base.soundRecipe || {}, source.soundRecipe || {})
    };
    snapshot.coverUrl = resolveRecordCover(Object.assign({}, snapshot, {
      coverUrl: source.coverUrl || '',
      anchorSong: anchorSong
    }));
    snapshot.anchorSong.coverUrl = snapshot.anchorSong.coverUrl || snapshot.coverUrl;
    snapshot.soundRecipe.sideA = snapshot.soundRecipe.sideA || snapshot.sideA;
    snapshot.soundRecipe.sideB = snapshot.soundRecipe.sideB || snapshot.sideB;
    snapshot.soundRecipe.previewLabel = snapshot.soundRecipe.previewLabel || snapshot.previewLabel;
    return snapshot;
  }

  function getShelfRecords() {
    try {
      var parsed = JSON.parse(localStorage.getItem(SHELF_RECORDS_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function saveShelfRecords(records) {
    try {
      localStorage.setItem(SHELF_RECORDS_KEY, JSON.stringify(records.slice(0, 12)));
    } catch (error) {}
  }

  function getRecordArchiveKey(record) {
    var anchor = record && record.anchorSong ? record.anchorSong : {};
    return [record && record.recordNo, record && record.title, anchor.title, anchor.artist].join('|');
  }

  function archiveCurrentRecord() {
    var snapshot = normalizeRecordSnapshot(getCurrentRecord(), fallbackSongs[0]);
    var key = getRecordArchiveKey(snapshot);
    var records = getShelfRecords();
    var existing = records.find(function (item) {
      return getRecordArchiveKey(item) === key;
    });
    var now = new Date().toISOString();
    if (existing) {
      snapshot.createdAt = existing.createdAt || snapshot.createdAt || now;
      snapshot.plantedAt = existing.plantedAt || snapshot.plantedAt || snapshot.createdAt;
      snapshot.diaryEntry = snapshot.diaryEntry || normalizeDiaryEntry(existing.diaryEntry);
    } else {
      snapshot.createdAt = snapshot.createdAt || now;
      snapshot.plantedAt = snapshot.plantedAt || snapshot.createdAt;
    }
    records = records.filter(function (item) {
      return getRecordArchiveKey(item) !== key;
    });
    records.unshift(snapshot);
    saveShelfRecords(records);
    lastShelfArchiveKey = key;
    currentRecord = snapshot;
    return snapshot;
  }

  function finalizePlanting(options) {
    var reason = options && options.reason ? String(options.reason) : '';
    if (!state.playbackCompleted && reason !== 'debug-force') return null;
    var diaryEntry = normalizeDiaryEntry(state.pendingDiaryEntry) || createDiaryEntrySnapshot('');
    currentRecord = normalizeRecordSnapshot(Object.assign({}, getCurrentRecord(), {
      diaryEntry: diaryEntry
    }), fallbackSongs[0]);
    var snapshot = archiveCurrentRecord();
    state.justPlantedRecordKey = getRecordArchiveKey(snapshot);
    return snapshot;
  }

  function renderShelfRecords() {
    var rack = document.querySelector('#screen-shelf .rack-records');
    if (!rack) return;
    var records = getShelfRecords();
    var latest = records[0] || normalizeRecordSnapshot(getCurrentRecord(), fallbackSongs[0]);
    var btn = rack.querySelector('.series-disc.current-record-disc');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'series-disc current-record-disc';
      rack.insertBefore(btn, rack.firstElementChild);
    }
    var cover = resolveRecordCover(latest);
    var key = getRecordArchiveKey(latest);
    var heroNo = document.getElementById('hero-no');
    var plantedMessage = document.getElementById('planted-message');
    btn.dataset.no = latest.recordNo;
    btn.dataset.plant = latest.plant;
    btn.dataset.words = latest.flowerWords;
    btn.dataset.source = latest.source || '';
    btn.dataset.bgm = latest.anchorSong.title + '——' + latest.anchorSong.artist;
    btn.innerHTML = '<img src="' + escapeHtml(cover) + '" alt="" onerror="this.classList.add(\'img-fail\')"><span>' + escapeHtml(latest.recordNo) + '</span>';
    btn.classList.remove('just-planted');
    if (heroNo) heroNo.textContent = '今晚新种下 · ' + latest.recordNo;
    if (plantedMessage) plantedMessage.textContent = '今晚的' + latest.plant + '，已经种下。';
    if (state.justPlantedRecordKey && state.justPlantedRecordKey === key) {
      requestAnimationFrame(function () {
        btn.classList.add('just-planted');
      });
      var clearJustPlanted = function () {
        btn.classList.remove('just-planted');
        if (state.justPlantedRecordKey === key) state.justPlantedRecordKey = '';
        btn.removeEventListener('animationend', clearJustPlanted);
      };
      btn.addEventListener('animationend', clearJustPlanted);
      window.setTimeout(clearJustPlanted, 1800);
    }
    btn.onclick = function () {
      if (openBloomCard) {
        openBloomCard(latest);
      }
    };
  }

  function getDeviceId() {
    var key = 'sonic_grove_device_id';
    try {
      var existing = localStorage.getItem(key);
      if (existing) return existing;
      var value = 'sg-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(key, value);
      return value;
    } catch (error) {
      return 'sonic-grove-web';
    }
  }

  function cleanText(value) {
    return String(value || '').replace(/[《》“”"'·\s]/g, '').toLowerCase();
  }

  function matchAnyText(text, words) {
    var normalized = cleanText(text);
    return (words || []).some(function (word) {
      return normalized.indexOf(cleanText(word)) !== -1;
    });
  }

  function getUserStateText() {
    return [state.answers.mood, state.answers.energy, state.answers.goal].join(' ');
  }

  const YeduReasonFragments = {
    mood: {
      '停不下来的思考': '今晚脑海里的念头一个接一个',
      '反复出现的课题': '有件事在心里来回走了很多遍',
      '心情很乱说不清': '心里有些乱，还没找到合适的说法',
      '心里空落落的': '今晚心里像空了一小块'
    },
    energy: {
      '生病难受': '身体也正忙着照顾自己',
      '累到发沉': '身体已经沉下来了',
      '困但很清醒': '眼睛困了，脑海里还亮着',
      '绷得紧紧的': '身体还像一根没有松开的弦'
    },
    goal: {
      '有人陪伴': '留一首不催你开口的歌，陪你坐一会儿',
      '平静下来': '先把声音放低，让今晚多一点空白',
      '被好好接住': '选一首有落点的歌，让你不用一直撑着',
      '什么都不想': '把声音变得简单一点，让今天到这里为止'
    }
  };

  function buildYeduMatchReason(answers) {
    var source = answers || {};
    var mood = YeduReasonFragments.mood[source.mood] || YeduReasonFragments.mood[mockRecord.mood.emotion];
    var energy = YeduReasonFragments.energy[source.energy] || YeduReasonFragments.energy[mockRecord.mood.energy];
    var goal = YeduReasonFragments.goal[source.goal] || YeduReasonFragments.goal[mockRecord.mood.goal];
    return mood + '，' + energy + '。夜渡想' + goal + '。';
  }

  function withYeduMatchReason(record) {
    if (!record || record.matchReason) return record;
    return Object.assign({}, record, {
      matchReason: buildYeduMatchReason(state.answers)
    });
  }

  function matchDemoPresetByState() {
    var text = getUserStateText();
    var preset = DemoPresets.yeduGuang;
    var score = 0;
    if (matchAnyText(text, preset.trigger.mood)) score += 1;
    if (matchAnyText(text, preset.trigger.energy)) score += 1;
    if (matchAnyText(text, preset.trigger.goal)) score += 1;
    if (state.answers.tension >= 65 && matchAnyText(text, ['停不下来', '想太多', '清醒', '平静'])) score += 1;
    return score >= 2 ? preset : null;
  }

  function matchDemoPresetByManual(songTitle, artist) {
    var text = [songTitle, artist].join(' ');
    var normalized = cleanText(text);
    if (cleanText(songTitle) === cleanText(DemoPresets.yeduGuang.preferredSong.title)) return DemoPresets.yeduGuang;
    if (cleanText(artist) === cleanText(DemoPresets.yeduGuang.preferredSong.artist)) return DemoPresets.yeduGuang;
    if (normalized.indexOf(cleanText('陈粒光')) !== -1) return DemoPresets.yeduGuang;
    return null;
  }

  function presetRecordBase(preset) {
    if (!preset) return null;
    return Object.assign({}, preset.record, {
      anchorSong: Object.assign({}, preset.preferredSong),
      matchReason: preset.matchReason,
      coverUrl: FlowerLibrary[preset.record.plant] || 'assets/cover_evening_primrose.webp',
      soundRecipe: Object.assign({}, defaultSoundRecipe, {
        music: preset.localAudio || defaultSoundRecipe.music,
        sideA: preset.record.sideA,
        sideB: preset.record.sideB,
        previewLabel: preset.record.previewLabel
      })
    });
  }

  function findFallbackBySong(songTitle, artist) {
    var wantedSong = cleanText(songTitle);
    var wantedArtist = cleanText(artist);
    return fallbackSongs.find(function (item) {
      var sameSong = cleanText(item.anchorSong.title) === wantedSong;
      var sameArtist = !wantedArtist || cleanText(item.anchorSong.artist) === wantedArtist;
      return sameSong && sameArtist;
    }) || null;
  }

  function chooseFallbackByMood() {
    var moodText = [state.answers.mood, state.answers.energy, state.answers.goal].join(' ');
    if (/绷|紧|反复|自责/.test(moodText) || state.answers.tension > 78) return fallbackSongs[5];
    if (/累|生病|沉|被好好接住/.test(moodText)) return fallbackSongs[2];
    if (/空|陪伴|低落/.test(moodText)) return fallbackSongs[6];
    if (/乱|说不清|听见|心事/.test(moodText)) return fallbackSongs[3];
    if (/逃|压力|什么都不想/.test(moodText)) return fallbackSongs[4];
    if (/平静|困但很清醒|停不下来/.test(moodText)) return fallbackSongs[0];
    return fallbackSongs[1];
  }

  function buildSearchQuery() {
    var words = ['晚安'];
    if (/停不下|反复|困但很清醒/.test(state.answers.mood + state.answers.energy)) {
      words.push('安静', '夜晚');
    }
    if (/空|陪伴|被好好接住/.test(state.answers.mood + state.answers.goal)) {
      words.push('陪伴', '温柔');
    }
    if (/累|生病|绷/.test(state.answers.energy)) {
      words.push('放松', '慢歌');
    }
    if (state.answers.tension > 70) words.push('低刺激');
    return words.slice(0, 4).join(' ');
  }

  function recordNoFromSong(song) {
    var id = Number(song && song.songId) || Math.floor(Math.random() * 9000 + 1000);
    return 'No.' + String(id % 10000).padStart(4, '0');
  }

  function buildSearchPlan(mode, songTitle, artist) {
    var preset = mode === 'manual' ? matchDemoPresetByManual(songTitle, artist) : matchDemoPresetByState();
    var fallback = preset ? presetRecordBase(preset) : withYeduMatchReason(chooseFallbackByMood());
    var preferredSong = preset ? preset.preferredSong : (fallback && fallback.anchorSong ? fallback.anchorSong : null);
    var query = preset
      ? preset.searchQuery
      : mode === 'manual'
        ? [songTitle, artist].filter(Boolean).join(' ')
        : [preferredSong && preferredSong.artist, preferredSong && preferredSong.title].filter(Boolean).join(' ');
    return {
      mode: mode,
      preset: preset,
      fallback: fallback,
      preferredSong: preferredSong,
      query: query || '陈粒 光'
    };
  }

  function makeRecordFromSong(song, copyBase) {
    var base = withYeduMatchReason(copyBase || chooseFallbackByMood());
    var hasRealSong = Boolean(song && (song.songId || song.songMid || song.coverUrl || song.h5Url));
    return {
      recordNo: base.recordNo || recordNoFromSong(song),
      title: base.title,
      plant: base.plant,
      flowerWords: base.flowerWords,
      note: base.note,
      anchorSong: {
        title: (song && (song.songTitle || song.songName)) || base.anchorSong.title,
        artist: (song && song.artist) || base.anchorSong.artist,
        coverUrl: normalizeCoverUrl(song && song.coverUrl, base.anchorSong && base.anchorSong.coverUrl)
      },
      sideA: base.sideA,
      sideB: base.sideB,
      source: hasRealSong ? 'dynamic' : (base.source || 'dynamic'),
      isSeed: false,
      audioKey: base.audioKey || '',
      audioMode: base.audioMode || 'soundscape-preview',
      previewLabel: base.previewLabel || '夜渡声景试听',
      suitableMood: base.suitableMood,
      matchReason: base.matchReason || buildYeduMatchReason(state.answers),
      soundRecipe: Object.assign({}, defaultSoundRecipe, {
        sideA: base.sideA,
        sideB: base.sideB,
        previewLabel: base.previewLabel
      }),
      songId: song && song.songId,
      songMid: song && song.songMid,
      h5Url: song && song.h5Url,
      previewUrl: song && song.previewUrl,
      playUrl: song && song.playUrl,
      coverUrl: normalizeCoverUrl(song && song.coverUrl, base.coverUrl)
    };
  }

  function setCurrentRecord(record) {
    currentRecord = normalizeRecordSnapshot(record, fallbackSongs[0]);
    applyMockRecord();
    return currentRecord;
  }

  function getCurrentRecord() {
    return currentRecord || fallbackSongs[0] || mockRecord;
  }

  function findSeedRecord(seedId) {
    return SeedRecords.find(function (record) {
      return record.recordNo === seedId;
    }) || null;
  }

  function getSoundRecipe() {
    var record = getCurrentRecord();
    var recipe = Object.assign({}, defaultSoundRecipe, record && record.soundRecipe ? record.soundRecipe : {});
    recipe.sideA = recipe.sideA || (record && record.sideA) || defaultSoundRecipe.sideA;
    recipe.sideB = recipe.sideB || (record && record.sideB) || defaultSoundRecipe.sideB;
    return recipe;
  }

  function scoreSongForYedu(song, userState) {
    if (!song) return 0;
    var title = cleanText(song.songTitle || song.songName);
    var artist = cleanText(song.artist);
    var preferred = userState && userState.preferredSong ? userState.preferredSong : {};
    var desiredTitle = cleanText(userState && userState.desiredTitle || preferred.title || '');
    var desiredArtist = cleanText(userState && userState.desiredArtist || preferred.artist || '');
    var score = 0;
    if (desiredTitle && title === desiredTitle) score += 50;
    else if (desiredTitle && title.indexOf(desiredTitle) !== -1) score += 24;
    else if (desiredTitle && desiredTitle.indexOf(title) !== -1) score += 12;
    if (desiredArtist && artist === desiredArtist) score += 35;
    else if (desiredArtist && artist.indexOf(desiredArtist) !== -1) score += 18;
    if (song.playable || song.tryPlayable || song.previewUrl || song.playUrl) score += 5;
    if (song.coverUrl) score += 2;
    return score;
  }

  function pickBestSong(songs, desiredTitle, desiredArtist, options) {
    var list = Array.isArray(songs) ? songs : [];
    if (!list.length) return null;
    var playable = list.filter(function (song) {
      return song && (song.playable || song.tryPlayable || song.previewUrl || song.playUrl);
    });
    var candidates = playable.length ? playable : list;
    var userState = Object.assign({}, options || {}, {
      desiredTitle: desiredTitle,
      desiredArtist: desiredArtist
    });
    var ranked = candidates.map(function (song) {
      return {
        song: song,
        score: scoreSongForYedu(song, userState)
      };
    }).sort(function (a, b) {
      return b.score - a.score;
    });
    return ranked[0] || null;
  }

  function fetchQQMusicSearch(query) {
    var params = new URLSearchParams({
      keyword: query,
      num: '10',
      t: '0',
      deviceId: getDeviceId()
    });
    return fetch('/api/qqmusic/search?' + params.toString(), { cache: 'no-store' })
      .then(function (response) { return response.ok ? response.json() : null; })
      .catch(function () { return null; });
  }

  function createRecordFromFallback(songTitle, artist) {
    var exact = findFallbackBySong(songTitle, artist);
    if (exact) return normalizeRecordSnapshot(withYeduMatchReason(exact), fallbackSongs[0]);
    var base = withYeduMatchReason(chooseFallbackByMood());
    return makeRecordFromSong({ songTitle: songTitle, songName: songTitle, artist: artist }, base);
  }

  function createAutoRecord() {
    var plan = buildSearchPlan('auto');
    var fallback = plan.fallback || withYeduMatchReason(chooseFallbackByMood());
    return fetchQQMusicSearch(plan.query).then(function (data) {
      lastSearchResult = Object.assign({ query: plan.query, plan: plan.mode, preset: plan.preset ? 'yeduGuang' : '' }, data || {});
      if (!data || !data.ok || !data.songs || !data.songs.length) {
        return setCurrentRecord(fallback);
      }
      var ranked = pickBestSong(data.songs, plan.preferredSong && plan.preferredSong.title, plan.preferredSong && plan.preferredSong.artist, {
        preferredSong: plan.preferredSong
      });
      if (!ranked || ranked.score < 28) return setCurrentRecord(fallback);
      return setCurrentRecord(makeRecordFromSong(ranked.song, fallback));
    });
  }

  function createManualRecord(songTitle, artist) {
    var plan = buildSearchPlan('manual', songTitle, artist);
    return fetchQQMusicSearch(plan.query).then(function (data) {
      lastSearchResult = Object.assign({ query: plan.query, plan: plan.mode, preset: plan.preset ? 'yeduGuang' : '' }, data || {});
      if (!data || !data.ok || !data.songs || !data.songs.length) {
        return setCurrentRecord(plan.preset ? plan.fallback : createRecordFromFallback(songTitle, artist));
      }
      var songTarget = plan.preferredSong || { title: songTitle, artist: artist };
      var ranked = pickBestSong(data.songs, songTarget.title, songTarget.artist, {
        preferredSong: plan.preferredSong,
        desiredTitle: songTitle,
        desiredArtist: artist
      });
      var exact = findFallbackBySong(songTitle, artist);
      if (!ranked || ranked.score < 24) {
        return setCurrentRecord(plan.preset ? plan.fallback : createRecordFromFallback(songTitle, artist));
      }
      return setCurrentRecord(makeRecordFromSong(ranked.song, plan.preset ? plan.fallback : (exact || chooseFallbackByMood())));
    });
  }

  function updateRecordImages(record) {
    var cover = resolveRecordCover(record);
    var selectors = [
      '#polaroid img',
      '#screen-reveal .record-sleeve img',
      '#screen-reveal .vinyl-label img',
      '#screen-shelf .hero-jacket .record-sleeve img',
      '#screen-shelf .hero-jacket .vinyl-label img'
    ];
    selectors.forEach(function (selector) {
      Array.from(document.querySelectorAll(selector)).forEach(function (img) {
        img.src = cover;
      });
    });
    Array.from(document.querySelectorAll('#screen-playback image')).forEach(function (image) {
      image.setAttribute('href', cover);
    });
  }

  function applyMockRecord() {
    var record = getCurrentRecord();
    if (ui.tensionSlider) ui.tensionSlider.value = String(mockRecord.mood.tension);
    if (ui.tensionValue) ui.tensionValue.textContent = String(mockRecord.mood.tension);
    ui.recordNo.textContent = record.recordNo;
    ui.recordTitle.textContent = record.title;
    ui.recordPlant.textContent = record.plant;
    ui.recordAnchor.textContent = '锚定歌《' + record.anchorSong.title + '》 · ' + record.anchorSong.artist;
    ui.recordSideA.textContent = 'A 面 · ' + record.sideA;
    ui.recordSideB.textContent = 'B 面 · ' + record.sideB;
    ui.recordWords.textContent = '“' + record.flowerWords + '”';
    ui.recordNote.textContent = record.note;
    ui.playbackSub.textContent = record.recordNo + ' · ' + record.title + ' · 《' + record.anchorSong.title + '》' + record.anchorSong.artist;
    ui.shelfNote.textContent = record.recordNo + ' · ' + record.plant + ' · ' + record.title;
    updateRecordImages(record);
    renderShelfRecords();
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
    appendToChat('<article class="chat-bubble from-yedu"><img class="yedu-avatar" src="assets/YEDU_chatcover.webp" alt="" aria-hidden="true"><div class="yedu-text"><p class="bubble-mark">YEDU</p><p>' + text + '</p></div></article>');
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
    var record = getCurrentRecord();
    var artist = record.anchorSong.artist;
    var title = record.anchorSong.title;
    var cover = resolveRecordCover(record);
    var html = '<article class="glass-panel match-card"><p class="bubble-mark">LIGHT CARD</p><div class="match-tabs" role="tablist"><button type="button" class="match-tab active" id="match-tab-auto" role="tab" aria-selected="true">自动匹配</button><button type="button" class="match-tab" id="match-tab-manual" role="tab" aria-selected="false">自主输入</button></div><div class="match-auto"><div class="album-line"><div class="album-thumb"><img src="' + escapeHtml(cover) + '" alt="' + escapeHtml(title) + '"></div><div class="album-copy"><p class="album-top">今天最适合陪伴你入睡的是</p><p class="album-main">' + escapeHtml(artist) + ' · 《' + escapeHtml(title) + '》</p></div></div><p class="album-bottom">《' + escapeHtml(title) + '》已经替你开出 ' + escapeHtml(record.recordNo) + ' 张花语唱片。</p></div></article>';
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
      createAutoRecord().then(function () {
        if (state.chatFlow.matchPhase !== 'thinking') return;
        state.chatFlow.matchPhase = 'revealed';
        state.chatFlow.matchMode = 'auto';
        lastMatchEl = appendMatchAuto();
        chatStep = 7;
        refreshChatState();
      });
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
      createManualRecord(song, artist).then(function (record) {
        if (songEl) songEl.textContent = album ? '《' + record.anchorSong.title + '》 · ' + album : '《' + record.anchorSong.title + '》';
        if (artistEl) artistEl.textContent = record.anchorSong.artist;
        if (card) card.classList.remove('hidden');
        state.chatFlow.manualConfirmed = true;
        refreshChatState();
      });
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
    currentRecord = fallbackSongs[0];
    applyMockRecord();
    state.answers.mood = '';
    state.answers.energy = '';
    state.answers.goal = '';
    state.answers.tension = mockRecord.mood.tension;
    state.chatFlow.tensionTouched = false;
    state.chatFlow.matchPhase = 'idle';
    state.chatFlow.matchMode = 'auto';
    state.chatFlow.manualConfirmed = false;
    state.chatFlow.diaryResponded = false;
    state.chatFlow.finalHintShown = false;
    state.pendingDiaryEntry = null;
    state.playbackCompleted = false;
    state.justPlantedRecordKey = '';
    chatStep = 0;

    var stage = document.getElementById('chat-stage');
    if (stage) stage.innerHTML = '';
    if (ui.diaryTextarea) ui.diaryTextarea.value = '';
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

  function getPlaybackElapsed() {
    if (!state.playbackStartedAt) return 0;
    return (performance.now() - state.playbackStartedAt) / 1000;
  }

  function getPlaybackPhase(elapsed) {
    if (elapsed < timeline.needleEnd) return 'needle';
    if (elapsed <= timeline.aEnd) return 'sideA';
    if (elapsed <= timeline.bridgeEnd) return 'bridge';
    if (elapsed <= timeline.bEnd) return 'sideB';
    if (elapsed <= timeline.total) return 'ending';
    return 'done';
  }

  function renderPlaybackFrame(elapsed) {
    var safeElapsed = clamp(elapsed, 0, timeline.total);
    var progress = clamp(safeElapsed / timeline.total, 0, 1);
    var phase = getPlaybackPhase(safeElapsed);
    var recipe = getSoundRecipe();
    state.playbackPhase = phase;

    app.style.setProperty('--curve-progress', String(progress));
    app.style.setProperty('--playback-darkness', String(clamp((safeElapsed - 18) / 58, 0, 1)));
    ui.playbackClock.textContent = formatTime(safeElapsed) + ' / 01:30';

    if (phase === 'needle') {
      var intro = clamp(safeElapsed / timeline.needleEnd, 0, 1);
      ui.playbackPhase.textContent = '落针 · 入夜';
      ui.markerA.classList.add('active');
      ui.markerB.classList.remove('active');
      Sound.setAmbientVolumes(0.72 * intro, 0.2 * intro, 0.1 * intro);
    } else if (phase === 'sideA') {
      ui.playbackPhase.textContent = 'A 面 · ' + recipe.sideA;
      ui.markerA.classList.add('active');
      ui.markerB.classList.remove('active');
      Sound.setAmbientVolumes(0.72, 0.22, 0.11);
    } else if (phase === 'bridge') {
      var bridge = (safeElapsed - timeline.aEnd) / (timeline.bridgeEnd - timeline.aEnd);
      ui.playbackPhase.textContent = '过渡 · 夜色渐深';
      ui.markerA.classList.add('active');
      ui.markerB.classList.add('active');
      Sound.setAmbientVolumes(fadeOut(Sound.pool.music, 0.72, bridge), 0.22 + (0.06 * bridge), 0.11 + (0.05 * bridge));
    } else if (phase === 'sideB') {
      ui.playbackPhase.textContent = 'B 面 · ' + recipe.sideB;
      ui.markerA.classList.remove('active');
      ui.markerB.classList.add('active');
      Sound.setAmbientVolumes(0, 0.28, 0.16);
    } else {
      var fade = clamp((safeElapsed - timeline.bEnd) / (timeline.total - timeline.bEnd), 0, 1);
      ui.playbackPhase.textContent = '晚安 · 渐隐';
      ui.markerA.classList.remove('active');
      ui.markerB.classList.add('active');
      if (fade >= 0.2) { ui.goodnight.classList.remove('hidden'); ui.goodnight.classList.add('show'); }
      else { ui.goodnight.classList.add('hidden'); ui.goodnight.classList.remove('show'); }
      Sound.setAmbientVolumes(0, fadeOut(Sound.pool.rain, 0.28, fade), fadeOut(Sound.pool.pink, 0.16, fade));
    }
  }

  function resetPlaybackVisuals() {
    app.style.setProperty('--playback-darkness', '0');
    app.style.setProperty('--curve-progress', '0');
    ui.goodnight.classList.add('hidden');
    ui.goodnight.classList.remove('show');
    ui.markerA.classList.add('active');
    ui.markerB.classList.remove('active');
    state.playbackPhase = 'idle';
    ui.playbackPhase.textContent = 'A 面 · ' + getSoundRecipe().sideA;
    ui.playbackClock.textContent = '00:00 / 01:30';
    document.getElementById('screen-playback').classList.remove('playing');
  }

  function ensurePlaybackHint() {
    if (!ui.playbackSub || document.getElementById('playback-preview-hint')) return;
    var hint = document.createElement('p');
    hint.id = 'playback-preview-hint';
    hint.className = 'playback-preview-hint';
    hint.textContent = '先听一小段今晚的黑胶。';
    ui.playbackSub.insertAdjacentElement('afterend', hint);
  }

  function stopPlayback() {
    cancelAnimationFrame(state.playbackRaf);
    clearTimeout(state.playbackTimeout);
    clearWhisper();
    state.playbackRaf = 0;
    state.playbackTimeout = 0;
    state.playbackStartedAt = 0;
    state.playbackPhase = 'idle';
    state.playbackEnding = false;
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
    if (state.playbackEnding) return;
    state.playbackEnding = true;
    cancelAnimationFrame(state.playbackRaf);
    clearTimeout(state.playbackTimeout);
    clearWhisper();
    state.playbackRaf = 0;
    state.playbackTimeout = 0;
    state.playbackPhase = 'done';
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
      state.playbackCompleted = true;
      finalizePlanting({ reason: 'playback-ended' });
      goTo('shelf');
      state.playbackEnding = false;
      state.playbackStartedAt = 0;
      state.playbackPhase = 'idle';
    }, 2400);
  }

  function updatePlaybackLoop() {
    const elapsed = getPlaybackElapsed();
    renderPlaybackFrame(elapsed);

    if (elapsed < timeline.total) {
      state.playbackRaf = requestAnimationFrame(updatePlaybackLoop);
    } else {
      onPlaybackEnd();
    }
  }

  function startPlayback() {
    stopPlayback();
    goTo('playback');
    Sound.pauseBgm();
    Sound.unlock();
    var pb = document.getElementById('screen-playback');
    if (pb) pb.classList.remove('eyes-closed');
    var hint = document.getElementById('eyes-closed-hint');
    if (hint) hint.classList.add('hidden');
    var breathEl = document.getElementById('breath-end');
    if (breathEl) { breathEl.classList.remove('show'); breathEl.classList.add('hidden'); }
    document.getElementById('screen-playback').classList.add('playing');
    ui.goodnight.classList.add('hidden');
    ui.goodnight.classList.remove('show');
    Sound.playFile('needle', 0.7, false);
    Sound.playAmbient();
    state.playbackStartedAt = performance.now();
    state.playbackEnding = false;
    state.playbackCompleted = false;
    renderPlaybackFrame(0);
    state.playbackRaf = requestAnimationFrame(updatePlaybackLoop);
    state.playbackTimeout = window.setTimeout(function () {
      onPlaybackEnd();
    }, (timeline.total * 1000) + 500);
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
    ui.engraveTip.textContent = '刻录完成。' + getCurrentRecord().plant + '已经发亮。';
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
      : '刻录完成。' + getCurrentRecord().plant + '已经发亮。';

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
    Sound.playFile('chime', 0.5, false);
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
    if (state.currentScreen === 'shelf' && id !== 'shelf') {
      stopBloomPreview();
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
      applyMockRecord();
    }
    if (id === 'shelf') {
      applyMockRecord();
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
      if (!state.pendingDiaryEntry) savePendingDiaryEntry('');
      ui.diaryOverlay.classList.add('hidden');
      ui.diaryPanel.classList.remove('recording');
      if (state.chatFlow.matchPhase === 'idle') {
        setTimeout(function () { startMatchThinking(); }, 600);
      }
    }

    if (ui.diaryClose) ui.diaryClose.addEventListener('click', closeDiary);
    if (ui.diarySkip) ui.diarySkip.addEventListener('click', function () {
      savePendingDiaryEntry('');
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
        savePendingDiaryEntry(ui.diaryTextarea ? ui.diaryTextarea.value : '');
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
      syncBloomPreviewVolume();
      if (state.currentScreen === 'playback' && state.playbackStartedAt) {
        renderPlaybackFrame(getPlaybackElapsed());
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
    var titleEl = document.getElementById('bloom-title');
    var plantEl = document.getElementById('bloom-plant');
    var wordsEl = document.getElementById('bloom-words');
    var anchorEl = document.getElementById('bloom-anchor');
    var sidesEl = document.getElementById('bloom-sides');
    var noteEl = document.getElementById('bloom-note');
    var bgmEl = document.getElementById('bloom-bgm');
    var bgmRow = document.getElementById('bloom-bgm-row');
    var playBtn = document.getElementById('bloom-play-btn');
    var frontPanel = document.getElementById('bloom-front');
    var diaryPanel = document.getElementById('bloom-diary');
    var flipBtn = document.getElementById('bloom-flip-btn');
    var diaryDateEl = document.getElementById('bloom-diary-date');
    var diaryTitleEl = document.getElementById('bloom-diary-title');
    var diaryLineSection = document.getElementById('bloom-diary-line-section');
    var diaryLineLabel = document.getElementById('bloom-diary-line-label');
    var diaryLineEl = document.getElementById('bloom-diary-line');
    var diaryNoteSection = document.getElementById('bloom-diary-note-section');
    var diaryNoteEl = document.getElementById('bloom-diary-note');
    var activeBloomRecord = null;
    var activeBloomView = 'front';
    var seedPreviewAudio = null;
    var seedPreviewLoading = false;
    var seedPreviewToken = 0;
    if (!overlay || !card) return;

    function resetBloomButton() {
      if (!playBtn) return;
      playBtn.textContent = '▶';
      playBtn.classList.remove('playing', 'loading');
    }

    function setBloomLoading() {
      if (!playBtn) return;
      playBtn.textContent = '载入中';
      playBtn.classList.add('loading');
      playBtn.classList.remove('playing');
    }

    function setBloomPlaying() {
      if (!playBtn) return;
      playBtn.textContent = '⏸';
      playBtn.classList.add('playing');
      playBtn.classList.remove('loading');
    }

    function stopSeedPreview(resetButton) {
      seedPreviewToken += 1;
      seedPreviewLoading = false;
      if (seedPreviewAudio) {
        try { seedPreviewAudio.pause(); } catch (error) {}
        try { seedPreviewAudio.currentTime = 0; } catch (error) {}
        seedPreviewAudio = null;
      }
      if (resetButton !== false) resetBloomButton();
    }

    stopBloomPreview = function () {
      stopSeedPreview(true);
    };

    syncBloomPreviewVolume = function () {
      if (seedPreviewAudio) {
        try { seedPreviewAudio.volume = clamp(state.playbackVolume, 0, 1); } catch (error) {}
      }
    };

    function getBloomPreviewLabel(record) {
      if (!record) return '';
      if (record.previewLabel) return record.previewLabel;
      return record.isSeed || record.audioMode === 'mapped-preview' ? '花语试听' : '夜渡声景试听';
    }

    function canPlaySeedPreview(record) {
      return Boolean(record && record.isSeed && record.audioKey && SeedAudioFiles[record.audioKey]);
    }

    function renderBloomDiary(record) {
      if (!record) return;
      var entry = normalizeDiaryEntry(record.diaryEntry);
      var userLine = entry && entry.userLine ? entry.userLine : '';
      var line = userLine || record.matchReason || '';
      if (diaryDateEl) diaryDateEl.textContent = formatRecordDate(record.plantedAt || record.createdAt);
      if (diaryTitleEl) diaryTitleEl.textContent = record.title || '';
      if (diaryLineLabel) diaryLineLabel.textContent = userLine ? '你留下的话' : '这一夜的心绪';
      if (diaryLineEl) diaryLineEl.textContent = line;
      if (diaryLineSection) diaryLineSection.classList.toggle('hidden', !line);
      if (diaryNoteEl) diaryNoteEl.textContent = record.note || '';
      if (diaryNoteSection) diaryNoteSection.classList.toggle('hidden', !record.note);
    }

    function setBloomView(view) {
      activeBloomView = view === 'diary' ? 'diary' : 'front';
      var isDiary = activeBloomView === 'diary';
      if (frontPanel) {
        frontPanel.classList.toggle('hidden', isDiary);
        frontPanel.setAttribute('aria-hidden', isDiary ? 'true' : 'false');
      }
      if (diaryPanel) {
        diaryPanel.classList.toggle('hidden', !isDiary);
        diaryPanel.setAttribute('aria-hidden', isDiary ? 'false' : 'true');
      }
      if (flipBtn) flipBtn.textContent = isDiary ? '回到花语' : '翻到这一天';
    }

    function openRecord(record) {
      if (!record) return;
      stopSeedPreview(true);
      activeBloomRecord = record;
      activeBloomView = 'front';
      var anchor = record.anchorSong || {};
      var hasSeedPreview = canPlaySeedPreview(record);
      var canFlipDiary = record.isSeed !== true;
      if (noEl) noEl.textContent = record.recordNo || '';
      if (titleEl) titleEl.textContent = record.title || '';
      if (plantEl) plantEl.textContent = record.plant || '';
      if (wordsEl) wordsEl.textContent = record.flowerWords ? '“' + record.flowerWords + '”' : '';
      if (anchorEl) anchorEl.textContent = anchor.title ? '《' + anchor.title + '》 · ' + (anchor.artist || '') : '';
      if (sidesEl) sidesEl.textContent = 'A 面 · ' + (record.sideA || '') + ' / B 面 · ' + (record.sideB || '');
      if (noteEl) noteEl.textContent = record.note || '';
      if (bgmEl) bgmEl.textContent = getBloomPreviewLabel(record);
      if (coverImg) {
        coverImg.innerHTML = '<img src="' + escapeHtml(resolveRecordCover(record)) + '" alt="' + escapeHtml(record.plant || '') + '" onerror="this.classList.add(\'img-fail\')">';
      }
      if (playBtn) {
        playBtn.disabled = !canPlaySeedPreview(record);
        playBtn.setAttribute('aria-label', canPlaySeedPreview(record) ? '播放花语试听' : '暂无独立试听');
      }
      renderBloomDiary(record);
      setBloomView('front');
      if (flipBtn) flipBtn.classList.toggle('hidden', !canFlipDiary);
      if (bgmRow) bgmRow.classList.toggle('hidden', !hasSeedPreview);
      overlay.classList.remove('hidden');
      card.classList.remove('hidden');
      overlay.removeAttribute('aria-hidden');
      card.setAttribute('aria-hidden', 'false');
      Sound.synth('click');
    }
    openBloomCard = openRecord;

    function close() {
      overlay.classList.add('hidden');
      card.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
      card.setAttribute('aria-hidden', 'true');
      activeBloomRecord = null;
      activeBloomView = 'front';
      setBloomView('front');
      stopSeedPreview(true);
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);

    if (flipBtn) {
      flipBtn.addEventListener('click', function () {
        if (!activeBloomRecord || activeBloomRecord.isSeed) return;
        setBloomView(activeBloomView === 'front' ? 'diary' : 'front');
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!activeBloomRecord || !canPlaySeedPreview(activeBloomRecord) || seedPreviewLoading) return;
        if (playBtn.classList.contains('playing')) {
          if (seedPreviewAudio) seedPreviewAudio.pause();
          resetBloomButton();
          return;
        }
        if (seedPreviewAudio && seedPreviewAudio.paused && seedPreviewAudio.currentTime > 0) {
          var resumeToken = seedPreviewToken;
          syncBloomPreviewVolume();
          seedPreviewAudio.play().then(function () {
            if (resumeToken === seedPreviewToken) setBloomPlaying();
          }).catch(function (error) {
            if (resumeToken !== seedPreviewToken) return;
            console.warn('[SonicGrove] seed preview failed', activeBloomRecord.audioKey, error);
            stopSeedPreview(true);
          });
          return;
        }

        stopSeedPreview(false);
        var audioKey = activeBloomRecord.audioKey;
        var file = SeedAudioFiles[audioKey];
        if (!file) {
          console.warn('[SonicGrove] seed preview failed', audioKey, new Error('Missing seed audio mapping'));
          resetBloomButton();
          return;
        }
        seedPreviewLoading = true;
        var token = seedPreviewToken;
        setBloomLoading();
        seedPreviewAudio = new Audio();
        seedPreviewAudio.preload = 'none';
        seedPreviewAudio.src = file;
        syncBloomPreviewVolume();
        seedPreviewAudio.addEventListener('ended', function () {
          if (token !== seedPreviewToken) return;
          stopSeedPreview(true);
        });
        seedPreviewAudio.addEventListener('error', function (error) {
          if (token !== seedPreviewToken) return;
          console.warn('[SonicGrove] seed preview failed', audioKey, error);
          stopSeedPreview(true);
        });
        seedPreviewAudio.addEventListener('playing', function () {
          if (token !== seedPreviewToken) return;
          seedPreviewLoading = false;
          setBloomPlaying();
        });
        seedPreviewAudio.load();
        seedPreviewAudio.play().catch(function (error) {
          if (token !== seedPreviewToken) return;
          console.warn('[SonicGrove] seed preview failed', audioKey, error);
          stopSeedPreview(true);
        });
      });
      card.addEventListener('transitionend', function () {
        if (card.classList.contains('hidden')) {
          stopSeedPreview(true);
        }
      });
    }

    var heroBtn = document.getElementById('hero-disc');
    if (heroBtn) {
      heroBtn.addEventListener('click', function () {
        var record = getCurrentRecord();
        openRecord(record);
      });
    }

    Array.from(document.querySelectorAll('.series-disc')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var seed = findSeedRecord(btn.dataset.seedId || '');
        if (seed) openRecord(seed);
      });
    });
  }

  function bindPlaybackSkips() {

    var skipBBtn = document.getElementById('skip-b');
    var skipEndBtn = document.getElementById('skip-end');
    if (skipBBtn) skipBBtn.addEventListener('click', function () {
      if (state.currentScreen !== 'playback') return;
      state.playbackStartedAt = performance.now() - (timeline.bridgeEnd * 1000);
      renderPlaybackFrame(timeline.bridgeEnd);
      scheduleWhisper();
    });
    if (skipEndBtn) skipEndBtn.addEventListener('click', function () {
      if (state.currentScreen !== 'playback') return;
      state.playbackStartedAt = performance.now() - (timeline.bEnd * 1000);
      renderPlaybackFrame(timeline.bEnd);
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
    ensurePlaybackHint();
    resetEngrave();
    resetPlaybackVisuals();
    app.dataset.fireflies = 'float';
  }

  function getActiveAudios() {
    return Object.keys(Sound.pool).filter(function (name) {
      var audio = Sound.pool[name];
      return audio && !audio.paused && !audio.ended;
    });
  }

  function listAudioFiles() {
    return Object.keys(Sound.files).map(function (name) {
      var loop = name === 'rain' || name === 'pink' || name === 'bgm';
      var audio = Sound.getAudio(name, loop);
      if (audio) Sound.loadAudio(audio);
      return {
        name: name,
        file: Sound.files[name],
        role: Sound.roles[name] || '',
        declared: Boolean(Sound.files[name]),
        loaded: Boolean(audio && audio._sgLoaded),
        failed: Boolean(audio && audio._sgFailed),
        readyState: audio ? audio.readyState : 0,
        networkState: audio ? audio.networkState : 0
      };
    });
  }

  function testAudio() {
    Sound.unlock();
    Sound.stopAmbient();
    Sound.playAmbient();
    Sound.setAmbientVolumes(0.45, 0.22, 0.12);
    window.setTimeout(function () {
      Sound.stopAmbient();
    }, 4800);
    return {
      ok: true,
      durationMs: 4800,
      activeAudios: getActiveAudios()
    };
  }

  function getPlaybackState() {
    var elapsed = getPlaybackElapsed();
    return {
      currentScreen: state.currentScreen,
      playbackStartedAt: state.playbackStartedAt,
      elapsed: elapsed,
      phase: state.playbackStartedAt ? getPlaybackPhase(clamp(elapsed, 0, timeline.total)) : state.playbackPhase,
      volume: state.playbackVolume,
      isEnding: state.playbackEnding,
      activeAudios: getActiveAudios(),
      currentRecord: {
        anchorSong: getCurrentRecord().anchorSong
      },
      soundRecipe: getSoundRecipe()
    };
  }

  function stopAllAudio() {
    cancelAnimationFrame(state.playbackRaf);
    clearTimeout(state.playbackTimeout);
    clearWhisper();
    state.playbackRaf = 0;
    state.playbackTimeout = 0;
    state.playbackStartedAt = 0;
    state.playbackPhase = 'idle';
    state.playbackEnding = false;
    stopBloomPreview();
    Sound.stopAll();
    resetPlaybackVisuals();
    return { ok: true, activeAudios: getActiveAudios() };
  }

  function previewAllMatchReasons() {
    var results = [];
    Q1.forEach(function (mood) {
      Q2.forEach(function (energy) {
        Q3.forEach(function (goal) {
          results.push({
            mood: mood,
            energy: energy,
            goal: goal,
            matchReason: buildYeduMatchReason({
              mood: mood,
              energy: energy,
              goal: goal
            })
          });
        });
      });
    });
    return results;
  }

  function forceGuangPreset() {
    var record = setCurrentRecord(presetRecordBase(DemoPresets.yeduGuang));
    state.playbackCompleted = true;
    state.pendingDiaryEntry = state.pendingDiaryEntry || createDiaryEntrySnapshot('');
    record = finalizePlanting({ reason: 'debug-force' }) || record;
    renderShelfRecords();
    return record;
  }

  function getLatestPlantedRecord() {
    var records = getShelfRecords();
    return records.length ? records[0] : null;
  }

  function getPlantingState() {
    return {
      playbackCompleted: state.playbackCompleted,
      justPlantedRecordKey: state.justPlantedRecordKey,
      lastShelfArchiveKey: lastShelfArchiveKey,
      latest: getLatestPlantedRecord()
    };
  }

  document.addEventListener('DOMContentLoaded', init);
  window.SonicGroveDebug = {
    listAudioFiles: listAudioFiles,
    testAudio: testAudio,
    getPlaybackState: getPlaybackState,
    stopAllAudio: stopAllAudio,
    getCurrentRecord: getCurrentRecord,
    getLastSearchResult: function () { return lastSearchResult; },
    forceGuangPreset: forceGuangPreset,
    resolveRecordCover: resolveRecordCover,
    getShelfRecords: getShelfRecords,
    getPendingDiaryEntry: function () { return state.pendingDiaryEntry; },
    getLatestPlantedRecord: getLatestPlantedRecord,
    getPlantingState: getPlantingState,
    previewAllMatchReasons: previewAllMatchReasons,
    getSeedRecords: function () { return SeedRecords.slice(); },
    getSeedAudioFiles: function () { return Object.assign({}, SeedAudioFiles); }
  };
  window.SonicGrove = {
    goTo: goTo,
    state: state,
    Sound: Sound,
    mockRecord: mockRecord,
    fallbackSongs: fallbackSongs,
    getCurrentRecord: getCurrentRecord,
    startPlayback: startPlayback,
    stopPlayback: stopPlayback,
    fadeOut: fadeOut,
    onPlaybackEnd: onPlaybackEnd,
    getSoundRecipe: getSoundRecipe
  };
})();
