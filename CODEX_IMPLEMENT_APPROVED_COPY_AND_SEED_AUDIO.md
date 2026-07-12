# Codex 实施 Prompt｜终版文案 + Seed 母带接线

请先阅读项目根目录中的 `AGENTS.md`（如果存在）以及我提供的 `RECORD_COPY_APPROVED.md`。

本轮任务是：

1. 严格按 `RECORD_COPY_APPROVED.md` 写入终版唱片文案与匹配理由机制；
2. 把末页四张花园种子唱片改成结构化 `SeedRecords`；
3. 让用户已经放入 `assets` 的四条 45 秒试听母带在本地与 Cloudflare Pages 部署后稳定、流畅地播放；
4. 控制网页音频体积与加载行为；
5. 不改写任何批准文案，不扩大任务范围。

## 最高优先级约束

- `RECORD_COPY_APPROVED.md` 是唯一文案来源。
- 不得自行润色、同义替换、补写、缩写或生成文案。
- 不得大改 UI、夜渡聊天流程、七屏黄金路径或 QQ 音乐代理。
- 不得直接播放 QQ 音乐原曲。
- 不得给成品 seed 母带再次叠加雨声、粉噪、落针、《光》或其他音轨。
- 不得把 seed record 写入 `currentRecord` 或用户当晚 localStorage。
- 不得自动 git commit、push 或部署。
- 不得安装大型依赖。
- 若文件缺失、对应关系不明确或无法安全执行，停止并报告，不得猜测。

---

# 阶段 0：先审计音频，不要立即改代码

请先：

1. 列出 `assets` 中与以下四首对应的所有音频文件：
   - perfume
   - 枕旧书 / zhenjiushu
   - DREAM
   - 春雷 / chunlei

2. 对每个文件报告：
   - 精确文件名
   - 路径
   - 文件大小
   - 时长
   - 编码格式
   - 采样率
   - 码率
   - 声道数

3. 优先使用 `ffprobe` 检查；若系统没有 `ffprobe`，不要安装大型软件，至少使用文件大小和浏览器可播放性检查。

4. `RECORD_COPY_APPROVED.md` 中的 canonical expected filenames 是：
   - `assets/seed_perfume_sleep_edit.mp3`
   - `assets/seed_zhenjiushu_sleep_edit.mp3`
   - `assets/seed_dream_sleep_edit.mp3`
   - `assets/seed_chunlei_sleep_edit.mp3`

5. 若实际文件名与 canonical 名不同：
   - 若每首都只有一个明确对应文件，可保留实际文件名并在映射中使用，不必强制重命名；
   - 若存在多个可能文件、缺失文件或无法判断对应关系，停止并报告，不要改代码。

完成审计后可以继续，但必须把审计结果放在最终输出中。

---

# 阶段 1：网页音频体积优化

目标不是极限压缩，而是在音质、部署体积和移动端加载之间取得稳定平衡。

## 体积目标

- 每条约 45 秒的网页试听文件，优先控制在 `1.0 MiB` 左右或以内；
- `1.2 MiB` 以内可直接接受；
- 若单条明显大于 `1.2 MiB`，再考虑生成 web 优化版本；
- 不要因为文件小于目标而重复有损转码。

## 若需要压缩

只有在文件明显过大且本机已有 `ffmpeg` 时，才允许：

1. 在项目目录外创建本地备份目录，例如：
   `../sonic-grove-audio-masters-backup/`
2. 先复制原始母带到该目录，确认备份成功；
3. 生成新的网页版本，不直接覆盖唯一原件；
4. 推荐网页版本：
   - MP3
   - 44.1 kHz
   - stereo
   - 128 kbps
5. 文件命名：
   - `seed_perfume_sleep_edit_web.mp3`
   - `seed_zhenjiushu_sleep_edit_web.mp3`
   - `seed_dream_sleep_edit_web.mp3`
   - `seed_chunlei_sleep_edit_web.mp3`
6. 验证网页版本可播放、时长合理、结尾完整后，再让 `SeedAudioFiles` 映射到 `_web.mp3`。
7. 不得删除项目外的备份。
8. 若没有 `ffmpeg`，报告文件大小，不要自动安装或用不可靠方式转码。

示例命令仅在确实需要时使用：

```powershell
ffmpeg -i "input.mp3" -c:a libmp3lame -b:a 128k -ar 44100 -ac 2 "output_web.mp3"
```

不要对已经低码率或已充分压缩的文件再次转码。

---

# 阶段 2：精确写入批准文案

请严格按 `RECORD_COPY_APPROVED.md`：

1. 更新 `fallbackSongs` 中 YD-001 至 YD-008 的：
   - title
   - plant
   - flowerWords
   - note
   - sideA
   - sideB
   - source
   - isSeed
   - audioMode
   - previewLabel

2. 保持歌曲名、歌手和 recordNo 与批准文件一致。

3. 修复：
   - 页面真实值 `困但很清醒`
   - `DemoPresets.yeduGuang.trigger.energy` 也必须是 `困但很清醒`

4. 《光》的主演示专属 `matchReason` 必须逐字使用批准文本。

5. 其他动态 / fallback 唱片不得再统一使用：
   `它的声音足够轻，适合把今晚慢慢放低。`

---

# 阶段 3：实现确定性的 matchReason 组合函数

请新增或改造一个最小函数，例如：

```js
buildYeduMatchReason(answers)
```

严格使用 `RECORD_COPY_APPROVED.md` 中批准的 Q1、Q2、Q3 文本片段。

要求：

- Q1 必须出现；
- Q2 默认出现；只有语义明显重复时才能省略；
- Q3 必须决定结尾；
- tension 不直接显示；
- 不调用随机数；
- 不调用外部生成式 API；
- 不自行改写批准文本；
- 只处理必要标点和连接；
- `yeduGuang` 主演示路径继续使用其专属批准 `matchReason`；
- 普通动态唱片使用组合函数结果。

请保证函数对所有 `4×4×4` 组合均返回非空、自然、确定的字符串。

可增加调试函数：

```js
SonicGroveDebug.previewAllMatchReasons()
```

返回 64 种组合及结果，但不要在正式 UI 中显示调试表。

---

# 阶段 4：建立结构化 SeedRecords

新建单一数据源，例如：

```js
const SeedRecords = [...]
```

四张必须严格来自 `RECORD_COPY_APPROVED.md`：

- No.0002 perfume — mehro
- No.0003 枕旧书 — 鸦青
- No.0004 DREAM — SEVENTEEN
- No.0005 春雷 — 米津玄师

每张包含：

```js
{
  recordNo,
  title,
  plant,
  flowerWords,
  note,
  anchorSong: {
    title,
    artist
  },
  coverUrl,
  sideA,
  sideB,
  audioKey,
  audioMode: "seed-preview",
  previewLabel: "花语试听",
  isSeed: true,
  source: "seed"
}
```

要求：

- 不再依赖散落的 HTML `data-bgm` 作为主要数据源；
- HTML 最多只保留 `data-seed-id`；
- 弹窗所有展示字段读取 `SeedRecords`；
- `currentRecord` 继续只代表用户当晚唱片；
- seed 不调用 `setCurrentRecord()`；
- seed 不调用 `archiveCurrentRecord()`；
- seed 不写入 `SHELF_RECORDS_KEY`。

---

# 阶段 5：独立 Seed Preview 播放器

请使用局部状态，例如：

```js
let activeBloomRecord = null;
let seedPreviewAudio = null;
```

或同等最小实现。

## 播放要求

- 点击 seed 卡片后，把对应对象赋给 `activeBloomRecord`；
- 点击播放按钮时，根据 `activeBloomRecord.audioKey` 查找音频文件；
- 只播放对应的单一成品 MP3；
- 不进入 90 秒 playback 页面；
- 不调用 A/B 面的多轨实时叠加；
- 不播放《光》的默认 music；
- 任意时刻只允许一个 seed preview 播放；
- 切换唱片前停止并归零上一条；
- 关闭 bloom modal 时停止并归零；
- `ended` 后恢复按钮；
- 点击暂停后可继续；
- 重复快速点击不得创建多个 Audio 实例叠加；
- `seedPreviewAudio` 的音量遵循现有全局音量设置；
- 不影响首页 BGM 和夜渡 90 秒 playback；
- 页面离开 shelf 或重新开始流程时清理 seed 音频。

## 加载与流畅性

- 初始页面不要同时下载四条完整音频；
- 使用 lazy load；
- Audio 的 `preload` 设为 `none`；
- 只在真实用户点击后设置 `src` / 调用 `load()` / `play()`；
- 加载时按钮显示简短状态，例如“载入中”；
- `canplay` 或 `playing` 后再显示播放态；
- 文件 404、解码失败或 play promise reject 时：
  - 恢复按钮；
  - 不显示假播放；
  - `console.warn("[SonicGrove] seed preview failed", audioKey, error)`；
  - 不使用 alert；
- 不把音频转为 base64；
- 不一次性 fetch 四条音频；
- 不新增音频框架。

可新增：

```js
const SeedAudioFiles = {
  // audioKey -> 实际文件路径
};
```

如果生成了 `_web.mp3`，只修改这里的路径，不修改 `SeedRecords` 的 `audioKey`。

---

# 阶段 6：末页最小 UI 文案

严格使用：

```text
今晚新种下
```

标记本次动态唱片。

以及：

```text
花园种子
```

辅助说明：

```text
夜渡替新来的夜晚，先留了几颗种子。
```

不要新增大段技术说明。

弹窗应至少显示：

- 唱片封面
- recordNo
- 唱片标题
- 植物
- 花语
- 歌曲与歌手
- A 面 / B 面
- 侧记
- “花语试听”标签
- 播放 / 暂停按钮

保持现有视觉风格，不重做页面结构。若字段过多，优先通过克制的层级、折叠或翻面处理，不得把弹窗变成信息表格。

---

# 阶段 7：检查与验收

## 静态检查

- `node --check app.js`
- 检查 `index.html` / `style.css` 是否只做必要改动
- 列出全部修改文件与函数
- 确认 QQ 音乐代理文件未修改
- 搜索确认没有把密钥写入前端
- 搜索确认批准文案没有被同义改写

## 本地启动

```powershell
npx.cmd wrangler pages dev . --compatibility-date=2026-07-09 --port 8788
```

## 音频直链

逐条确认返回 200 且浏览器可播放：

```text
http://127.0.0.1:8788/assets/<实际 perfume 文件名>
http://127.0.0.1:8788/assets/<实际 枕旧书文件名>
http://127.0.0.1:8788/assets/<实际 DREAM 文件名>
http://127.0.0.1:8788/assets/<实际 春雷文件名>
```

## 功能验收

1. 打开每张 seed，文案与 `RECORD_COPY_APPROVED.md` 完全一致；
2. 点击哪张，只播放哪张对应母带；
3. 切换 seed，上一条立即停止；
4. 关闭弹窗，音频停止；
5. 四张快速来回点击，没有叠音；
6. 播放结束，按钮复位；
7. 文件缺失时不会假播放；
8. `currentRecord` 在浏览 seed 前后完全不变；
9. shelf localStorage 在浏览 seed 前后不新增记录；
10. 《光》的 90 秒 playback 不受影响；
11. 自动匹配与自主输入不受影响；
12. `困但很清醒` 可以准确参与 yeduGuang preset；
13. 普通 fallback 显示组合生成的 `matchReason`。

## Network 验收

使用浏览器开发者工具 Network：

- 首次进入 shelf 时，不应同时请求四条 seed MP3；
- 点击某一张后，只请求该张对应 MP3；
- 重复播放已加载文件时不应无意义地重复创建并行请求；
- 检查实际传输大小；
- 检查 `Content-Type` 为 `audio/mpeg`；
- 在线部署后再次检查 200、播放、切换与关闭。

不要为了缓存音频自行添加 `_headers`。保持 Cloudflare Pages 默认静态资源缓存行为，避免比赛前出现旧音频缓存难以刷新。

---

# 最终输出格式

完成后请输出：

1. 实际发现的四个母带文件名、大小、时长和编码；
2. 是否生成 web 优化版本，以及为什么；
3. 最终 `SeedAudioFiles` 映射；
4. 修改文件与函数；
5. 64 种 `matchReason` 是否全部非空；
6. seed 是否完全不污染 `currentRecord` / localStorage；
7. 本地测试结果；
8. 仍需我人工完成的步骤；
9. 明确确认：
   - 没有自行改文案；
   - 没有修改 QQ 音乐代理；
   - 没有叠加第二层音效；
   - 没有自动 commit / push / deploy。

完成后停止，不要继续开发其他精灵、花园动效或新功能。
