const QQMUSIC_API_URL = 'https://qplaycloud.y.qq.com/rpc_proxy/fcgi-bin/music_open_api.fcg';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function signQuery(query, appKey) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(appKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${query}&cookie=`)
  );
  return toHex(signature).toLowerCase();
}

function appendIf(params, key, value) {
  if (value !== undefined && value !== null && String(value) !== '') {
    params.append(key, String(value));
  }
}

function normalizeUrl(url) {
  return String(url || '').replace(/^http:\/\//, 'https://');
}

function normalizeSong(song) {
  return {
    songId: song.song_id || 0,
    songMid: song.song_mid || '',
    songTitle: song.song_title || song.song_name || '',
    songName: song.song_name || song.song_title || '',
    artist: song.singer_name || '',
    singerId: song.singer_id || '',
    albumId: song.album_id || 0,
    albumMid: song.album_mid || '',
    albumName: song.album_name || '',
    coverUrl: normalizeUrl(song.album_pic_500x500 || song.album_pic_300x300 || song.album_pic_150x150 || song.album_pic),
    h5Url: normalizeUrl(song.song_h5_url),
    previewUrl: normalizeUrl(song.try_30s_url),
    playUrl: normalizeUrl(song.song_play_url_standard || song.song_play_url || song.try_30s_url),
    playable: Number(song.playable || 0),
    tryPlayable: Number(song.try_playable || 0),
    vip: Number(song.vip || 0),
    unplayableCode: Number(song.unplayable_code || 0),
    unplayableMsg: song.unplayable_msg || ''
  };
}

async function callQQMusic(params, env) {
  const query = params.toString();
  const sign = await signQuery(query, env.QQMUSIC_APP_KEY);
  const response = await fetch(`${QQMUSIC_API_URL}?${query}`, {
    method: 'GET',
    headers: { 'X-QYOPI-Sign': sign }
  });
  const data = await response.json();
  return { data, area: response.headers.get('area') || '' };
}

export async function onRequestGet(context) {
  const { request } = context;
  const env = context.env || {};
  const url = new URL(request.url);
  const rawKeyword = url.searchParams.get('keyword') || url.searchParams.get('q') || url.searchParams.get('query') || '';
  const keyword = String(rawKeyword).trim();
  const debug = {
    hasKeyword: Boolean(keyword),
    hasAppId: Boolean(env.QQMUSIC_APP_ID),
    hasAppKey: Boolean(env.QQMUSIC_APP_KEY),
    keywordLength: keyword.length
  };

  if (!keyword) {
    return json({ ok: false, songs: [], message: 'Missing keyword', debug }, 400);
  }

  if (!env.QQMUSIC_APP_ID || !env.QQMUSIC_APP_KEY) {
    return json({ ok: false, songs: [], message: 'Missing QQ Music credentials', debug });
  }

  const params = new URLSearchParams();
  params.append('opi_cmd', 'fcg_music_custom_search.fcg');
  params.append('app_id', env.QQMUSIC_APP_ID);
  params.append('timestamp', String(Math.floor(Date.now() / 1000)));
  appendIf(params, 'device_id', url.searchParams.get('deviceId') || request.headers.get('cf-ray') || 'sonic-grove-web');
  appendIf(params, 'client_ip', request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '0.0.0.0');

  if (env.QQMUSIC_OPEN_ID && env.QQMUSIC_ACCESS_TOKEN) {
    params.append('login_type', '6');
    params.append('qqmusic_open_appid', env.QQMUSIC_OPEN_APPID || env.QQMUSIC_APP_ID);
    params.append('qqmusic_open_id', env.QQMUSIC_OPEN_ID);
    params.append('qqmusic_access_token', env.QQMUSIC_ACCESS_TOKEN);
  }

  params.append('w', keyword);
  params.append('p', String(Math.min(Math.max(Number(url.searchParams.get('p') || 1), 1), 3)));
  params.append('num', String(Math.min(Math.max(Number(url.searchParams.get('num') || 10), 1), 20)));
  params.append('t', String(url.searchParams.get('t') || 0));

  try {
    const { data, area } = await callQQMusic(params, env);
    if (Number(data.ret) !== 0) {
      return json({ ok: false, songs: [], message: 'QQ Music search unavailable', debug });
    }

    return json({
      ok: true,
      area,
      keyword: data.keyword || keyword,
      userOwnRule: data.user_own_rule,
      songs: Array.isArray(data.list) ? data.list.map(normalizeSong) : []
    });
  } catch (error) {
    return json({ ok: false, songs: [], message: 'QQ Music search unavailable', debug });
  }
}
