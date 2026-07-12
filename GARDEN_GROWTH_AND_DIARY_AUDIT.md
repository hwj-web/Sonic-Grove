# Sonic Grove 「听完即开花 + 夜记翻面」审计

审计范围：基于当前本地仓库代码与已封存稳定版本，仅读取 `AGENTS.md`、`RECORD_COPY_APPROVED.md`、`app.js`、`index.html`、`style.css`。本文件只做产品与代码结构审计，不修改功能代码、不生成补丁、不创建素材。

结论摘要：
- 当前已经具备“唱片完成后进入唱片架”的闭环，但“开花”语义目前只是页面视觉，不是结构化状态。
- 当前已经有“日记”输入 UI，但用户输入没有写入 `state`、`currentRecord` 或 `localStorage`。
- “夜记翻面”的最小落点应是动态唱片的 bloom modal，不应影响四张 seed records 的试听详情。
- 第一版“听完即开花”不需要新增图片素材，可以复用现有唱片封面、柔光、CSS 动效。

---

## 一、当前夜记数据审计

### 1. 用户聊天过程中实际保存了哪些内容

| 内容 | 当前保存位置 | 文件与行号 | 是否持久化 | 说明 |
| --- | --- | --- | --- | --- |
| Q1 情绪选择 | `state.answers.mood` | `app.js:299`, `app.js:1372` | 否 | 点击选项后写入内存状态，刷新或重走聊天会消失。 |
| Q2 能量选择 | `state.answers.energy` | `app.js:299`, `app.js:1372` | 否 | 同上。 |
| Q3 今晚目标 | `state.answers.goal` | `app.js:299`, `app.js:1372` | 否 | 同上。 |
| tension 数值 | `state.answers.tension` | `app.js:299`, `app.js:1299-1315` | 否 | slider 输入写入内存状态。 |
| 是否回应日记弹窗 | `state.chatFlow.diaryResponded` | `app.js:306`, `app.js:1991-2034` | 否 | 只记录用户是否跳过/保存过日记，不保存日记内容。 |
| 生成唱片侧记 | `currentRecord.note` | `app.js:786`, `app.js:1039`, `app.js:1218` | 是，进入 shelf 后 | 这是夜渡生成的唱片侧记，不是用户原话。 |
| 匹配理由 | `currentRecord.matchReason` | `app.js:796`, `app.js:931-935`, `app.js:1053` | 是，进入 shelf 后 | 用于解释歌曲为何适合今晚，不是完整夜记。 |

### 2. Q1 / Q2 / Q3 / tension 存在哪里

- 初始结构在 `app.js:299`：
  - `state.answers.mood`
  - `state.answers.energy`
  - `state.answers.goal`
  - `state.answers.tension`
- 用户点击选项时，`onQAnswered(group, value)` 在 `app.js:1372` 写入对应字段。
- tension slider 在 `app.js:1299-1315` 读取和更新 `state.answers.tension`。
- 这些字段目前只存在于本轮页面内存，不进入 `currentRecord`，也不进入 `localStorage`。

### 3. 用户是否有自由输入的一句话

有 UI，但没有真实保存。

- DOM：`index.html:151-176`
  - `#diary-textarea`
  - `#diary-save`
  - `#diary-skip`
  - `#diary-rec`
- 打开逻辑：`appendRecordToday()`，`app.js:1321-1334`
- 保存按钮逻辑：`app.js:2025-2034`

当前 `diarySave` 点击后只做三件事：
- 更新提示文字；
- 把 `state.chatFlow.diaryResponded` 设为 `true`；
- 追加一句夜渡回复并关闭弹窗。

未看到代码读取 `ui.diaryTextarea.value`，也未看到写入 `state`、`currentRecord` 或 `localStorage`。

### 4. 聊天结束后出现的“日记”来自哪里

当前“日记”主要是弹窗 UI，而不是数据模型。

- 日记弹窗来自 `index.html:151-176`。
- 弹窗由 `appendRecordToday()` 打开，见 `app.js:1321-1334`。
- 关闭后如果匹配阶段仍为 idle，会继续进入匹配流程，见 `app.js:1982-1989`。
- 页面上的唱片侧记来自 `currentRecord.note`，不是用户在日记弹窗中输入的文字，见 `app.js:1218`。

### 5. 当前是否存在相关字段

| 字段名 | 当前状态 | 证据 |
| --- | --- | --- |
| `diary` | 仅作为 DOM 命名存在 | `index.html:151-176`, `app.js:357-365` |
| `diaryEntry` | 未确认存在 | 全仓搜索未见作为数据字段使用 |
| `journal` | 未确认存在 | 全仓搜索未见作为数据字段使用 |
| `userLine` | 未确认存在 | 全仓搜索未见作为数据字段使用 |
| `summary` | 未确认存在 | 全仓搜索未见作为数据字段使用 |
| `note` | 已存在 | `currentRecord.note` / seed note / fallback note |
| `matchReason` | 已存在 | `currentRecord.matchReason` |
| `conversation snapshot` | 未确认存在 | 目前没有聊天过程快照结构 |

### 6. 哪些内容只显示在页面里，没有保存

- `#diary-textarea` 中的用户输入：当前没有被读取。
- 按住录音后的“录音中 / 已记录今晚的小日记”状态：只是 UI 状态，没有真实音频或文本数据。
- 夜渡聊天过程中的逐句 DOM 气泡：流程重置或刷新后不会保留。
- tension 当前 slider 数值：只在本轮内存中存在，不进入归档 snapshot。

### 7. 哪些内容已经进入 currentRecord

`normalizeRecordSnapshot()` 在 `app.js:771-812` 生成当前唱片 snapshot，包含：

- `recordNo`
- `title`
- `plant`
- `flowerWords`
- `note`
- `anchorSong`
- `sideA`
- `sideB`
- `source`
- `isSeed`
- `audioKey`
- `audioMode`
- `previewLabel`
- `suitableMood`
- `matchReason`
- `songId`
- `songMid`
- `h5Url`
- `previewUrl`
- `playUrl`
- `soundRecipe`
- `coverUrl`

不包含：

- `mood`
- `energy`
- `goal`
- `tension`
- `diaryEntry`
- `userLine`
- `conversationSnapshot`

### 8. 哪些内容已经保存到 localStorage

进入 shelf 时，`archiveCurrentRecord()` 在 `app.js:835-846` 调用 `normalizeRecordSnapshot()`，追加 `createdAt`，并写入 `SHELF_RECORDS_KEY = 'sonic_grove_shelf_records'`，见 `app.js:294` 与 `app.js:815-826`。

当前保存的是唱片 snapshot，不保存用户聊天答案和日记正文。

### 9. 页面刷新后哪些内容会消失

会消失：
- `state.answers` 中的 Q1 / Q2 / Q3 / tension；
- 用户在日记 textarea 里输入但尚未保存的内容；
- 即使点了“记下”，由于未写入数据模型，正文也会消失；
- 聊天 DOM 气泡；
- `state.chatFlow.diaryResponded`。

会保留：
- 已归档的唱片 snapshot；
- `createdAt`；
- 唱片标题、植物、花语、A/B 面、侧记、匹配理由、封面、锚定歌等。

### 10. 最适合延展为“一页夜记”的真实字段

当前最适合直接复用：
- 日期：`createdAt`
- 唱片标题：`currentRecord.title`
- 植物：`currentRecord.plant`
- 用户状态摘要：`currentRecord.matchReason`
- 夜渡侧记：`currentRecord.note`

当前缺失但最值得最小新增：
- `diaryEntry.userLine`：来自 `#diary-textarea` 的用户一句话；
- `diaryEntry.answersSnapshot`：保存当晚 `mood / energy / goal`，不建议展示 tension 数值；
- `diaryEntry.source`：区分 `user` 与 `generated`，避免把自动摘要误当用户原话。

必须明确区分：
- 用户当晚说的话：目前没有保存；
- 夜渡生成的侧记：`currentRecord.note`；
- 唱片花语：`currentRecord.flowerWords`；
- 歌曲匹配理由：`currentRecord.matchReason`。

---

## 二、播放结束到唱片架链路审计

### 1. 90 秒 playback 开始函数

- `startPlayback()`：`app.js:1665-1689`
- 当前行为：
  - `stopPlayback()`
  - `goTo('playback')`
  - 暂停首页 BGM
  - 解锁音频
  - 播放落针
  - 启动本地 sleep-preview 音频包
  - 设置 `state.playbackStartedAt = performance.now()`
  - 用 RAF 启动 90 秒时间线

### 2. RAF / timer 主控制函数

- `updatePlaybackLoop()`：`app.js:1654-1663`
- `getPlaybackElapsed()`：`app.js:1505-1508`
- `getPlaybackPhase()`：`app.js:1512-1518`
- 兜底 timeout：`app.js:1685-1687`

当前时间线由 `performance.now()` + RAF 驱动，不依赖 mp3 播放结束。

### 3. A 面、B 面、晚安收尾状态切换

- `timeline`：`app.js:387-393`
  - `needleEnd: 3`
  - `aEnd: 35`
  - `bridgeEnd: 50`
  - `bEnd: 85`
  - `total: 90`
- `renderPlaybackFrame(elapsed)`：`app.js:1521-1581`
  - needle：落针 / 入夜
  - sideA：A 面
  - bridge：A 到 B 过渡
  - sideB：B 面
  - ending：晚安渐隐

### 4. 正常播放结束时调用什么函数

- `updatePlaybackLoop()` 在 elapsed 达到 90 秒后调用 `onPlaybackEnd()`，见 `app.js:1658-1662`。
- timeout 兜底也调用 `onPlaybackEnd()`，见 `app.js:1685-1687`。
- `onPlaybackEnd()`：`app.js:1626-1652`
  - 设置 ending guard；
  - 停止 RAF / timeout / whisper；
  - 停止环境声；
  - 显示 `#breath-end`；
  - 2.4 秒后 `goTo('shelf')`。

### 5. 用户点击“B 面”“收尾”或跳转按钮时调用什么函数

- `bindPlaybackSkips()`：`app.js:2324-2338`
  - `#skip-b`：把 `playbackStartedAt` 调整到 bridgeEnd；
  - `#skip-end`：把 `playbackStartedAt` 调整到 bEnd；
  - 两者都不直接调用 `onPlaybackEnd()`，只是把时间线推进到对应阶段。
- 退出到首页等跳转入口会通过 `goTo()` 离开 playback，若不是 ending 状态，会触发 `stopPlayback()`，见 `app.js:1857-1864`。

### 6. 进入 shelf 时调用什么函数

- `goTo('shelf')`：`app.js:1857-1902`
- 当 `id === 'shelf'`：
  - `archiveCurrentRecord()`
  - `applyMockRecord()`

### 7. archiveCurrentRecord() 的准确调用位置

- 主调用：`goTo('shelf')`，`app.js:1898-1901`
- 调试调用：`forceGuangPreset()` 附近，`app.js:2469-2470`
- 函数自身：`app.js:835-846`

### 8. 是否存在重复归档风险

有轻微风险，但当前已有去重。

- `archiveCurrentRecord()` 使用 `getRecordArchiveKey()` 去重，见 `app.js:830-846`。
- key 由 `recordNo / title / anchorSong.title / anchorSong.artist` 组成。
- 如果同一张唱片多次进入 shelf，不会形成多张重复记录。
- 但 `archiveCurrentRecord()` 每次都会新建 snapshot，并设置新的 `createdAt`，再替换旧记录。也就是说，同一张唱片反复进 shelf 时，时间可能被刷新。

这对“今晚新种下 / plantedAt”会有影响：如果用 `createdAt` 代表种下时间，重复进入 shelf 可能改变种下时间。

### 9. 用户中途退出、重新开始或重复播放时会发生什么

- 中途离开 playback：`goTo()` 会调用 `stopPlayback()`，停止 RAF、timeout 和音频，不归档。
- 再次播放：`startPlayback()` 先 `stopPlayback()`，避免叠加时间线和声音。
- 重复进入 shelf：会再次调用 `archiveCurrentRecord()`，当前列表不重复，但时间字段可能刷新。
- Seed preview 独立于 90 秒 playback，不会触发归档。

### 10. 最适合作为“今晚的花已经种下”的唯一触发点

推荐新增一个幂等的 `finalizePlanting()`，不要把“开花状态”散落在 `onPlaybackEnd()` 或 `goTo('shelf')` 里。

推荐判断：
- 语义触发点：`onPlaybackEnd()`，因为它代表用户完成了 90 秒试听旅程；
- 路由渲染点：`goTo('shelf')`，只负责进入唱片架并渲染；
- 统一保底点：`finalizePlanting()`，用于任何官方完成入口，包括未来可能出现的“完成体验 / 跳到唱片架”。

建议结构：
- `onPlaybackEnd()` 调用 `finalizePlanting({ reason: 'playback-ended' })` 后再进入 shelf；
- 如果保留 `goTo('shelf')` 自动归档，也应让它调用同一个 `finalizePlanting()`，并通过 archive key 或 `plantedAt` 做幂等；
- `archiveCurrentRecord()` 应避免重复刷新已有唱片的 `plantedAt`。

结论：开花不应只由“进入 shelf”隐式触发；应有一个统一且可重复调用不出错的完成函数。

---

## 三、当前 shelf 与 bloom modal 审计

### 1. 当前动态唱片卡 DOM 结构

动态唱片卡不是写死在 HTML 里，而是由 `renderShelfRecords()` 插入：

- 插入位置：`#screen-shelf .rack-records`，`app.js:849`
- class：`.series-disc.current-record-disc`，`app.js:853-857`
- 数据属性：
  - `data-no`
  - `data-plant`
  - `data-words`
  - `data-bgm`
- 点击行为：`btn.onclick = openBloomCard(latest)`，`app.js:868-872`

### 2. 四张 SeedRecords 的 DOM 结构

Seed record 卡片写在 `index.html:440-452`：

- `button.series-disc[data-seed-id="No.0002"]`
- `button.series-disc[data-seed-id="No.0003"]`
- `button.series-disc[data-seed-id="No.0004"]`
- `button.series-disc[data-seed-id="No.0005"]`

每张卡片包含：
- `<img>`
- `<span>No.000x</span>`
- 内联色彩变量 `--g1 / --g2`

### 3. 动态唱片与 seed 点击是否共用事件

部分共用。

- 动态唱片：由 `renderShelfRecords()` 单独设置 `onclick`，直接传入 latest snapshot。
- Seed records：由 `bindBloomCards()` 在 `app.js:2316-2322` 绑定，读取 `data-seed-id`，再 `findSeedRecord()`。
- 最终都调用同一个 `openRecord(record)` / `openBloomCard(record)`，见 `app.js:2198-2229`。

### 4. 当前 bloom modal 展示哪些字段

DOM 在 `index.html:466-480`：

- `bloom-cover`
- `bloom-no`
- `bloom-title`
- `bloom-plant`
- `bloom-words`
- `bloom-anchor`
- `bloom-sides`
- `bloom-note`
- `bloom-bgm`
- `bloom-play-btn`

填充逻辑在 `openRecord(record)`，`app.js:2198-2229`。

### 5. 动态唱片点击后是否能查看完整 currentRecord

能查看一部分完整 snapshot 字段：

- recordNo
- title
- plant
- flowerWords
- anchorSong
- sideA / sideB
- note
- cover
- preview label

目前不能查看：
- createdAt；
- 用户当晚一句话；
- Q1 / Q2 / Q3；
- tension；
- diary / journal。

原因是这些字段还没有进入 snapshot，或 modal 没有对应展示区域。

### 6. seed 点击后如何使用 activeBloomRecord

`bindBloomCards()` 内部维护 `activeBloomRecord`，见 `app.js:2146-2150` 与 `app.js:2201`。

- seed record 打开后成为 `activeBloomRecord`；
- 播放按钮只在 `canPlaySeedPreview(record)` 返回 true 时可用；
- `canPlaySeedPreview()` 要求 `record.isSeed && record.audioKey && SeedAudioFiles[audioKey]`，见 `app.js:2182-2184`；
- seed preview 使用独立 `new Audio()`，不走 90 秒 playback。

### 7. 是否已有翻面、展开、详情或返回机制

未确认存在翻面机制。

已有：
- bloom modal 打开 / 关闭；
- seed 独立试听；
- reveal 页面有“翻看侧记”按钮，见 `index.html:276-280` 与 `app.js:2074` 附近；
- modal 自身没有 front/back 状态。

### 8. 哪些样式可以直接复用

可复用：
- `.bloom-card` 的弹窗容器与滚动能力，`style.css:1927-1942`；
- `.bloom-title / .bloom-plant / .bloom-words / .bloom-note` 的文字层级，`style.css:1964-1988`；
- `.series-disc` 作为唱片架小卡，`style.css:2052-2064`；
- `.planted-glow` 和 `plantGlow`，`style.css:1906-1909`, `style.css:2020`, `style.css:2034`；
- `fadeUp`，`style.css:2035`；
- `prefers-reduced-motion` 降级，`style.css:2183`。

### 9. 当前手机端弹窗尺寸、滚动和文字容量

`bloom-card` 使用：

- `width: min(304px, calc(100% - 42px))`
- `max-height: 82%`
- `overflow: auto`

见 `style.css:1927-1942`。

这对短夜记足够，但不适合完整聊天记录。因此“夜记翻面”应只放：
- 日期；
- 用户一句话或核心状态；
- 夜渡侧记；

不应放完整聊天记录或 tension 数值。

### 10. 动态唱片夜记背面与 seed 详情如何不互相污染

推荐规则：

- 动态唱片：
  - `record.isSeed !== true`
  - modal 支持“花语正面 / 夜记背面”
  - 不显示 seed 独立试听按钮，或保持当前禁用逻辑
- seed records：
  - `record.isSeed === true`
  - 继续显示当前花语试听详情
  - 不出现夜记背面
  - 不写入 `currentRecord`
  - 不归档到用户当晚唱片

实现上应把 modal 状态拆成：
- `activeBloomRecord`
- `activeBloomView = 'front' | 'diary'`

不要在翻面时修改 `activeBloomRecord`，否则会把 seed 和动态唱片的数据混在一起。

---

## 四、“听完即开花”的最小实现评估

目标体验：

1. 用户完成夜渡 90 秒试听或通过现有收尾入口完成体验；
2. 进入唱片架；
3. 最新动态唱片显示“今晚新种下”；
4. 出现“今晚的 {plant}，已经种下。”；
5. 最新唱片卡进行一次克制生长动画；
6. 动画结束后保持稳定状态，不循环；
7. 四张 seed records 仍显示“花园种子”；
8. 不增加农场玩法。

### 最小数据需求评估

| 字段 | 当前是否已有同类字段 | 是否真的需要新增 | 是否进入 currentRecord snapshot | 是否保存 localStorage | 兼容建议 |
| --- | --- | --- | --- | --- | --- |
| `plantedAt` | 有 `createdAt` | 可选 | 推荐进入 | 推荐保存 | 最小版可复用 `createdAt`；如果要避免重复刷新种下时间，建议新增并首次写入后不覆盖。 |
| `isPlanted` | 无 | 不必新增 | 不建议强依赖 | 不建议强依赖 | 唱片已在 shelf 中即可视为 planted；动画可用临时 class。 |
| `growthStage` | 无 | 不建议新增 | 不建议 | 不建议 | 当前只有一次开花动画，没有阶段系统，不应提前做成长玩法。 |
| `plantVisualKey` | 可由 `plant` 推导 | 暂不需要 | 不建议 | 不建议 | 第一版用封面与柔光即可；未来多植物专属动效再加。 |
| `diaryEntry` | 无 | 推荐新增 | 推荐进入 | 推荐保存 | 夜记翻面的核心字段，保存用户一句话与状态摘要。 |
| `userLine` | 无 | 视 diaryEntry 而定 | 推荐作为 diaryEntry 子字段 | 推荐保存 | 读取 textarea；为空时用已批准的状态摘要策略。 |

### 最小判断

必须新增：
- `diaryEntry` 或等价的夜记 snapshot；
- 一个幂等的 planting finalizer；
- 最新动态卡的短暂 `just-planted` UI 状态。

可以复用：
- `createdAt` 作为日期；
- `plant` 生成“今晚的 {plant}，已经种下。”；
- `matchReason` 做用户状态摘要；
- `note` 做夜渡侧记；
- 当前 shelf hero 与 rack 动效。

不建议新增：
- `growthStage`；
- 数值成长；
- 浇水、金币、任务；
- 多日成长系统；
- 花园天气。

### 老唱片兼容

老记录缺少 `diaryEntry` 时：
- 日期使用 `createdAt`；
- 用户状态摘要使用 `matchReason`；
- 夜渡侧记使用 `note`；
- 不展示 tension；
- 不生成或显示未经批准的新文案。

---

## 五、“夜记翻面”的最小实现评估

### 1. 当前现有数据是否足够

够做“基础夜记背面”，但不够做“用户原话夜记”。

已有可用：
- `createdAt`
- `record.title`
- `record.plant`
- `record.matchReason`
- `record.note`

缺失：
- 用户在日记 textarea 里输入的一句话；
- 当晚 Q1 / Q2 / Q3 的结构化 snapshot；
- 日记来源标记。

### 2. 最适合做“夜记标题”的字段

推荐使用已有 `record.title` 作为夜记标题。

理由：
- 它是当前唱片最稳定、最具夜渡语气的字段；
- 与正面唱片一致；
- 不需要新增未经人工批准的新文案。

日期可以作为标题上方或下方的 meta，不建议另写一套标题系统。

### 3. 用户没有自由输入时如何生成克制摘要

当前最稳的来源是 `record.matchReason`。

如果下一轮需要更贴近用户选择，建议把 `state.answers.mood / energy / goal` 在归档前保存到 `diaryEntry.answersSnapshot`。这样可以在背面展示“核心状态”，但不要展示 tension 数值。

不要在代码里临时生成大量新夜记文案；如需默认句，应走人工批准文案表。

### 4. 是否需要保存用户答案结构化 snapshot

推荐保存，但只保存最小字段：

```js
diaryEntry: {
  userLine: '',
  mood: state.answers.mood,
  energy: state.answers.energy,
  goal: state.answers.goal,
  source: 'user' | 'generated'
}
```

不建议保存：
- 完整聊天 DOM；
- tension 原始数值；
- 录音状态；
- 大段自动生成文本。

### 5. 翻面方式评估

| 方式 | 评价 |
| --- | --- |
| CSS 3D flip | 有“翻面”隐喻，但移动端滚动、文字可读性和背面高度更容易出问题。 |
| 淡入淡出切换 | 最稳，适合当前 glass modal；文字可读性最好。 |
| 折页展开 | 有调性，但实现和移动端适配成本更高。 |
| 其他方式 | 可用小 tab / 正反面切换，但要避免变成工具 UI。 |

推荐：淡入淡出切换，视觉上可以保留“翻面”文案，但不要真的做复杂 3D 翻转。

### 6. 移动端、可读性和稳定性最佳选择

最佳：同一个 bloom modal 内切换 front / diary 两个 panel，使用 opacity + transform 的 0.35–0.6 秒淡入淡出。

理由：
- 已有 modal 支持滚动；
- 不影响布局；
- 不需要新增大结构；
- 降级容易；
- 不影响 seed preview。

### 7. 是否会和当前 bloom modal 播放按钮冲突

会有潜在冲突，需要明确分流：

- seed record：保留播放按钮；
- 动态 record：显示“夜记背面”入口，不显示或禁用 seed 播放按钮；
- 翻到背面时，不改变 `activeBloomRecord`；
- 如果 seed preview 正在播放，关闭 modal 或切换 seed 时沿用现有 `stopSeedPreview()`。

---

## 六、动效质量审计

### Skill 检查

当前可用 Skill 中，和本方向最接近的是：

- `design-taste-frontend`：用于前端审美、界面一致性、避免模板感与突兀设计。

未发现专门命名为以下方向的 Skill：

- frontend motion
- interaction design
- CSS animation
- accessible animation
- web UI polish

结论：后续实施阶段可以调用 `design-taste-frontend` 做审美约束，但动效策略应直接遵守本项目的 Sonic Grove Motion Spec。

### 当前 CSS 与素材判断

当前已有可复用动效：
- `plantGlow`：`style.css:2034`
- `heroIn`：`style.css:2033`
- `fadeUp`：`style.css:2035`
- `sleeveBreath`：`style.css:2036`
- `prefers-reduced-motion`：`style.css:2183`

当前已有可复用视觉：
- shelf 背景：`style.css:89`
- shelf hero glow：`index.html:420`, `style.css:1906-1909`
- 唱片封面与 record sleeve：`index.html:422-431`, `style.css:1885-1889`
- rack records：`style.css:2052-2064`

### 是否需要新图片

第一版完全不需要新增图片。

可以用：
- 当前植物封面；
- `.planted-glow`；
- 当前唱片卡；
- CSS opacity / transform / filter；
- 伪元素做一层非常轻的柔光或嫩芽轮廓。

如果未来确实需要素材，最多建议：
- 1 个透明背景简化嫩芽 SVG；
- 尺寸 128×128 或 160×160；
- 单色或低饱和暖金/雾绿；
- 只用于最新动态唱片一次性开花动画。

但本轮最小 V2 不建议新增素材。

### 动效方向

推荐：
- 进入 shelf 后，最新动态唱片先轻微上浮 4–8px；
- 柔光从封面下方慢慢显出；
- 卡片周围出现一次性花影/叶影 scale + opacity；
- 1.2–1.5 秒结束；
- 结束后只保留稳定状态，不循环。

禁止：
- 弹跳；
- 抖动；
- 爆炸粒子；
- 游戏式奖励；
- 循环吸引注意力。

---

## 七、输出最小实施方案

### 1. 当前可复用的数据与函数

| 类型 | 文件与行号 | 可复用内容 |
| --- | --- | --- |
| 当前唱片 snapshot | `app.js:771-812` | `normalizeRecordSnapshot()` |
| 唱片归档 | `app.js:835-846` | `archiveCurrentRecord()` |
| 唱片架读取 | `app.js:815-826` | `getShelfRecords()` / `saveShelfRecords()` |
| 唱片架渲染 | `app.js:848-873` | `renderShelfRecords()` |
| 播放结束 | `app.js:1626-1652` | `onPlaybackEnd()` |
| 90 秒时间线 | `app.js:387-393`, `app.js:1521-1581` | A/B 面与晚安状态 |
| 页面跳转 | `app.js:1857-1902` | `goTo(id)` |
| 日记入口 | `index.html:151-176`, `app.js:1321-1334` | diary modal UI |
| 日记按钮 | `app.js:1991-2034` | skip / rec / save 事件 |
| bloom modal | `index.html:466-480`, `app.js:2133-2322` | 唱片详情弹窗 |
| shelf 动效 | `style.css:2020-2036` | glow / hero / fade 动效 |
| reduced motion | `style.css:2183` | 动效降级 |

### 2. 当前缺失的数据

必须新增：
- `diaryEntry`：至少保存用户一句话或状态摘要；
- `finalizePlanting()` 的幂等状态；
- 最新动态唱片的 one-shot planted UI 状态。

可以复用：
- `createdAt`：用于夜记日期；
- `matchReason`：用于没有用户输入时的状态摘要；
- `note`：用于夜渡侧记；
- `plant`：用于“今晚的 {plant}，已经种下。”；
- `recordNo / title / coverUrl`：用于正面展示。

不建议新增：
- `growthStage`；
- `plantVisualKey`；
- 长期成长数值；
- 完整 conversation snapshot；
- tension 展示字段。

### 3. 推荐用户体验

推荐最小路径：

1. playback 收尾：90 秒结束，晚安渐隐。
2. `finalizePlanting()`：生成或补齐当前唱片的 planted snapshot。
3. 进入 shelf：最新动态唱片出现在第一张。
4. 今晚新种下：最新动态卡显示已有“今晚新种下”语义。
5. 生长动画：最新卡和柔光做一次 1.2–1.5 秒克制显现。
6. 点击动态唱片：打开 bloom modal。
7. 花语正面：显示封面、标题、植物、花语、锚定歌、A/B 面。
8. 夜记背面：切换显示日期、用户一句话或核心状态、夜渡侧记。

Seed records 保持当前逻辑：
- 点击仍打开花语试听详情；
- 仍可播放独立 45 秒试听；
- 不出现夜记背面；
- 不污染 currentRecord。

### 4. 最小代码改动

需要修改的文件：

- `app.js`
  - 新增 `createDiaryEntrySnapshot()`：读取 textarea 与 `state.answers`；
  - 新增 `finalizePlanting()`：幂等归档、补齐 `plantedAt / diaryEntry`；
  - 调整 `archiveCurrentRecord()` 或让它被 `finalizePlanting()` 包裹，避免重复刷新 planted time；
  - 在 `onPlaybackEnd()` 或官方完成入口调用 `finalizePlanting()`；
  - 在 `renderShelfRecords()` 给最新动态卡加一次性 planted class 或 data；
  - 在 `bindBloomCards()` 中增加动态唱片 front / diary 切换，seed 不启用 diary。

- `index.html`
  - 在 shelf 或 bloom modal 中增加最小必要容器；
  - 可增加一处用于“今晚的 {plant}，已经种下。”的轻量文本；
  - 可增加 bloom modal 正反面切换按钮或区域。

- `style.css`
  - 增加 one-shot 生长动画；
  - 增加 bloom modal front / diary panel 切换样式；
  - 增加 reduced-motion 下的降级。

必须保持不动：
- QQ 音乐 API routes；
- AppID / AppKey 读取方式；
- 夜渡聊天核心文案；
- 七屏主路径；
- 90 秒音频时间线；
- SeedRecords 文案；
- SeedAudioFiles 与 seed preview 播放逻辑；
- currentRecord 单一数据源原则。

localStorage schema：
- 推荐向后兼容新增字段，不做迁移脚本。
- 老记录缺少 `diaryEntry / plantedAt` 时，读取时用 `createdAt / matchReason / note` 兜底。

### 5. 动效实现建议

推荐 CSS 方向：
- `.current-record-disc.just-planted`：一次性 transform + opacity；
- `.current-record-disc.just-planted::before` 或相邻柔光元素：scale + blur + opacity；
- shelf hero 的 `.planted-glow` 可复用，不要全屏粒子；
- 动画时长 1.2–1.5 秒；
- `animation-fill-mode: both`；
- 动画结束后移除 `just-planted` class 或保持静态 final state；
- `@media (prefers-reduced-motion: reduce)` 下直接显示最终状态。

夜记翻面：
- 不建议第一版用复杂 3D flip；
- 建议同一 modal 内两个 panel crossfade；
- panel 高度允许内容撑开，由当前 `overflow:auto` 兜底；
- seed modal 不显示翻面入口。

### 6. 素材需求

不需要新素材。

可完全由代码完成：
- 最新动态唱片生长光；
- “今晚新种下”标签状态；
- “今晚的 {plant}，已经种下。”文本；
- bloom modal 正反面切换；
- 夜记背面排版。

可选但不推荐第一版加入：
- 1 个透明背景嫩芽 SVG，未来如果需要更明确“开花”符号再补。

### 7. 风险清单

| 风险 | 当前情况 | 保底方案 |
| --- | --- | --- |
| 重复进入 shelf | `goTo('shelf')` 会重复调用归档 | 用 `finalizePlanting()` 做幂等，已有同 key 记录不刷新 `plantedAt`。 |
| 重复归档 | 当前通过 archive key 去重，但会刷新 `createdAt` | 保留首次 `plantedAt`，只更新必要字段。 |
| 用户跳过完整试听 | skip-end 目前只是推进到 85 秒，仍走时间线结束 | 如果未来有直接完成按钮，也必须调用同一个 `finalizePlanting()`。 |
| 老记录没有 diary | 当前所有旧 snapshot 都没有 | modal 背面用 `createdAt / matchReason / note` 兜底，不显示空字段。 |
| localStorage 迁移 | 当前 schema 无 diaryEntry | 只做读取兜底，不写迁移脚本。 |
| 动态唱片与 seed modal 混淆 | 当前共用 bloom modal | 用 `record.isSeed` 分流，seed 不显示夜记背面。 |
| 翻面后音频按钮状态 | seed 有播放按钮，动态没有 | seed modal 保持现状；动态 modal 入口替代或隐藏播放按钮。 |
| 手机端空间不足 | bloom modal 已 `max-height:82%; overflow:auto` | 夜记只放短内容，不放完整聊天。 |
| prefers-reduced-motion | 已有全局降级 | 新动画必须在 reduced motion 下直接进入最终状态。 |
| 动效失败降级 | 动画不应参与业务逻辑 | 种下状态由数据决定，动画只是 class。 |
| 误改夜渡文案 | 当前夜渡主路径已稳定 | 不改聊天 copy，只保存已有用户输入与状态。 |
| seed preview 被影响 | seed preview 在 `bindBloomCards()` 独立管理 | 不改 `canPlaySeedPreview()` 和 `SeedAudioFiles`。 |

### 8. 唯一推荐实施范围

只推荐一个最小 V2 范围：

> 完成动态唱片的“听完即开花 + 今晚新种下 + bloom modal 夜记背面”，并把用户一句话或状态摘要保存进当前唱片 snapshot。

不建议本轮扩展：
- 七夜记忆树；
- 花园天气；
- 分享明信片；
- 其他精灵；
- 商业化页面；
- 农场成长系统；
- 复杂素材动效。

这个范围最符合当前稳定版本：它强化夜渡主路径的完成感和留存感，同时不碰 QQ 音乐代理、不碰主聊天文案、不重构 UI、不影响 seed preview。

