# GARDEN_GROWTH_AND_DIARY_APPROVED

## Sonic Grove / 声息花园 ·「听完即开花 + 夜记翻面」批准规范

> 状态：APPROVED FOR IMPLEMENTATION  
> 本文件是本轮 V2 优化的唯一产品与文案依据。  
> Codex 不得自行改写文案、扩大功能范围或重构现有夜渡主路径。

## 1. 本轮唯一实施范围

只实现：
1. 保存用户在日记 textarea 中留下的一句话；
2. 保存当晚最小状态快照；
3. 用幂等的 `finalizePlanting()` 完成本次唱片归档；
4. 播放完成后进入唱片架，显示“今晚新种下”；
5. 最新动态唱片执行一次克制的生长动效；
6. 点击动态唱片后，可在花语正面与夜记背面之间切换；
7. 四张 seed records 继续保持独立花语试听，不出现夜记背面。

本轮不实现：
- 七夜记忆树；
- 花园天气；
- 分享明信片；
- 其他精灵；
- 浇水、金币、数值、任务；
- 复杂成长阶段；
- 新图片或大型动画库；
- 录音转写、语音日记或完整聊天记录保存。

## 2. 数据规范

### 2.1 diaryEntry

```js
diaryEntry: {
  userLine: "",
  mood: "",
  energy: "",
  goal: "",
  source: "user" | "generated"
}
```

规则：
- `userLine` 来自 `#diary-textarea`；
- 保存时 trim，并压缩连续空白；
- 输入非空时 `source: "user"`；
- 跳过或输入为空时 `source: "generated"`；
- 保存当前 `mood / energy / goal`；
- 不保存 tension 数值；
- 不保存完整聊天 DOM；
- 不保存录音按钮的 UI 状态；
- 不把 `matchReason` 冒充为用户原话；
- textarea 若无 `maxlength`，增加 `maxlength="120"`；已有则保留。

### 2.2 plantedAt

```js
plantedAt: ISOString
```

规则：
- 第一次完成种植时写入；
- 同一 archive key 重复进入 shelf 时不得刷新；
- 老记录没有 `plantedAt` 时，日期回退到 `createdAt`；
- 不新增 `growthStage`、`isPlanted` 或数值成长字段。

### 2.3 临时 UI 状态

```js
state.justPlantedRecordKey
state.pendingDiaryEntry
state.playbackCompleted
```

这些字段不进入 localStorage。

## 3. 种植完成机制

新增幂等函数：

```js
finalizePlanting({ reason })
```

职责：
1. 读取当前 `currentRecord`；
2. 合并 `diaryEntry`；
3. 保留已有 `createdAt / plantedAt`；
4. 第一次种植时写入 `plantedAt`；
5. 按现有 archive key 合并保存，不制造重复记录；
6. 设置 `state.justPlantedRecordKey`，只用于当前会话一次动效；
7. 返回最终 snapshot。

触发原则：
- 语义触发点是 `onPlaybackEnd()`；
- `onPlaybackEnd()` 设置 `state.playbackCompleted = true` 后调用 `finalizePlanting({ reason: "playback-ended" })`；
- `goTo("shelf")` 只负责渲染，不能因普通页面跳转把默认唱片误种下；
- 现有收尾入口最终仍走 `onPlaybackEnd()`，不得额外重复归档；
- debug 归档必须显式 reason；
- 中途退出 playback 时不种下、不归档。

## 4. 日记保存行为

### 4.1 点击“记下”
必须真实读取 `ui.diaryTextarea.value`，保存到 `state.pendingDiaryEntry`，不得只改变提示文字或 `diaryResponded`。

### 4.2 点击“跳过”
保存：

```js
{
  userLine: "",
  mood,
  energy,
  goal,
  source: "generated"
}
```

### 4.3 重置流程
重置时清空：
- `state.pendingDiaryEntry`
- textarea 内容
- `state.playbackCompleted`
- `state.justPlantedRecordKey`

不得删除已归档历史夜记。

### 4.4 录音按钮
本轮不实现录音保存或语音转写。
- 不得把录音 UI 状态当作真实 `userLine`；
- 不安装语音库；
- 不扩大到浏览器录音权限流程。

## 5. 唱片架体验

固定文案：

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

其中 `{plant}` 只从最终保存 snapshot 的 `plant` 字段读取。

## 6. 动效规范

只对当前会话刚完成的动态唱片执行一次，时长 1.2–1.5 秒。

允许：
- opacity
- translateY 4–8px
- scale 0.94 → 1
- 轻微 blur → 0
- 现有 `.planted-glow`
- 伪元素柔光 / 花影

禁止：
- 弹跳
- 抖动
- 爆炸粒子
- 循环发光
- 游戏式奖励
- 全屏遮挡
- 新图片依赖
- 大型动画库

动效失败不能影响归档与显示。  
`prefers-reduced-motion: reduce` 下直接显示最终状态。

## 7. Bloom Modal：花语正面 / 夜记背面

### 7.1 分流

动态唱片：

```js
record.isSeed !== true
```

支持花语正面与夜记背面。

Seed records：

```js
record.isSeed === true
```

继续显示花语详情与独立 45 秒试听，不显示夜记背面，不写入 `currentRecord`。

### 7.2 切换方式
使用同一 modal 内两个 panel 的淡入淡出切换，不做复杂 3D 翻转。

要求：
- opacity + translateY；
- 0.35–0.6 秒；
- 打开 modal 总是回到 front；
- 关闭 modal 重置 front；
- 切换 view 不修改 `activeBloomRecord`；
- 保持 `overflow: auto`；
- 360px 手机宽度不溢出。

### 7.3 固定 UI 文案

```text
翻到这一夜
```

```text
回到花语
```

```text
你留下的话
```

```text
这一夜的心绪
```

```text
夜渡侧记
```

### 7.4 夜记背面字段
按顺序显示：
1. 日期：优先 `plantedAt`，回退 `createdAt`；
2. 唱片标题；
3. 用户一句话或状态摘要；
4. 夜渡侧记。

规则：
- `diaryEntry.userLine` 非空：显示原话，标签“你留下的话”；
- `userLine` 为空：显示 `record.matchReason`，标签“这一夜的心绪”；
- 夜渡侧记使用 `record.note`；
- 不显示 tension；
- 不显示完整聊天记录；
- 不生成新的未经批准文案；
- 老记录缺 diaryEntry 时按 matchReason / note 降级；
- 空字段隐藏，不显示 `undefined` 或空引号。

## 8. 兼容与安全

- localStorage 只做向后兼容新增字段；
- seed preview、SeedAudioFiles 与 45 秒母带保持不动；
- 90 秒 playback 时间线保持不动；
- QQ 音乐代理保持不动；
- currentRecord 仍是当前动态唱片唯一真相源；
- 重复进入 shelf 不刷新首次 plantedAt；
- 页面刷新后，已归档夜记仍可查看；
- 历史记录缺新字段时正常降级；
- 不自动 commit、push 或部署。

## 9. 验收标准

1. textarea 输入一句话并保存，夜记背面逐字显示；
2. 跳过日记时，夜记背面使用 matchReason，不冒充用户原话；
3. 播放未完成时退出，不生成归档；
4. 播放完成时只归档一次；
5. 重复进入 shelf，不刷新 plantedAt；
6. 最新动态唱片出现“今晚新种下”；
7. 提示显示正确植物名；
8. 生长动效只执行一次；
9. 刷新页面后不重复动效；
10. 动态唱片可切换花语正面与夜记背面；
11. seed 唱片不出现夜记入口；
12. seed 独立试听不受影响；
13. 旧唱片缺 diaryEntry 时仍能打开夜记背面；
14. 360px 手机无横向溢出；
15. reduced motion 下无强制动画；
16. `node --check app.js` 通过。
