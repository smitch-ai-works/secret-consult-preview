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
