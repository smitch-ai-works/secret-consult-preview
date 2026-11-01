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
