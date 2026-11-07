/* BONUS_V37_MIGRATION_START */
(()=>{const rules={"04": {"product": {"hash": "964932e0", "value": "架空の紹介案件A（計算練習）"}, "reward": {"hash": "4a8827ab", "value": "承認1件あたり3,000円という練習設定。"}, "conversion": {"hash": "3b585bdd", "value": "実際の案件では、申込・購入など何を成果として計測するかを確認する。"}, "target": {"hash": "7e088054", "value": "初回利用など対象者の条件があるか、紹介する案件で確認する。"}, "approval": {"hash": "354da00c", "value": "取消・返品など、承認されない条件を確認する。"}, "purchase": {"hash": "485339cc", "value": "送料・購入回数・継続・解約など、販売ページの条件を確認する。"}, "source": {"hash": "23f24c7e", "value": "これは練習例。実際に使うときは、条件の確認元URLと確認日へ置き換える。"}, "unknown": {"hash": "03325774", "value": "実際の成果地点、対象者、承認時期、購入条件。"}, "accountMemo": {"hash": "e128e2d6", "value": "紹介内容と案内先が合い、自分の紹介として計測するリンクを使っているかを確認する。"}}, "09": {"entryRoute": {"hash": "4881d841", "value": "first"}, "searchMemo": {"hash": "c9179868", "value": "携帯用ブラシと収納ポーチを、外出先で身だしなみを整える場面から比較する。実際に調べた日と確認元を残す。"}, "aProduct": {"hash": "dda330c8", "value": "携帯用ブラシ（架空商品の練習例）"}, "aScene": {"hash": "6a81613b", "value": "外出先で髪を整え、小さなバッグへ道具をしまいたい人。"}, "aFacts": {"hash": "24084727", "value": "折りたたみ式・ケース付きという練習設定。開く・閉じる・しまう形を見せる。"}, "aTerms": {"hash": "a6930a7c", "value": "実際に紹介する商品の成果条件と案内先を確認する。"}, "aUnknown": {"hash": "4bc36902", "value": "実商品の仕様、使える素材、購入・成果の条件。"}, "bProduct": {"hash": "016d06aa", "value": "収納ポーチ（架空商品の練習例）"}, "bScene": {"hash": "96081d22", "value": "外出用の道具をまとめ、取り出しやすくしまいたい人。"}, "bFacts": {"hash": "7041b216", "value": "仕切りがあるという練習設定。内側と、道具を入れた形を見せる。"}, "bTerms": {"hash": "21fbe470", "value": "実際に紹介する商品の成果条件と案内先を確認する。"}, "bUnknown": {"hash": "e1f2884f", "value": "実商品のサイズ、素材の出所、購入・成果の条件。"}, "testHypothesis": {"hash": "c4a27eeb", "value": "ブラシを選ぶ人へ、使う形としまう形を見せる構成を一本作る。効果や売上を予測した仮説ではなく、見せ方を確かめる練習。"}, "reviewDate": {"hash": "37aa0d8b", "value": "実際の確認日と、公開後に同じ指標を見直す日を記入する。"}, "next": {"hash": "cc7b6691", "value": "まずブラシの実商品を一候補確認し、仕様・素材・案内先をそろえられるかを見る。"}}};const hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return (h>>>0).toString(16).padStart(8,'0')};for(const [n,fields] of Object.entries(rules)){try{const key='secret-bonus-v15-volume-'+n;const saved=JSON.parse(localStorage.getItem(key)||'null');if(!saved?.fields)continue;let changed=false;for(const [name,rule] of Object.entries(fields))if(typeof saved.fields[name]==='string'&&hash(saved.fields[name])===rule.hash){saved.fields[name]=rule.value;changed=true;}if(changed)localStorage.setItem(key,JSON.stringify(saved));}catch{}}})();
/* BONUS_V37_MIGRATION_END */
(()=>{'use strict';
const PREFIX='secret-bonus-v15-';
const store={get(k){try{return JSON.parse(localStorage.getItem(PREFIX+k)||'null')}catch{return null}},set(k,v){try{localStorage.setItem(PREFIX+k,JSON.stringify(v));return true}catch{return false}},remove(k){try{localStorage.removeItem(PREFIX+k)}catch{}}};
document.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));
document.querySelectorAll('[data-quiz-answer]').forEach(b=>b.addEventListener('click',()=>{const group=b.closest('fieldset');group.querySelectorAll('button').forEach(x=>{x.classList.remove('is-correct','is-incorrect');x.setAttribute('aria-pressed','false')});b.classList.add(b.dataset.quizAnswer==='true'?'is-correct':'is-incorrect');b.setAttribute('aria-pressed','true');group.querySelector('.quiz-feedback').textContent=(b.dataset.quizAnswer==='true'?'その通りです。':'もう一度、図へ戻ると見えてきます。')+b.dataset.feedback;}));
const yen=n=>Math.round(n).toLocaleString('ja-JP')+'円';
const num=v=>v===''||v==null?null:(Number.isFinite(Number(v))?Number(v):null);
const calculator=document.querySelector('[data-reward-calculator]');
if(calculator){
 const fields=[...calculator.querySelectorAll('input')];const saved=store.get('reward-calculator');if(saved)fields.forEach(x=>{if(Object.hasOwn(saved,x.name))x.value=saved[x.name]});
 const update=()=>{const data=Object.fromEntries(fields.map(x=>[x.name,x.value]));const u=num(data.unit),o=num(data.occurred),a=num(data.approved),c=num(data.cost);const status=calculator.querySelector('[data-calc-status]');
  const invalid=[u,o,a,c].some(x=>x==null||x<0)||!Number.isInteger(o)||!Number.isInteger(a)||a>o;
  status.classList.toggle('error',invalid);status.textContent=invalid?'0以上の数値を入力してください。件数は整数、承認件数は発生件数以下にします。':'発生額と確定額を分けて表示しています。';
  const values={occurred:invalid?null:u*o,approved:invalid?null:u*a,balance:invalid?null:u*a-c};
  for(const [k,v] of Object.entries(values))calculator.querySelector('[data-calc="'+k+'"]').textContent=v==null?'—':yen(v);store.set('reward-calculator',data);
 };calculator.addEventListener('input',update);update();
}
const form=document.querySelector('form[data-tool]');if(!form)return;
const volume=form.dataset.volume,kind=form.dataset.tool,key='volume-'+volume;
const outputPanel=form.querySelector('.output-panel'),output=form.querySelector('[data-output]'),status=form.querySelector('[data-tool-status]');
let promptKind=0;
const common={product:'携帯用ブラシ',audience:'外出先で髪を整える道具を選ぶ人',scene:'昼休みや外出前。小さなバッグへ道具をしまいたい。',facts:'折りたたみ式。収納ケース付き。',source:'この教材の練習設定。実商品では、確認した仕様と出所に置き換える。',reason:'開いた形と、しまった形の両方が見えれば、持ち運ぶときの形を確かめられる。',destination:'サイズと購入条件を、商品ページで確認する。'};
const examples={
 '02':{slot:'水曜日、夕食のあとに20分',finish:'紹介候補を一つ選び、仕様と出所を一つのメモへまとめる。',materials:'候補の商品情報、使える素材の一覧、記入するメモ。',restart:'次回は、このメモを開いて「相手と使う場面」を一つ決める。'},
 '04':{product:'候補の案件A（記入例）',reward:'1件3,000円とする。',conversion:'指定された申込または購入が完了したこと。実際の成果条件を確認する。',target:'初回利用など、案件の対象条件を確認する。',approval:'取消や返品など、否認に関係する条件を確認する。',purchase:'送料・購入回数・継続や解約の条件を確認する。',source:'条件が載ったページのURLと、確認した日付をここへ記入。',unknown:'どの時点で承認されるか、確認する。'},
 '05':common,
 '06':{stage0:true,stage1:true,stage2:false,stage3:false,stage4:false,blocker:'開いた形と閉じた形の素材はあるが、ケースへしまう素材がまだない。',next:'使える収納素材を一つ用意し、出所をメモする。'},
 '07':{min0:'15',task0:'商品の仕様と出所を一件メモする',min2:'20',task2:'相手・場面・事実を一枚にする',min5:'45',task5:'一回分を形にし、商品の事実と照合する',min6:'10',task6:'反応と、次に直す一つを残す',restart:'水曜は、月曜に残した仕様メモから設計を始める。',request:'確定原稿を、意味がつながる一行ごとのフレーズへ区切る。',materials:'確定原稿、完成見本。',fixed:'語句・数字・意味・掲載順。',delivery:'納期は相談して決める。UTF-8のテキスト。追加・抜け・言い換えがないか確認。'},
 '08':{...common,script:'外へ持っていくブラシを選ぶなら、開いた形だけでなく、折りたたんだ形とケースも。サイズと購入条件は、商品ページで確認してください。',timing:''},
 '09':{aProduct:'携帯用ブラシ（練習例）',aScene:'外出先で髪を整え、小さなバッグに道具をしまいたい人。',aFacts:'折りたたみ式・ケース付きという練習設定。開く・閉じる形を見せる。',aTerms:'実商品の案件条件と案内先は未確認。',aUnknown:'実際の仕様、利用できる素材、報酬の成果条件。',bProduct:'収納ポーチ（練習例）',bScene:'外出用の道具をまとめ、探さず取り出したい人。',bFacts:'仕切りがあるという練習設定。内側と収納した形を見せる。',bTerms:'実商品の案件条件と案内先は未確認。',bUnknown:'実際のサイズ、素材の出所、報酬の成果条件。',next:'まず携帯用ブラシの実商品を一候補調べ、仕様と使える素材がそろうかを確認する。'},
 '10':{aPeriod:'公開から7日間という比較の例',aViews:'500',aClicks:'10',aApproved:'24000',aCost:'3000',bPeriod:'公開から7日間という比較の例',bViews:'1500',bClicks:'15',bApproved:'30000',bCost:'5000',same:'集計期間と指標をそろえる。案内先の変更がないか確認する。',changed:'例では、表示数とクリック数の変化を記録した。',next:'次は案内の一文だけを変え、公開から同じ日数で数を比べる。'},
};
const controls=()=>[...form.elements].filter(x=>x.name&&['INPUT','TEXTAREA','SELECT'].includes(x.tagName));
const read=()=>Object.fromEntries(controls().map(x=>[x.name,x.type==='checkbox'?x.checked:x.value]));
const value=n=>(form.elements.namedItem(n)?.value||'').trim();
const setValues=data=>controls().forEach(x=>{if(Object.hasOwn(data,x.name)){if(x.type==='checkbox')x.checked=Boolean(data[x.name]);else x.value=data[x.name]??'';}});
const note=(s,error=false)=>{status.textContent=s;status.classList.toggle('error',error)};
const saved=store.get(key);if(saved?.fields){setValues(saved.fields);promptKind=Number.isInteger(saved.promptKind)?saved.promptKind:0;}
const persist=()=>store.set(key,{fields:read(),promptKind});
function update(){
 if(kind==='route'){const count=controls().filter(x=>x.type==='checkbox'&&x.checked).length;form.querySelector('[data-route-count]').textContent=count+' / 5';form.querySelector('progress').value=count;}
 if(kind==='week'){const total=Array.from({length:7},(_,i)=>num(value('min'+i))||0).reduce((a,b)=>a+b,0);form.querySelector('[data-week-total]').textContent=total+'分';}
 if(kind==='metrics'){
  const a=ratio('a'),b=ratio('b');const box=form.querySelector('.metrics-live');box.textContent='';
  for(const [label,rate,k] of [['前回',a,'a'],['今回',b,'b']]){const p=document.createElement('p');p.textContent=label+'のクリック率：'+(rate==null?(num(value(k+'Views'))===0?'見られた数が0のため算出しません。':'表示数とクリック数を入力すると計算します。'):rate.toFixed(2)+'%');box.append(p);}
  if(a!=null&&b!=null){const p=document.createElement('p');p.textContent='差：'+(b-a>=0?'+':'')+(b-a).toFixed(2)+'ポイント。理由は、条件や変更点と一緒に考えます。';box.append(p);}
 }
 if(kind==='prompts'){
  form.querySelectorAll('[data-prompt-kind]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.promptKind)===promptKind)));
  form.querySelector('.prompt-materials').hidden=promptKind>=4;
  form.querySelector('.prompt-script').hidden=promptKind<3;
  form.querySelector('.prompt-timing').hidden=promptKind!==5;
 }
}
function ratio(k){const v=num(value(k+'Views')),c=num(value(k+'Clicks'));return v!=null&&v>0&&c!=null?100*c/v:null;}
update();form.addEventListener('input',()=>{update();note(persist()?'入力を保存しました。':'端末へ保存できません。内容をまとめてテキストで保存してください。',false)});
form.querySelector('[data-example]')?.addEventListener('click',()=>{controls().forEach(x=>{if(x.type==='checkbox')x.checked=false;else x.value=''});setValues(examples[volume]||{});outputPanel.hidden=true;update();persist();note('記入例を入れました。自分の内容へ置き換えて使ってください。');});
form.querySelector('[data-clear]')?.addEventListener('click',()=>{controls().forEach(x=>{if(x.type==='checkbox')x.checked=false;else x.value=''});output.value='';outputPanel.hidden=true;store.remove(key);update();note('このページの入力を空にしました。');});
form.querySelector('.transfer-design')?.addEventListener('click',()=>{const d=store.get('volume-05');if(!d?.fields||!Object.values(d.fields).some(Boolean)){note('05の設計シートへ入力すると、ここへ読み込めます。',true);return}setValues(d.fields);persist();note('05の設計を読み込みました。必要な工程を選んで指示文を作れます。');});
form.querySelectorAll('[data-prompt-kind]').forEach(b=>b.addEventListener('click',()=>{promptKind=Number(b.dataset.promptKind);update();persist();note('「'+window.BONUS_PROMPTS[promptKind][0]+'」の指示を選びました。');}));
const line=(label,name)=>label+'：'+(value(name)||'［未記入］');
function build(){
 if(kind==='plan')return ['次の一回の作業メモ',line('作業する枠','slot'),line('その枠で終わらせること','finish'),line('先に用意するもの','materials'),line('次回の始め方','restart')].join('\n\n');
 if(kind==='offer')return ['案件条件の確認メモ',...['product','reward','conversion','target','approval','purchase','source','unknown'].map((k,i)=>line(['案件・商品','報酬','成果の条件','対象者','承認・取消の条件','購入条件','参照した場所と確認日','まだ確認すること'][i],k))].join('\n\n');
 if(kind==='design')return ['収益化の設計メモ',...['product','audience','scene','facts','source','reason','destination'].map((k,i)=>line(['商品','相手','使う場面','確認した事実','出所','相手に関係する理由','案内先で確かめること'][i],k)),'紹介の順番','1. '+(value('scene')||'［使う場面］')+'\n2. '+(value('facts')||'［商品の事実］')+'\n3. '+(value('reason')||'［相手に関係する理由］')+'\n4. '+(value('destination')||'［案内先］')].join('\n\n');
 if(kind==='route'){const names=['条件を確認','相手と場面を設計','素材を準備','一回分を制作','結果を記録'];return ['最初の一回・進行メモ',...names.map((s,i)=>(form.elements.namedItem('stage'+i).checked?'✓ ':'□ ')+s),line('いま止まっていること','blocker'),line('次に終わらせる一つ','next')].join('\n\n');}
 if(kind==='week'){const days=['月','火','水','木','金','土','日'];return ['週間の仕込み',...days.map((d,i)=>d+'｜'+(value('min'+i)||'未記入')+'分｜'+(value('task'+i)||'作業は未記入')),form.querySelector('.week-total').textContent,line('次回の最初に開くもの','restart'),'依頼メモ',line('お願いする作業','request'),line('渡す材料','materials'),line('変えないもの','fixed'),line('納期・形式・確認範囲','delivery')].join('\n\n');}
 if(kind==='prompts'){
  if(promptKind<4&&(!value('audience')||!value('facts')))throw new Error('相手と商品の事実を入力してください。');
  if(promptKind>=3&&!value('script'))throw new Error('この工程では原稿を入力してください。');
  if(promptKind===5&&!value('timing'))throw new Error('字幕形式にするには、実音声で確認した開始・終了時刻を入力してください。');
  const task=window.BONUS_PROMPTS[promptKind];const rules='入力にない体験・効果・価格・数値・実績を足さないでください。未確認のことは、本文と分けて「確認すること」に残してください。';
  const materials=promptKind<4?['audience','scene','facts','source','reason','destination'].map((k,i)=>line(['相手','使う場面','確認した商品の事実','情報の出所','相手に関係する理由','案内先'][i],k)).join('\n'):'';
  return [task[1],rules,materials,promptKind>=3?line('原稿','script'):'',promptKind===5?line('確認済みの時刻','timing'):''].filter(Boolean).join('\n\n');
 }
 if(kind==='research')return ['候補の比較メモ',...['a','b'].map((k,i)=>['候補'+(i?'B':'A'),...['Product','Scene','Facts','Terms','Unknown'].map((name,j)=>line(['商品名','相手と場面','仕様と素材','案件条件・案内先','不足している情報'][j],k+name))].join('\n')),line('次に調べる候補と理由','next')].join('\n\n');
 if(kind==='metrics')return ['数字と改善の比較メモ',...['a','b'].map((k,i)=>{const rate=ratio(k),a=num(value(k+'Approved')),c=num(value(k+'Cost'));return [(i?'今回':'前回'),line('集計期間',''+k+'Period'),'見られた数：'+(num(value(k+'Views'))?.toLocaleString('ja-JP')??'未記入'),'クリック数：'+(num(value(k+'Clicks'))?.toLocaleString('ja-JP')??'未記入'),'クリック率：'+(rate==null?'算出しない':rate.toFixed(2)+'%'),'確定額：'+(a==null?'未記入':yen(a)),'記入した費用：'+(c==null?'未記入':yen(c)),'確定額 − 記入費用：'+(a==null||c==null?'両方の数値を入力すると計算':yen(a-c))].join('\n')}),line('比較の条件','same'),line('前回から変えたこと','changed'),line('次に変える一つ','next')].join('\n\n');
 return '';
}
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;
 try{if(!controls().some(x=>x.type==='checkbox'?x.checked:x.value.trim()))throw new Error('記入例を入れるか、自分の内容を入力してください。');output.value=build();outputPanel.hidden=false;persist();note(kind==='prompts'?'AIへ貼り付ける指示文を作りました。':'入力した内容をまとめました。コピー・保存して使えます。');}catch(error){note(error.message,true);}
});
form.querySelector('[data-copy]')?.addEventListener('click',async()=>{if(!output.value)return;try{await navigator.clipboard.writeText(output.value);note('コピーしました。')}catch{output.focus();output.select();note('文章を選択しました。コピーして使ってください。');}});
form.querySelector('[data-download]')?.addEventListener('click',()=>{if(!output.value)return;const url=URL.createObjectURL(new Blob(['\ufeff'+output.value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='特典'+volume+'_実践メモ.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);note('保存用のテキストファイルを作りました。');});
})();

/* 既存v15の入力と保存キーを保ち、完成確認と段階別の読み取りを追加。 */
(()=>{'use strict';
 const form=document.querySelector('form[data-tool]');
 document.querySelectorAll('[data-select-prompt]').forEach(b=>b.addEventListener('click',()=>{
  const target=document.querySelector('[data-prompt-kind="'+b.dataset.selectPrompt+'"]');
  if(target){target.click();target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});target.focus({preventScroll:true});}
 }));
 if(!form)return;
 const kind=form.dataset.tool,volume=form.dataset.volume;
 const get=n=>(form.elements.namedItem(n)?.value||'').trim();
 const number=n=>get(n)===''?null:Number(get(n));
 const text=(tag,value)=>{const x=document.createElement(tag);x.textContent=value;return x};
 const rate=(a,b)=>a==null||b==null?'未入力':b===0?'算出しない（母数0）':(100*a/b).toFixed(2)+'%';
 const labels={Scene:'相手の場面',Facts:'仕様と素材',Terms:'案件条件',Destination:'案内先'};
 const routes=[['04','条件メモを完成させる','報酬・成果・承認・購入条件を確認する。'],['05','相手と場面を一つにする','商品を選ぶ場面と、見せる事実を決める。'],['09','足りない素材をそろえる','必要な形・動き・仕様と、その出所を確認する。'],['08','一回分の紹介を作る','設計メモを渡し、構成から確定原稿まで進める。'],['10','反応を残して見直す','公開日・同じ期間の数字・次に試す一つを記録する。']];
 function update(){
  if(kind==='route'){
   const box=form.querySelector('[data-route-next]');box.replaceChildren();
   const i=routes.findIndex((_,i)=>!form.elements.namedItem('stage'+i).checked);
   if(i<0){box.append(text('strong','5点がそろいました。次は、10で反応を見直します。'));return;}
   const [n,title,description]=routes[i];box.append(text('strong','次に見る場所：'+title),text('p',description));
   const a=text('a','特典'+n+'のシートを開く');a.href=n+'.html#practice';box.append(a);
  }
  if(kind==='metrics'){
   const box=form.querySelector('[data-funnel-live]');box.replaceChildren(text('h3','クリックの先も、段階を分ける。'));
   const row=(a,b,c)=>{const r=document.createElement('div');r.className='funnel-row';r.append(text('span',a),text('strong',b),text('strong',c));box.append(r)};
   row('段階','前回','今回');
   for(const [label,n,d] of [['クリック率','Clicks','Views'],['クリック→発生','Occurred','Clicks'],['発生→承認','ApprovedCount','Occurred']])row(label,rate(number('a'+n),number('a'+d)),rate(number('b'+n),number('b'+d)));
   let invalid=false;
   for(const k of ['a','b']){
    const occured=number(k+'Occurred'),approved=number(k+'ApprovedCount');
    if(occured!=null&&approved!=null&&approved>occured){const p=text('p',(k==='a'?'前回':'今回')+'：承認件数は発生件数以下にしてください。');p.className='error';box.append(p);invalid=true;}
   }
   box.append(text('p',invalid?'入力の件数を確認してください。':'未確認の件数は空欄で構いません。0件と、未確認を分けて残します。'));
   const clicks=number('bClicks'),occurred=number('bOccurred'),views=number('bViews');
   let suggestion='比較期間・相手・案内先などの条件と、今回変えた箇所を一緒に確認します。';
   if(views===0)suggestion='見られた数が0件です。計測期間と公開状態を先に確認します。';
   else if(clicks===0&&views>0)suggestion='表示はあり、クリックは0件。案内が見える位置・言葉・リンクが開くかを確認します。';
   else if(clicks>0&&occurred===0)suggestion='クリックはあり、発生は0件。案内内容と行き先の一致、成果条件、計測期間を確認します。';
   box.append(text('p','次に確認する場所：'+suggestion));
  }
 }
 update();form.addEventListener('input',update);form.addEventListener('change',update);
 form.querySelector('[data-example]')?.addEventListener('click',()=>{
  if(kind==='metrics'){
   for(const [name,v] of Object.entries({aOccurred:'5',aApprovedCount:'3',bOccurred:'5',bApprovedCount:'4',aApproved:'9000',bApproved:'12000',aCost:'1000',bCost:'2000'})){form.elements.namedItem(name).value=v;}
  }
  if(kind==='research')for(const k of ['a','b'])for(const suffix of Object.keys(labels))form.elements.namedItem(k+'Check'+suffix).value='unknown';
  form.dispatchEvent(new Event('input',{bubbles:true}));
 });
 form.querySelector('[data-clear]')?.addEventListener('click',update);
 form.addEventListener('submit',event=>{
  form.querySelector('.output-panel').hidden=true;
  if(kind==='metrics')for(const k of ['a','b']){
   const occurred=number(k+'Occurred'),approved=number(k+'ApprovedCount');
   if(occurred!=null&&approved!=null&&approved>occurred){
    event.preventDefault();event.stopImmediatePropagation();
    const status=form.querySelector('[data-tool-status]');status.textContent='承認件数は発生件数以下にしてください。';status.classList.add('error');return;
   }
  }
 },true);
 form.addEventListener('submit',()=>{
  if(!form.reportValidity())return;
  const output=form.querySelector('[data-output]');const panel=form.querySelector('.output-panel');
  if(panel.hidden||!output.value)return;
  const review=form.querySelector('[data-result-review]');review.replaceChildren();review.hidden=false;
  let checks=[];
  if(kind==='design')checks=[['audience','相手'],['scene','使う場面'],['facts','商品の事実'],['source','出所'],['reason','相手が選ぶ理由'],['destination','案内先']];
  if(kind==='offer')checks=[['reward','報酬'],['conversion','成果条件'],['approval','承認条件'],['purchase','購入条件'],['source','確認先と日付']];
  if(kind==='plan')checks=[['slot','作業枠'],['finish','完成物'],['materials','先に開くもの'],['restart','次の作業']];
  if(kind==='week')checks=[['restart','再開する場所']];
  const missing=checks.filter(([n])=>!get(n)).map(([,label])=>label);
  review.append(text('strong',missing.length?'次に埋める材料':'完成したメモの使い方'));
  review.append(text('p',missing.length?missing.join('・')+'を追加すると、次の工程へ進めます。':({'design':'05の設計を08へ読み込み、構成案を作れます。','offer':'条件が不明な箇所は、紹介前に確認先へ質問します。','plan':'決めた時間になったら、記入した資料から始めます。','week':'次の作業枠では「再開する場所」を先に開きます。','route':'表示された次の資料で、未完了の一段階を進めます。','prompts':'AIへ貼り付け、出力例と照らしてから採る案を選びます。','research':'不足がある候補は、先に確認する材料を一つ決めます。','metrics':'次に変える一つと、比較する期間を決めて記録します。'}[kind]||'記録した内容を次の一回に使います。')));
  if(kind==='research'){
   let addition='\n\n着手する材料の確認';
   for(const k of ['a','b']){
    addition+='\n候補'+k.toUpperCase();
    for(const [suffix,label] of Object.entries(labels))addition+='\n'+label+'：'+({ready:'確認済み',missing:'不足あり',unknown:'未確認'}[get(k+'Check'+suffix)]||'未確認');
   }
   output.value+=addition;
   review.append(text('p','確認済みの項目が多いことは、売上の予測ではありません。自分で着手できる材料として比較します。'));
  }
  if(kind==='metrics'){
   let addition='\n\n段階別の割合';
   for(const k of ['a','b'])addition+='\n'+(k==='a'?'前回':'今回')+'｜クリック→発生：'+rate(number(k+'Occurred'),number(k+'Clicks'))+'｜発生→承認：'+rate(number(k+'ApprovedCount'),number(k+'Occurred'));
   output.value+=addition;
  }
 });
})();

/* BONUS_V32_START */
(()=>{'use strict';
const examples=window.BONUS_V32_EXAMPLES||{};
const form=document.querySelector('form[data-tool]');
if(form){
 const volume=form.dataset.volume,kind=form.dataset.tool;
 const value=n=>(form.elements.namedItem(n)?.value||'').trim();
 const extra=[...form.querySelectorAll('[data-v32-field]')];
 const routeNames=['条件・登録・承認・リンクの確認','相手と場面の設計','使う素材の準備','原稿・映像・案内先の照合','公開日と見直す日の記録'];
 function updateRoute(){
  if(kind!=='route')return;
  const box=form.querySelector('[data-route-next]');box.replaceChildren();
  const i=routeNames.findIndex((_,i)=>!form.elements.namedItem('stage'+i).checked);
  const strong=document.createElement('strong');strong.textContent=i<0?'一回分の準備と記録がそろいました。':'次に終わらせるもの：'+routeNames[i];box.append(strong);
  const p=document.createElement('p');p.textContent=i<0?'決めた見直す日に、同じ期間の反応を残し、次に変える一つを決めます。':['このページの手順01で登録・承認・リンクを確認し、初期設定メモへ残します。','手順02〜03で参考と四場面を決めます。','手順03で、各場面に使う素材と出所をそろえます。','手順04で、実際に原稿・映像・案内先を照合します。','手順05で、見直す日と記録する数字を決めます。'][i];box.append(p);
  const a=document.createElement('a');a.href='#lesson-'+([1,2,3,4,5][Math.max(0,i)]);a.textContent='このページの手順へ戻る';box.append(a);
 }
 updateRoute();form.addEventListener('input',updateRoute);form.addEventListener('change',updateRoute);
 form.querySelector('[data-clear]')?.addEventListener('click',updateRoute);
 form.querySelector('[data-example]')?.addEventListener('click',()=>{
  for(const [name,v] of Object.entries(examples[volume]||{})){const field=form.elements.namedItem(name);if(field)field.value=v;}
  form.dispatchEvent(new Event('input',{bubbles:true}));
 });
 form.addEventListener('submit',()=>{
  const panel=form.querySelector('.output-panel'),output=form.querySelector('[data-output]');
  if(panel.hidden||!output.value)return;
  if(extra.length)output.value+='\n\n'+({'02':'観察から改善へ','04':'報酬設定の確認','06':'最初の一本の制作メモ','09':'今回の参入ルート','10':'次の比較'}[volume]||'追加メモ')+'\n'+extra.map(x=>x.dataset.v32Field+'：'+(x.tagName==='SELECT'?(x.selectedOptions[0]?.textContent||'未選択'):(value(x.name)||'［未記入］'))).join('\n\n');
  const review=form.querySelector('[data-result-review]');
  if(volume==='02'&&review){review.replaceChildren();const p=document.createElement('p');p.textContent=value('ownChange')?'観察した事実と理由を読み、自分の素材で変える一つから制作を始めます。':'参考・判断理由・自分の変更点を埋めると、時間割だけでなく制作の判断を再開できます。';review.append(p);review.hidden=false;}
  if(volume==='06'&&review){review.replaceChildren();const p=document.createElement('p');p.textContent='初期設定の状態を自分の管理画面で確かめ、未完了の一段階から進めます。このメモは承認やリンク計測の成否を自動判定するものではありません。';review.append(p);review.hidden=false;}
 });
}

const caption=document.querySelector('[data-caption-tool]');if(!caption)return;
const key='secret-bonus-v32-caption',input=caption.elements.namedItem('captionRows'),status=caption.querySelector('[data-caption-status]'),panel=caption.querySelector('[data-caption-panel]'),out=caption.querySelector('[data-caption-output]');
const note=(message,error=false)=>{status.textContent=message;status.classList.toggle('error',error)};
try{const saved=localStorage.getItem(key);if(saved!==null)input.value=saved;}catch{}
const persist=()=>{try{localStorage.setItem(key,input.value);return true}catch{return false}};
input.addEventListener('input',()=>{panel.hidden=true;note(persist()?'入力を保存しました。時刻と字幕を確認してから作成してください。':'端末へ保存できません。必要な入力はコピーして残してください。')});
caption.querySelector('[data-caption-example]').addEventListener('click',()=>{input.value='0 | 2.4 | 外へ持っていくブラシを選ぶなら、\n2.4 | 4.8 | 開いた形だけでなく、\n4.8 | 7.2 | 折りたたんだ形とケースも。\n7.2 | 10.5 | サイズと購入条件は、\\n商品ページで確認してください。';panel.hidden=true;persist();note('作例を入れました。自分の音声で確認した時刻と字幕へ置き換えてください。');});
caption.querySelector('[data-caption-clear]').addEventListener('click',()=>{input.value='';out.value='';panel.hidden=true;try{localStorage.removeItem(key)}catch{}note('この字幕欄の入力を空にしました。');});
const time=ms=>{const hour=Math.floor(ms/3600000),min=Math.floor(ms%3600000/60000),sec=Math.floor(ms%60000/1000),msec=ms%1000;return [hour,min,sec].map(x=>String(x).padStart(2,'0')).join(':')+','+String(msec).padStart(3,'0')};
caption.addEventListener('submit',event=>{event.preventDefault();panel.hidden=true;out.value='';
 try{
  const lines=input.value.split(/\r?\n/).map((line,i)=>({line:line.trim(),i:i+1})).filter(x=>x.line);
  if(!lines.length)throw new Error('秒数と字幕を一行以上入力してください。');
  let previousEnd=0;const entries=[];
  for(const {line,i} of lines){
   const parts=line.split('|');if(parts.length<3)throw new Error(i+'行目：開始秒 | 終了秒 | 字幕 の順に入力してください。');
   const first=parts.shift().trim(),last=parts.shift().trim(),text=parts.join('|').trim().replace(/\\n/g,'\n');
   if(!/^\d+(?:\.\d{1,3})?$/.test(first)||!/^\d+(?:\.\d{1,3})?$/.test(last))throw new Error(i+'行目：秒数は0以上、小数点以下3桁までの数値にしてください。');
   const start=Math.round(Number(first)*1000),end=Math.round(Number(last)*1000);
   if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||end<=start)throw new Error(i+'行目：終了は開始より後の時刻にしてください。');
   if(start<previousEnd)throw new Error(i+'行目：前の字幕の終了と重なっています。音声で確認し、時刻を直してください。');
   if(!text||text.split('\n').some(x=>!x.trim()))throw new Error(i+'行目：字幕本文を入力し、空の改行を除いてください。');
   entries.push(entries.length+1+'\n'+time(start)+' --> '+time(end)+'\n'+text);previousEnd=end;
  }
  out.value=entries.join('\n\n')+'\n';panel.hidden=false;persist();note(entries.length+'件のSRTを作りました。保存して、編集ソフトで全編を照合してください。');
 }catch(error){note(error.message,true);}
});
caption.querySelector('[data-caption-copy]').addEventListener('click',async()=>{if(!out.value)return;try{await navigator.clipboard.writeText(out.value);note('SRTの内容をコピーしました。')}catch{out.focus();out.select();note('コピーできませんでした。選択した内容を手動でコピーしてください。',true)}});
caption.querySelector('[data-caption-download]').addEventListener('click',()=>{if(!out.value)return;const url=URL.createObjectURL(new Blob(['\ufeff'+out.value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='字幕.srt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);note('字幕.srtの保存を開始しました。編集ソフトで読み込み、音声と照合してください。');});
})();
/* BONUS_V32_END */

/* BONUS_V37_START */
(()=>{'use strict';
const examples={"05": {"shot1": "バッグと商品を同じ画面で見せる。", "shot2": "ブラシを開く→折りたたむ動き。", "shot3": "収納ケースへしまった形。", "shot4": "サイズと購入条件を確認できる商品ページの案内。"}, "08": {"shot1": "バッグと商品を同じ画面で見せる。", "shot2": "ブラシを開く→折りたたむ動き。", "shot3": "収納ケースへしまった形。", "shot4": "サイズと購入条件を確認できる商品ページの案内。"}, "04": {"product": "架空の紹介案件A（計算練習）", "reward": "承認1件あたり3,000円という練習設定。", "conversion": "実際の案件では、申込・購入など何を成果として計測するかを確認する。", "target": "初回利用など対象者の条件があるか、紹介する案件で確認する。", "approval": "取消・返品など、承認されない条件を確認する。", "purchase": "送料・購入回数・継続・解約など、販売ページの条件を確認する。", "source": "これは練習例。実際に使うときは、条件の確認元URLと確認日へ置き換える。", "unknown": "実際の成果地点、対象者、承認時期、購入条件。", "accountMemo": "紹介内容と案内先が合い、自分の紹介として計測するリンクを使っているかを確認する。"}, "09": {"entryRoute": "first", "searchMemo": "携帯用ブラシと収納ポーチを、外出先で身だしなみを整える場面から比較する。実際に調べた日と確認元を残す。", "aProduct": "携帯用ブラシ（架空商品の練習例）", "aScene": "外出先で髪を整え、小さなバッグへ道具をしまいたい人。", "aFacts": "折りたたみ式・ケース付きという練習設定。開く・閉じる・しまう形を見せる。", "aTerms": "実際に紹介する商品の成果条件と案内先を確認する。", "aUnknown": "実商品の仕様、使える素材、購入・成果の条件。", "bProduct": "収納ポーチ（架空商品の練習例）", "bScene": "外出用の道具をまとめ、取り出しやすくしまいたい人。", "bFacts": "仕切りがあるという練習設定。内側と、道具を入れた形を見せる。", "bTerms": "実際に紹介する商品の成果条件と案内先を確認する。", "bUnknown": "実商品のサイズ、素材の出所、購入・成果の条件。", "testHypothesis": "ブラシを選ぶ人へ、使う形としまう形を見せる構成を一本作る。効果や売上を予測した仮説ではなく、見せ方を確かめる練習。", "reviewDate": "実際の確認日と、公開後に同じ指標を見直す日を記入する。", "next": "まずブラシの実商品を一候補確認し、仕様・素材・案内先をそろえられるかを見る。"}};
const form=document.querySelector('form[data-tool]');
const get=n=>(form?.elements.namedItem(n)?.value||'').trim();
const show=(message)=>{const s=form?.querySelector('[data-tool-status]');if(s)s.textContent=message;};
function openTarget(hash){
 if(!hash||hash.length<2)return;
 const target=document.getElementById(decodeURIComponent(hash.slice(1)));if(!target)return;
 for(let p=target.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;
}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>openTarget(a.hash)));
openTarget(location.hash);
document.querySelectorAll('[data-v35-copy-target]').forEach(b=>b.addEventListener('click',async()=>{
 const text=document.getElementById(b.dataset.v35CopyTarget)?.innerText||'';
 const status=b.parentElement.querySelector('[data-v35-copy-status]');
 try{await navigator.clipboard.writeText(text);if(status)status.textContent='依頼文をコピーしました。自分の材料へ置き換えて使えます。';}
 catch{if(status)status.textContent='依頼文を選択してコピーしてください。';}
}));
if(!form)return;
const n=form.dataset.volume,kind=form.dataset.tool;
form.querySelector('[data-example]')?.addEventListener('click',()=>{
 for(const [name,value] of Object.entries(examples[n]||{})){const x=form.elements.namedItem(name);if(x)x.value=value;}
 form.dispatchEvent(new Event('input',{bubbles:true}));
});
if(kind==='route'){
 const targets=['setupMemo','firstOutline','firstOutline','checklist','reviewDate'];
 function update(){
  const i=Array.from({length:5},(_,i)=>i).find(i=>!form.elements.namedItem('stage'+i).checked);
  const box=form.querySelector('[data-route-next]');
  const a=box?.querySelector('a');if(!a)return;
  a.href='#'+(targets[i]||'reviewDate');a.textContent='必要な記入欄へ進む';
  const p=box.querySelector('p');if(p)p.textContent=i==null?'見直す日に同じ期間の数字を残します。':'できていない段階の材料を、下の制作メモへ残して進めます。';
  a.addEventListener('click',()=>openTarget(a.hash),{once:true});
 }
 update();form.addEventListener('input',update);form.addEventListener('change',update);
 form.querySelector('[data-example]')?.addEventListener('click',update);
}
form.addEventListener('submit',()=>{
 const panel=form.querySelector('.output-panel'),output=form.querySelector('[data-output]');
 if(panel.hidden||!output.value)return;
 if(kind==='design'||kind==='prompts'&&Number(form.querySelector('[data-prompt-kind][aria-pressed="true"]')?.dataset.promptKind)<4){
  output.value+='\n\n四場面の素材割当\n'+['01 場面','02 事実','03 理由','04 案内'].map((label,i)=>label+'：'+(get('shot'+(i+1))||'［素材は未記入］')).join('\n');
 }
 if(kind==='design'){
  const missing=[1,2,3,4].filter(i=>!get('shot'+i));
  const review=form.querySelector('[data-result-review]');
  if(missing.length&&review){const p=document.createElement('p');p.textContent='素材が未記入の場面：'+missing.join('・')+'。使う素材と出所を確認して追加してください。';review.append(p);}
 }
 if(kind==='metrics'){
  output.value+='\n\n発生・承認の元件数\n'+['a','b'].map((key,i)=>(i?'今回':'前回')+'｜発生件数：'+(get(key+'Occurred')||'［未確認］')+'｜承認件数：'+(get(key+'ApprovedCount')||'［未確認］')).join('\n');
 }
});
})();
/* BONUS_V37_END */
