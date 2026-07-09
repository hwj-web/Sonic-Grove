# QQ Music API Setup

V2 keeps the current Night Ferry Cat UI and core flow intact, while moving QQ Music access behind Cloudflare Pages Functions.

## Environment Variables

The frontend never stores `app_id` or `app_key`. Configure these variables in Cloudflare Pages, or copy `.dev.vars.example` to `.dev.vars` for local Pages preview:

```txt
QQMUSIC_APP_ID=
QQMUSIC_APP_KEY=
```

Optional login variables are only needed for APIs that require a QQ Music user login state:

```txt
QQMUSIC_OPEN_APPID=
QQMUSIC_OPEN_ID=
QQMUSIC_ACCESS_TOKEN=
```

## Endpoints

- `/api/qqmusic/search`: searches QQ Music songs and returns normalized song data.
- `/api/qqmusic/song-info`: fetches song details by `songMid` or `songId`.

If the API is unavailable, missing credentials, rate-limited, or returns an error, the demo falls back to the local Night Ferry Cat record samples so the core presentation flow continues.
