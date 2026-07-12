# Sonic Grove 花语唱片文案全量盘点

审查范围：当前仓库 `app.js`、`index.html`、`style.css`、`functions/`、`API_SETUP.md` 中所有可能被用户看到、触发或存入唱片架的唱片文案。  
本文件只盘点现状，不新增候选文案，不替换现有代码。

## 读取结论

- 当前真正进入用户主路径的唱片数据源是 `currentRecord`，由 `setCurrentRecord()` 调用 `normalizeRecordSnapshot()` 归一化后显示到 reveal / playback / shelf。
- `currentRecord` 默认值是 `fallbackSongs[0]`，即陈粒《光》/ 月见草 / “灯熄以后，光还在”。
- `DemoPresets.yeduGuang` 与 `fallbackSongs[0]` 是同一套核心文案，但 `DemoPresets.yeduGuang` 额外带有 `matchReason` 和 `soundRecipe.music = "anchor_guang_sleep_edit"`。
- `index.html` 里仍有一套初始写死的《光》/ 月见草展示文案；正常运行后会被 `applyMockRecord()` 用 `currentRecord` 覆盖。
- shelf 里有 4 张预设种子唱片，只保存编号、植物、花语、BGM、封面；没有唱片标题、侧记、A/B 面。
- `makeRecordFromSong()` 会将 QQ 音乐真实歌曲名/歌手/封面嵌入某个 fallback 文案底座，因此可能出现“真实歌曲 A + fallback 植物文案 B”的动态唱片。

## A. 当前用户真实可能看到的全部唱片

### A1. 夜渡主路径 / 《光》基准唱片

| 字段 | 内容 |
|---|---|
| 编号 | No.0006 |
| 来源文件与大致行号 | `app.js:33-45`；`app.js:143-165`；`index.html:238-279` 初始 DOM |
| 来源变量或函数 | `fallbackSongs[0]`；`DemoPresets.yeduGuang.record`；`currentRecord = fallbackSongs[0]` |
| 是否实际可触发 | 是 |
| 触发路径 | 夜渡自动匹配；夜渡主演示路径；自主输入“光/陈粒/陈粒 光”；API fallback；唱片架归档 |
| 数据类型 | fallback sample / Demo preset / 动态唱片底座 |
| 歌曲名 | 光 |
| 歌手 | 陈粒 |
| 唱片标题 | 灯熄以后，光还在 |
| 植物 | 月见草 |
| 花语 | 没人看，也会开 |
| A 面 | 落地 |
| B 面 | 留白 |
| 侧记 | 月见草是夜里才开的花。没人看，它也开。今天没有被谁看见，可你也好好地活过了一天。 |
| matchReason | `DemoPresets.yeduGuang`: 你说今晚脑子停不下来，夜渡选了一首更适合慢慢落地的歌。`makeRecordFromSong()` 默认：它的声音足够轻，适合把今晚慢慢放低。 |
| coverUrl 或本地封面 | `assets/cover_evening_primrose.webp`；若 QQ 音乐返回真实 `coverUrl`，动态唱片会优先用真实封面 |
| soundRecipe | Demo preset: `{ mode:"sleep-preview", music:"anchor_guang_sleep_edit", ambience:["rain","pink"], sideA:"落地", sideB:"留白", description:"90 秒花语黑胶试听" }`；fallback 本身未显式声明，归一化后补默认配方 |
| 是否存在字段缺失 | fallback 缺 `matchReason`、`soundRecipe`，运行时由函数补齐；mockRecord 缺 `coverUrl`、`matchReason`、`soundRecipe` |
| 是否与其他唱片重复或冲突 | 与 `mockRecord`、`index.html` 初始 DOM、`DemoPresets.yeduGuang` 重复；这是基准重复，不是冲突 |

### A2. 夜渡 fallback sample：慢慢喜欢你

| 字段 | 内容 |
|---|---|
| 编号 | No.0007 |
| 来源文件与大致行号 | `app.js:47-57` |
| 来源变量或函数 | `fallbackSongs[1]`；`chooseFallbackByMood()` 默认返回 |
| 是否实际可触发 | 是 |
| 触发路径 | 夜渡自动匹配；API fallback；普通自主输入低分 fallback 时可能使用 |
| 数据类型 | fallback sample / 动态唱片底座 |
| 歌曲名 | 慢慢喜欢你 |
| 歌手 | 莫文蔚 |
| 唱片标题 | 慢慢地，也算抵达 |
| 植物 | 薰衣草 |
| 花语 | 等一等，香气会自己回来 |
| A 面 | 放慢 |
| B 面 | 回温 |
| 侧记 | 薰衣草不是一下子香起来的。它要晒过光，也要等过风。今晚不必急着好起来，慢一点，香气会自己回来。 |
| matchReason | 固定数据缺失；动态生成时默认补：它的声音足够轻，适合把今晚慢慢放低。 |
| coverUrl 或本地封面 | `assets/cover_a_sprig_of_lavender.webp` |
| soundRecipe | 固定数据缺失；归一化后补默认 sleep-preview，sideA/sideB 为“放慢/回温” |
| 是否存在字段缺失 | 缺 `matchReason`、`soundRecipe` |
| 是否与其他唱片重复或冲突 | 植物与 shelf seed No.0002 同为薰衣草，花语一致；歌曲不同于 seed 的 `perfume——mehro` |

### A3. 夜渡 fallback sample：The Rose

| 字段 | 内容 |
|---|---|
| 编号 | No.0008 |
| 来源文件与大致行号 | `app.js:59-69` |
| 来源变量或函数 | `fallbackSongs[2]`；`chooseFallbackByMood()` 在“累/生病/被接住”等状态返回 |
| 是否实际可触发 | 是 |
| 触发路径 | 夜渡自动匹配；API fallback；普通自主输入低分 fallback 时可能使用 |
| 数据类型 | fallback sample / 动态唱片底座 |
| 歌曲名 | The Rose |
| 歌手 | Westlife |
| 唱片标题 | 夜里也有花开 |
| 植物 | 睡莲 |
| 花语 | 睡吧，水会将你托住 |
| A 面 | 下沉 |
| B 面 | 托住 |
| 侧记 | 睡莲开在水面，却从不害怕夜色落下来。你也可以先不撑着了。睡吧，水会将你托住。 |
| matchReason | 固定数据缺失；动态生成时默认补：它的声音足够轻，适合把今晚慢慢放低。 |
| coverUrl 或本地封面 | `assets/cover_a_water_lily.webp` |
| soundRecipe | 固定数据缺失；归一化后补默认 sleep-preview，sideA/sideB 为“下沉/托住” |
| 是否存在字段缺失 | 缺 `matchReason`、`soundRecipe` |
| 是否与其他唱片重复或冲突 | 植物与 shelf seed No.0003 同为睡莲，花语一致；歌曲不同于 seed 的 `枕旧书——鸦青` |

### A4. 夜渡 fallback sample：小半

| 字段 | 内容 |
|---|---|
| 编号 | No.0009 |
| 来源文件与大致行号 | `app.js:71-81` |
| 来源变量或函数 | `fallbackSongs[3]`；`chooseFallbackByMood()` 在“乱/说不清/心事/需要被听见”等状态返回 |
| 是否实际可触发 | 是 |
| 触发路径 | 夜渡自动匹配；API fallback；普通自主输入低分 fallback 时可能使用 |
| 数据类型 | fallback sample / 动态唱片底座 |
| 歌曲名 | 小半 |
| 歌手 | 陈粒 |
| 唱片标题 | 把没说完的，放在夜里 |
| 植物 | 蓝铃花 |
| 花语 | 低着头，也在轻轻奏响 |
| A 面 | 低语 |
| B 面 | 回声 |
| 侧记 | 蓝铃花总是低着头，好像不愿惊动谁。可风经过的时候，它也会很轻地响。没说完的话，今晚可以先放在这里。 |
| matchReason | 固定数据缺失；动态生成时默认补：它的声音足够轻，适合把今晚慢慢放低。 |
| coverUrl 或本地封面 | `assets/cover_a_cluster_of_hanging_bluebells.webp` |
| soundRecipe | 固定数据缺失；归一化后补默认 sleep-preview，sideA/sideB 为“低语/回声” |
| 是否存在字段缺失 | 缺 `matchReason`、`soundRecipe` |
| 是否与其他唱片重复或冲突 | 植物与 shelf seed No.0004 同为蓝铃花，花语一致；歌曲不同于 seed 的 `DREAM——seventeen` |

### A5. 夜渡 fallback sample：平凡之路

| 字段 | 内容 |
|---|---|
| 编号 | No.0010 |
| 来源文件与大致行号 | `app.js:83-93` |
| 来源变量或函数 | `fallbackSongs[4]`；`chooseFallbackByMood()` 在“逃/压力/什么都不想”等状态返回 |
| 是否实际可触发 | 是 |
| 触发路径 | 夜渡自动匹配；API fallback；普通自主输入低分 fallback 时可能使用 |
| 数据类型 | fallback sample / 动态唱片底座 |
| 歌曲名 | 平凡之路 |
| 歌手 | 朴树 |
| 唱片标题 | 走到这里，已经很好 |
| 植物 | 蒲公英 |
| 花语 | 松开手，它就会飞翔 |
| A 面 | 放手 |
| B 面 | 远行 |
| 侧记 | 蒲公英不是被风带走的，它只是终于松开了自己。今天走到这里已经很好，剩下的路，明天再走也可以。 |
| matchReason | 固定数据缺失；动态生成时默认补：它的声音足够轻，适合把今晚慢慢放低。 |
| coverUrl 或本地封面 | `assets/cover_a_dandelion_seed_head.webp` |
| soundRecipe | 固定数据缺失；归一化后补默认 sleep-preview，sideA/sideB 为“放手/远行” |
| 是否存在字段缺失 | 缺 `matchReason`、`soundRecipe` |
| 是否与其他唱片重复或冲突 | 植物与 shelf seed No.0005 同为蒲公英，花语一致；歌曲不同于 seed 的 `春雷——米津玄师` |

### A6. 夜渡 fallback sample：晚安

| 字段 | 内容 |
|---|---|
| 编号 | No.0011 |
| 来源文件与大致行号 | `app.js:95-105` |
| 来源变量或函数 | `fallbackSongs[5]`；`chooseFallbackByMood()` 在“绷/紧/反复/自责”或 tension > 78 时返回 |
| 是否实际可触发 | 是 |
| 触发路径 | 夜渡自动匹配；API fallback；普通自主输入低分 fallback 时可能使用 |
| 数据类型 | fallback sample / 动态唱片底座 |
| 歌曲名 | 晚安 |
| 歌手 | 颜人中 |
| 唱片标题 | 今天到这里就好 |
| 植物 | 洋甘菊 |
| 花语 | 把刺放下，也能睡着 |
| A 面 | 松开 |
| B 面 | 安睡 |
| 侧记 | 洋甘菊没有很响亮的香气，只是在水里慢慢散开。今天到这里就好，你不用再把自己拧紧了。 |
| matchReason | 固定数据缺失；动态生成时默认补：它的声音足够轻，适合把今晚慢慢放低。 |
| coverUrl 或本地封面 | `assets/cover_evening_primrose.webp`；`FlowerLibrary` 也将洋甘菊映射到同一月见草封面 |
| soundRecipe | 固定数据缺失；归一化后补默认 sleep-preview，sideA/sideB 为“松开/安睡” |
| 是否存在字段缺失 | 缺 `matchReason`、`soundRecipe`；植物没有独立本地封面 |
| 是否与其他唱片重复或冲突 | 洋甘菊使用月见草封面，可能造成植物/封面认知冲突 |

### A7. 夜渡 fallback sample：给你一瓶魔法药水

| 字段 | 内容 |
|---|---|
| 编号 | No.0012 |
| 来源文件与大致行号 | `app.js:107-117` |
| 来源变量或函数 | `fallbackSongs[6]`；`chooseFallbackByMood()` 在“空/陪伴/低落”等状态返回 |
| 是否实际可触发 | 是 |
| 触发路径 | 夜渡自动匹配；API fallback；普通自主输入低分 fallback 时可能使用 |
| 数据类型 | fallback sample / 动态唱片底座 |
| 歌曲名 | 给你一瓶魔法药水 |
| 歌手 | 告五人 |
| 唱片标题 | 把坏心情泡软一点 |
| 植物 | 雪松 |
| 花语 | 有人替你守着 |
| A 面 | 回暖 |
| B 面 | 守夜 |
| 侧记 | 雪松在冷天里也不急着低头。它只是站在那里，替很小的生命挡一会儿风。今晚也有人替你守着。 |
| matchReason | 固定数据缺失；动态生成时默认补：它的声音足够轻，适合把今晚慢慢放低。 |
| coverUrl 或本地封面 | `assets/cover_a_sprig_of_lavender.webp`；`FlowerLibrary` 也将雪松映射到薰衣草封面 |
| soundRecipe | 固定数据缺失；归一化后补默认 sleep-preview，sideA/sideB 为“回暖/守夜” |
| 是否存在字段缺失 | 缺 `matchReason`、`soundRecipe`；植物没有独立本地封面 |
| 是否与其他唱片重复或冲突 | 雪松使用薰衣草封面，可能造成植物/封面认知冲突 |

### A8. 夜渡 fallback sample：忽然之间

| 字段 | 内容 |
|---|---|
| 编号 | No.0013 |
| 来源文件与大致行号 | `app.js:119-129` |
| 来源变量或函数 | `fallbackSongs[7]` |
| 是否实际可触发 | 是，但当前 `chooseFallbackByMood()` 未直接返回该条；可通过精确自主输入“忽然之间 / 莫文蔚”触发 `findFallbackBySong()` |
| 触发路径 | 自主输入；API fallback 精确匹配；代码保留样本 |
| 数据类型 | fallback sample / 动态唱片底座 |
| 歌曲名 | 忽然之间 |
| 歌手 | 莫文蔚 |
| 唱片标题 | 忽然之间，夜安静了 |
| 植物 | 白茉莉 |
| 花语 | 轻轻的，也足够 |
| A 面 | 安静 |
| B 面 | 微光 |
| 侧记 | 白茉莉不需要很大的月亮。只要一点点夜风，它就能把香气交出去。你也不需要证明很多，轻轻的，也足够。 |
| matchReason | 固定数据缺失；动态生成时默认补：它的声音足够轻，适合把今晚慢慢放低。 |
| coverUrl 或本地封面 | `assets/cover_a_water_lily.webp`；`FlowerLibrary` 也将白茉莉映射到睡莲封面 |
| soundRecipe | 固定数据缺失；归一化后补默认 sleep-preview，sideA/sideB 为“安静/微光” |
| 是否存在字段缺失 | 缺 `matchReason`、`soundRecipe`；植物没有独立本地封面 |
| 是否与其他唱片重复或冲突 | 白茉莉使用睡莲封面，可能造成植物/封面认知冲突 |

### A9. 动态 QQ 音乐唱片模板

| 字段 | 内容 |
|---|---|
| 编号 | 动态：优先 `base.recordNo`，否则 `recordNoFromSong(song)` |
| 来源文件与大致行号 | `app.js:849-864`；`app.js:867-894`；`app.js:974-1008` |
| 来源变量或函数 | `buildSearchPlan()`；`makeRecordFromSong()`；`createAutoRecord()`；`createManualRecord()` |
| 是否实际可触发 | 是 |
| 触发路径 | 夜渡自动匹配；自主输入；QQ 音乐搜索成功且 `scoreSongForYedu()` 达阈值 |
| 数据类型 | 动态唱片 |
| 歌曲名 | 来自 QQ 音乐 `song.songTitle || song.songName`，失败时来自 fallback/preset |
| 歌手 | 来自 QQ 音乐 `song.artist`，失败时来自 fallback/preset |
| 唱片标题 | 来自 `copyBase.title`，即某条 fallback 或 Demo preset |
| 植物 | 来自 `copyBase.plant` |
| 花语 | 来自 `copyBase.flowerWords` |
| A 面 | 来自 `copyBase.sideA` |
| B 面 | 来自 `copyBase.sideB` |
| 侧记 | 来自 `copyBase.note` |
| matchReason | `copyBase.matchReason`，若无则补默认“它的声音足够轻，适合把今晚慢慢放低。” |
| coverUrl 或本地封面 | 优先 QQ 音乐 `song.coverUrl`，否则 `copyBase.coverUrl` / `FlowerLibrary` / 月见草默认封面 |
| soundRecipe | 默认 sleep-preview，sideA/sideB 从 `copyBase` 注入；Demo preset 可注入 `music:"anchor_guang_sleep_edit"` |
| 是否存在字段缺失 | 动态歌曲可能缺封面、songId、songMid；归一化后会补封面与唱片字段 |
| 是否与其他唱片重复或冲突 | 存在认知风险：真实歌曲/歌手可能变化，但植物、花语、侧记仍沿用 fallback 底座 |

## B. 唱片架预设种子唱片

这些不是用户动态生成的完整唱片，位于 `index.html:439-449`，点击后只进入 bloom 弹窗展示封面、编号、植物、花语、BGM。它们不会经过 `normalizeRecordSnapshot()`，也没有 A/B 面和侧记。

| 编号 | 来源 | 是否实际可触发 | 数据类型 | 歌曲名 | 歌手 | 唱片标题 | 植物 | 花语 | A 面 | B 面 | 侧记 | matchReason | coverUrl 或本地封面 | soundRecipe | 字段缺失 | 重复或冲突 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| No.0002 | `index.html:439-440` / `.series-disc` | 是，点击 shelf seed | seed record | perfume | mehro | 缺失 | 薰衣草 | 等一等，香气会自己回来 | 缺失 | 缺失 | 缺失 | 缺失 | `assets/cover_a_sprig_of_lavender.webp` | 缺失 | 缺标题、A/B 面、侧记、matchReason、soundRecipe | 与 fallback No.0007 同植物同花语，但歌曲不同 |
| No.0003 | `index.html:442-443` / `.series-disc` | 是，点击 shelf seed | seed record | 枕旧书 | 鸦青 | 缺失 | 睡莲 | 睡吧，水会将你托住 | 缺失 | 缺失 | 缺失 | 缺失 | `assets/cover_a_water_lily.webp` | 缺失 | 缺标题、A/B 面、侧记、matchReason、soundRecipe | 与 fallback No.0008 同植物同花语，但歌曲不同 |
| No.0004 | `index.html:445-446` / `.series-disc` | 是，点击 shelf seed | seed record | DREAM | seventeen | 缺失 | 蓝铃花 | 低着头，也在轻轻奏响 | 缺失 | 缺失 | 缺失 | 缺失 | `assets/cover_a_cluster_of_hanging_bluebells.webp` | 缺失 | 缺标题、A/B 面、侧记、matchReason、soundRecipe | 与 fallback No.0009 同植物同花语，但歌曲不同 |
| No.0005 | `index.html:448-449` / `.series-disc` | 是，点击 shelf seed | seed record | 春雷 | 米津玄师 | 缺失 | 蒲公英 | 松开手，它就会飞翔 | 缺失 | 缺失 | 缺失 | 缺失 | `assets/cover_a_dandelion_seed_head.webp` | 缺失 | 缺标题、A/B 面、侧记、matchReason、soundRecipe | 与 fallback No.0010 同植物同花语，但歌曲不同 |

## C. 重复与冲突

1. 《光》/ 月见草文案重复出现多处
   - `mockRecord`：`app.js:13-31`
   - `fallbackSongs[0]`：`app.js:35-45`
   - `DemoPresets.yeduGuang`：`app.js:143-165`
   - `index.html` reveal 初始 DOM：`index.html:238-279`
   - `index.html` shelf 初始 DOM：`index.html:421-458`
   - 结论：这是当前项目的基准唱片，重复合理，但后续人工改文案时需要同步多处或明确只保留单一数据源。

2. `mockRecord` 是旧/兜底残留
   - 来源：`app.js:13-31`
   - 当前行为：`getCurrentRecord()` 在 `currentRecord` 和 `fallbackSongs[0]` 都不存在时才回退到 `mockRecord`；`state.answers.tension` 默认也读取 `mockRecord.mood.tension`。
   - 冲突：文案与 No.0006 一致，不冲突；但字段缺 `coverUrl`、`matchReason`、`soundRecipe`。

3. shelf seed records 不完整
   - 来源：`index.html:439-449`
   - 当前行为：只在 shelf 弹窗展示编号、植物、花语、BGM、封面。
   - 冲突：与 fallback records 共享植物和花语，但歌曲不同；用户可能误以为它们也是完整“花语唱片”。

4. 多个植物复用非本植物封面
   - `FlowerLibrary`: `app.js:132-140`
   - 洋甘菊 → `assets/cover_evening_primrose.webp`
   - 雪松 → `assets/cover_a_sprig_of_lavender.webp`
   - 白茉莉 → `assets/cover_a_water_lily.webp`
   - 冲突：文案植物与视觉封面不一致。

5. 动态 QQ 音乐唱片可能产生“真实歌曲 + fallback 文案底座”的认知裂缝
   - 来源：`makeRecordFromSong()`：`app.js:867-894`
   - 当前行为：歌曲名、歌手、封面可来自 QQ 音乐；唱片标题、植物、花语、侧记、A/B 面来自 fallback 或 preset。
   - 冲突：若 QQ 搜到的歌曲与 fallback 气质偏离，文案可信度可能下降。

6. 默认 matchReason 重复且较通用
   - 来源：`app.js:883`
   - 文案：它的声音足够轻，适合把今晚慢慢放低。
   - 冲突：除 yeduGuang preset 外，动态唱片大多会共享这句，解释力有限。

7. reveal / playback / shelf 文案目前理论上统一
   - 来源：`applyMockRecord()`：`app.js:1034-1045`
   - 当前行为：三个页面都读取 `record` / `currentRecord`，封面由 `resolveRecordCover()` 统一。
   - 结论：未发现 reveal / playback / shelf 当前会主动生成不同文案；旧 DOM 初始值只在 JS 覆盖前存在。

## D. 建议锁定的基准文案

只标记当前项目中风格最稳定、建议作为后续人工审定基准的内容，不提供新文案。

1. No.0006 / 月见草 / 《光》
   - 唱片标题：灯熄以后，光还在
   - 花语：没人看，也会开
   - A/B 面：落地 / 留白
   - 侧记：月见草是夜里才开的花。没人看，它也开。今天没有被谁看见，可你也好好地活过了一天。
   - 理由：与夜渡主路径、Demo preset、音频语义和现场演示绑定最深。

2. No.0009 / 蓝铃花 / 《小半》
   - 唱片标题：把没说完的，放在夜里
   - 花语：低着头，也在轻轻奏响
   - A/B 面：低语 / 回声
   - 理由：A/B 面和“未说完的话”声音隐喻较一致，夜渡语气稳定。

3. No.0011 / 洋甘菊 / 《晚安》
   - 唱片标题：今天到这里就好
   - 花语：把刺放下，也能睡着
   - A/B 面：松开 / 安睡
   - 理由：睡前场景明确，动作感和收束感较强。

4. No.0008 / 睡莲 / The Rose
   - 唱片标题：夜里也有花开
   - 花语：睡吧，水会将你托住
   - A/B 面：下沉 / 托住
   - 理由：A/B 面声音旅程明确，适合 90 秒 A/B 面结构。

## E. 建议人工重新审定的内容

1. No.0012 / 雪松 / 给你一瓶魔法药水
   - 原因：`花语: 有人替你守着` 与 `侧记` 很贴夜渡，但“把坏心情泡软一点”略口语化；可人工判断是否与整体高级感一致。
   - 不生成新文案，仅建议审定。

2. No.0007 / 薰衣草 / 慢慢喜欢你
   - 原因：整体温柔，但“香气会自己回来”出现两次，侧记略满；可审定是否需要更克制。

3. No.0010 / 蒲公英 / 平凡之路
   - 原因：歌和“远行/放手”匹配，但“今天走到这里已经很好”比较常见，可能略接近安慰模板。

4. No.0013 / 白茉莉 / 忽然之间
   - 原因：当前自动状态选择不直接触发，且白茉莉复用睡莲封面；如保留，应审定触发路径和视觉一致性。

5. shelf seed records No.0002-No.0005
   - 原因：它们不是完整唱片，只能在弹窗看到花语和 BGM；若用户以为是完整归档，信息缺口明显。

6. 默认动态 matchReason
   - 原因：`它的声音足够轻，适合把今晚慢慢放低。` 作为兜底可用，但解释力较弱，且会在多首动态歌曲中重复。

7. FlowerLibrary 复用封面项
   - 原因：洋甘菊/雪松/白茉莉没有独立封面，可能削弱“植物花语唱片”的一致性。

## F. 补充：字段来源与显示链路

- `setCurrentRecord(record)`：`app.js:897-900`，将输入 record 归一化为 `currentRecord`。
- `normalizeRecordSnapshot(record, fallbackRecord)`：`app.js:650-685`，负责补齐缺失字段。
- `resolveRecordCover(record)`：`app.js:639-647`，封面优先级为 `record.coverUrl` → `record.anchorSong.coverUrl` → `FlowerLibrary[plant]` → 月见草默认封面。
- `applyMockRecord()`：`app.js:1034-1045`，将同一 record 写入 reveal / playback / shelf 文案与封面。
- `archiveCurrentRecord()`：`app.js:708-718`，进入 shelf 时保存完整 record snapshot 到 `localStorage` key `sonic_grove_shelf_records`。
- `renderShelfRecords()`：`app.js:721-742`，将最新归档唱片插入 shelf rack 第一张。

## G. 当前用户真实可触发项目汇总

| 项目 | 实际可触发 | 主要触发方式 | 备注 |
|---|---|---|---|
| No.0006 光 / 月见草 | 是 | 默认 currentRecord；Demo preset；自动匹配；自主输入；API fallback | 主演示路径 |
| No.0007 慢慢喜欢你 / 薰衣草 | 是 | 默认 fallback；普通状态 fallback | chooseFallbackByMood 默认返回 |
| No.0008 The Rose / 睡莲 | 是 | “累/生病/被接住”等状态 fallback | A/B 面声音逻辑较强 |
| No.0009 小半 / 蓝铃花 | 是 | “乱/说不清/心事”等状态 fallback；自主输入精确匹配 | 与 seed No.0004 花语重复但歌曲不同 |
| No.0010 平凡之路 / 蒲公英 | 是 | “逃/压力”等状态 fallback | 与 seed No.0005 花语重复但歌曲不同 |
| No.0011 晚安 / 洋甘菊 | 是 | “紧绷/自责/tension高”等状态 fallback | 封面复用月见草 |
| No.0012 给你一瓶魔法药水 / 雪松 | 是 | “空/陪伴/低落”等状态 fallback | 封面复用薰衣草 |
| No.0013 忽然之间 / 白茉莉 | 有条件触发 | 自主输入精确匹配 | 当前自动 fallback 未直接返回 |
| 动态 QQ 音乐唱片 | 是 | API 搜索成功且评分达阈值 | 歌曲/歌手/封面动态，唱片文案来自 fallback/preset |
| shelf seed No.0002-No.0005 | 是 | shelf 点击小唱片 | 非完整动态唱片 |
| mockRecord | 极低/兜底 | 只有 currentRecord 与 fallbackSongs 都不可用时 | 旧代码残留，不应作为主审定源 |
