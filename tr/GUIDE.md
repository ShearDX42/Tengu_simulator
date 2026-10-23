# Translation guide — 《天狗》(Tengu), a Go-Shirakawa simulator text game

You translate Chinese game text into **Japanese (ja)** or **English (en)**. The game is a literary, historically grounded text game about Emperor/Cloistered Emperor Go-Shirakawa (1127–1192), the Hōgen/Heiji disturbances and the Genpei War. Narration addresses the player in the second person ("你" = the player as Go-Shirakawa).

## Input / output
- Input: `src_N.json` — an object `{ "id": "Chinese string", ... }`.
- Output: write `ja_N.json` or `en_N.json` (same folder) — an object with **exactly the same ids**, each value the translation. Valid JSON, UTF-8, no missing ids. Then validate it by running: `python3 -c "import json;a=json.load(open('src_N.json'));b=json.load(open('OUT'));assert set(a)==set(b);print('ok',len(b))"`.

## Hard rules
1. Preserve markup exactly: `*emphasis*` asterisks (keep them around the corresponding translated words), `<b>…</b>`, `<em>`, `<span class="ja">…</span>`, `<br>`, and placeholders like `{a}` `{b}`.
2. Do NOT add HTML tags that are not in the source.
3. Strings that are purely original Japanese (classical poems/songs/quotes in kana, e.g. `遊びをせんとや生まれけむ…`) → return **unchanged** in both languages.
4. When the source contains an original Japanese quote followed by a Chinese gloss in parentheses, e.g. `「平氏倒れ候ひぬ。」（平氏倒了。）`:
   - ja: keep the Japanese quote, drop the Chinese gloss.
   - en: keep the Japanese quote, replace the gloss with an English one: `「平氏倒れ候ひぬ。」 (“The Heishi has fallen.”)`.
5. Short UI labels stay short. Stat/faction names must follow the glossary exactly.
6. Some strings are fragments used in code (e.g. `已殁`, `需：`, `图：`, `其`, `所`). Translate them as fragments: en `Deceased`, `Requires: `, `Image: `, …; ja `没`, `要：`, `図：`, … Keep trailing colons/spaces as appropriate.
7. Year/era strings: keep the era name + Western year. ja: `保元元年（1156）七月二日` (Japanese kanji forms). en: `Hōgen 1 (1156), 7th month, 2nd day` — use “month/day” ordinal style for lunar dates; `九月` → `9th month`; `秋` → `autumn`; `数年之后` → `Some years later`; `另一种天下` → `Another realm`.
8. 「」 quotes: ja keep 「」 (use 『』 for book titles); en use “ ” and render book titles plainly in English/romanized form (no italics tags).

## Style
- **ja**: literary 常体 narrative (だ・である調 / 体言止め welcome), elegant and historically flavoured; dialogue in period voice (「〜でございます」「〜じゃ」「〜候」 lightly). Use proper Japanese historical names and kanji (後白河院, 鹿ケ谷, 壇ノ浦, 頼朝, 義経). Second person: 「あなた」 or omit the subject naturally; the court may call him 「院」「法皇」.
- **en**: polished literary English, vivid but not purple; second person ("you"). Hepburn romanization with macrons. Dialogue natural and period-flavoured, not modern slang.

## Glossary (zh → ja → en)
- 后白河 → 後白河 → Go-Shirakawa; 雅仁 → 雅仁 → Masahito; 法皇 → 法皇 → the Cloistered Emperor; 上皇 → 上皇 → the Retired Emperor; 天子 → 天子 → the Emperor / the Son of Heaven; 院 → 院 → the In
- 院政 → 院政 → cloistered rule; 院宣 → 院宣 → In-zen (decree of the In); 宣旨 → 宣旨 → senji (imperial edict); 院近臣 → 院近臣 → the In's favourites; 北面武士 → 北面武士 → Northern Guard; 西面武士 → 西面武士 → Western Guard
- 天狗 → 天狗 → Tengu; 大天狗 → 大天狗 → Great Tengu; 今样 → 今様 → imayō; 梁尘秘抄 → 梁塵秘抄 → Ryōjin Hishō; 口传集 → 口伝集 → Kudenshū
- Stats: 院威 → 院威 → Authority; 帑藏 → 財力 → Treasury; 武备 → 武備 → Arms; 人望 → 人望 → Favor; 今样 → 今様 → Imayō; 天狗 → 天狗 → Tengu
- Factions: 平氏 → 平氏 → Taira; 源氏 → 源氏 → Minamoto; 摄关 → 摂関 → Regents; 寺社 → 寺社 → Temples; 天子 → 天子 → Throne
- UI: 起居之札 → 起居の札 → Daily Record; 帖 → 帖 → Book (序帖 Prologue, 第一帖 Book One…, 外帖 Side Book); 史注 → 史注 → Historical Note; 人物志 → 人物誌 → Dramatis Personae; 年表 → 年表 → Chronicle; 结局录 → 結末録 → Endings; 今样帖 → 今様帖 → Book of Imayō; 卷末 → 巻末 → Colophon; 御所 → 御所 → Palace; 结局 → 結末 → Ending; 史实 → 史実 → History; 始卷 → 始巻 → Begin; 续卷 → 続巻 → Continue; 展卷 → 巻を開く → Unroll; 襲色目 → 襲の色目 → kasane colours; 假想之线 → 仮想の線 → an imagined line
- Emperors: 鸟羽 Toba; 崇德 崇徳 Sutoku; 近卫 近衛 Konoe; 二条 Nijō; 六条 Rokujō; 高仓 高倉 Takakura; 安德 安徳 Antoku; 后鸟羽 後鳥羽 Go-Toba; 以仁王 Prince Mochihito; 北陆宫 北陸宮 the Hokuroku Prince
- Women: 待贤门院璋子 待賢門院璋子 Taikenmon-in Shōshi; 美福门院得子 美福門院得子 Bifukumon-in Tokushi; 建春门院滋子 建春門院滋子 Kenshunmon-in Shigeko; 德子 徳子 Tokuko / 建礼门院 建礼門院 Kenreimon-in; 二位尼时子 二位尼時子 Tokiko, the Nun of the Second Rank; 池禅尼 Ike-no-Zenni; 丹后局 丹後局 Lady Tango; 纪二位 紀伊二位 Lady Kii; 上西门院 上西門院 Jōsaimon-in; 宣阳门院 宣陽門院 Senyōmon-in; 乙前 Otomae; 静御前 Shizuka Gozen; 巴御前 Tomoe Gozen; 常盘 常盤 Tokiwa; 北条政子 Hōjō Masako; 祇王 Giō; 佛御前 仏御前 Hotoke Gozen; 小弁殿 Koben-dono
- Fujiwara: 信西 Shinzei; 忠通 Tadamichi; 赖长 頼長 Yorinaga; 忠实 忠実 Tadazane; 信赖 信頼 Nobuyori; 基实 基実 Motozane; 基房 Motofusa; 九条兼实 九条兼実 Kujō Kanezane; 基通 Motomichi; 慈圆 慈円 Jien; 成亲 成親 Narichika; 西光 Saikō; 俊宽 俊寛 Shunkan; 平康赖 平康頼 Taira no Yasuyori; 经宗 経宗 Tsunemune; 惟方 Korekata; 俊成 Fujiwara no Shunzei; 高阶泰经 高階泰経 Takashina no Yasutsune; 平知康 Taira no Tomoyasu (鼓判官 → 鼓判官 → the “Drum Magistrate”); 静宪 静憲 Seiken; 吉田经房 吉田経房 Yoshida Tsunefusa; 源通亲 源通親 Minamoto no Michichika
- Taira: 清盛 Kiyomori (入道相国 → 入道相国 → the Lay Priest Chancellor); 忠盛 Tadamori; 重盛 Shigemori; 宗盛 Munemori; 知盛 Tomomori; 重衡 Shigehira; 维盛 維盛 Koremori; 资盛 資盛 Sukemori; 教经 教経 Noritsune; 忠度 Tadanori; 敦盛 Atsumori; 时忠 時忠 Tokitada; 赖盛 頼盛 Yorimori; 盛子 Moriko; 忠正 Tadamasa
- Minamoto: 为义 為義 Tameyoshi; 义朝 義朝 Yoshitomo; 为朝 為朝 Tametomo (镇西八郎 Chinzei Hachirō); 赖政 頼政 Yorimasa; 赖朝 頼朝 Yoritomo (镰仓殿 鎌倉殿 the Lord of Kamakura; 佐殿 Suke-dono); 义经 義経 Yoshitsune (九郎判官 Kurō Hōgan); 范赖 範頼 Noriyori; 木曾义仲 木曾義仲 Kiso Yoshinaka (旭将军 朝日将軍 the Rising-Sun General); 行家 Yukiie; 今井兼平 Imai Kanehira; 北条时政 北条時政 Hōjō Tokimasa; 弁庆 弁慶 Benkei; 梶原景时 梶原景時 Kajiwara Kagetoki; 多田行纲 多田行綱 Tada Yukitsuna; 熊谷直实 熊谷直実 Kumagai Naozane; 那须与一 那須与一 Nasu no Yoichi; 长田忠致 長田忠致 Osada Tadamune; 义平 義平 Yoshihira
- Clergy / others: 明云 明雲 Meiun; 文觉 文覚 Mongaku; 重源 Chōgen; 西行 Saigyō; 菩提僊那 Bodhisena; 藤原秀衡 Fujiwara no Hidehira; 泰衡 Yasuhira; 鸭长明 鴨長明 Kamo no Chōmei; 隆晓 隆暁 Ryūgyō
- Places: 平安京 Heian-kyō; 法住寺殿 Hōjūji-dono; 三条殿 Sanjō-dono; 三条高仓第 三条高倉第 the Sanjō-Takakura mansion; 六波罗 六波羅 Rokuhara; 白河北殿 Shirakawa-kita-dono; 高松殿 Takamatsu-dono; 鸟羽殿 鳥羽殿 Toba-dono; 一本御书所 一本御書所 the Ippon-gosho-dokoro; 仁和寺 Ninna-ji; 莲华王院 蓮華王院 Rengeō-in; 最胜光院 最勝光院 Saishōkō-in; 鹿谷 鹿ケ谷 Shishigatani; 福原 Fukuhara; 大轮田泊 大輪田泊 Ōwada-no-tomari; 严岛 厳島 Itsukushima; 比叡山 Mount Hiei; 延历寺 延暦寺 Enryaku-ji; 兴福寺 興福寺 Kōfuku-ji; 园城寺 園城寺 Onjō-ji; 东大寺 東大寺 Tōdai-ji; 坛之浦 壇ノ浦 Dan-no-ura; 屋岛 屋島 Yashima; 一之谷 一ノ谷 Ichi-no-Tani; 鹎越 鵯越 Hiyodorigoe; 俱利伽罗峠 倶利伽羅峠 Kurikara Pass; 宇治 Uji; 平等院 Byōdō-in; 粟津 Awazu; 富士川 Fujikawa; 平泉 Hiraizumi; 中尊寺金色堂 Chūson-ji Konjikidō; 衣川 Koromogawa; 镰仓 鎌倉 Kamakura; 鹤冈八幡宫 鶴岡八幡宮 Tsurugaoka Hachiman-gū; 腰越 Koshigoe; 伊豆 Izu; 赞岐 讃岐 Sanuki; 白峰 Shiramine; 鬼界岛 鬼界ヶ島 Kikai-ga-shima; 大原寂光院 Jakkō-in in Ōhara; 六条殿 Rokujō-dono; 长讲堂 長講堂 Chōkōdō; 熊野 Kumano; 江口 Eguchi; 青墓 Aohaka; 爱宕山 愛宕山 Mount Atago; 鞍马 鞍馬 Kurama; 大物浦 Daimotsu-ura; 吉野 Yoshino
- Eras: 大治 Daiji; 久安 Kyūan; 久寿 Kyūju; 保元 Hōgen; 平治 Heiji; 永历 永暦 Eiryaku; 应保 応保 Ōhō; 长宽 長寛 Chōkan; 永万 Eiman; 仁安 Nin'an; 嘉应 嘉応 Kaō; 承安 Jōan; 安元 Angen; 治承 Jishō; 养和 養和 Yōwa; 寿永 Juei; 元历 元暦 Genryaku; 文治 Bunji; 建久 Kenkyū; 弘仁 Kōnin; 延喜 Engi; 天平胜宝 天平勝宝 Tenpyō-shōhō
- Sources: 平家物语 平家物語 The Tale of the Heike; 玉叶 玉葉 Gyokuyō; 愚管抄 Gukanshō; 吾妻镜 吾妻鏡 Azuma Kagami; 保元物语 Hōgen Monogatari; 平治物语 Heiji Monogatari; 方丈记 方丈記 Hōjōki; 兵范记 兵範記 Hyōhanki; 山槐记 山槐記 Sankaiki; 百练抄 百練抄 Hyakurenshō; 台记 台記 Taiki; 古事谈 古事談 Kojidan; 吉记 吉記 Kikki; 源平盛衰记 源平盛衰記 Genpei Jōsuiki; 义经记 義経記 Gikeiki; 今镜 今鏡 Imakagami; 山家集 Sankashū; 千载和歌集 千載和歌集 Senzai Wakashū; 天子摄关御影 天子摂関御影 Tenshi Sekkan Miei; 前贤故实 前賢故実 Zenken Kojitsu; 平治物语绘卷 平治物語絵巻 Heiji Monogatari Emaki; 年中行事绘卷 年中行事絵巻 Nenjū Gyōji Emaki; 天狗草纸 天狗草紙 Tengu Zōshi
- Endings (keep consistent): 日本国第一之大天狗 → 日本国第一の大天狗 → The Greatest Tengu in Japan; 天子复政 → 天子復政 → The Throne Restored; 院政千年 → 院政千年 → A Thousand Years of Cloistered Rule; 平家永昌 → 平家永昌 → The Taira Endure; 两帝并立 → 両帝並立 → Two Emperors; 浪下之都 → 波の下の都 → The Capital Beneath the Waves; 旭日长照 → 旭日長照 → The Rising Sun Abides; 判官之世 → 判官の世 → The Age of the Hōgan; 北方王土 → 北方の王土 → The Northern Realm; 摄关中兴 → 摂関中興 → The Regency Revived; 遊びをせんとや → 遊びをせんとや → Born to Play; 赞岐之魔缘 → 讃岐の魔縁 → The Demon of Sanuki; 江口之月 → 江口の月 → The Moon over Eguchi; 高松殿之火 → 高松殿の火 → Fire at Takamatsu-dono; 一本御书所 → 一本御書所 → The Ippon-gosho-dokoro; 鸟羽之笼 → 鳥羽の籠 → The Cage at Toba
- Tengu tiers: 尚是寻常天子 → いまだ尋常の天子 → Still an ordinary sovereign; 山中小天狗 → 山中の小天狗 → A minor mountain tengu; 鞍马僧正坊 → 鞍馬の僧正坊 → Sōjōbō of Kurama; 爱宕山太郎坊 → 愛宕山太郎坊 → Tarōbō of Mount Atago; 日本国第一之大天狗 → 日本国第一の大天狗 → The Greatest Tengu in Japan
