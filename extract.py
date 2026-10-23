import re,json
files=['prelude.js','s0_2.js','s3_4.js','s5_6.js','s7_8.js','endings.js','people.js','misc.js','portraits.js']
CJK=re.compile(r'[぀-ヿ㐀-鿿]')
def lits(src):
    i=0;n=len(src);out=[]
    while i<n:
        c=src[i]
        if src.startswith('//',i): i=src.find('\n',i); i=n if i<0 else i; continue
        if src.startswith('/*',i): i=src.find('*/',i)+2; continue
        if c in "'\"":
            j=i+1;buf=''
            while src[j]!=c:
                if src[j]=='\\': buf+=src[j+1]; j+=2; continue
                buf+=src[j]; j+=1
            out.append(buf); i=j+1; continue
        if c=='`':
            # template: collect static parts only, skip ${...}
            j=i+1;depth=0
            while True:
                if src[j]=='\\': j+=2; continue
                if src[j]=='`': break
                if src.startswith('${',j):
                    d=1;j+=2
                    while d:
                        if src[j]=='{': d+=1
                        elif src[j]=='}': d-=1
                        elif src[j] in "'\"":
                            q=src[j]; j+=1
                            while src[j]!=q: j+= 2 if src[j]=='\\' else 1
                        j+=1
                    continue
                j+=1
            i=j+1; continue
        i+=1
    return out
seen={}
for f in files:
    for s in lits(open(f).read()):
        if not CJK.search(s): continue
        s=re.sub(r'^@[a-z_0-9]+\|','',s); s=re.sub(r'^[>~]','',s)
        if s not in seen: seen[s]=f
arr=[{'id':i,'f':f,'zh':s} for i,(s,f) in enumerate(seen.items())]
json.dump(arr,open('strings.json','w'),ensure_ascii=False)
print(len(arr), sum(len(a['zh']) for a in arr))
