# Sonic Grove Agent Rules

## Project priority

This repository is a working hackathon demo. Stability is more important than feature quantity.

## Locked areas

Unless the current task explicitly requests otherwise:

- Do not redesign or restructure the V1 UI.
- Do not rewrite the Yedu chat copy or interaction flow.
- Do not change the seven-screen golden path.
- Do not replace or broadly refactor app.js.
- Do not modify QQ Music API routes or credential handling.
- Do not add frameworks or large dependencies.
- Do not add visible debug UI.
- Do not expose or commit .dev.vars, AppID, or AppKey.

## Development method

- Make the smallest possible change.
- One task may modify only one product layer.
- Inspect existing logic before editing.
- Reuse existing functions and data structures where practical.
- currentRecord must be the single source of truth for the current record.
- reveal, playback, and shelf must display the same record snapshot.
- Do not silently generate new product copy.
- Do not change visual design unless explicitly requested.

## Required checks

After every code change:

- Run node --check app.js.
- Run syntax checks for modified Functions files when applicable.
- List every modified file.
- Explain why each file was modified.
- State what was deliberately not modified.
- Provide a manual regression checklist.
- Stop after completing the requested stage and wait for user review.
