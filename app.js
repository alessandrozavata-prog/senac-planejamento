// VERSAO 20 - RETRY QUOTA

console.log("VERSAO 20 - Retry automatico em quota exceeded");
// ── STATE ──────────────────────────────────────────
var A={po:'',cn:'',ex:'',ucs:[],su:null,sun:'',hist:[],key:localStorage.getItem('gk')||''};

// ── INIT ───────────────────────────────────────────
window.onload=function(){
  // API key
  if(A.key){
    document.getElementById('ak').value=A.key;
    document.getElementById('ks').innerHTML='<span style="color:var(--stx)"><i class="ti ti-circle-check"></i> Chave configurada</span>';
  } else {
    var w=document.createElement('div');
    w.className='al alw';
    w.innerHTML='<i class="ti ti-key"></i><div>Configure sua chave gratuita em <strong>API Key Gemini</strong> antes de gerar.</div>';
    var ph=document.querySelector('#p0 .ph');
    if(ph) ph.after(w);
  }

  // Counter update function - called multiple ways
  function updateCounter(){
    var po = document.getElementById('po');
    var cc = document.getElementById('cc');
    if(!po || !cc) return;
    var v = po.value || '';
    cc.textContent = v.length.toLocaleString('pt-BR') + ' caracteres';
    cc.style.color = v.length > 500 ? 'var(--stx)' : 'var(--or)';
    A.po = v.trim(); // Always keep A.po in sync
  }

  // Attach to textarea via addEventListener (more reliable than inline)
  var po = document.getElementById('po');
  if(po){
    po.addEventListener('input', updateCounter);
    po.addEventListener('change', updateCounter);
    po.addEventListener('keyup', updateCounter);
    po.addEventListener('paste', function(){ setTimeout(updateCounter, 10); setTimeout(updateCounter, 100); setTimeout(updateCounter, 500); });
    po.addEventListener('drop', function(){ setTimeout(updateCounter, 100); });
    po.addEventListener('blur', updateCounter);
    po.addEventListener('focus', updateCounter);
    po.addEventListener('click', updateCounter);
    po.addEventListener('mouseup', updateCounter);
    po.addEventListener('touchend', updateCounter);
  }

  // Nuclear option: poll every 200ms regardless of events
  setInterval(updateCounter, 200);

  ca();
};


// ── NAV ────────────────────────────────────────────
function gp(i){
  document.querySelectorAll('.pan').forEach(function(p,idx){p.classList.toggle('act',idx===i);});
  ['nv0','nv1','nv2','nv3','nv4','nv5'].forEach(function(id,idx){
    var el=document.getElementById(id);if(!el)return;
    el.classList.remove('act');if(idx===i)el.classList.add('act');
  });
  if(i===3)rs();if(i===4)rh();window.scrollTo(0,0);
}

// ── STEP 0 ─────────────────────────────────────────
function s0(){
  var po = document.getElementById('po');
  var txt = '';
  // Try every possible way to get the value
  if(po){ txt = po.value || po.textContent || po.innerText || ''; }
  txt = txt.trim();
  
  A.po = txt;
  A.cn = (document.getElementById('cn')||{value:''}).value.trim();
  A.ex = (document.getElementById('ex')||{value:''}).value || '';
  
  if(!txt){
    alert('O campo está vazio. Cole o texto do P.O. e clique em Continuar.');
    return;
  }
  
  A.ucs = dUC(A.po);
  rUCG();
  gp(1);
}

// ── DETECT UCs ─────────────────────────────────────
function dUC(t){
  var f=[],s=new Set(),r=/UC\s*(\d+)\s*[:\-–]\s*([^\n\r]{6,100}?)(?=\s*\n|\s*CARGA|\s*\d+\s*h|\s*$)/gi,m;
  while((m=r.exec(t))!==null){
    var n=m[1],nm=m[2].trim().replace(/\s+/g,' ').replace(/[.,:;]+$/,'');
    if(!s.has(n)&&nm.length>4){s.add(n);var sl=t.slice(m.index,m.index+400),ch=sl.match(/(\d+)\s*horas?/i);f.push({num:n,name:nm,ch:ch?ch[1]+'h':''});}
  }
  return f;
}
function rUCG(){
  var g=document.getElementById('ucg');
  if(!A.ucs.length){g.innerHTML='<div class="es"><i class="ti ti-search-off"></i>Nenhuma UC detectada. Use o campo manual.</div>';return;}
  g.innerHTML=A.ucs.map(function(u,i){return '<div class="ucc'+(A.su===i?' sl':'')+'" id="uc'+i+'" onclick="suc('+i+')"><div class="ucn">UC'+u.num+'</div><div class="uct">'+u.name+'</div>'+(u.ch?'<div class="uch"><i class="ti ti-clock"></i> '+u.ch+'</div>':'')+'</div>';}).join('');
}
function suc(i){
  A.su=i;A.sun='UC'+A.ucs[i].num+' – '+A.ucs[i].name;
  document.querySelectorAll('.ucc').forEach(function(c){c.classList.remove('sl');});
  var el=document.getElementById('uc'+i);if(el)el.classList.add('sl');
  document.getElementById('ucm').value='';
  if(A.ucs[i].ch){document.getElementById('chp').value=parseInt(A.ucs[i].ch);ca();}
}
function s1(){
  var m=document.getElementById('ucm').value.trim();
  if(A.su===null&&!m){alert('Selecione uma UC ou descreva manualmente.');return;}
  if(m&&A.su===null)A.sun=m.split('\n')[0].substring(0,120);
  gp(2);
}

// ── STEP 2 ─────────────────────────────────────────
function odc(){document.getElementById('cdw').style.display=document.getElementById('da').value==='custom'?'block':'none';ca();}
function ca(){
  var p=parseFloat(document.getElementById('chp').value)||0,e=parseFloat(document.getElementById('che').value)||0,tot=p+e;
  var d=document.getElementById('da').value,dv=d==='4'?4:d==='3.5'?3.5:d==='misto'?3.75:parseFloat(document.getElementById('dc')&&document.getElementById('dc').value)||0;
  var el=document.getElementById('chi');
  if(tot>0&&dv>0){el.innerHTML='<i class="ti ti-calculator"></i> Total: <strong>'+tot+'h</strong> ÷ '+dv+'h = <strong>~'+Math.ceil(tot/dv)+' aulas</strong>'+(d==='misto'?' (estimado)':'');}
  else{el.innerHTML='Preencha a carga horária para calcular as aulas.';}
}
function s2(){if(!document.getElementById('chp').value){alert('Informe a carga horária presencial.');return;}gp(3);}

// ── SUMMARY ────────────────────────────────────────
function rs(){
  var ucn=A.sun||document.getElementById('ucm').value.split('\n')[0]||'Não selecionada';
  var p=document.getElementById('chp').value||'?',e=document.getElementById('che').value||'0';
  var dur=document.getElementById('da'),nv=document.getElementById('nv'),enf=document.getElementById('enf'),mod=document.getElementById('mod');
  var tot=(parseFloat(p)||0)+(parseFloat(e)||0);
  document.getElementById('sm').innerHTML='<tr><td>Curso</td><td>'+(A.cn||'(não informado)')+'</td></tr><tr><td>Eixo</td><td>'+A.ex+'</td></tr><tr><td>UC</td><td>'+ucn+'</td></tr><tr><td>CH total</td><td><strong>'+tot+'h</strong></td></tr><tr><td>Duração das aulas</td><td>'+dur.options[dur.selectedIndex].text+'</td></tr><tr><td>Nível</td><td>'+nv.options[nv.selectedIndex].text+'</td></tr><tr><td>Ênfase</td><td>'+enf.options[enf.selectedIndex].text+'</td></tr><tr><td>Modalidade</td><td>'+mod.options[mod.selectedIndex].text+'</td></tr>';
}

// ── DROP ZONE ──────────────────────────────────────
function dzOv(e){e.preventDefault();document.getElementById('dz').classList.add('over');}
function dzLv(e){document.getElementById('dz').classList.remove('over');}
function dzDp(e){e.preventDefault();dzLv(e);var f=e.dataTransfer.files[0];if(f)pArq(f);}
function onFi(e){var f=e.target.files[0];if(f)pArq(f);}

function fst(msg,ok){var el=document.getElementById('fst');el.style.display='block';el.style.color=ok?'var(--stx)':'var(--wtx)';el.textContent=msg;}

function pArq(file){
  var nm=file.name.toLowerCase();
  fst('Carregando: '+file.name+'...',true);
  if(nm.endsWith('.txt')){
    var r=new FileReader();
    r.onload=function(e){var t=e.target.result;document.getElementById('po').value=t;A.po=t.trim();var cc=document.getElementById('cc');cc.textContent=t.length.toLocaleString()+' caracteres';cc.className='cc'+(t.length>500?' ok':'');fst('✓ '+file.name+' ('+t.length.toLocaleString()+' chars)',true);};
    r.readAsText(file,'UTF-8');
  } else if(nm.endsWith('.pdf')){
    if(!window.pdfjsLib){var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';s.onload=function(){pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';lerPDF(file);};document.head.appendChild(s);}
    else{lerPDF(file);}
  } else if(nm.endsWith('.docx')||nm.endsWith('.doc')){
    if(!window.mammoth){var s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';s.onload=function(){lerDOCX(file);};document.head.appendChild(s);}
    else{lerDOCX(file);}
  } else {fst('Use .txt, .pdf ou .docx',false);}
}
function lerPDF(file){
  var r=new FileReader();
  r.onload=function(ev){
    pdfjsLib.getDocument({data:new Uint8Array(ev.target.result)}).promise.then(function(pdf){
      var txts=[],tot=pdf.numPages,lidas=0;
      for(var i=1;i<=tot;i++){(function(pn){pdf.getPage(pn).then(function(pg){pg.getTextContent().then(function(tc){txts[pn-1]=tc.items.map(function(it){return it.str;}).join(' ');lidas++;if(lidas===tot){var t=txts.join('\n');document.getElementById('po').value=t;A.po=t.trim();var cc=document.getElementById('cc');cc.textContent=t.length.toLocaleString()+' caracteres';cc.className='cc ok';fst('✓ PDF: '+tot+' páginas',true);}});});});(i);}
    }).catch(function(e){fst('Erro PDF: '+e.message,false);});
  };
  r.readAsArrayBuffer(file);
}
function lerDOCX(file){
  var r=new FileReader();
  r.onload=function(ev){
    mammoth.extractRawText({arrayBuffer:ev.target.result}).then(function(res){
      document.getElementById('po').value=res.value;A.po=res.value.trim();
      var cc=document.getElementById('cc');cc.textContent=res.value.length.toLocaleString()+' caracteres';cc.className='cc ok';
      fst('✓ Documento: '+res.value.length.toLocaleString()+' chars',true);
    }).catch(function(e){fst('Erro DOCX: '+e.message,false);});
  };
  r.readAsArrayBuffer(file);
}

// ── GENERATION ─────────────────────────────────────
async function sleep(ms){ return new Promise(function(r){setTimeout(r,ms);}); }

async function chamada(key, prompt, tentativa){
  tentativa = tentativa || 1;
  var r = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + key,
    { method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({contents:[{parts:[{text:prompt}]}], generationConfig:{maxOutputTokens:65536,temperature:0.7}}) }
  );
  var d = await r.json();
  if(d.error){
    var msg = d.error.message || JSON.stringify(d.error);
    if((msg.indexOf('quota')>-1 || msg.indexOf('429')>-1 || msg.indexOf('RESOURCE_EXHAUSTED')>-1) && tentativa<=3){
      var waitSec = 35;
      var m = msg.match(/retry in ([\d.]+)s/);
      if(m) waitSec = Math.ceil(parseFloat(m[1])) + 3;
      var ltEl = document.getElementById('lt');
      if(ltEl) ltEl.textContent = 'Limite da API. Aguardando ' + waitSec + 's... (' + tentativa + '/3)';
      await sleep(waitSec * 1000);
      return chamada(key, prompt, tentativa + 1);
    }
    throw new Error(msg);
  }
  if(!d.candidates||!d.candidates[0]) throw new Error('Resposta vazia da API');
  return d.candidates[0].content.parts.map(function(p){return p.text||'';}).join('\n');
}

async function gen(){
  var key=A.key||localStorage.getItem('gk')||'';
  if(!key){alert('Configure a chave Gemini em "API Key Gemini".');gp(5);return;}
  var po=A.po||(document.getElementById('po').value||'').trim();
  var ucn=A.sun||document.getElementById('ucm').value.trim();
  var p=document.getElementById('chp').value,e=document.getElementById('che').value||'0';
  var dur=document.getElementById('da'),durT=dur.options[dur.selectedIndex].text;
  var nv=document.getElementById('nv'),enf=document.getElementById('enf'),mod=document.getElementById('mod');
  var obs=document.getElementById('obs').value.trim(),tot=(parseFloat(p)||0)+(parseFloat(e)||0);
  var nAulas=Math.ceil(tot/({'4':4,'3.5':3.5,'misto':3.75,'custom':parseFloat(document.getElementById('dc')&&document.getElementById('dc').value)||4}[document.getElementById('da').value]||4));
  if(!po){alert('Cole o P.O. na Etapa 1.');return;}
  if(!ucn){alert('Selecione uma UC na Etapa 2.');return;}
  if(!p){alert('Configure a carga horária na Etapa 3.');return;}

  document.getElementById('gbr').style.display='none';
  document.getElementById('os').style.display='none';
  document.getElementById('es2').style.display='none';
  document.getElementById('ldc').style.display='block';

  var base='Curso: '+(A.cn||'N/I')+' | Eixo: '+A.ex+' | UC: '+ucn+' | CH: '+tot+'h | Aulas: '+durT+' | '+nAulas+' aulas | '+mod.options[mod.selectedIndex].text+' | '+nv.options[nv.selectedIndex].text+' | '+enf.options[enf.selectedIndex].text+(obs?' | '+obs:'');
  var banco='Apresentação e discussão de vídeo, Atividade em grupos com plenária, Brainstorming, Mapa conceitual, Debate, Diário de bordo, Dinâmica de grupo, Discussão de caso, Dramatização, Elaboração de portfólio, Entrevista, Experimentação, Exposição dialogada, Jogo, Pesquisa, Simulação, Storytelling, Trabalho com projetos, Visita técnica, World Café';

  var steps1=[['Analisando o P.O...',8],['Matriz pedagógica...',20],['Análise de complexidade...',32],['Distribuindo carga horária...',44],['Progressão pedagógica...',52]];
  var steps2=[['Gerando planos de aula...',60],['Situações de aprendizagem...',72],['Metodologias ativas...',82],['Auditoria pedagógica...',90],['Relatórios finais...',97]];
  var si=0;
  document.getElementById('pb').style.width='4%';
  var iv=setInterval(function(){if(si<steps1.length){document.getElementById('lt').textContent=steps1[si][0];document.getElementById('pb').style.width=steps1[si][1]+'%';si++;}},4000);

  var p1='';
  try{
    p1=await chamada(key,'Você é Especialista Sênior em Planejamento Pedagógico do SENAC SP. Responda em português brasileiro.\n\nDADOS: '+base+'\n\nBANCO SENAC SP: '+banco+'\n\nP.O.:\n'+po+'\n\nEXECUTE ETAPAS 1-5:\nETAPA 1 – RESUMO: UC, CH, Indicadores numerados, Conhecimentos, Habilidades, Atitudes, Evidências, Critérios.\nETAPA 2 – MATRIZ PEDAGÓGICA: Tabela Indicador|Conhecimentos|Habilidades|Atitudes|Evidências. Nenhum sem mapeamento.\nETAPA 3 – COMPLEXIDADE: Para cada conhecimento: nível (Básico/Intermediário/Avançado), justificativa, nº aulas.\nETAPA 4 – DISTRIBUIÇÃO CH: '+tot+'h, '+durT+', '+nAulas+' aulas. Tabela: Nº|Tema|CH|Tipo|Indicadores.\nETAPA 5 – PROGRESSÃO: Sequência lógica justificada das '+nAulas+' aulas. NÃO gere planos de aula ainda.');
    clearInterval(iv);
    document.getElementById('pb').style.width='52%';
    document.getElementById('lt').textContent = 'Aguardando 5s para evitar limite da API...';
    await sleep(5000);
    si=0;
    var iv2=setInterval(function(){if(si<steps2.length){document.getElementById('lt').textContent=steps2[si][0];document.getElementById('pb').style.width=steps2[si][1]+'%';si++;}},5000);

    var fmtAula = [
      'AULA [N] de ' + nAulas + ' | [TITULO]',
      'CH: [X]h | Modalidade: [Presencial/EaD]',
      'Indicadores: [numeros]',
      'Conhecimentos: [lista apenas os conhecimentos]',
      'Habilidades: [lista apenas as habilidades]',
      'Atitudes: [lista apenas as atitudes]',
      'Objetivo: [objetivo em 1-2 frases]',
      'Situacao: [situacao de aprendizagem]',
      'Metodologia: [nome da estrategia]',
      'Recursos: [lista de recursos]',
      'ACOLHIMENTO: [descricao]',
      'MOBILIZACAO: [descricao]',
      'DESENVOLVIMENTO: [descricao]',
      'PRATICA: [descricao]',
      'SISTEMATIZACAO: [descricao]',
      'ENCERRAMENTO: [descricao]',
      'PRODUTO: [produto esperado]',
      'EVIDENCIAS: [evidencias]',
      'CRITERIOS: [criterios observaveis]',
      'INSTRUMENTOS: [instrumentos]',
      'ORIENTACOES: [orientacoes ao docente]',
      'REFLEXAO: [perguntas para reflexao]',
      'CHECKLIST: [checklist do docente]',
      '---FIM---'
    ].join('\n');
    var promptP2 = 'Especialista em Planejamento Pedagogico SENAC SP.\n\n';
    promptP2 += 'DADOS: ' + base + '\n\n';
    promptP2 += 'BANCO SENAC SP: ' + banco + '\n\n';
    promptP2 += 'P.O.: ' + po.substring(0, 20000) + '\n\n';
    promptP2 += 'PLANEJAMENTO JA FEITO (etapas 1-5):\n' + p1 + '\n\n';
    promptP2 += 'EXECUTE ETAPAS 6-10:\n';
    promptP2 += 'ETAPA 6: Para cada uma das ' + nAulas + ' aulas, crie situacao de aprendizagem contextualizada.\n';
    promptP2 += 'ETAPA 7: Para cada aula, indique metodologia do Banco SENAC SP com justificativa.\n';
    promptP2 += 'ETAPA 8: Gere TODOS os ' + nAulas + ' planos de aula usando EXATAMENTE este formato para cada:\n\n';
    promptP2 += fmtAula + '\n\n';
    promptP2 += 'ETAPA 9: Adapte ao eixo ' + A.ex + '.\n';
    promptP2 += 'ETAPA 10: Auditoria com tabelas de cobertura.';
    var p2=await chamada(key, promptP2);
    clearInterval(iv2);
    document.getElementById('pb').style.width='100%';
    document.getElementById('ldc').style.display='none';

    var txt='═'.repeat(60)+'\nPLANEJAMENTO PEDAGÓGICO SENAC — '+ucn+'\nGerado em: '+new Date().toLocaleString('pt-BR')+'\n'+'═'.repeat(60)+'\n\nPARTE 1 — ESTRUTURA (Etapas 1-5)\n'+'─'.repeat(60)+'\n\n'+p1+'\n\nPARTE 2 — PLANOS DE AULA (Etapas 6-10)\n'+'─'.repeat(60)+'\n\n'+p2;
    document.getElementById('ob').textContent=txt;
    document.getElementById('os').style.display='block';
    document.getElementById('gbr').style.display='none';
    A.hist.unshift({uc:A.sun||ucn,curso:A.cn,ts:new Date().toLocaleString('pt-BR'),out:txt});
    document.getElementById('hd').style.display='block';
  }catch(err){
    clearInterval(iv);
    document.getElementById('ldc').style.display='none';
    if(p1){document.getElementById('ob').textContent='PARTE 1 GERADA:\n\n'+p1;document.getElementById('os').style.display='block';}
    document.getElementById('em').innerHTML='Erro: '+err.message+(p1?'<br><br>A Parte 1 está disponível acima.':'');
    document.getElementById('es2').style.display='block';
    document.getElementById('gbr').style.display='flex';
  }
}

// ── OUTPUT ─────────────────────────────────────────
function cp(){navigator.clipboard.writeText(document.getElementById('ob').textContent).then(function(){var b=document.querySelectorAll('.bsm')[0];b.innerHTML='<i class="ti ti-check"></i> Copiado!';setTimeout(function(){b.innerHTML='<i class="ti ti-copy"></i> Copiar';},2500);});}
function dl(){var txt=document.getElementById('ob').textContent,nm=(A.sun||'planejamento').replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g,'').replace(/\s+/g,'_').substring(0,50);var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));a.download='Planejamento_'+nm+'_'+new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')+'.txt';a.click();}
function nuc(){A.su=null;document.getElementById('os').style.display='none';document.getElementById('es2').style.display='none';document.getElementById('gbr').style.display='flex';document.getElementById('ucm').value='';document.querySelectorAll('.ucc').forEach(function(c){c.classList.remove('sl');});gp(1);}
function rh(){var el=document.getElementById('hc');if(!A.hist.length){el.innerHTML='<div class="es"><i class="ti ti-file-off"></i>Nenhum planejamento gerado ainda.</div>';return;}el.innerHTML=A.hist.map(function(h,i){return '<div class="hi" onclick="vh('+i+')"><div><div class="hun">'+h.uc+'</div><div class="hmt">'+(h.curso||'Curso não informado')+' · '+h.ts+'</div></div><i class="ti ti-eye" style="font-size:18px;color:var(--tx3)"></i></div>';}).join('');}
function vh(i){var h=A.hist[i];document.getElementById('ob').textContent=h.out;document.getElementById('os').style.display='block';document.getElementById('gbr').style.display='none';gp(3);}

// ── API KEY ────────────────────────────────────────
function sk(){var k=document.getElementById('ak').value.trim();if(!k){alert('Digite a chave.');return;}A.key=k;localStorage.setItem('gk',k);document.getElementById('ks').innerHTML='<span style="color:var(--stx)"><i class="ti ti-circle-check"></i> Salva com sucesso!</span>';}
function ck2(){A.key='';localStorage.removeItem('gk');document.getElementById('ak').value='';document.getElementById('ks').innerHTML='<span style="color:var(--wtx)">Chave removida.</span>';}
function tk(){var i=document.getElementById('ak'),ic=document.getElementById('ei');i.type=i.type==='password'?'text':'password';ic.className=i.type==='password'?'ti ti-eye':'ti ti-eye-off';}

// ── WORD EXPORT ────────────────────────────────────
async function gerarWord(){
  var btn = document.getElementById('bw');
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader"></i> Convertendo para Word...';

  var key = A.key || localStorage.getItem('gk') || '';
  if(!key){ alert('Chave Gemini nao configurada.'); btn.disabled=false; btn.innerHTML='<i class="ti ti-file-word"></i> Baixar Word'; return; }

  var txt = document.getElementById('ob').textContent || '';
  if(!txt){ alert('Gere o planejamento primeiro.'); btn.disabled=false; btn.innerHTML='<i class="ti ti-file-word"></i> Baixar Word'; return; }

  try {
    // Count how many lessons exist in the text
    var aulaCount = (txt.match(/AULA\s+\d+\s+de\s+\d+/gi) || []).length;
    if(aulaCount === 0) aulaCount = (txt.match(/AULA\s+\d+\s*[—–|]/gi) || []).length;
    if(aulaCount === 0){ alert('Nenhum plano de aula encontrado no texto.'); btn.disabled=false; btn.innerHTML='<i class="ti ti-file-word"></i> Baixar Word'; return; }

    // Split into batches of 7
    var batchSize = 7;
    var batches = Math.ceil(aulaCount / batchSize);
    var allAulas = [];

    for(var b = 0; b < batches; b++){
      var from = b * batchSize + 1;
      var to = Math.min((b+1) * batchSize, aulaCount);
      btn.innerHTML = '<i class="ti ti-loader"></i> Extraindo aulas ' + from + '-' + to + ' de ' + aulaCount + '...';

      var prompt = 'Extraia APENAS as aulas ' + from + ' a ' + to + ' do planejamento abaixo e retorne um JSON puro.\n\n';
      prompt += 'Formato EXATO do JSON (sem markdown, sem ```json, apenas o JSON):\n';
      prompt += '{"aulas":[{"numero":1,"titulo":"...","ch":"4h","modalidade":"Presencial","indicadores":"1, 2",';
      prompt += '"metodologia":"...","conhecimentos":"...","habilidades":"...","atitudes":"...","objetivo":"...",';
      prompt += '"situacao":"...","recursos":"...","acolhimento":"...","mobilizacao":"...","desenvolvimento":"...",';
      prompt += '"pratica":"...","sistematizacao":"...","encerramento":"...","produto":"...","evidencias":"...",';
      prompt += '"criterios":"...","instrumentos":"...","orientacoes":"...","reflexao":"...","checklist":"..."}]}\n\n';
      prompt += 'REGRAS:\n- Retorne SOMENTE o JSON\n- Cada campo deve conter APENAS o conteudo daquele campo\n';
      prompt += '- NAO misture campos\n- Extraia SOMENTE as aulas ' + from + ' a ' + to + '\n\n';
      prompt += 'TEXTO:\n' + txt.substring(0, 55000);

      // Use chamada() with auto-retry for quota errors
      var raw = await chamada(key, prompt);
      // chamada returns text directly
      raw = raw.replace(/```json\s*/gi,'').replace(/```\s*/gi,'').trim();

      var parsed;
      try { parsed = JSON.parse(raw); }
      catch(e) {
        var m = raw.match(/\{[\s\S]*\}/);
        if(m) parsed = JSON.parse(m[0]);
        else throw new Error('JSON invalido no lote ' + (b+1));
      }

      if(parsed.aulas) allAulas = allAulas.concat(parsed.aulas);
    }

    if(!allAulas.length) throw new Error('Nenhuma aula extraida.');

    btn.innerHTML = '<i class="ti ti-loader"></i> Montando Word (' + allAulas.length + ' aulas)...';

    // Load docx library
    if(!window.docx){
      await new Promise(function(res,rej){
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/docx@7.8.2/build/index.js';
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }

    await montarDocxDeJSON(allAulas);

  } catch(e) {
    console.error(e);
    alert('Erro: ' + e.message);
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-file-word"></i> Baixar Word';
}


async function montarDocxDeJSON(aulas){
  var D = window.docx;
  var AZ='1F3864', OR='E05A1A', CZ='D6DCE4', CZ2='F2F2F2', BR='FFFFFF';

  var brd = {style:'single', size:4, color:'CCCCCC'};
  var brdAll = {top:brd, bottom:brd, left:brd, right:brd};
  var brdAz = {top:{style:'single',size:8,color:AZ}, bottom:{style:'single',size:8,color:AZ}, left:{style:'single',size:8,color:AZ}, right:{style:'single',size:8,color:AZ}};
  var mg = {top:80, bottom:80, left:120, right:120};

  function p(text, opts){
    opts = opts||{};
    return new D.Paragraph({
      children:[new D.TextRun({text:String(text||''), bold:opts.b||false, size:opts.s||22, font:'Arial', color:opts.c||'000000'})],
      alignment: opts.center ? 'center' : 'left',
      spacing:{before:opts.sb||40, after:opts.sa||40}
    });
  }

  function cell(children, bg, w, span){
    return new D.TableCell({
      children: Array.isArray(children) ? children : [children],
      borders: brdAll,
      width: w ? {size:w, type:'dxa'} : undefined,
      columnSpan: span||1,
      shading: bg ? {fill:bg, type:'clear'} : undefined,
      margins: mg
    });
  }

  function row2(label, value, bgLabel){
    var labelPar = p(label, {b:true, s:20, c:AZ});
    var valuePar = p(value||'', {s:20});
    return new D.TableRow({children:[
      cell(labelPar, bgLabel||CZ, 3200),
      cell(valuePar, null, 11200)
    ]});
  }

  function tbl2(rows){
    return new D.Table({width:{size:14400,type:'dxa'}, columnWidths:[3200,11200], rows:rows});
  }

  var children = [];

  // CAPA
  children.push(new D.Table({
    width:{size:14400,type:'dxa'}, columnWidths:[14400],
    rows:[new D.TableRow({children:[
      cell([
        p('PLANEJAMENTO PEDAGÓGICO SENAC',{b:true,s:32,c:BR,center:true,sb:160,sa:60}),
        p(A.cn||'', {b:true,s:26,c:BR,center:true,sb:0,sa:60}),
        p(A.sun||'', {s:22,c:BR,center:true,sb:0,sa:160})
      ], AZ, 14400)
    ]})]
  }));
  children.push(p(''));
  children.push(new D.Table({
    width:{size:14400,type:'dxa'}, columnWidths:[4000,10400],
    rows:[
      new D.TableRow({children:[cell(p('Total de Aulas:',{b:true,s:20,c:AZ}),CZ,4000), cell(p(String(aulas.length)+' aulas',{s:20}),null,10400)]}),
      new D.TableRow({children:[cell(p('Docente:',{b:true,s:20,c:AZ}),CZ,4000), cell(p('',{s:20}),null,10400)]}),
      new D.TableRow({children:[cell(p('Turma:',{b:true,s:20,c:AZ}),CZ,4000), cell(p('',{s:20}),null,10400)]})
    ]
  }));

  // AULAS
  aulas.forEach(function(a, idx){
    children.push(new D.Paragraph({children:[new D.PageBreak()]}));

    // Cabeçalho azul
    children.push(new D.Table({
      width:{size:14400,type:'dxa'}, columnWidths:[14400],
      rows:[new D.TableRow({children:[
        cell([
          p('AULA '+(a.numero||idx+1)+' de '+aulas.length+' — '+(a.titulo||''),{b:true,s:26,c:BR,center:true,sb:120,sa:60}),
          p(A.sun||'',{s:20,c:BR,center:true,sb:0,sa:100})
        ], AZ, 14400, 1)
      ]})]
    }));
    children.push(p(''));

    // Linha de informações rápidas
    children.push(new D.Table({
      width:{size:14400,type:'dxa'}, columnWidths:[3600,3600,3600,3600],
      rows:[
        new D.TableRow({children:[
          cell(p('Carga Horária',{b:true,s:20,c:BR}),OR,3600),
          cell(p('Modalidade',{b:true,s:20,c:BR}),OR,3600),
          cell(p('Indicadores',{b:true,s:20,c:BR}),OR,3600),
          cell(p('Metodologia',{b:true,s:20,c:BR}),OR,3600)
        ]}),
        new D.TableRow({children:[
          cell(p(a.ch||'4h',{s:20}),CZ2,3600),
          cell(p(a.modalidade||'Presencial',{s:20}),CZ2,3600),
          cell(p(a.indicadores||'',{s:20}),CZ2,3600),
          cell(p(a.metodologia||'',{s:19}),CZ2,3600)
        ]})
      ]
    }));
    children.push(p(''));

    // Situação
    if(a.situacao) { children.push(tbl2([row2('Situação de Aprendizagem', a.situacao)])); children.push(p('')); }

    // Objetivo
    if(a.objetivo) { children.push(tbl2([row2('Objetivo da Aula', a.objetivo)])); children.push(p('')); }

    // CHA
    children.push(new D.Table({
      width:{size:14400,type:'dxa'}, columnWidths:[4800,4800,4800],
      rows:[
        new D.TableRow({children:[
          cell(p('Conhecimentos',{b:true,s:20,c:BR}),AZ,4800),
          cell(p('Habilidades',{b:true,s:20,c:BR}),AZ,4800),
          cell(p('Atitudes',{b:true,s:20,c:BR}),AZ,4800)
        ]}),
        new D.TableRow({children:[
          cell(p(a.conhecimentos||'',{s:19}),CZ2,4800),
          cell(p(a.habilidades||'',{s:19}),CZ2,4800),
          cell(p(a.atitudes||'',{s:19}),CZ2,4800)
        ]})
      ]
    }));
    children.push(p(''));

    // Desenvolvimento
    var devRows = [
      new D.TableRow({children:[cell(p('DESENVOLVIMENTO',{b:true,s:22,c:BR,center:true}),AZ,14400,1)]})
    ];
    [
      ['Acolhimento (15 min)', a.acolhimento],
      ['Mobilização (20 min)', a.mobilizacao],
      ['Desenvolvimento', a.desenvolvimento],
      ['Prática', a.pratica],
      ['Sistematização (20 min)', a.sistematizacao],
      ['Encerramento (15 min)', a.encerramento]
    ].forEach(function(r){
      if(r[1]) devRows.push(row2(r[0], r[1]));
    });
    children.push(new D.Table({width:{size:14400,type:'dxa'}, columnWidths:[3200,11200], rows:devRows}));
    children.push(p(''));

    // Avaliação
    children.push(new D.Table({
      width:{size:14400,type:'dxa'}, columnWidths:[4800,4800,4800],
      rows:[
        new D.TableRow({children:[
          cell(p('Evidências',{b:true,s:20,c:BR}),OR,4800),
          cell(p('Critérios Observáveis',{b:true,s:20,c:BR}),OR,4800),
          cell(p('Instrumentos',{b:true,s:20,c:BR}),OR,4800)
        ]}),
        new D.TableRow({children:[
          cell(p(a.evidencias||'',{s:19}),CZ2,4800),
          cell(p(a.criterios||'',{s:19}),CZ2,4800),
          cell(p(a.instrumentos||'',{s:19}),CZ2,4800)
        ]})
      ]
    }));
    children.push(p(''));

    // Produto + Recursos
    if(a.produto||a.recursos){
      children.push(tbl2([
        row2('Produto Esperado', a.produto),
        row2('Recursos Necessários', a.recursos)
      ]));
      children.push(p(''));
    }

    // Orientações + Reflexão
    if(a.orientacoes||a.reflexao){
      children.push(new D.Table({
        width:{size:14400,type:'dxa'}, columnWidths:[7200,7200],
        rows:[new D.TableRow({children:[
          cell([p('Orientações ao Docente',{b:true,s:20,c:AZ}), p(a.orientacoes||'',{s:19})], CZ2, 7200),
          cell([p('Perguntas para Reflexão',{b:true,s:20,c:AZ}), p(a.reflexao||'',{s:19})], CZ2, 7200)
        ]})]
      }));
      children.push(p(''));
    }

    // Checklist
    if(a.checklist) { children.push(tbl2([row2('Checklist do Docente', a.checklist)])); children.push(p('')); }
  });

  var doc = new D.Document({
    sections:[{
      properties:{page:{size:{width:16838,height:11906}, margin:{top:720,right:720,bottom:720,left:720}}},
      children: children
    }]
  });

  var blob = await D.Packer.toBlob(doc);
  var url = URL.createObjectURL(blob);
  var a2 = document.createElement('a');
  var nm = (A.sun||'planejamento').replace(/[^\w\sÀ-ÿ]/g,'').replace(/\s+/g,'_').substring(0,50);
  a2.href = url;
  a2.download = 'Planos_'+nm+'_'+new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')+'.docx';
  a2.click();
  setTimeout(function(){URL.revokeObjectURL(url);}, 3000);
}


ca();
