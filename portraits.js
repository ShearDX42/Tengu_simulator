/* ================= 绘：史料画像（Wikimedia Commons，公有领域） ================= */
/* 头像取景：[x%, y%, 放大] —— 以面部为中心 */
const POS = {
 me:[45,20,1.3], me_full:[52,18,1.8], toba:[50,15,1.6], sutoku:[48,20,1.4], sutoku2:[50,30,1.6], konoe:[50,30,1.1], nijo:[48,25,1.8], rokujo:[50,20,1.2], takakura:[50,22,1.8], antoku:[55,20,1.8], gotoba:[45,22,1.6], bifuku:[50,40,1], mochihito:[45,25,1.8],
 tadazane:[40,25,1.6], tadamichi:[50,20,1.8], yorinaga:[45,20,1.6], motofusa:[50,20,1.8], kanezane:[50,20,1.8], nobuyori:[50,55,1.4], shunzei:[70,25,1.6], jien:[55,20,1.4], shinzei:[50,40,1.6],
 tadamori:[50,15,1.6], kiyomori:[50,18,1.8], shigemori:[45,22,1.8], munemori:[45,22,1.8], tomomori:[50,18,1.6], tokiko:[50,10,1.2], kenreimon:[70,20,1.6], shigehira:[50,15,1.6], koremori:[50,10,1.4], noritsune:[50,18,1.6], tadanori:[85,10,1.4], atsumori:[55,15,1.6],
 tameyoshi:[50,12,1.6], yoshitomo:[50,12,1.4], tametomo:[40,15,1.4], yorimasa:[55,15,1.4], yoritomo:[50,22,1.8], masako:[50,20,1.4], tokimasa:[50,30,1.4], yoshitsune:[45,18,1.6], noriyori:[50,15,1.6], yoshinaka:[50,15,1.6], tomoe:[60,15,1.4], yukiie:[40,15,1.4], tokiwa:[50,35,1.2], benkei:[40,15,1.4], shizuka:[50,12,1.4], kumagai:[50,15,1.4], nasu:[35,20,1.4],
 saigyo:[50,75,1.4], mongaku:[50,25,1.4], chogen:[50,20,1.4], hidehira:[50,20,1.6], shunkan:[30,30,1.4], t_kyo:[62,30,2.2], t_zoshi:[50,40,1.6]
};
function imgTag(k, alt){
  const p = POS[k] || [50,20,1.3];
  return `<img src="${IMG[k]}" alt="${alt||''}" loading="lazy" style="object-position:${p[0]}% ${p[1]}%;transform:scale(${p[2]});transform-origin:${p[0]}% ${p[1]}%">`;
}
/* 无传世画像者：以朱印代之，不伪造面貌 */
function sealTag(name){
  const core = name.replace(/^(入道相国|天台座主|鼓判官|武藏坊|建礼门院|建春门院|中宫|二位尼|镇西八郎)\s*/,'').replace(/[（）()]/g,'');
  const ch = core.length > 2 ? core.slice(0,2) : core;
  return `<span class="seal-ph" title="${name}：无传世画像">${ch.split('').join('<br>')}</span>`;
}

/* ---------- 角色 ---------- */
const CAST = {
  me:{n:g => (g.yr < 1155 || g.scene==='konoe') ? '雅仁亲王' : g.yr < 1158 ? '天子' : g.yr < 1169 ? '上皇' : '法皇', i:'me'},
  shinzei:{n:'信西', i:'shinzei'}, bifuku:{n:'美福门院', i:'bifuku'}, toba:{n:'鸟羽法皇', i:'toba'},
  sutoku:{n:'崇德上皇', i:'sutoku'}, sutoku_t:{n:'白峰之影', i:'t_kyo'},
  tadamichi:{n:'藤原忠通', i:'tadamichi'}, yorinaga:{n:'藤原赖长', i:'yorinaga'}, yoshitomo:{n:'源义朝', i:'yoshitomo'},
  kiyomori:{n:g => g.yr>=1168 ? '入道相国 平清盛' : '平清盛', i:'kiyomori'}, tametomo:{n:'镇西八郎为朝', i:'tametomo'},
  nobuyori:{n:'藤原信赖', i:'nobuyori'}, kinoni:{n:'纪二位'}, otomae:{n:'乙前'}, shigeko:{n:'建春门院 滋子'},
  tokitada:{n:'平时忠'}, shigemori:{n:'平重盛', i:'shigemori'}, munemori:{n:'平宗盛', i:'munemori'}, tokiko:{n:'二位尼 时子', i:'tokiko'},
  tokuko:{n:g => g.yr>=1185 ? '建礼门院（出家）' : '中宫 德子', i:'kenreimon'}, narichika:{n:'藤原成亲'}, saiko:{n:'西光'},
  shunkan:{n:'俊宽', i:'shunkan'}, yasuyori:{n:'平康赖'}, seiken:{n:'静宪法印'}, yoritomo:{n:'源赖朝', i:'yoritomo'},
  yoshitsune:{n:'九郎义经', i:'yoshitsune'}, yoshinaka:{n:'木曾义仲', i:'yoshinaka'}, tomoyasu:{n:'鼓判官 平知康'}, tango:{n:'丹后局'},
  tomomori:{n:'平知盛', i:'tomomori'}, antoku:{n:'安德天皇', i:'antoku'}, gotoba:{n:'四宫尊成', i:'gotoba'}, benkei:{n:'武藏坊弁庆', i:'benkei'},
  shizuka:{n:'静御前', i:'shizuka'}, masako:{n:'北条政子', i:'masako'}, tokimasa:{n:'北条时政', i:'tokimasa'}, hidehira:{n:'藤原秀衡', i:'hidehira'},
  mongaku:{n:'文觉', i:'mongaku'}, kanezane:{n:'九条兼实', i:'kanezane'}, shunzei:{n:'藤原俊成', i:'shunzei'}, tadanori:{n:'平忠度', i:'tadanori'},
  meiun:{n:'天台座主 明云'}, yukitsuna:{n:'多田行纲'}, kinshin:{n:'院近臣'}, kuge:{n:'公卿'}, shisha:{n:'传宣使'},
  nijo:{n:'二条天皇', i:'nijo'}, kenreimon:{n:'建礼门院', i:'kenreimon'}, saigyo:{n:'西行', i:'saigyo'}, choken:{n:'重源', i:'chogen'}, yasutsune:{n:'高阶泰经'}
};
const castName = k => { const c = CAST[k]; if(!c) return k; return tr(typeof c.n==='function' ? c.n(G||{yr:1127}) : c.n); };
const castSvg  = (k) => { const c = CAST[k]; if(!c) return ''; return c.i && IMG[c.i] ? imgTag(c.i, castName(k)) : sealTag(sealName(typeof c.n==='function' ? c.n(G||{yr:1127}) : c.n)); };

const PMAP = {'后白河天皇（雅仁）':'me_full','鸟羽天皇（法皇）':'toba','美福门院 藤原得子':'bifuku','崇德天皇（上皇）':'sutoku2','近卫天皇':'konoe','二条天皇（守仁）':'nijo','六条天皇':'rokujo','高仓天皇（宪仁）':'takakura','安德天皇（言仁）':'antoku','后鸟羽天皇（尊成）':'gotoba','以仁王':'mochihito','建礼门院 平德子':'kenreimon',
 '藤原忠实':'tadazane','藤原忠通':'tadamichi','藤原赖长':'yorinaga','信西（藤原通宪）':'shinzei','藤原信赖':'nobuyori','藤原基房（松殿）':'motofusa','九条兼实':'kanezane','慈圆':'jien','藤原俊成':'shunzei','俊宽':'shunkan',
 '平忠盛':'tadamori','平清盛':'kiyomori','二位尼 平时子':'tokiko','平重盛':'shigemori','平宗盛':'munemori','平知盛':'tomomori','平重衡':'shigehira','平维盛':'koremori','平教经':'noritsune','平忠度':'tadanori','平敦盛':'atsumori',
 '源为义':'tameyoshi','源义朝':'yoshitomo','源为朝':'tametomo','源赖政':'yorimasa','源赖朝':'yoritomo','北条政子':'masako','北条时政':'tokimasa','源义经':'yoshitsune','源范赖':'noriyori','木曾义仲':'yoshinaka','巴御前':'tomoe','源行家':'yukiie','常盘御前':'tokiwa','武藏坊弁庆':'benkei','静御前':'shizuka','熊谷直实':'kumagai','那须与一':'nasu',
 '文觉':'mongaku','重源':'chogen','西行':'saigyo','藤原秀衡':'hidehira'};
function personSvg(p){ const k = PMAP[p.name]; return k && IMG[k] ? imgTag(k, tr(p.name)) : sealTag(sealName(p.name)); }
function sealName(zh){ return LANG==='zh' ? zh : (I18N.ja[zh] || zh); }

/* ---------- 场景图与题签 ---------- */
const SCAP = {
 s_nenju:'《年中行事绘卷》内宴（住吉如庆摹本）。原卷系后白河院命常盘光长所绘。',
 s_hogen:'保元之乱图。',
 s_heiji:'《平治物语绘卷》三条殿夜讨卷（波士顿美术馆藏，镰仓时代）。',
 s_rokuhara:'《平治物语绘卷》六波罗行幸卷（东京国立博物馆藏）。',
 s_itsu:'歌川广重《安艺严岛》。',
 s_shunkan:'月冈芳年绘：鬼界岛上的俊宽，目送赦船远去。',
 s_fever:'月冈芳年《平清盛炎焼病之图》。',
 s_awazu:'歌川芳员绘：粟津合战，巴御前与木曾军。',
 s_dan:'传土佐光信《安德天皇缘起绘》坛之浦合战（赤间神宫藏）。',
 s_yashima:'传土佐光信《安德天皇缘起绘》那须与一射扇（赤间神宫藏）。',
 s_daibutsu:'芝琳贤《东大寺大佛缘起》。',
 s_ohara:'月冈耕渔《能乐百番·大原御幸》。',
 s_koromo:'歌川国芳绘：义经奥州衣川馆。',
 t_sojo:'月冈芳年绘：鞍马山大天狗僧正坊授剑于牛若丸。',
 t_kyo:'河锅晓斋绘：天狗。',
 t_kyo2:'河锅晓斋绘：牛若丸于鞍马山随天狗习武。',
 t_zoshi:'《天狗草纸》（根津美术馆藏，镰仓时代）。描绘诸寺骄僧堕为天狗。',
 t_hok:'葛饰北斋绘：天狗。'
};
const SCENE_IMG = {birth:'s_nenju', hogen3:'s_hogen', heiji3:'s_heiji', heiji4:'s_rokuhara', renge2:'t_zoshi', kenshun:'s_itsu', shunkan:'s_shunkan',
 kiyomori_death:'s_fever', ichinotani:'s_awazu', kiso_fall:'s_awazu', yashima:'s_yashima', dannoura:'s_dan', daibutsu:'s_daibutsu', tengu2:'t_kyo2', ohara:'s_ohara', oshu_war:'s_koromo', oshu_fall:'s_koromo'};
const CH_IMG = ['s_nenju','s_hogen','s_heiji','s_itsu','s_shunkan','s_fever','s_awazu','s_dan','t_kyo2','s_rokuhara','s_itsu','s_yashima','s_awazu','s_koromo','s_koromo'];
const END_IMG = {tengu:'t_kyo2', onryo:'t_zoshi', tenshi:'s_nenju', insei:'s_rokuhara', heike:'s_itsu', saikai:'s_yashima', umi:'s_dan', kiso:'s_awazu', yoshitsune:'t_sojo', oshu:'s_koromo', sekkan:'s_nenju', asobi:'s_nenju', eguchi:'t_hok', hogen:'s_hogen', heiji:'s_heiji', toba:'s_fever'};
function figure(k){ const c = tr(SCAP[k]||''); return `<figure class="plate"><img src="${IMG[k]}" alt="${c}" loading="lazy"><figcaption>${c}</figcaption></figure>`; }

/* 天狗之鉴：真画随天狗值由墨转彩 */
function tenguGauge(lv){
  const g = Math.max(0, 1 - lv/80), op = .35 + Math.min(lv,100)/100*.65;
  return `<img src="${IMG.t_kyo}" alt="${tr('河锅晓斋绘天狗')}" style="filter:grayscale(${g}) sepia(${g*.4}) contrast(${1+lv/400});opacity:${op}">`;
}
