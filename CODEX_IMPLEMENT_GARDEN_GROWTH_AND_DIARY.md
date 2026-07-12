请先阅读项目根目录中的：

- AGENTS.md（如果存在）
- RECORD_COPY_APPROVED.md
- GARDEN_GROWTH_AND_DIARY_APPROVED.md
- GARDEN_GROWTH_AND_DIARY_AUDIT.md
- 当前最新 app.js
- index.html
- style.css

当前稳定版本已经由我人工验收。现在只实施：

「听完即开花 + 今晚新种下 + 夜记翻面」

`GARDEN_GROWTH_AND_DIARY_APPROVED.md` 是本轮唯一产品与文案依据。

## 绝对约束

- 不得自行改写、润色、缩写或新增批准文案。
- 不得修改 QQ 音乐代理、密钥处理或 API 路由。
- 不得修改夜渡核心聊天文案与七屏黄金路径。
- 不得改动 90 秒 A/B 面音频时间线。
- 不得改动 SeedRecords 文案、SeedAudioFiles 和四张 45 秒试听母带。
- 不得让 seed 进入 currentRecord 或用户历史。
- 不得新增图片、大型动画库、框架或依赖。
- 不得实现七夜树、花园天气、明信片、其他精灵或农场玩法。
- 不得自动 commit、push 或部署。
- 若代码现状与批准文件无法安全对应，先停止并报告，不得猜测。

如当前环境确实存在 `design-taste-frontend` Skill，可在实施 UI 与动效时使用；不存在则不要声称调用，严格遵循批准文件中的动效规范。

## 阶段 0：实施前检查

先检查并报告：
1. 当前 git status；
2. 本轮预计修改的文件和函数；
3. diary textarea 是否已有 maxlength；
4. 当前 diarySave / diarySkip / diaryRec 的真实行为；
5. 当前 archive key 与重复归档逻辑；
6. 当前动态唱片 bloom modal 与 seed modal 的分流；
7. 当前可复用的 reduced-motion 规则。

确认后继续实施，不要停在计划阶段。

## 阶段 1：真实保存日记输入

新增最小状态：
```js
state.pendingDiaryEntry
state.playbackCompleted
state.justPlantedRecordKey
```

实现：
1. diarySave 点击时真实读取 `ui.diaryTextarea.value`；
2. trim 并压缩连续空白；
3. 保存 `{ userLine, mood, energy, goal, source }` 到 pendingDiaryEntry；
4. 非空时 source 为 `user`；
5. 空值或 diarySkip 时 source 为 `generated`；
6. 不保存 tension；
7. 不保存完整聊天 DOM；
8. 不把录音 UI 状态当作 userLine；
9. textarea 若无 maxlength，增加 120；
10. resetChatFlow 时清空本轮 pendingDiaryEntry 与 textarea。

不要实现录音、语音转写或浏览器权限流程。

## 阶段 2：扩展 snapshot，保持向后兼容

在 `normalizeRecordSnapshot()` 或最合适的单一归一化位置，允许保存并读取：

```js
diaryEntry
plantedAt
```

要求：
- 老记录缺字段时不报错；
- 不把默认空对象误显示为用户日记；
- `createdAt` 继续保留；
- `plantedAt` 第一次写入后不得刷新；
- 不新增 growthStage / isPlanted / plantVisualKey；
- 不修改 seed snapshot 逻辑。

## 阶段 3：实现幂等 finalizePlanting()

新增：

```js
finalizePlanting({ reason })
```

核心要求：
1. 只有官方完成路径才允许种下；
2. `onPlaybackEnd()` 设置 `state.playbackCompleted = true`；
3. 随后调用 `finalizePlanting({ reason: "playback-ended" })`；
4. 保存最终 snapshot 后再进入 shelf；
5. `goTo("shelf")` 不再无条件把默认 currentRecord 归档；
6. 同 archive key 已存在时保留首次 plantedAt，不制造重复记录；
7. 设置 `state.justPlantedRecordKey` 供当前会话动效使用；
8. 中途退出 playback 时不归档；
9. skip-b / skip-end 仍通过原时间线最终进入 onPlaybackEnd；
10. debug 强制归档必须显式 reason，不得影响生产路径。

请特别检查原 `archiveCurrentRecord()` 的调用点，避免双重归档。

## 阶段 4：唱片架“今晚新种下”

逐字使用：

```text
今晚新种下
```

```text
今晚的{plant}，已经种下。
```

```text
花园种子
```

```text
夜渡替新来的夜晚，先留了几颗种子。
```

要求：
- `{plant}` 从最终保存 snapshot 读取；
- 只标记最新动态唱片；
- seed 分区身份保持不变；
- 刷新后显示已归档唱片，但不重复 just-planted 动效；
- 不重构 shelf 页面。

## 阶段 5：一次性生长动效

给当前会话刚种下的动态唱片增加 one-shot class，例如：

```css
.just-planted
```

要求：
- 1.2–1.5 秒；
- opacity / translateY / scale / blur；
- 可复用 `.planted-glow`；
- 不循环、不弹跳、不抖动、不使用爆炸粒子；
- 不添加图片；
- 动画失败不影响业务；
- 动画结束后清理 class 或进入稳定最终状态；
- `prefers-reduced-motion: reduce` 直接显示最终状态；
- 只由 `state.justPlantedRecordKey` 触发；
- 页面刷新、重复进入 shelf、打开历史唱片均不触发。

## 阶段 6：Bloom Modal 夜记背面

仅对：

```js
record.isSeed !== true
```

显示夜记入口。

固定文案逐字使用：
- `翻到这一夜`
- `回到花语`
- `你留下的话`
- `这一夜的心绪`
- `夜渡侧记`

实现要求：
1. 同一 modal 中 front / diary 两个 panel；
2. 使用 0.35–0.6 秒 opacity + translateY 淡入淡出；
3. 不使用复杂 3D flip；
4. modal 每次打开默认 front；
5. 关闭后重置 front；
6. 切换 view 不修改 activeBloomRecord；
7. dynamic record：
   - 日期优先 plantedAt，回退 createdAt；
   - 标题使用 record.title；
   - userLine 非空时显示原话和“你留下的话”；
   - userLine 为空时显示 matchReason 和“这一夜的心绪”；
   - note 显示在“夜渡侧记”下；
8. seed record：
   - 不显示夜记入口；
   - 保持现有详情与独立试听；
9. 空字段隐藏，不显示 undefined；
10. 不展示 tension 或完整聊天记录；
11. 保持现有 max-height / overflow；
12. 360px 手机无横向溢出。

## 阶段 7：回归与调试

可新增只读调试函数：
```js
SonicGroveDebug.getPendingDiaryEntry()
SonicGroveDebug.getLatestPlantedRecord()
SonicGroveDebug.getPlantingState()
```

执行：
```powershell
node --check .\app.js
```

本地启动：
```powershell
npx.cmd wrangler pages dev . --compatibility-date=2026-07-09 --port 8788
```

必须验证：

A. 输入一句话保存，最终夜记背面逐字显示并在刷新后保留。  
B. 跳过日记时，背面显示 matchReason，标签为“这一夜的心绪”。  
C. playback 中途退出，不新增 shelf 记录。  
D. 重复进入 shelf，不刷新 plantedAt，不重复动效，不新增重复唱片。  
E. 四张 seed 无夜记入口，试听正常，currentRecord 与 localStorage 不被修改。  
F. 老记录缺 diaryEntry / plantedAt 时正常降级。  
G. 360px 无横向溢出，reduced motion 下无强制动画。

## 最终输出格式

完成后只输出：
1. 修改文件；
2. 新增 / 修改函数；
3. diaryEntry 最终 schema；
4. finalizePlanting 的触发与幂等逻辑；
5. localStorage 向后兼容方式；
6. dynamic / seed modal 如何分流；
7. 动效如何保证只执行一次；
8. node 检查结果；
9. 本地验收结果；
10. 仍需我人工检查的项目；
11. 明确确认：
   - 未改批准文案；
   - 未改 QQ 音乐代理；
   - 未改 90 秒时间线；
   - 未改 seed 音频；
   - 未新增图片或大型依赖；
   - 未自动 commit / push / deploy。

完成后停止，不要继续实现七夜树、天气、明信片、其他精灵或商业化功能。
