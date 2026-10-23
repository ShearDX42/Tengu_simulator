# 天狗 · Tengu

**一个以后白河法皇为主角的多结局历史文字游戏。** 从保元、平治之乱到源平合战，你以「日本第一大天狗」的身份周旋于平氏、源氏、摄关与寺社之间。16 种结局，中文 / 日本語 / English 三语。

*A multi-ending historical text game in which you play the Cloistered Emperor Go-Shirakawa (1127–1192), from the Hōgen and Heiji disturbances through the Genpei War. 16 endings; Chinese, Japanese and English.*

> 本作主要由 **Claude**（Anthropic）制作。Made mainly with Claude by Anthropic.

## 游玩 / Play

直接用浏览器打开 `index.html` 即可，无需服务器。存档保存在浏览器本地。
Open `index.html` in any modern browser. No server needed; saves stay in your browser.

## 目录 / Layout

| 文件 | 内容 |
|---|---|
| `prelude.js` | 语言、数值、帖（章节）定义 |
| `s0_2.js` … `s7_8.js` | 各帖场景 |
| `endings.js` | 结局 |
| `people.js` / `who.js` | 人物志 |
| `portraits.js` / `imgdata.js` | 画像（内嵌 WebP） |
| `misc.js` | 年表、卷末说明 |
| `music.js` | 歌单播放器（开源版不含音频） |
| `engine.js` | 引擎 |
| `shell.html` | 页面骨架与样式 |
| `tr/` | 日语、英语译文 |
| `build.py` | 把以上文件合成为 `index.html` |
| `sim.js` | 无头随机试玩，检查结局可达与断链 |

## 构建 / Build

```bash
python3 build.py      # 生成 all.js、i18n_data.js 与 index.html
node sim.js           # 随机试玩检查
```

修改中文文本后，运行 `python3 extract.py` 重新提取待译字符串（`strings.json`），翻译写入 `tr/ja_*.json`、`tr/en_*.json` 或 `tr/extra.json`。

## 音乐 / Music

开源版**不附带任何音乐**。若要启用顶栏「♪」歌单，把你有权使用的音频放进 `bgm/`，再在 `music.js` 的 `TRACKS` 里登记。
*No audio is included. Put audio you have the rights to use in `bgm/` and list it in `TRACKS` in `music.js`.*

## 许可 / License

- 代码：MIT，见 [`LICENSE`](LICENSE)
- 剧情文字与译文：CC BY-NC-SA 4.0，见 [`LICENSE-CONTENT.md`](LICENSE-CONTENT.md)
- 图片：来自维基共享资源，几乎全部为公有领域，其中一张为 CC BY 4.0，逐张出处见 [`CREDITS.md`](CREDITS.md)
- 史料原文（《平家物语》《玉叶》《愚管抄》等）属公有领域
