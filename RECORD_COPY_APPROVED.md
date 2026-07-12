# RECORD_COPY_APPROVED

## Sonic Grove / 声息花园 · 夜渡线终版文案与数据规范

> **状态：APPROVED**  
> 本文件是夜渡线唱片文案、匹配理由与四张花园种子唱片的唯一批准来源。  
> Codex 只允许按本文件精确落地，不得自行润色、补写、删改、扩写或替换任何文案。  
> 若代码现状与本文件冲突，以本文件为准；若字段或音频文件无法确认，应停止并报告，不得猜测。

---

# 1. 统一文字审美

## 1.1 核心气质

参考汪曾祺文字中的清淡、自然、日常质感，以及张爱玲文字中的冷静、准确与微妙锋芒；只吸收语言特征，不模仿具体句式、段落或代表性表达。

文字应当：

- 短、稳、有留白；
- 有植物、夜色、声音与身体感，但不堆砌意象；
- 像一个真正懂得夜晚的人在说话；
- 文学感来自准确措辞、节奏与观察，而不是华丽形容词；
- 克制地陪伴用户，不诊断、不教育、不做虚假疗愈承诺。

避免：

- 鸡汤、口号以及“你值得”“一切都会好起来”式模板；
- 过度使用“轻轻、慢慢、接住、守着、放下”；
- 每段都套用“今晚……夜渡……”的固定句式；
- 虚构系统已经分析歌曲歌词、编曲、情绪或疗效；
- 在产品页面使用“处方、治疗、焦虑指数、睡眠诊断”等医疗化表达。

## 1.2 字段长度与功能

- **唱片标题**：6–12 个汉字，像唱片名，不像一句劝慰。
- **花语**：6–14 个汉字，克制、可记忆，不承诺治愈。
- **A/B 面**：每面 2–4 个汉字，体现声音旅程。
- **侧记**：约 45–75 字，从植物或夜晚的特征落到用户当晚状态。
- **匹配理由**：解释“为什么此刻适合”，不虚构歌曲内容分析。

---

# 2. 数据与试听身份

## 2.1 三类唱片

### dynamic

用户本次聊天后生成的动态唱片。

```js
source: "dynamic"
isSeed: false
```

### fallback / preset-fallback

真实 API 不可用或搜索结果低于阈值时使用的本地稳定唱片。

```js
source: "fallback"
// 或
source: "preset-fallback"
isSeed: false
```

### seed

最终唱片架中的四张固定花园种子，只服务于末页展示和独立试听，不属于用户当晚的历史唱片。

```js
source: "seed"
isSeed: true
```

## 2.2 试听标签

有对应本地处理母带：

```text
花语试听
```

动态匹配歌曲没有对应本地处理母带：

```text
夜渡声景试听
```

不得让用户误以为正在播放动态匹配歌曲的低刺激处理版。

---

# 3. 夜渡匹配理由生成机制

## 3.1 生成规则

不为 64 种排列组合手写 64 段完整文案。

- `mood`：决定核心困扰、植物与基础文案包。
- `energy`：补充身体状态并影响声音强度。
- `goal`：决定匹配理由结尾与 B 面方向。
- `tension`：只影响搜索权重与低刺激程度，不直接显示数值。

推荐结构：

```text
【Q1 状态句】，【可选 Q2 身体句】。夜渡想【Q3 声音方向】。
```

规则：

- Q1 必须出现；
- Q2 通常出现；若与 Q1 语义重复，可省略；
- Q3 必须决定结尾；
- tension 不直接写入页面文案；
- 不随机改写批准文本；
- 组合后只允许做标点衔接，不得同义改写。

## 3.2 Q1 状态句

| 真实选项 | 批准文本 |
|---|---|
| 停不下来的思考 | 今晚脑海里的念头一个接一个 |
| 反复出现的课题 | 有件事在心里来回走了很多遍 |
| 心情很乱说不清 | 心里有些乱，还没找到合适的说法 |
| 心里空落落的 | 今晚心里像空了一小块 |

## 3.3 Q2 身体句

| 真实选项 | 批准文本 |
|---|---|
| 生病难受 | 身体也正忙着照顾自己 |
| 累到发沉 | 身体已经沉下来了 |
| 困但很清醒 | 眼睛困了，脑海里还亮着 |
| 绷得紧紧的 | 身体还像一根没有松开的弦 |

## 3.4 Q3 声音方向

| 真实选项 | 批准文本 |
|---|---|
| 有人陪伴 | 留一首不催你开口的歌，陪你坐一会儿 |
| 平静下来 | 先把声音放低，让今晚多一点空白 |
| 被好好接住 | 选一首有落点的歌，让你不用一直撑着 |
| 什么都不想 | 把声音变得简单一点，让今天到这里为止 |

## 3.5 组合示例

### 停不下来的思考 + 困但很清醒 + 平静下来

> 今晚脑海里的念头一个接一个，眼睛困了，脑海里还亮着。夜渡想先把声音放低，让今晚多一点空白。

### 反复出现的课题 + 绷得紧紧的 + 什么都不想

> 有件事在心里来回走了很多遍，身体还像一根没有松开的弦。夜渡想把声音变得简单一点，让今天到这里为止。

### 心情很乱说不清 + 累到发沉 + 被好好接住

> 心里有些乱，还没找到合适的说法，身体已经沉下来了。夜渡想选一首有落点的歌，让你不用一直撑着。

### 心里空落落的 + 生病难受 + 有人陪伴

> 今晚心里像空了一小块，身体也正忙着照顾自己。夜渡想留一首不催你开口的歌，陪你坐一会儿。

---

# 4. 主演示唱片

## YD-001｜陈粒《光》× 月见草

```yaml
recordNo: No.0006
source: preset-fallback
isSeed: false
song: 光
artist: 陈粒
title: 灯熄以后，光还在
plant: 月见草
flowerWords: 没人看，也会开
sideA: 落地
sideB: 留白
audioKey: anchor_guang_sleep_edit
audioMode: mapped-preview
previewLabel: 花语试听
```

**侧记**

> 月见草是夜里才开的花。没人看，它也开。今天没有被谁看见，可你也好好地活过了一天。

**主演示路径专属匹配理由**

> 你说今晚脑海里的念头一个接一个，眼睛困了，脑海里还亮着。夜渡想先替你留住一束熟悉的光。

**触发修复**

代码中的真实 Q2 选项是：

```text
困但很清醒
```

`DemoPresets.yeduGuang.trigger.energy` 必须同步为相同文本，不得继续使用“困但清醒”。

---

# 5. 夜渡 fallback 唱片终版

> 以下唱片的 `matchReason` 不使用静态通用句，而是由第 3 节批准的组合机制生成。

## YD-002｜莫文蔚《慢慢喜欢你》× 薰衣草

```yaml
recordNo: No.0007
source: fallback
isSeed: false
song: 慢慢喜欢你
artist: 莫文蔚
title: 慢一点，也会抵达
plant: 薰衣草
flowerWords: 等一等，香气会自己回来
sideA: 放慢
sideB: 回温
audioMode: soundscape-preview
previewLabel: 夜渡声景试听
```

**侧记**

> 薰衣草并不是一下子香起来的。它晒过光，也等过风。今晚不必急着好起来，把呼吸放慢一点，香气自会从安静里回来。

## YD-003｜Westlife《The Rose》× 睡莲

```yaml
recordNo: No.0008
source: fallback
isSeed: false
song: The Rose
artist: Westlife
title: 夜里也有花开
plant: 睡莲
flowerWords: 睡吧，水会将你托住
sideA: 下沉
sideB: 托住
audioMode: soundscape-preview
previewLabel: 夜渡声景试听
```

**侧记**

> 睡莲浮在水面，却把根安静地留在深处。今晚不必再用力撑着，水会托住你，直到呼吸慢下来。

## YD-004｜陈粒《小半》× 蓝铃花

```yaml
recordNo: No.0009
source: fallback
isSeed: false
song: 小半
artist: 陈粒
title: 把没说完的，留给夜里
plant: 蓝铃花
flowerWords: 低着头，也在轻轻奏响
sideA: 低语
sideB: 回声
audioMode: soundscape-preview
previewLabel: 夜渡声景试听
```

**侧记**

> 蓝铃花总低着头，风经过时，才有很轻的响声。那些没说完的话，不必今晚就找到答案，先留在这里。

## YD-005｜朴树《平凡之路》× 蒲公英

```yaml
recordNo: No.0010
source: fallback
isSeed: false
song: 平凡之路
artist: 朴树
title: 风来以前，先停一停
plant: 蒲公英
flowerWords: 松开一点，风才会经过
sideA: 停步
sideB: 远风
audioMode: soundscape-preview
previewLabel: 夜渡声景试听
```

**侧记**

> 蒲公英并不急着远行。风没来时，它只是安静地站着。今天先停在这里，剩下的路，等明天有风再走。

## YD-006｜颜人中《晚安》× 洋甘菊

```yaml
recordNo: No.0011
source: fallback
isSeed: false
song: 晚安
artist: 颜人中
title: 今天，到这里就好
plant: 洋甘菊
flowerWords: 慢慢散开，也能安睡
sideA: 松开
sideB: 安睡
audioMode: soundscape-preview
previewLabel: 夜渡声景试听
```

**侧记**

> 洋甘菊的香气一点点散进水里，不争，也不催。今天到这里就好，把肩膀放下来，夜晚会替你收住剩下的事。

## YD-007｜告五人《给你一瓶魔法药水》× 雪松

```yaml
recordNo: No.0012
source: fallback
isSeed: false
song: 给你一瓶魔法药水
artist: 告五人
title: 风停在雪松以外
plant: 雪松
flowerWords: 安静站着，也是一种陪伴
sideA: 回暖
sideB: 灯下
audioMode: soundscape-preview
previewLabel: 夜渡声景试听
```

**侧记**

> 雪松在冷夜里不急着低头，只把枝叶撑开，让风从身旁绕过去。你不用一直清醒，先在它的影子里坐一会儿。

## YD-008｜莫文蔚《忽然之间》× 白茉莉

```yaml
recordNo: No.0013
source: fallback
isSeed: false
song: 忽然之间
artist: 莫文蔚
title: 忽然之间，夜安静了
plant: 白茉莉
flowerWords: 轻轻的，也足够
sideA: 安静
sideB: 微光
audioMode: soundscape-preview
previewLabel: 夜渡声景试听
```

**侧记**

> 白茉莉不需要很亮的月光，一点夜风，就够它把香气送出去。你也不用证明很多，今晚这样，已经足够。

**触发范围**

保留为自主输入精确命中或明确匹配时使用，不强行加入主要自动 fallback 路径。

---

# 6. 四张花园种子唱片终版

## 6.1 统一身份与交互

最终页分为：

```text
今晚新种下
```

用于本次动态 `currentRecord`。

以及：

```text
花园种子
```

辅助说明：

> 夜渡替新来的夜晚，先留了几颗种子。

每张 seed：

- 使用独立 `audioKey`；
- 播放独立 45 秒成品试听母带；
- 使用 `activeBloomRecord`；
- 不调用 `setCurrentRecord()`；
- 不调用 `archiveCurrentRecord()`；
- 不写入用户当晚的 localStorage；
- 不进入完整 90 秒 playback；
- 不叠加雨声、粉噪、落针或《光》的默认轨道。

## SEED-002｜mehro《perfume》× 薰衣草

```yaml
recordNo: No.0002
source: seed
isSeed: true
song: perfume
artist: mehro
title: 香气走得很慢
plant: 薰衣草
flowerWords: 等一等，香气会自己回来
sideA: 近闻
sideB: 余香
audioKey: seed_perfume_sleep_edit
audioMode: seed-preview
previewLabel: 花语试听
expectedFileName: assets/seed_perfume_sleep_edit.mp3
```

**侧记**

> 薰衣草晒过白日的光，到了夜里，才把香气一点点还回来。有些事情也是这样，离远一些，反而在安静处显出轮廓。

## SEED-003｜鸦青《枕旧书》× 睡莲

```yaml
recordNo: No.0003
source: seed
isSeed: true
song: 枕旧书
artist: 鸦青
title: 旧书合上以后
plant: 睡莲
flowerWords: 睡吧，水会将你托住
sideA: 合页
sideB: 浮梦
audioKey: seed_zhenjiushu_sleep_edit
audioMode: seed-preview
previewLabel: 花语试听
expectedFileName: assets/seed_zhenjiushu_sleep_edit.mp3
```

**侧记**

> 旧书翻到最后，纸页会自己安静下来。睡莲浮在水面，不问水底藏了什么。今晚把没读完的留在枕边，明天再翻。

## SEED-004｜SEVENTEEN《DREAM》× 蓝铃花

```yaml
recordNo: No.0004
source: seed
isSeed: true
song: DREAM
artist: SEVENTEEN
title: 梦在低处轻响
plant: 蓝铃花
flowerWords: 低着头，也在轻轻奏响
sideA: 微响
sideB: 入梦
audioKey: seed_dream_sleep_edit
audioMode: seed-preview
previewLabel: 花语试听
expectedFileName: assets/seed_dream_sleep_edit.mp3
```

**侧记**

> 蓝铃花总低着头，风一来，整片花就有了很轻的声音。梦也未必要从高处开始，闭上眼，它会从耳边一点点长出来。

## SEED-005｜米津玄师《春雷》× 蒲公英

```yaml
recordNo: No.0005
source: seed
isSeed: true
song: 春雷
artist: 米津玄师
title: 雷声过后，风会来
plant: 蒲公英
flowerWords: 松开一点，风才会经过
sideA: 余响
sideB: 远风
audioKey: seed_chunlei_sleep_edit
audioMode: seed-preview
previewLabel: 花语试听
expectedFileName: assets/seed_chunlei_sleep_edit.mp3
```

**侧记**

> 蒲公英并不怕春雷。响声过去，它只等一阵风，把自己交给更远的地方。有些事可以松开一点，不必替明天攥得太紧。

---

# 7. Seed Preview 播放规范

## 7.1 母带

四条母带已经由用户完成处理。

应用层只播放对应单一成品文件，不再实时叠加：

- `rain_loop`
- `pink_noise_loop`
- `falling_needle`
- `anchor_guang_sleep_edit`
- 其他 BGM 或环境轨

## 7.2 播放行为

- 用户点击后才加载并播放；
- 页面初始不同时预加载四条完整音频；
- 任意时刻只允许一条 seed preview 播放；
- 打开另一张唱片前停止并归零上一条；
- 关闭 bloom modal 时停止并归零；
- 播放结束后按钮恢复初始状态；
- 加载时显示克制的 loading 状态；
- 文件缺失或解码失败时，按钮不得进入假播放状态；
- 错误只写入 console，不使用阻断式 alert；
- 音量控制遵循现有全局音量，但不改变 90 秒 playback；
- 不自动播放。

## 7.3 音频文件映射

`audioKey` 是稳定的数据字段，文件名由 `Sound.files` 或独立 `SeedAudioFiles` 映射。

即使为了网页优化生成 `_web.mp3`，seed record 中的 `audioKey` 也保持不变。

若原文件已经足够小，可直接映射原文件，不生成 `_web` 版本。

---

# 8. Codex 禁止事项

Codex 不得：

- 改写本文件中的任何文案；
- 自动新增第五张 seed；
- 修改四首 seed 的选曲；
- 把 seed 写入 currentRecord；
- 把 seed 保存为用户当晚历史；
- 让四张 seed 统一播放《光》；
- 在成品母带上再次叠加环境音；
- 直接播放 QQ 音乐原曲；
- 大改页面结构或夜渡聊天流程；
- 新增大型音频库或框架；
- 未经检查直接覆盖用户的原始音频母带；
- 自动提交、推送或部署代码。
