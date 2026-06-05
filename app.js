// VERSAO 16 - 2026-06-04-FIXED

console.log("VERSAO 16 CARREGADA - app.js separado e corrigido");
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
async function chamada(key,prompt){
  var r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key='+key,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:65536,temperature:0.7}})});
  var d=await r.json();
  if(d.error)throw new Error(d.error.message||JSON.stringify(d.error));
  if(!d.candidates||!d.candidates[0])throw new Error('Resposta vazia');
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
    si=0;
    var iv2=setInterval(function(){if(si<steps2.length){document.getElementById('lt').textContent=steps2[si][0];document.getElementById('pb').style.width=steps2[si][1]+'%';si++;}},5000);

    var p2=await chamada(key,'Voce e Especialista Senior em Planejamento Pedagogico do SENAC SP. Responda em portugues brasileiro.\n\nDADOS: '+base+'\n\nBANCO SENAC SP: '+banco+'\n\nP.O.:\n'+po+'\n\nPLANEJAMENTO (etapas 1-5) JA FEITO:\n'+p1+'\n\nEXECUTE ETAPAS 6-10:\nETAPA 6: Para cada uma das '+nAulas+' aulas, crie situacao contextualizada com: Titulo, Contexto profissional real, Problema, Objetivo, Desenvolvimento, Entrega, Evidencias, Criterios, Indicadores.\nETAPA 7: Para cada aula, indique estrategia do Banco SENAC SP e justifique. Diversifique.\nETAPA 8: Gere TODOS os '+nAulas+' planos de aula. Para cada aula use EXATAMENTE este formato:\n\nAULA [N] de '+nAulas+' | [TITULO]\nCH: [X]h | Modalidade: [Presencial/EaD]\nIndicadores: [numeros]\nConhecimentos: [lista]\nHabilidades: [lista]\nAtitudes: [lista]\nObjetivo: [objetivo]\nSituacao: [situacao]\nMetodologia: [nome]\nRecursos: [lista]\nACOLHIMENTO: [descricao]\nMOBILIZACAO: [descricao]\nDESENVOLVIMENTO: [descricao]\nPRATICA: [descricao]\nSISTEMATIZACAO: [descricao]\nENCERRAMENTO: [descricao]\nPRODUTO: [produto]\nEVIDENCIAS: [evidencias]\nCRITERIOS: [criterios]\nINSTRUMENTOS: [instrumentos]\nORIENTACOES: [orientacoes]\nREFLEXAO: [perguntas]\nCHECKLIST: [checklist]\n---FIM---\n\nETAPA 9: Adapte exemplos ao eixo '+A.ex+'.\nETAPA 10: Auditoria com tabelas de cobertura.');
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
  if(!key){ alert('Chave Gemini não configurada.'); btn.disabled=false; btn.innerHTML='<i class="ti ti-file-word"></i> Baixar Word'; return; }

  var txt = document.getElementById('ob').textContent || '';
  if(!txt){ alert('Gere o planejamento primeiro.'); btn.disabled=false; btn.innerHTML='<i class="ti ti-file-word"></i> Baixar Word'; return; }

  try {
    // Step 1: Ask Gemini to convert the text to clean JSON
    btn.innerHTML = '<i class="ti ti-loader"></i> Extraindo dados (1/2)...';

    var jsonPrompt = 'Voce recebera um planejamento pedagogico em texto. Extraia APENAS os planos de aula individuais e retorne um JSON puro (sem markdown, sem ```json, apenas o objeto JSON).\n\nO JSON deve ter este formato exato:\n{\n  \"aulas\": [\n    {\n      \"numero\": 1,\n      \"titulo\": \"titulo da aula\",\n      \"ch\": \"4h\",\n      \"modalidade\": \"Presencial\",\n      \"indicadores\": \"1, 2\",\n      \"metodologia\": \"nome da metodologia\",\n      \"conhecimentos\": \"lista de conhecimentos desta aula\",\n      \"habilidades\": \"lista de habilidades\",\n      \"atitudes\": \"lista de atitudes\",\n      \"objetivo\": \"objetivo da aula em 1-2 frases\",\n      \"situacao\": \"situacao de aprendizagem em 2-3 frases\",\n      \"recursos\": \"lista de recursos\",\n      \"acolhimento\": \"o que acontece no acolhimento\",\n      \"mobilizacao\": \"o que acontece na mobilizacao\",\n      \"desenvolvimento\": \"o que acontece no desenvolvimento\",\n      \"pratica\": \"o que acontece na pratica\",\n      \"sistematizacao\": \"o que acontece na sistematizacao\",\n      \"encerramento\": \"o que acontece no encerramento\",\n      \"produto\": \"produto esperado\",\n      \"evidencias\": \"evidencias de aprendizagem\",\n      \"criterios\": \"criterios observaveis\",\n      \"instrumentos\": \"instrumentos de acompanhamento\",\n      \"orientacoes\": \"orientacoes ao docente\",\n      \"reflexao\": \"perguntas para reflexao\",\n      \"checklist\": \"checklist do docente\"\n    }\n  ]\n}\n\nREGRAS:\n- Retorne SOMENTE o JSON, sem texto antes ou depois\n- Cada campo deve conter APENAS o conteudo daquele campo\n- Nao misture conteudo de campos diferentes\n- Se um campo nao existir, use string vazia \"\"\n\nTEXTO DO PLANEJAMENTO:\n' + txt.substring(0, 50000)

    var jsonResp = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + key,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          contents: [{parts: [{text: jsonPrompt}]}],
          generationConfig: {maxOutputTokens: 65536, temperature: 0.1}
        })
      }
    );

    var jsonData = await jsonResp.json();
    if(jsonData.error) throw new Error('Erro Gemini: ' + jsonData.error.message);

    var rawJson = jsonData.candidates[0].content.parts.map(function(p){return p.text||'';}).join('');
    // Clean any markdown fences
    rawJson = rawJson.replace(/```json\s*/gi,'').replace(/```\s*/gi,'').trim();

    var parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch(e) {
      // Try to extract JSON object
      var m = rawJson.match(/\{[\s\S]*\}/);
      if(m) parsed = JSON.parse(m[0]);
      else throw new Error('JSON inválido: ' + rawJson.substring(0,200));
    }

    var aulas = parsed.aulas || [];
    if(!aulas.length) throw new Error('Nenhuma aula encontrada no JSON.');

    // Step 2: Build Word document
    btn.innerHTML = '<i class="ti ti-loader"></i> Gerando Word (2/2)...';

    if(!window.docx){
      await new Promise(function(res,rej){
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/docx@7.8.2/build/index.js';
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }

    await montarDocxDeJSON(aulas);

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


async function montarDocx(aulas){
  var D = window.docx;
  var children = [];

  // Helper: paragraph
  function p(text, opts){
    opts = opts||{};
    var run = new D.TextRun({
      text: text||'',
      bold: opts.bold||false,
      size: opts.size||22,
      font: 'Arial',
      color: opts.color||'000000'
    });
    return new D.Paragraph({
      children: [run],
      alignment: opts.center ? 'center' : 'left',
      spacing: { before: opts.before||40, after: opts.after||40 }
    });
  }

  // Helper: simple table row with 2 cols
  function row2(label, value, bgLabel){
    return new D.TableRow({
      children: [
        new D.TableCell({
          children: [p(label, {bold:true, size:20, color:'1F3864'})],
          width: {size: 3000, type: 'dxa'},
          shading: bgLabel ? {fill: bgLabel, type: 'clear'} : undefined,
          margins: {top:80, bottom:80, left:120, right:120}
        }),
        new D.TableCell({
          children: [p(value||'', {size:20})],
          width: {size: 11400, type: 'dxa'},
          margins: {top:80, bottom:80, left:120, right:120}
        })
      ]
    });
  }

  // CAPA
  children.push(p('PLANEJAMENTO PEDAGÓGICO SENAC', {bold:true, size:36, color:'1F3864', center:true, before:200, after:80}));
  children.push(p(A.cn||'', {bold:true, size:28, color:'1F3864', center:true, before:0, after:60}));
  children.push(p(A.sun||'', {size:24, color:'1F3864', center:true, before:0, after:200}));
  children.push(p('Total de aulas: '+aulas.length, {size:22, center:true, before:0, after:200}));
  children.push(p(''));

  // PLANOS DE AULA
  aulas.forEach(function(aula, idx){
    // Page break before each lesson (except first)
    if(idx > 0){
      children.push(new D.Paragraph({
        children: [new D.PageBreak()],
        spacing: {before:0, after:0}
      }));
    }

    // Lesson header
    children.push(p('AULA '+(idx+1)+' de '+aulas.length+' — '+(aula.titulo||''), {
      bold:true, size:28, color:'1F3864', before:120, after:80
    }));
    children.push(p(A.sun||'', {size:20, color:'5C5B58', before:0, after:160}));

    // Info table
    children.push(new D.Table({
      width: {size: 14400, type: 'dxa'},
      columnWidths: [3600, 3600, 3600, 3600],
      rows: [
        new D.TableRow({children:[
          new D.TableCell({children:[p('Carga Horária',{bold:true,size:20,color:'FFFFFF'})],shading:{fill:'1F3864',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}}),
          new D.TableCell({children:[p('Modalidade',{bold:true,size:20,color:'FFFFFF'})],shading:{fill:'1F3864',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}}),
          new D.TableCell({children:[p('Indicadores',{bold:true,size:20,color:'FFFFFF'})],shading:{fill:'1F3864',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}}),
          new D.TableCell({children:[p('Metodologia',{bold:true,size:20,color:'FFFFFF'})],shading:{fill:'1F3864',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}})
        ]}),
        new D.TableRow({children:[
          new D.TableCell({children:[p(aula.ch||'4h',{size:20})],shading:{fill:'F2F2F2',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}}),
          new D.TableCell({children:[p(aula.modalidade||'Presencial',{size:20})],shading:{fill:'F2F2F2',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}}),
          new D.TableCell({children:[p(aula.indicadores||'',{size:20})],shading:{fill:'F2F2F2',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}}),
          new D.TableCell({children:[p(aula.metodologia||'',{size:19})],shading:{fill:'F2F2F2',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}})
        ]})
      ]
    }));
    children.push(p(''));

    // Content sections
    var secoes = [
      ['Situação de Aprendizagem', aula.situacao],
      ['Objetivo da Aula', aula.objetivo],
      ['Conhecimentos', aula.conhecimentos],
      ['Habilidades', aula.habilidades],
      ['Atitudes', aula.atitudes],
      ['Produto Esperado', aula.produto],
      ['Evidências de Aprendizagem', aula.evidencias],
      ['Critérios Observáveis', aula.criterios],
      ['Instrumentos de Acompanhamento', aula.instrumentos],
    ];
    secoes.forEach(function(s){
      if(s[1]){
        children.push(new D.Table({
          width:{size:14400,type:'dxa'},
          columnWidths:[3200,11200],
          rows:[row2(s[0],s[1],'D6DCE4')]
        }));
        children.push(p(''));
      }
    });

    // Desenvolvimento
    var dev = aula.desenvolvimento||{};
    var devItems = [
      ['Acolhimento (15 min)',dev.acolhimento],
      ['Mobilização (20 min)',dev.mobilizacao],
      ['Desenvolvimento',dev.desenvolvimento],
      ['Prática',dev.pratica],
      ['Sistematização (20 min)',dev.sistematizacao],
      ['Encerramento (15 min)',dev.encerramento]
    ].filter(function(d){return d[1];});
    
    if(devItems.length){
      children.push(p('DESENVOLVIMENTO DA AULA', {bold:true, size:22, color:'1F3864', before:80, after:40}));
      children.push(new D.Table({
        width:{size:14400,type:'dxa'},
        columnWidths:[3200,11200],
        rows: devItems.map(function(d){return row2(d[0],d[1],'D6DCE4');})
      }));
      children.push(p(''));
    }

    // More sections
    var secoes2 = [
      ['Orientações ao Docente', aula.orientacoes],
      ['Possíveis Dificuldades', aula.dificuldades],
      ['Perguntas para Reflexão', aula.reflexao],
      ['Checklist do Docente', aula.checklist],
    ];
    secoes2.forEach(function(s){
      if(s[1]){
        children.push(new D.Table({
          width:{size:14400,type:'dxa'},
          columnWidths:[3200,11200],
          rows:[row2(s[0],s[1],'D6DCE4')]
        }));
        children.push(p(''));
      }
    });

    children.push(p('─'.repeat(80), {color:'AAAAAA', size:16, before:40, after:40}));
  });

  // Build document
  var doc = new D.Document({
    sections:[{
      properties:{
        page:{
          size:{width:16838, height:11906},
          margin:{top:720, right:720, bottom:720, left:720}
        }
      },
      children: children
    }]
  });

  var blob = await D.Packer.toBlob(doc);
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  var nm = (A.sun||'planejamento').replace(/[^\w\sÀ-ÿ]/g,'').replace(/\s+/g,'_').substring(0,50);
  a.href = url;
  a.download = 'Planejamento_'+nm+'_'+new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')+'.docx';
  a.click();
  setTimeout(function(){URL.revokeObjectURL(url);}, 3000);
}


function parsearAulas(txt){
  var aulas=[];
  // Split by AULA N de N — header pattern
  var blocos = txt.split(/(?=AULA\s+\d+\s+de\s+\d+\s*[—–|])/);
  
  blocos.forEach(function(bloco){
    if(!bloco.match(/^AULA\s+\d+/)) return;
    var a={};
    
    // Extract title from first line
    var tituloM = bloco.match(/^AULA\s+\d+\s+de\s+\d+\s*[—–|]+\s*([^\n]+)/);
    a.titulo = tituloM ? tituloM[1].trim().replace(/UC\d+.*/,'').trim() : 'Aula';
    
    // CH and modalidade from the line after title
    var chM = bloco.match(/CH:\s*([\dh]+)/i);
    a.ch = chM ? chM[1].trim() : '4h';
    var modM = bloco.match(/Modalidade:\s*([^\n|]+)/i);
    a.modalidade = modM ? modM[1].trim() : 'Presencial';
    
    // Helper: extract field content between label and next label
    // Next label patterns to stop at
    var stopPat = '(?=\\n(?:Indicadores?|Conhecimentos?|Habilidades?|Atitudes?|Objetivo|Situa|Metodologia|Recursos|DESENVOLVIMENTO|Produto|Instrumentos|Evid|Crit|Orienta|Poss|Estrat|Perguntas?|Checklist|AULA\\s+\\d|═|╚)|$)';
    
    function getField(label, fallback){
      var r = new RegExp(label + ':\\s*([\\s\\S]+?)' + stopPat, 'i');
      var m = bloco.match(r);
      if(!m) return fallback||'';
      // Clean the value - remove subsequent field labels that leaked in
      var val = m[1].trim();
      // Stop at any line that looks like "FieldName:" pattern
      var lines = val.split('\n');
      var clean = [];
      for(var i=0;i<lines.length;i++){
        var l = lines[i];
        // Stop if line starts with known field name followed by colon
        if(i>0 && l.match(/^\*\*?(Indicadores?|Conhecimentos?|Habilidades?|Atitudes?|Objetivo|Situa|Metodologia ativa|Recursos necessários|Produto esperado|Instrumentos|Evidências|Critérios|Orientações ao|Possíveis|Estratégias|Perguntas para|Checklist)\*\*?:/i)) break;
        if(i>0 && l.match(/^(Indicadores?|Conhecimentos?|Habilidades?|Atitudes?|Objetivo|Situa|Metodologia ativa|Recursos necessários|Produto esperado|Instrumentos|Evidências|Critérios|Orientações ao|Possíveis|Estratégias|Perguntas para|Checklist):/i)) break;
        clean.push(l);
      }
      return clean.join('\n').trim().replace(/\*\*/g,'').replace(/^[-•*]\s*/gm,'• ');
    }
    
    a.indicadores  = getField('Indicadores?(?:\s+trabalhados?)?');
    a.conhecimentos = getField('Conhecimentos?');
    a.habilidades  = getField('Habilidades?');
    a.atitudes     = getField('Atitudes?');
    a.objetivo     = getField('Objetivo(?:\s+da\s+aula)?');
    a.situacao     = getField('Situa[çc][aã]o(?:\s+de\s+aprendizagem)?');
    a.metodologia  = getField('Metodologia(?:\s+ativa)?');
    a.recursos     = getField('Recursos(?:\s+necess[aá]rios)?');
    a.produto      = getField('Produto(?:\s+esperado)?');
    a.instrumentos = getField('Instrumentos(?:\s+de\s+acompanhamento)?');
    a.evidencias   = getField('Evid[eê]ncias(?:\s+de\s+aprendizagem)?');
    a.criterios    = getField('Crit[eé]rios(?:\s+observ[aá]veis)?');
    a.orientacoes  = getField('Orienta[çc][oõ]es(?:\s+ao\s+docente)?');
    a.dificuldades = getField('Poss[ií]veis(?:\s+dificuldades?)?');
    a.reflexao     = getField('Perguntas?(?:\s+para\s+reflex[aã]o)?');
    a.checklist    = getField('Checklist(?:\s+docente)?');
    
    // Extract DESENVOLVIMENTO block
    a.desenvolvimento = {};
    var devM = bloco.match(/DESENVOLVIMENTO[^:]*:([\s\S]+?)(?=Produto esperado:|╚|$)/i);
    if(devM){
      var db = devM[1];
      var devFields = [
        {k:'acolhimento',  p:/(?:Acolhimento)[^:]*:\s*([^\n]+(?:\n(?![•*]\s*\*\*(?:Mobili|Desen|Prátic|Sistem|Encer))[^\n]*)*)/i},
        {k:'mobilizacao',  p:/(?:Mobiliza[çc][aã]o)[^:]*:\s*([^\n]+(?:\n(?![•*]\s*\*\*(?:Desen|Prátic|Sistem|Encer))[^\n]*)*)/i},
        {k:'desenvolvimento',p:/(?:Desenvolvimento)[^:]*:\s*([^\n]+(?:\n(?![•*]\s*\*\*(?:Prátic|Sistem|Encer))[^\n]*)*)/i},
        {k:'pratica',      p:/(?:Pr[aá]tica)[^:]*:\s*([^\n]+(?:\n(?![•*]\s*\*\*(?:Sistem|Encer))[^\n]*)*)/i},
        {k:'sistematizacao',p:/(?:Sistematiza[çc][aã]o)[^:]*:\s*([^\n]+(?:\n(?![•*]\s*\*\*Encer)[^\n]*)*)/i},
        {k:'encerramento', p:/(?:Encerramento)[^:]*:\s*([^\n]+(?:\n(?![•*]\s*\*\*)[^\n]*)*)/i},
      ];
      devFields.forEach(function(df){
        var m=db.match(df.p);
        if(m) a.desenvolvimento[df.k]=m[1].trim().replace(/\*\*/g,'');
      });
    }
    
    if(a.titulo && a.titulo.length > 1) aulas.push(a);
  });
  
  return aulas;
}


async function montarDocx(aulas){
  var D = window.docx;
  var children = [];

  // Helper: paragraph
  function p(text, opts){
    opts = opts||{};
    var run = new D.TextRun({
      text: text||'',
      bold: opts.bold||false,
      size: opts.size||22,
      font: 'Arial',
      color: opts.color||'000000'
    });
    return new D.Paragraph({
      children: [run],
      alignment: opts.center ? 'center' : 'left',
      spacing: { before: opts.before||40, after: opts.after||40 }
    });
  }

  // Helper: simple table row with 2 cols
  function row2(label, value, bgLabel){
    return new D.TableRow({
      children: [
        new D.TableCell({
          children: [p(label, {bold:true, size:20, color:'1F3864'})],
          width: {size: 3000, type: 'dxa'},
          shading: bgLabel ? {fill: bgLabel, type: 'clear'} : undefined,
          margins: {top:80, bottom:80, left:120, right:120}
        }),
        new D.TableCell({
          children: [p(value||'', {size:20})],
          width: {size: 11400, type: 'dxa'},
          margins: {top:80, bottom:80, left:120, right:120}
        })
      ]
    });
  }

  // CAPA
  children.push(p('PLANEJAMENTO PEDAGÓGICO SENAC', {bold:true, size:36, color:'1F3864', center:true, before:200, after:80}));
  children.push(p(A.cn||'', {bold:true, size:28, color:'1F3864', center:true, before:0, after:60}));
  children.push(p(A.sun||'', {size:24, color:'1F3864', center:true, before:0, after:200}));
  children.push(p('Total de aulas: '+aulas.length, {size:22, center:true, before:0, after:200}));
  children.push(p(''));

  // PLANOS DE AULA
  aulas.forEach(function(aula, idx){
    // Page break before each lesson (except first)
    if(idx > 0){
      children.push(new D.Paragraph({
        children: [new D.PageBreak()],
        spacing: {before:0, after:0}
      }));
    }

    // Lesson header
    children.push(p('AULA '+(idx+1)+' de '+aulas.length+' — '+(aula.titulo||''), {
      bold:true, size:28, color:'1F3864', before:120, after:80
    }));
    children.push(p(A.sun||'', {size:20, color:'5C5B58', before:0, after:160}));

    // Info table
    children.push(new D.Table({
      width: {size: 14400, type: 'dxa'},
      columnWidths: [3600, 3600, 3600, 3600],
      rows: [
        new D.TableRow({children:[
          new D.TableCell({children:[p('Carga Horária',{bold:true,size:20,color:'FFFFFF'})],shading:{fill:'1F3864',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}}),
          new D.TableCell({children:[p('Modalidade',{bold:true,size:20,color:'FFFFFF'})],shading:{fill:'1F3864',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}}),
          new D.TableCell({children:[p('Indicadores',{bold:true,size:20,color:'FFFFFF'})],shading:{fill:'1F3864',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}}),
          new D.TableCell({children:[p('Metodologia',{bold:true,size:20,color:'FFFFFF'})],shading:{fill:'1F3864',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}})
        ]}),
        new D.TableRow({children:[
          new D.TableCell({children:[p(aula.ch||'4h',{size:20})],shading:{fill:'F2F2F2',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}}),
          new D.TableCell({children:[p(aula.modalidade||'Presencial',{size:20})],shading:{fill:'F2F2F2',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}}),
          new D.TableCell({children:[p(aula.indicadores||'',{size:20})],shading:{fill:'F2F2F2',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}}),
          new D.TableCell({children:[p(aula.metodologia||'',{size:19})],shading:{fill:'F2F2F2',type:'clear'},margins:{top:80,bottom:80,left:120,right:120}})
        ]})
      ]
    }));
    children.push(p(''));

    // Content sections
    var secoes = [
      ['Situação de Aprendizagem', aula.situacao],
      ['Objetivo da Aula', aula.objetivo],
      ['Conhecimentos', aula.conhecimentos],
      ['Habilidades', aula.habilidades],
      ['Atitudes', aula.atitudes],
      ['Produto Esperado', aula.produto],
      ['Evidências de Aprendizagem', aula.evidencias],
      ['Critérios Observáveis', aula.criterios],
      ['Instrumentos de Acompanhamento', aula.instrumentos],
    ];
    secoes.forEach(function(s){
      if(s[1]){
        children.push(new D.Table({
          width:{size:14400,type:'dxa'},
          columnWidths:[3200,11200],
          rows:[row2(s[0],s[1],'D6DCE4')]
        }));
        children.push(p(''));
      }
    });

    // Desenvolvimento
    var dev = aula.desenvolvimento||{};
    var devItems = [
      ['Acolhimento (15 min)',dev.acolhimento],
      ['Mobilização (20 min)',dev.mobilizacao],
      ['Desenvolvimento',dev.desenvolvimento],
      ['Prática',dev.pratica],
      ['Sistematização (20 min)',dev.sistematizacao],
      ['Encerramento (15 min)',dev.encerramento]
    ].filter(function(d){return d[1];});
    
    if(devItems.length){
      children.push(p('DESENVOLVIMENTO DA AULA', {bold:true, size:22, color:'1F3864', before:80, after:40}));
      children.push(new D.Table({
        width:{size:14400,type:'dxa'},
        columnWidths:[3200,11200],
        rows: devItems.map(function(d){return row2(d[0],d[1],'D6DCE4');})
      }));
      children.push(p(''));
    }

    // More sections
    var secoes2 = [
      ['Orientações ao Docente', aula.orientacoes],
      ['Possíveis Dificuldades', aula.dificuldades],
      ['Perguntas para Reflexão', aula.reflexao],
      ['Checklist do Docente', aula.checklist],
    ];
    secoes2.forEach(function(s){
      if(s[1]){
        children.push(new D.Table({
          width:{size:14400,type:'dxa'},
          columnWidths:[3200,11200],
          rows:[row2(s[0],s[1],'D6DCE4')]
        }));
        children.push(p(''));
      }
    });

    children.push(p('─'.repeat(80), {color:'AAAAAA', size:16, before:40, after:40}));
  });

  // Build document
  var doc = new D.Document({
    sections:[{
      properties:{
        page:{
          size:{width:16838, height:11906},
          margin:{top:720, right:720, bottom:720, left:720}
        }
      },
      children: children
    }]
  });

  var blob = await D.Packer.toBlob(doc);
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  var nm = (A.sun||'planejamento').replace(/[^\w\sÀ-ÿ]/g,'').replace(/\s+/g,'_').substring(0,50);
  a.href = url;
  a.download = 'Planejamento_'+nm+'_'+new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')+'.docx';
  a.click();
  setTimeout(function(){URL.revokeObjectURL(url);}, 3000);
}


function parsearAulas(txt){
  var aulas=[],blocos=txt.split(/╔[═]+/);
  blocos.forEach(function(bloco){
    if(!bloco.includes('AULA')||!bloco.includes('╚'))return;
    var a={};
    var tm=bloco.match(/AULA\s+\d+\s+de\s+\d+\s*[—–-]+\s*([^\n]+)/i);
    a.titulo=tm?tm[1].trim().replace(/╚.*/,'').trim():'Aula';
    var chm=bloco.match(/CH:\s*([^\|]+)/i);a.ch=chm?chm[1].trim():'4h';
    var mm=bloco.match(/Modalidade:\s*([^\n]+)/i);a.modalidade=mm?mm[1].trim():'Presencial';
    var campos=[
      {k:'indicadores',p:/Indicadores[^:]*:\s*([^\n]+)/i},
      {k:'conhecimentos',p:/Conhecimentos?:\s*([\s\S]*?)(?=\nHabilidades?:|$)/i},
      {k:'habilidades',p:/Habilidades?:\s*([\s\S]*?)(?=\nAtitudes?:|$)/i},
      {k:'atitudes',p:/Atitudes?:\s*([\s\S]*?)(?=\nObjetivo|$)/i},
      {k:'objetivo',p:/Objetivo[^:]*:\s*([\s\S]*?)(?=\nSitua|$)/i},
      {k:'situacao',p:/Situa[çc][aã]o[^:]*:\s*([\s\S]*?)(?=\nMetodologia|$)/i},
      {k:'metodologia',p:/Metodologia[^:]*:\s*([\s\S]*?)(?=\nRecursos|$)/i},
      {k:'produto',p:/Produto[^:]*:\s*([\s\S]*?)(?=\nInstrumentos|$)/i},
      {k:'instrumentos',p:/Instrumentos[^:]*:\s*([\s\S]*?)(?=\nEvid|$)/i},
      {k:'evidencias',p:/Evid[eê]ncias[^:]*:\s*([\s\S]*?)(?=\nCrit|$)/i},
      {k:'criterios',p:/Crit[eé]rios[^:]*:\s*([\s\S]*?)(?=\nOrienta|$)/i},
      {k:'orientacoes',p:/Orienta[çc][oõ]es[^:]*:\s*([\s\S]*?)(?=\nPoss|$)/i},
      {k:'reflexao',p:/Perguntas?[^:]*:\s*([\s\S]*?)(?=\nChecklist|$)/i},
      {k:'checklist',p:/Checklist[^:]*:\s*([\s\S]*?)(?=╚|$)/i},
    ];
    campos.forEach(function(c){var m=bloco.match(c.p);a[c.k]=m?m[1].trim().replace(/╚[═]*/,'').trim():'';});
    a.desenvolvimento={};
    var db=bloco.match(/DESENVOLVIMENTO[^:]*:([\s\S]*?)(?=Produto|$)/i);
    if(db){
      var dv=db[1];
      [{k:'acolhimento',p:/Acolhimento[^:]*:\s*([^\n•▸]+)/i},{k:'mobilizacao',p:/Mobiliza[çc][aã]o[^:]*:\s*([^\n•▸]+)/i},{k:'desenvolvimento',p:/Desenvolvimento[^:]*:\s*([^\n•▸]+)/i},{k:'pratica',p:/Pr[aá]tica[^:]*:\s*([^\n•▸]+)/i},{k:'sistematizacao',p:/Sistematiza[çc][aã]o[^:]*:\s*([^\n•▸]+)/i},{k:'encerramento',p:/Encerramento[^:]*:\s*([^\n•▸]+)/i}].forEach(function(c){var m=dv.match(c.p);a.desenvolvimento[c.k]=m?m[1].trim():'';});
    }
    if(a.titulo&&a.titulo.length>2)aulas.push(a);
  });
  return aulas;
}

async function gerarWordBrowser(aulas,D){
  // Safe enum access - works with docx 7.x and 8.x
  function getEnum(obj,path,fallback){
    try{var parts=path.split('.');var v=obj;for(var p of parts){v=v[p];if(v===undefined)return fallback;}return v||fallback;}catch(e){return fallback;}
  }
  var SINGLE  = getEnum(D,'BorderStyle.SINGLE','single');
  var LEFT    = getEnum(D,'AlignmentType.LEFT','left');
  var CENTER  = getEnum(D,'AlignmentType.CENTER','center');
  var DXA     = getEnum(D,'WidthType.DXA','dxa');
  var CLEAR   = getEnum(D,'ShadingType.CLEAR','clear');
  var VTOP    = getEnum(D,'VerticalAlign.TOP','top');
  var LAND    = getEnum(D,'PageOrientation.LANDSCAPE','landscape');
  var AZ='1F3864',OR='E05A1A',CZ='D6DCE4',CZ2='F2F2F2',BR='FFFFFF';
  // Use string literals for cross-version compatibility
  
  
  
  
  
  
  
  var brd=function(c,s){return{style:SINGLE,size:s||4,color:c||'AAAAAA'};};
  var brdN={top:brd(),bottom:brd(),left:brd(),right:brd()};
  var brdA={top:brd(AZ,8),bottom:brd(AZ,8),left:brd(AZ,8),right:brd(AZ,8)};
  var tx=function(t,o){o=o||{};return new D.TextRun({text:t||'',bold:o.b,size:o.s||22,font:'Arial',color:o.c||'000000',italics:o.i});};
  var pr=function(t,o){o=o||{};return new D.Paragraph({children:[tx(t,o)],alignment:o.al||LEFT,spacing:{before:o.sb||60,after:o.sa||60}});};
  var cl=function(ch,o){o=o||{};return new D.TableCell({borders:o.brd||brdN,width:o.w?{size:o.w,type:DXA}:undefined,columnSpan:o.sp||1,shading:o.bg?{fill:o.bg,type:CLEAR}:undefined,margins:{top:80,bottom:80,left:120,right:120},verticalAlign:VTOP,children:Array.isArray(ch)?ch:[ch]});};
  var secR=function(l,v){return new D.Table({width:{size:14400,type:DXA},columnWidths:[2800,11600],rows:[new D.TableRow({children:[cl(pr(l,{b:true,c:AZ,s:20}),{bg:CZ,w:2800}),cl(pr(v||'',{s:20}),{w:11600})]})]});};
  var ch=[];
  ch.push(new D.Table({width:{size:14400,type:DXA},columnWidths:[14400],rows:[new D.TableRow({children:[cl([pr('PLANEJAMENTO PEDAGÓGICO SENAC',{b:true,s:32,c:BR,al:CENTER,sb:160,sa:80}),pr(A.cn||'',{b:true,s:26,c:BR,al:CENTER,sb:0,sa:60}),pr(A.sun||'',{s:22,c:BR,al:CENTER,sb:0,sa:160})],{bg:AZ,brd:brdA,w:14400})]})]},),pr(''));
  aulas.forEach(function(aula,idx){
    ch.push(new D.Paragraph({children:[new D.PageBreak()]}));
    ch.push(new D.Table({width:{size:14400,type:DXA},columnWidths:[14400],rows:[new D.TableRow({children:[cl([pr('AULA '+(idx+1)+' de '+aulas.length+'  |  '+(aula.titulo||''),{b:true,s:26,c:BR,al:CENTER,sb:120,sa:60}),pr(A.sun||'',{s:20,c:BR,al:CENTER,sb:0,sa:120})],{bg:AZ,brd:brdA,w:14400})]})]},),pr(''));
    if(aula.situacao)ch.push(secR('Situação de Aprendizagem',aula.situacao),pr(''));
    ch.push(new D.Table({width:{size:14400,type:DXA},columnWidths:[2880,2880,2880,2880,2880],rows:[new D.TableRow({children:[cl(pr('CH',{b:true,s:20,c:BR}),{bg:OR}),cl(pr('Modalidade',{b:true,s:20,c:BR}),{bg:OR}),cl(pr('Metodologia',{b:true,s:20,c:BR}),{bg:OR}),cl(pr('Indicadores',{b:true,s:20,c:BR}),{bg:OR}),cl(pr('Produto',{b:true,s:20,c:BR}),{bg:OR})]}),new D.TableRow({children:[cl(pr(aula.ch||'',{s:20}),{bg:CZ2}),cl(pr(aula.modalidade||'',{s:20}),{bg:CZ2}),cl(pr(aula.metodologia||'',{s:19}),{bg:CZ2}),cl(pr(aula.indicadores||'',{s:20}),{bg:CZ2}),cl(pr(aula.produto||'',{s:19}),{bg:CZ2})]})]}),pr(''));
    if(aula.objetivo)ch.push(secR('Objetivo',aula.objetivo),pr(''));
    ch.push(new D.Table({width:{size:14400,type:DXA},columnWidths:[4800,4800,4800],rows:[new D.TableRow({children:[cl(pr('Conhecimentos',{b:true,s:20,c:BR}),{bg:AZ}),cl(pr('Habilidades',{b:true,s:20,c:BR}),{bg:AZ}),cl(pr('Atitudes',{b:true,s:20,c:BR}),{bg:AZ})]}),new D.TableRow({children:[cl(pr(aula.conhecimentos||'',{s:19}),{bg:CZ2}),cl(pr(aula.habilidades||'',{s:19}),{bg:CZ2}),cl(pr(aula.atitudes||'',{s:19}),{bg:CZ2})]})]}),pr(''));
    var dev=aula.desenvolvimento||{};
    ch.push(new D.Table({width:{size:14400,type:DXA},columnWidths:[3200,11200],rows:[new D.TableRow({children:[cl(pr('DESENVOLVIMENTO',{b:true,s:22,c:BR,al:CENTER}),{bg:AZ,sp:2})]})].concat([['Acolhimento (15 min)',dev.acolhimento],['Mobilização (20 min)',dev.mobilizacao],['Desenvolvimento',dev.desenvolvimento],['Prática',dev.pratica],['Sistematização (20 min)',dev.sistematizacao],['Encerramento (15 min)',dev.encerramento]].map(function(r){return new D.TableRow({children:[cl(pr(r[0],{b:true,s:20,c:AZ}),{bg:CZ,w:3200}),cl(pr(r[1]||'',{s:20}),{w:11200})]});}))},),pr(''));
    ch.push(new D.Table({width:{size:14400,type:DXA},columnWidths:[4800,4800,4800],rows:[new D.TableRow({children:[cl(pr('Evidências',{b:true,s:20,c:BR}),{bg:OR}),cl(pr('Critérios',{b:true,s:20,c:BR}),{bg:OR}),cl(pr('Instrumentos',{b:true,s:20,c:BR}),{bg:OR})]}),new D.TableRow({children:[cl(pr(aula.evidencias||'',{s:19}),{bg:CZ2}),cl(pr(aula.criterios||'',{s:19}),{bg:CZ2}),cl(pr(aula.instrumentos||'',{s:19}),{bg:CZ2})]})]}),pr(''));
    ch.push(new D.Table({width:{size:14400,type:DXA},columnWidths:[7200,7200],rows:[new D.TableRow({children:[cl([pr('Orientações ao Docente',{b:true,s:20,c:AZ}),pr(aula.orientacoes||'',{s:19})],{bg:CZ2}),cl([pr('Perguntas para Reflexão',{b:true,s:20,c:AZ}),pr(aula.reflexao||'',{s:19})],{bg:CZ2})]})]}),pr(''));
  });
  var doc=new D.Document({styles:{default:{document:{run:{font:'Arial',size:22}}}},sections:[{properties:{page:{size:{width:16838,height:11906},margin:{top:720,right:720,bottom:720,left:720},orientation:LAND}},children:ch}]});
  var blob=await D.Packer.toBlob(doc);
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  var nm=(A.sun||'planejamento').replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g,'').replace(/\s+/g,'_').substring(0,50);
  a.href=url;a.download='Planos_'+nm+'_'+new Date().toLocaleDateString('pt-BR').replace(/\//g,'-')+'.docx';a.click();
  URL.revokeObjectURL(url);
}

ca();
