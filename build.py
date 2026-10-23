import pathlib, json, glob
p=pathlib.Path('.')
src={str(a['id']):a['zh'] for a in json.load(open('strings.json'))}
d={'ja':{},'en':{}}
for lang in d:
    for f in sorted(glob.glob(f'tr/{lang}_*.json')):
        for k,v in json.load(open(f)).items():
            if k in src and isinstance(v,str) and v: d[lang][src[k]]=v
ex=json.load(open('tr/extra.json'))
for lang in d: d[lang].update({k:v for k,v in ex[lang].items() if k not in d[lang]})
(p/'i18n_data.js').write_text('I18N.ja='+json.dumps(d['ja'],ensure_ascii=False)+';\nI18N.en='+json.dumps(d['en'],ensure_ascii=False)+';\n')
order=['prelude.js','i18n_data.js','s0_2.js','s3_4.js','s5_6.js','s7_8.js','imgdata.js','endings.js','people.js','portraits.js','misc.js','who.js','music.js','engine.js']
js=''.join((p/f).read_text() + '\n' for f in order)
(p/'all.js').write_text(js)
html=(p/'shell.html').read_text()+'\n<script>\n'+js+'\n</script>\n'
print(len(html.encode()), {k:len(v) for k,v in d.items()}, 'of', len(src))
# Netlify / standalone version: full document wrapper
wrap = '<!doctype html>\n<html lang="zh-Hans">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n</head>\n<body>\n' + html + '\n</body>\n</html>\n'
(p/'index.html').write_text(wrap)
