# 夜渡匹配逻辑 + 四张种子唱片实现盘点

审计范围：当前本地仓库中的 `app.js` 与 `index.html`。  
执行边界：本文件只做盘点和最小建议；未修改 `app.js`、`index.html`、`style.css`、音频文件或任何功能代码。

## 第一部分：夜渡聊天输入与匹配逻辑

### 1. Q1 / Q2 / Q3 当前真实选项

来源：`app.js:1078-1101`、`app.js:1186-1205`。  
页面显示文字与代码内部 `value` 相同；`renderQuestionHTML()` 会把选项同时写入按钮文本和 `data-value`，见 `app.js:1109-1115`。

| 题号 | 页面问题 | 所属字段 | 页面显示文字 | 内部 value | optionReplies 中夜渡回复 |
|---|---|---|---|---|---|
| Q1 | 今晚，脑子里最吵的是 | mood | 停不下来的思考 | 停不下来的思考 | 我听见了，和我一起到灯光下，你不用追上每个念头。 |
| Q1 | 今晚，脑子里最吵的是 | mood | 反复出现的课题 | 反复出现的课题 | 把声音调低一些。今晚先不解它，搁到灯下放一会儿。 |
| Q1 | 今晚，脑子里最吵的是 | mood | 心情很乱说不清 | 心情很乱说不清 | 说不清也行，乱成一团的线，可以先放在我这里。 |
| Q1 | 今晚，脑子里最吵的是 | mood | 心里空落落的 | 心里空落落的 | 夜晚很长，空着的地方，我先替你点一盏小灯。 |
| Q2 | 身体现在更像 | energy | 生病难受 | 生病难受 | 身体已经很努力了。今晚我们不催它，只陪它慢一点。 |
| Q2 | 身体现在更像 | energy | 累到发沉 | 累到发沉 | 沉一点也没关系，地面会接住你。 |
| Q2 | 身体现在更像 | energy | 困但很清醒 | 困但很清醒 | 眼睛困了，脑子还亮着。我们把那盏灯慢慢调暗。 |
| Q2 | 身体现在更像 | energy | 绷得紧紧的 | 绷得紧紧的 | 像一根拉太久的弦。先不用松开，我陪你一点点放轻。 |
| Q3 | 今天的末尾，你真正期待的是什么 | goal | 有人陪伴 | 有人陪伴 | 我在的，整夜都在。你睡你的，我替你看着夜走。 |
| Q3 | 今天的末尾，你真正期待的是什么 | goal | 平静下来 | 平静下来 | 好，我们把今天的响声，一点点压低到听不见。 |
| Q3 | 今天的末尾，你真正期待的是什么 | goal | 被好好接住 | 被好好接住 | 放心往后倒，这一张唱片，就是用来接住你的。 |
| Q3 | 今天的末尾，你真正期待的是什么 | goal | 什么都不想 | 什么都不想 | 那就什么都不想，把今天交给我，我替你收着。 |

### 2. tension 当前实现

来源：`app.js:13-31`、`app.js:175-181`、`app.js:1103-1141`、`app.js:774-782`、`app.js:818-841`、`app.js:1271-1314`。

| 项目 | 当前代码事实 |
|---|---|
| 最小值 | `0`，来自 slider `min="0"`，见 `app.js:1121-1122` |
| 最大值 | `100`，来自 slider `max="100"`，见 `app.js:1121-1122` |
| 默认值 | `72`，来自 `mockRecord.mood.tension`，见 `app.js:25-29`；初始化到 `state.answers.tension`，见 `app.js:175-181` |
| 是否必须操作 | 必须。`refreshChatState()` 要求 `state.chatFlow.tensionTouched` 为 true 才能继续，见 `app.js:1271-1276` |
| UI 回复阈值 | `<35`、`>70`、中间档，见 `replyForTension()`，`app.js:1103-1107` |
| Demo Preset 阈值 | `>=65` 且用户状态文本命中“停不下来 / 想太多 / 清醒 / 平静”时加 1 分，见 `app.js:774-782` |
| fallback 阈值 | `>78` 时强制优先 `fallbackSongs[5]`，即《晚安》/ 洋甘菊，见 `app.js:818-826` |
| 旧搜索词阈值 | `buildSearchQuery()` 中 `>70` 会加入“低刺激”，见 `app.js:829-841`；但当前主链路使用 `buildSearchPlan()`，该函数在当前匹配链路中未确认被调用 |

tension 当前影响：

- 流程门槛：不触发 slider `change`，就无法出现最终继续按钮，见 `refreshChatState()` 的 `tensionReady`。
- 夜渡即时回复：根据 `<35`、`>70` 和中间值返回不同一句回复。
- `yeduGuang` 命中概率：`>=65` 时可为 Demo Preset 加 1 分。
- fallback 选择：`>78` 会进入紧绷类 fallback，即《晚安》/ 洋甘菊。
- 动态唱片生成：`makeRecordFromSong()` 本身不直接读取 tension；它使用传入的 `copyBase`，所以 tension 是通过 `buildSearchPlan()` / `chooseFallbackByMood()` 间接影响唱片文案与歌曲目标。

### 3. 当前实际组合

来源：`app.js:1099-1101`。

| 项目 | 数量 |
|---|---:|
| Q1 mood 选项数 | 4 |
| Q2 energy 选项数 | 4 |
| Q3 goal 选项数 | 4 |
| 理论排列组合总数 | 64 |

流程可达性：

- 只看 Q1/Q2/Q3，未发现无法进入下一步的选项组合。
- 实际流程还要求用户操作 tension slider。若用户不触发 `change`，`state.chatFlow.tensionTouched` 保持 false，流程不能继续，见 `app.js:1271-1276`。
- 未发现 Q1/Q2/Q3 中永远不会写入 `state.answers` 的选项；`onQAnswered()` 会统一写入 `state.answers[group] = value`，见 `app.js:1192-1196`。
- `DemoPresets.yeduGuang.trigger.energy` 中包含“困但清醒”，而当前 Q2 文案是“困但很清醒”。由于 `cleanText()` 只去掉空格、引号等符号，不会去掉“很”，因此这两个字符串不是完全同一表达。它仍可通过 Q1“停不下来的思考”、Q3“平静下来”或 tension 加分命中，但“energy 单项精确命中”存在表达不一致。

### 4. 当前匹配链路

#### 4.1 state.answers 如何写入

- Q1/Q2/Q3：`onQAnswered(group, value)` 写入 `state.answers[group] = value`，见 `app.js:1192-1196`。
- tension：slider `input` 与 `change` 都会写入 `state.answers.tension = Number(slider.value)`，见 `app.js:1127-1133`。
- reset：`resetChatFlow()` 会清空 mood/energy/goal，并把 tension 重置为 `mockRecord.mood.tension`，见 `app.js:1302-1314`。

#### 4.2 buildSearchPlan() 如何读取状态

来源：`app.js:849-864`。

- 自动匹配：`buildSearchPlan('auto')` 调用 `matchDemoPresetByState()`，未命中则调用 `chooseFallbackByMood()`。
- 自主输入：`buildSearchPlan('manual', songTitle, artist)` 调用 `matchDemoPresetByManual(songTitle, artist)`，未命中则调用 `chooseFallbackByMood()`。
- `preferredSong` 来自 preset 的 `preferredSong`，否则来自 fallback 的 `anchorSong`。
- 自动匹配的 query 当前不是宽泛情绪词，而是 `[preferredSong.artist, preferredSong.title]`。例如命中月见草 fallback 时 query 是“陈粒 光”。
- 若 query 为空，兜底为“陈粒 光”。

#### 4.3 chooseFallbackByMood() 如何决定 fallback

来源：`app.js:818-826`。该函数按顺序命中，前面的规则优先级更高。

| 优先级 | 条件 | 返回 fallback |
|---:|---|---|
| 1 | mood/energy/goal 文本含“绷 / 紧 / 反复 / 自责”，或 tension > 78 | `fallbackSongs[5]`：《晚安》/ 颜人中 / 洋甘菊 |
| 2 | 文本含“累 / 生病 / 沉 / 被好好接住” | `fallbackSongs[2]`：The Rose / Westlife / 睡莲 |
| 3 | 文本含“空 / 陪伴 / 低落” | `fallbackSongs[6]`：《给你一瓶魔法药水》/ 告五人 / 雪松 |
| 4 | 文本含“乱 / 说不清 / 听见 / 心事” | `fallbackSongs[3]`：《小半》/ 陈粒 / 蓝铃花 |
| 5 | 文本含“逃 / 压力 / 什么都不想” | `fallbackSongs[4]`：《平凡之路》/ 朴树 / 蒲公英 |
| 6 | 文本含“平静 / 困但很清醒 / 停不下来” | `fallbackSongs[0]`：《光》/ 陈粒 / 月见草 |
| 7 | 都未命中 | `fallbackSongs[1]`：《慢慢喜欢你》/ 莫文蔚 / 薰衣草 |

#### 4.4 DemoPresets.yeduGuang 触发条件

来源：`app.js:143-165`、`app.js:774-805`、`app.js:785-791`。

`DemoPresets.yeduGuang` 数据：

- mood trigger：停不下来的思考 / 想太多 / 脑子停不下来。
- energy trigger：困但清醒 / 很困但睡不着。
- goal trigger：平静下来 / 睡着 / 不再想太多。
- searchQuery：陈粒 光。
- preferredSong：光 / 陈粒。
- localAudio：anchor_guang_sleep_edit。
- record：No.0006 / 灯熄以后，光还在 / 月见草 / 没人看，也会开 / A 面落地 / B 面留白。

自动匹配触发：

- `matchDemoPresetByState()` 统计 mood、energy、goal 三类文本命中数。
- tension >= 65 且文本含“停不下来 / 想太多 / 清醒 / 平静”时额外加 1。
- 总分 >= 2 返回 `yeduGuang`。

自主输入触发：

- 歌曲名精确等于“光”。
- 歌手精确等于“陈粒”。
- 歌曲名 + 歌手归一化后包含“陈粒光”。

#### 4.5 scoreSongForYedu() 如何给 QQ 音乐结果评分

来源：`app.js:915-953`。

| 加分项 | 分值 |
|---|---:|
| 歌名与目标歌名完全一致 | +50 |
| 歌名包含目标歌名 | +24 |
| 目标歌名包含结果歌名 | +12 |
| 歌手与目标歌手完全一致 | +35 |
| 歌手包含目标歌手 | +18 |
| 有 playable / tryPlayable / previewUrl / playUrl | +5 |
| 有 coverUrl | +2 |

选择逻辑：

- `pickBestSong()` 优先在可播放/试听字段存在的结果里筛选；如果没有，则使用全部结果。
- 自动匹配要求 `score >= 28`，否则 fallback。
- 自主输入要求 `score >= 24`，否则 fallback。

#### 4.6 makeRecordFromSong() 如何决定植物、花语、A/B 面和 matchReason

来源：`app.js:867-894`。

- 真实歌曲字段来自 QQ 音乐结果：歌曲名、歌手、封面、songId、songMid、h5Url、previewUrl、playUrl。
- 唱片标题、植物、花语、侧记、A/B 面、suitableMood 来自 `copyBase`，即 preset 或 fallback。
- `matchReason` 来自 `copyBase.matchReason`；如果缺失，统一使用“它的声音足够轻，适合把今晚慢慢放低。”。
- `soundRecipe` 使用 `defaultSoundRecipe`，再覆盖 sideA / sideB；不会根据 QQ 音乐歌曲直接播放原曲。

### 5. 完整映射表与主要组合结果

#### 5.1 Q1 情绪主题

| Q1 | 当前优先情绪主题 | 主要 fallback / preset 影响 |
|---|---|---|
| 停不下来的思考 | 思绪停不下来、睡前脑内噪声 | 可触发 `yeduGuang`；fallback 优先《光》/ 月见草 |
| 反复出现的课题 | 反刍、未解决课题 | fallback 优先《晚安》/ 洋甘菊，因为命中“反复” |
| 心情很乱说不清 | 混乱、难以表达 | fallback 优先《小半》/ 蓝铃花 |
| 心里空落落的 | 空落、孤独、陪伴需求 | fallback 优先《给你一瓶魔法药水》/ 雪松 |

#### 5.2 Q2 声音强度或节奏影响

| Q2 | 当前应影响的声音强度或节奏 | 代码实际影响 |
|---|---|---|
| 生病难受 | 更慢、更轻、身体被托住 | fallback 优先 The Rose / 睡莲 |
| 累到发沉 | 下沉、托住、低能量 | fallback 优先 The Rose / 睡莲 |
| 困但很清醒 | 入睡前但脑子仍亮，适合低刺激落地 | fallback 优先《光》/ 月见草；也可参与 `yeduGuang` tension 加分 |
| 绷得紧紧的 | 高紧绷，需要减压、放松边缘 | fallback 优先《晚安》/ 洋甘菊 |

#### 5.3 Q3 最终声音目标

| Q3 | 当前应影响的最终声音目标 | 代码实际影响 |
|---|---|---|
| 有人陪伴 | 陪伴、温暖、守夜 | fallback 优先《给你一瓶魔法药水》/ 雪松，除非更高优先级命中 |
| 平静下来 | 降噪、落地、安静 | 可触发 `yeduGuang`；fallback 优先《光》/ 月见草 |
| 被好好接住 | 托住、支撑、安全感 | fallback 优先 The Rose / 睡莲 |
| 什么都不想 | 放手、停止思考、逃离压力 | fallback 优先《平凡之路》/ 蒲公英，除非更高优先级命中 |

#### 5.4 主要组合可能命中的 preset / fallback / QQ 搜索词

当前自动匹配的搜索词来自 `buildSearchPlan()`：命中 preset 时为 preset.searchQuery；未命中时为 fallback 的歌手 + 歌名，见 `app.js:849-864`。

| 主要组合特征 | 可能命中 | 自动搜索词 | 说明 |
|---|---|---|---|
| “停不下来的思考” + “平静下来” | `DemoPresets.yeduGuang` | 陈粒 光 | mood 与 goal 两项命中，稳定进入主演示路径 |
| “停不下来的思考” + tension >= 65 | `DemoPresets.yeduGuang` | 陈粒 光 | mood 命中 + tension 加分，稳定进入主演示路径 |
| “困但很清醒” + “平静下来” + tension >= 65 | `DemoPresets.yeduGuang` | 陈粒 光 | goal 命中 + tension 文本含“清醒/平静”加分 |
| 任意组合含“反复”或“绷/紧”，或 tension > 78 | fallbackSongs[5] | 颜人中 晚安 | 该优先级最高，可能覆盖 goal 的其他意图 |
| 任意组合含“生病/累/沉/被好好接住” | fallbackSongs[2] | Westlife The Rose | 第二优先级，可能覆盖“陪伴/什么都不想”等 goal |
| 任意组合含“空/陪伴/低落” | fallbackSongs[6] | 告五人 给你一瓶魔法药水 | 主要覆盖孤独陪伴类 |
| 任意组合含“乱/说不清/听见/心事” | fallbackSongs[3] | 陈粒 小半 | 主要覆盖混乱、未说出口类 |
| 任意组合含“逃/压力/什么都不想” | fallbackSongs[4] | 朴树 平凡之路 | 主要覆盖放手、暂停思考类 |
| 任意组合含“平静/困但很清醒/停不下来”且未命中 preset | fallbackSongs[0] | 陈粒 光 | 会回到月见草《光》 |
| 都未命中 | fallbackSongs[1] | 莫文蔚 慢慢喜欢你 | 当前 12 个真实选项基本都会命中前面规则，因此默认兜底较少出现 |

#### 5.5 不同组合得到完全相同结果的情况

存在，而且是当前实现的主要特征：

- “生病难受”“累到发沉”“被好好接住”都会优先聚合到 The Rose / 睡莲。
- “反复出现的课题”“绷得紧紧的”以及 tension > 78 都会聚合到《晚安》/ 洋甘菊。
- “心里空落落的”“有人陪伴”都会聚合到《给你一瓶魔法药水》/ 雪松。
- “停不下来的思考”“困但很清醒”“平静下来”会聚合到《光》/ 月见草，且满足组合条件时进入 `yeduGuang`。

### 6. 只基于代码事实的问题判断

#### 逻辑清晰的组合

- “停不下来的思考 / 困但很清醒 / 平静下来”到 `yeduGuang` 的主演示路径清晰，且可由自动匹配和自主输入双入口触发。
- “生病难受 / 累到发沉 / 被好好接住”到 The Rose / 睡莲的身体下沉主题清晰。
- “心情很乱说不清”到《小半》/ 蓝铃花的未表达主题清晰。
- “心里空落落的 / 有人陪伴”到《给你一瓶魔法药水》/ 雪松的陪伴主题清晰。

#### 组合逻辑缺失或较弱的地方

- Q2 “困但很清醒”和 `DemoPresets.yeduGuang.trigger.energy` 的“困但清醒”不完全一致；自动 preset 仍可通过其他项触发，但 energy trigger 本身不够严丝合缝。
- Q3 对结果的影响会被 `chooseFallbackByMood()` 的优先级覆盖。例如只要 Q2 是“绷得紧紧的”，就优先《晚安》/ 洋甘菊，Q3 的“有人陪伴/什么都不想”不会主导结果。
- `buildSearchQuery()` 仍保留旧的宽泛搜索词逻辑，但当前主链路未确认使用它；这可能让后续维护者误判“搜索是按情绪词搜索”。
- `matchReason` 大多来自 `copyBase`。fallbackSongs 当前没有 `matchReason` 字段时，会统一落到“它的声音足够轻，适合把今晚慢慢放低。”，无法反向解释具体 Q1/Q2/Q3。

#### 写死或通用 fallback 的地方

- `DemoPresets.yeduGuang` 是明确写死的主演示 preset。
- `fallbackSongs` 是本地样本文案库。
- 自动匹配当前先根据状态选 preset/fallback，再用 QQ 音乐搜索目标歌曲；不是完全由模型实时生成植物与花语。
- `makeRecordFromSong()` 对 fallback 场景使用通用 `matchReason`，当没有 preset.matchReason 时解释力度较弱。

#### matchReason 不能反向解释用户输入的情况

- 除 `yeduGuang.matchReason` 外，fallbackSongs 未见独立 `matchReason` 字段。
- 所以 The Rose、慢慢喜欢你、小半、平凡之路、晚安、给你一瓶魔法药水、忽然之间等 fallback 动态生成唱片时，如果未从别处补充，`matchReason` 会统一为“它的声音足够轻，适合把今晚慢慢放低。”。
- 这句只能解释“低刺激/睡前”，不能解释“生病难受”“心里空落落的”“什么都不想”等具体输入。

## 第二部分：末页四张种子唱片

### 1. 当前四张预设唱片逐张盘点

来源：`index.html:439-449`、`index.html:464-473`、`app.js:1951-2040`。

#### No.0002 perfume — mehro

| 字段 | 当前实现 |
|---|---|
| recordNo | No.0002 |
| 歌曲名 | perfume |
| 歌手 | mehro |
| 植物 | 薰衣草 |
| 花语 | 等一等，香气会自己回来 |
| 封面文件名 | `assets/cover_a_sprig_of_lavender.webp` |
| index.html 位置与 data 属性 | `index.html:439-440`；`data-no="No.0002"`、`data-plant="薰衣草"`、`data-words="等一等，香气会自己回来"`、`data-bgm="perfume——mehro"` |
| 点击后调用函数 | `.series-disc` click listener 调用 `open(no, plant, words, coverSrc, bgm)`，见 `app.js:2030-2039` |
| 弹窗显示字段 | 封面、No.0002、薰衣草、花语、`BGM：perfume——mehro`，见 `app.js:1964-1970` |
| 当前是否有播放按钮 | 有，`#bloom-play-btn`，见 `index.html:471-473` |
| 当前播放音频 | 无。播放逻辑只在 `no === 'No.0006' && Sound.unlocked` 时播放 `Sound.playFile('music')`，见 `app.js:1992-2014` |
| 是否会错误播放《光》或统一音频 | 不会播放《光》；但按钮会切换为暂停态，容易造成“看似播放但无声”的体验问题 |
| 是否经过 currentRecord / normalizeRecordSnapshot() | 否。HTML data 属性直接进入弹窗 |
| 是否保存进 localStorage | 否。静态 seed 不经过 `archiveCurrentRecord()` |
| 缺少完整唱片字段 | `title`、`note`、`sideA`、`sideB`、`matchReason`、`soundRecipe`、`audioKey`、`audioMode`、`isSeed`、`source`、结构化 `anchorSong` |

#### No.0003 枕旧书 — 鸦青

| 字段 | 当前实现 |
|---|---|
| recordNo | No.0003 |
| 歌曲名 | 枕旧书 |
| 歌手 | 鸦青 |
| 植物 | 睡莲 |
| 花语 | 睡吧，水会将你托住 |
| 封面文件名 | `assets/cover_a_water_lily.webp` |
| index.html 位置与 data 属性 | `index.html:442-443`；`data-no="No.0003"`、`data-plant="睡莲"`、`data-words="睡吧，水会将你托住"`、`data-bgm="枕旧书——鸦青"` |
| 点击后调用函数 | `.series-disc` click listener 调用 `open(no, plant, words, coverSrc, bgm)`，见 `app.js:2030-2039` |
| 弹窗显示字段 | 封面、No.0003、睡莲、花语、`BGM：枕旧书——鸦青` |
| 当前是否有播放按钮 | 有 |
| 当前播放音频 | 无，原因同上 |
| 是否会错误播放《光》或统一音频 | 不会播放《光》；按钮仍会进入播放态但无声 |
| 是否经过 currentRecord / normalizeRecordSnapshot() | 否 |
| 是否保存进 localStorage | 否 |
| 缺少完整唱片字段 | `title`、`note`、`sideA`、`sideB`、`matchReason`、`soundRecipe`、`audioKey`、`audioMode`、`isSeed`、`source`、结构化 `anchorSong` |

#### No.0004 DREAM — SEVENTEEN

| 字段 | 当前实现 |
|---|---|
| recordNo | No.0004 |
| 歌曲名 | DREAM |
| 歌手 | SEVENTEEN |
| 植物 | 蓝铃花 |
| 花语 | 低着头，也在轻轻奏响 |
| 封面文件名 | `assets/cover_a_cluster_of_hanging_bluebells.webp` |
| index.html 位置与 data 属性 | `index.html:445-446`；`data-no="No.0004"`、`data-plant="蓝铃花"`、`data-words="低着头，也在轻轻奏响"`、`data-bgm="DREAM——seventeen"` |
| 点击后调用函数 | `.series-disc` click listener 调用 `open(no, plant, words, coverSrc, bgm)`，见 `app.js:2030-2039` |
| 弹窗显示字段 | 封面、No.0004、蓝铃花、花语、`BGM：DREAM——seventeen` |
| 当前是否有播放按钮 | 有 |
| 当前播放音频 | 无，原因同上 |
| 是否会错误播放《光》或统一音频 | 不会播放《光》；按钮仍会进入播放态但无声 |
| 是否经过 currentRecord / normalizeRecordSnapshot() | 否 |
| 是否保存进 localStorage | 否 |
| 缺少完整唱片字段 | `title`、`note`、`sideA`、`sideB`、`matchReason`、`soundRecipe`、`audioKey`、`audioMode`、`isSeed`、`source`、结构化 `anchorSong` |

#### No.0005 春雷 — 米津玄师

| 字段 | 当前实现 |
|---|---|
| recordNo | No.0005 |
| 歌曲名 | 春雷 |
| 歌手 | 米津玄师 |
| 植物 | 蒲公英 |
| 花语 | 松开手，它就会飞翔 |
| 封面文件名 | `assets/cover_a_dandelion_seed_head.webp` |
| index.html 位置与 data 属性 | `index.html:448-449`；`data-no="No.0005"`、`data-plant="蒲公英"`、`data-words="松开手，它就会飞翔"`、`data-bgm="春雷——米津玄师"` |
| 点击后调用函数 | `.series-disc` click listener 调用 `open(no, plant, words, coverSrc, bgm)`，见 `app.js:2030-2039` |
| 弹窗显示字段 | 封面、No.0005、蒲公英、花语、`BGM：春雷——米津玄师` |
| 当前是否有播放按钮 | 有 |
| 当前播放音频 | 无，原因同上 |
| 是否会错误播放《光》或统一音频 | 不会播放《光》；按钮仍会进入播放态但无声 |
| 是否经过 currentRecord / normalizeRecordSnapshot() | 否 |
| 是否保存进 localStorage | 否 |
| 缺少完整唱片字段 | `title`、`note`、`sideA`、`sideB`、`matchReason`、`soundRecipe`、`audioKey`、`audioMode`、`isSeed`、`source`、结构化 `anchorSong` |

### 2. 当前 seed records 与动态唱片的关系

当前最终 shelf 中有两类唱片：

- 当前用户动态唱片：通过 `archiveCurrentRecord()` 保存 snapshot 到 `localStorage`，再由 `renderShelfRecords()` 插入 `.current-record-disc`，见 `app.js:708-744`。
- 静态 seed records：直接写在 `index.html:439-449`，点击时只读 DOM data 属性，不走 `currentRecord`、`normalizeRecordSnapshot()` 或 `localStorage`。

这意味着：

- 静态 seed 不会污染用户当晚的 `currentRecord`。
- 静态 seed 也无法继承完整唱片能力，例如侧记、A/B 面、matchReason、soundRecipe、独立试听。
- 当前 `.series-disc` 选择器会同时绑定静态 seed 和动态 `.current-record-disc`；动态唱片另有 `onclick` 覆盖，见 `app.js:739-742`。

### 3. 现有 90 秒 playback 是否适合复用给 seed records

代码事实：

- 90 秒 playback 基于当前 `currentRecord` 与 `soundRecipe`，当前默认音频为 `anchor_guang_sleep_edit`，见 `defaultSoundRecipe` 和 `Sound.files`，`app.js:274-280`、`app.js:364-392`。
- seed modal 当前独立于 playback 页面，只在弹窗里尝试播放 `No.0006` 的 `music` 音频，见 `app.js:1992-2014`。

判断：

- 直接复用 90 秒 playback 给 seed records 技术上可以做，但需要把 seed 临时变成一个 record snapshot；如果处理不好，会污染用户当晚 `currentRecord` 和唱片架归档。
- 更稳的方向是先为 seed records 做独立 30-60 秒短试听，挂在 bloom modal 内，不进入完整 playback 页面。这样不会改变七屏黄金路径，也不会破坏 currentRecord 单一数据源。

### 4. 为每张 seed 增加独立 audioKey 的最小函数影响

仅作为后续最小实现建议，本轮未修改代码。

最少需要补的点：

1. 建一个结构化 `SeedRecords` 数据源，替代散落在 HTML data 属性里的不完整字段。
2. 在 `Sound.files` 中增加 seed audio key，或先让全部 seed 使用一个明确的 seed preview key。
3. 改 `bindBloomCards()` 的 `open()` 入参或改为传入完整 seed record。
4. 改 `bloom-play-btn` click 逻辑：根据当前打开的 seed record 的 `audioKey` 播放，而不是只判断 `no === 'No.0006'`。
5. 保持 `currentRecord` 不变；seed modal 只读 seed 数据，不调用 `setCurrentRecord()`，不调用 `archiveCurrentRecord()`。

### 5. 如何避免点击 seed 污染 currentRecord

最小原则：

- seed modal 使用局部变量，例如 `activeBloomRecord`，不要复用 `currentRecord`。
- seed 点击只调用 `openSeedRecord(seed)` 或 `openBloomCard(seed)`。
- seed 播放只调用 `playSeedPreview(seed.audioKey)`。
- seed 不触发 `archiveCurrentRecord()`，不写入 `SHELF_RECORDS_KEY`。
- 如果未来允许用户把 seed 收藏到个人唱片架，需要显式加 `source: 'seed'`，并与动态唱片区分。

### 6. 数据结构上如何区分三类 record

建议后续用 `source` 与布尔字段区分：

| 类型 | 判断字段 | 当前来源 |
|---|---|---|
| 当前用户动态唱片 | `source: 'dynamic'` 或无 `isSeed`；由 `currentRecord` / `normalizeRecordSnapshot()` 生成 | QQ 搜索 + preset/fallback copyBase |
| seed record | `isSeed: true`、`source: 'seed'` | 末页四张预设唱片 |
| fallback record | `source: 'fallback'` 或 `source: 'preset-fallback'` | `fallbackSongs`、`DemoPresets.yeduGuang` |

## 第三部分：推荐数据结构

以下是兼容当前结构的最小 seed record schema。该 schema 是结构建议，不包含新花语文案，不要求本轮实现。

```js
{
  recordNo,
  title,
  plant,
  flowerWords,
  note,
  anchorSong,
  coverUrl,
  sideA,
  sideB,
  soundRecipe,
  audioKey,
  audioMode,
  isSeed,
  source
}
```

| 字段 | 当前是否已有 | 当前来源 / 需要从哪里补齐 |
|---|---|---|
| recordNo | 有 | `index.html` 的 `data-no` |
| title | 缺失 | 当前 seed 只有歌曲信息，没有唱片标题；需要人工审定后补入 seed 数据源 |
| plant | 有 | `index.html` 的 `data-plant` |
| flowerWords | 有 | `index.html` 的 `data-words` |
| note | 缺失 | 当前弹窗不显示侧记；需要人工审定后补入 seed 数据源 |
| anchorSong | 部分有 | 当前在 `data-bgm` 中以“歌曲——歌手”字符串存在；建议拆成 `{ title, artist }` |
| coverUrl | 有 | 当前来自每个 button 内的 `<img src>` |
| sideA | 缺失 | 需要人工审定后补入 seed 数据源 |
| sideB | 缺失 | 需要人工审定后补入 seed 数据源 |
| soundRecipe | 缺失 | 如果 seed 要试听，需要补；如果只展示收藏卡，可暂不补 |
| audioKey | 缺失 | 当前 seed 不播放；如增加独立试听，需要与 `Sound.files` 中 key 对齐 |
| audioMode | 缺失 | 建议用于区分 `seed-preview` 与 `sleep-preview` |
| isSeed | 缺失 | 建议补 true，避免被当作用户动态唱片 |
| source | 缺失 | 建议为 `'seed'`；fallback 可用 `'fallback'`，动态唱片可用 `'dynamic'` |

## 结论摘要

1. 夜渡当前主匹配链路是可闭环的：Q1/Q2/Q3/tension 写入状态，`buildSearchPlan()` 选择 preset 或 fallback，再请求 QQ 音乐搜索，最后由 `makeRecordFromSong()` 把真实歌曲信息与本地花语唱片文案合成 `currentRecord`。
2. `yeduGuang` 主演示路径稳定性较高，但 Q2 “困但很清醒”与 trigger “困但清醒”存在轻微表达不一致。
3. 当前 64 种组合没有发现无法继续的 Q 选项，但大量组合会因优先级规则聚合到同一张 fallback 唱片。
4. 除 `yeduGuang` 外，多数 fallback 唱片没有独立 `matchReason`，会使用通用解释，不能充分反向解释用户输入。
5. 末页四张 seed records 目前是静态 HTML 数据，不经过 `currentRecord`，不进 localStorage，不会污染当晚动态唱片。
6. 四张 seed records 目前有播放按钮但没有实际音频播放；按钮会进入播放态，属于后续若要提升完成度时最值得优先处理的小问题。
7. 若要给 seed records 增加试听，建议优先做独立短试听，不直接复用 90 秒 playback，以免影响当前夜渡黄金路径和 currentRecord 一致性。
