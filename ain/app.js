const $=s=>document.querySelector(s),app=$('#app');const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>[...a].sort(()=>Math.random()-.5);let page='dashboard',active=null,mock=null,history=[],hints=0,completed=new Set(JSON.parse(localStorage.getItem('ain-done-v3')||'[]'));
let selectedCommand=0;
const catalog=[...new Map(AIN_LABS.flatMap(l=>l.steps.map(s=>[s[1],[s[1],s[0],l.domain]]))).values()];
function save(){localStorage.setItem('ain-done-v3',JSON.stringify([...completed]));if(mock)localStorage.setItem('ain-mock-v3',JSON.stringify(mock));window.dispatchEvent(new Event('ain-progress-changed'))}
function button(t,fn,cls=''){return `<button class="button ${cls}" onclick="${esc(fn)}">${t}</button>`}
function go(p){page=p;render()}function resetState(){return {link:{swp1:'down',swp2:'up',swp49:'up'},mtu:{swp1:9216,swp2:1500,swp49:9216},staged:{},last:'',applied:false}}
let net=resetState();function start(id,fromMock=false){let l=AIN_LABS.find(x=>x.id===id);if(!l)return;active={id,at:0,done:[],hintCounts:[],fromMock};net=resetState();if(id!=='cx-link')net.link.swp1='up';if(id!=='cx-mtu')net.mtu.swp2=9216;if(id==='automation-drift')net.mtu.swp49=1500;history=[];hints=0;page='terminal';render()}
function output(cmd){let l=active&&AIN_LABS.find(x=>x.id===active.id),fault=l?.id||'',p=cmd.split(' '),port=p.find(x=>/^swp\d+$/.test(x))||'swp1';if(cmd==='help'||cmd==='?')return [
'NETWORK LAB COMMAND REFERENCE (synthetic training)',
'',
'SPECTRUM / CUMULUS (NVUE)',
'  nv show interface swp1 | swp2 | swp49  - Interface status',
'  nv show qos                          - QoS / PFC inspection',
'  nv config show                       - Staged configuration',
'  nv set interface swp1 link state up  - Restore an interface',
'  nv set interface swp2 link mtu 9216  - Change MTU',
'  nv config apply                      - Apply configuration',
'',
'INFINIBAND / FABRIC',
'  ibstat | ibv_devinfo | iblinkinfo     - Local adapter / links',
'  ibdiagnet | perfquery                - Fabric / port counters',
'  mlxlink -d /dev/mst/mt4129_pciconf0 -p 1  - Port detail',
'',
'LINUX / RDMA / ROUTING',
'  rdma link show | ip link show | ip addr show | ip route',
'  ethtool -S swp1 | swp2 | swp49       - Link statistics',
'  sudo vtysh -c "show bgp summary"    - BGP peers',
'  kubectl get pods -n nvidia-network-operator | kubectl get nodes -o wide',
'  kubectl get daemonsets -n nvidia-network-operator',
'  kubectl logs daemonset/mofed-ds -n nvidia-network-operator',
'  kubectl get network-attachment-definitions -A',
'  nv config diff | ansible-inventory -i inventory.yml --list',
'  ansible-playbook -i inventory.yml fabric.yml --check --diff',
'',
'TRAINING CONTROLS',
'  Diagnostic-only incidents are assessed by confirmed observations; no fake escalation command.',
'  hint  - Next-step hint (penalty in mock)   clear  - Clear output',
'  help  - Display this reference',
'',
'Use the Command Academy for explanations and the current lab objective for context.'
].join('\n');
if(cmd==='hint'){if(!active)return 'Start a guided lab first.';if(active.fromMock)return 'Hints are disabled in exam labs.';let step=l.steps[active.at];if(!step)return 'Lab complete';active.hintCounts[active.at]=(active.hintCounts[active.at]||0)+1;save();return 'HINT (penalty applies in mock): '+step[1]+'\nObjective: '+step[0]}
if(cmd==='clear'){history=[];return 'Terminal cleared.'}
if(cmd.startsWith('nv show interface ')){if(!/^swp(1|2|49)$/.test(port))return 'Error: interface not found';let st=net.link[port],mtu=net.mtu[port];return `Interface: ${port}\nAdmin state: ${st==='down'?'down':'up'}\nOper state: ${st==='down'?'down':'up'}\nMTU: ${mtu}\nSpeed: 400G\nRX errors: ${fault==='sx-fabric'&&port==='swp49'?183:0}\nTraining snapshot: ${fault==='cx-link'&&port==='swp1'?'administratively down':fault==='cx-mtu'&&port==='swp2'?'MTU below intended jumbo frame setting':'see scenario for fault context'}`}
if(cmd==='nv show qos')return 'QoS (synthetic Spectrum-X profile)\nRoCE traffic class: 3\nPFC: enabled on priority 3\nECN: enabled for designated lossless queue\nPriority 3 pause frames: '+(fault==='sx-pfc'?15020:128)+'\nECN marked packets: '+(fault==='sx-ecn'?48321:352)+'\nValidate settings against the approved fabric design; do not assume defaults.';
if(cmd==='nv config diff')return 'NVUE configuration diff (synthetic): no locally staged changes; compare against automation baseline using Ansible --check --diff.';
if(cmd==='ansible-inventory -i inventory.yml --list')return '{\"all\":{\"hosts\":[\"leaf01\"],\"vars\":{\"ansible_connection\":\"ansible.netcommon.network_cli\"}}} (synthetic fixture)';
if(cmd==='ansible-playbook -i inventory.yml fabric.yml --check --diff')return 'PLAY [Validate approved leaf01 baseline] (synthetic)\nTASK [Inspect NVUE swp49 MTU] changed: [leaf01] (check mode)\n--- before: swp49 mtu=1500\n+++ after: swp49 mtu=9216\nPLAY RECAP leaf01: ok=3 changed=1 failed=0\nNo configuration was applied: --check --diff';
if(cmd==='kubectl get pods -n nvidia-network-operator')return 'NAME READY STATUS RESTARTS\nnetwork-operator-6fc4 1/1 Running 0\nmofed-ds-node002 0/1 CrashLoopBackOff 6';
if(cmd==='kubectl get daemonsets -n nvidia-network-operator')return 'NAME DESIRED CURRENT READY\nmofed-ds 2 2 1';
if(cmd==='kubectl logs daemonset/mofed-ds -n nvidia-network-operator')return 'mofed-ds-node002: detected unsupported driver/kernel combination after worker upgrade (synthetic); coordinate compatible OFED image before remediation';
if(cmd==='kubectl get nodes -o wide')return 'NAME STATUS ROLES VERSION\nnode001 Ready worker v1.32\nnode002 Ready worker v1.32';
if(cmd==='kubectl get network-attachment-definitions -A')return 'NAMESPACE NAME AGE\nai-training rdma-net 12d';
if(cmd==='nv config show')return `- interface:\n    swp1: {link: {state: ${net.link.swp1}}, mtu: ${net.mtu.swp1}}\n    swp2: {link: {state: ${net.link.swp2}}, mtu: ${net.mtu.swp2}}\n    swp49: {link: {state: ${net.link.swp49}}, mtu: ${net.mtu.swp49}}\n- qos: {roce-priority: 3}\nStaged changes: ${JSON.stringify(net.staged)}`;
let m=cmd.match(/^nv set interface (swp\d+) link state (up|down)$/);if(m){if(!net.link[m[1]])return 'Error: unknown port';net.staged['link:'+m[1]]=m[2];return 'Staged link state change for '+m[1]+'; run nv config apply.'}
m=cmd.match(/^nv set interface (swp\d+) link mtu (\d+)$/);if(m){if(!net.link[m[1]])return 'Error: unknown port';net.staged['mtu:'+m[1]]=Number(m[2]);return 'Staged MTU change for '+m[1]+'; run nv config apply.'}
if(cmd==='nv config apply'){for(let [k,v] of Object.entries(net.staged)){let [kind,iface]=k.split(':');if(kind==='link')net.link[iface]=v;else net.mtu[iface]=v}let n=Object.keys(net.staged).length;net.staged={};net.applied=n>0;return `Applied ${n} staged change(s) in training environment. Verify interface state.`}
if(cmd==='ibstat')return `CA 'mlx5_0'\nCA type: MT4129\nNumber of ports: 1\nPort 1:\n State: ${fault==='ib-down'?'Initializing':'Active'}\n Physical state: ${fault==='ib-down'?'LinkDown':'LinkUp'}\n Rate: 400\n Base lid: ${fault==='ib-subnet'?'0':'23'}\n SM lid: ${fault==='ib-subnet'?'0':'1'}`;
if(cmd==='ibv_devinfo')return `hca_id: mlx5_0\n transport: InfiniBand\n fw_ver: training\n port: 1\n state: ${fault==='ib-down'?'PORT_INIT':'PORT_ACTIVE'}\n sm_lid: ${fault==='ib-subnet'?'0':'1'}\n link_layer: InfiniBand`;
if(cmd==='iblinkinfo')return fault==='ib-down'?'CA compute-03 port 1 ==> switch ib-leaf-02 port 8 [DOWN]\nOther ports ACTIVE':fault==='ib-subnet'?'Fabric discovery incomplete: subnet manager not active':'CA compute-03 port 1 ==> switch ib-leaf-02 port 8 [ACTIVE]\nFabric topology discovered: 32 endpoints';
if(cmd==='ibdiagnet')return `ibdiagnet synthetic fabric report\nDiscovery: ${fault==='ib-subnet'?'FAILED: no active subnet manager':'COMPLETE'}\nLink issues: ${fault==='ib-down'?1:0}\nPort counter warnings: ${['ib-errors','ib-traffic'].includes(fault)?2:0}\nInspect individual links/counters for root cause. No automatic remediation performed.`;
if(cmd==='perfquery')return `Port counters for mlx5_0 port 1\nSymbolErrorCounter: ${fault==='ib-errors'?342:0}\nLinkErrorRecoveryCounter: ${fault==='ib-errors'?15:0}\nPortXmitWait: ${fault==='ib-traffic'?92342:128}\nPortRcvErrors: ${fault==='ib-errors'?44:0}`;
if(cmd==='mlxlink -d /dev/mst/mt4129_pciconf0 -p 1')return `Mellanox Link Diagnostic (synthetic)\nOperational State: ${fault==='ib-down'?'Down':'Active'}\nPhysical State: ${fault==='ib-down'?'LinkDown':'LinkUp'}\nSpeed: 400G\nCable status: ${fault==='ib-down'?'Check cable/transceiver path':'Present'}\nFEC errors: ${fault==='ib-errors'?283:0}`;
if(cmd==='sudo vtysh -c "show bgp summary"')return `IPv4 Unicast Summary:\nNeighbor         AS      State/PfxRcd\n10.0.0.1         65100   ${['cx-bgp','cx-route'].includes(fault)?'Idle':'128'}\n10.0.0.2         65100   128\nBGP sessions shown are synthetic.`;
if(cmd==='ip route')return ['cx-bgp','cx-route'].includes(fault)?'10.0.0.0/24 dev swp49 proto kernel\n203.0.113.0/24 unreachable (peer route withdrawn)':'default via 10.0.0.1 dev eth0\n203.0.113.0/24 via 10.0.0.1 dev swp49';
if(cmd==='ip link show')return '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9000\n3: ens5f0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9000';
if(cmd==='ip addr show')return 'eth0: inet 192.0.2.10/24\nens5f0: inet 198.51.100.10/24 (training address)';
if(cmd==='rdma link show')return fault==='sx-rdma'?'link mlx5_0/1 state DOWN physical_state DISABLED netdev ens5f0':'link mlx5_0/1 state ACTIVE physical_state LINK_UP netdev ens5f0';
if(/^ethtool -S swp(1|2|49)$/.test(cmd))return `NIC statistics (${port}):\n rx_packets: 103231\n tx_packets: 102901\n rx_errors: ${fault==='sx-fabric'?81:0}\n rx_pause_prio3: ${fault==='sx-pfc'?15020:118}\n ecn_marked: ${fault==='sx-ecn'?48321:352}`;
if(cmd.startsWith('simctl'))return 'Error: simctl is not an NVIDIA or Linux command. Collect diagnostics and escalate through your organization’s incident system.';
return 'Command not available in this synthetic lab. Type help to inspect supported commands.'}
function evaluateAinGoals(cmd,out){
 if(!active||/^Error:|^Command not available/.test(out)||['help','hint','clear','?'].includes(cmd))return;
 const lab=AIN_LABS.find(l=>l.id===active.id);
 if(!lab)return;
 const isRepair=['cx-link','cx-mtu'].includes(active.id);
 // Diagnostics are executable in any order. Each must yield a valid synthetic response.
 // For repair cases, the final read-back must be after nv config apply.
 for(let i=0;i<lab.steps.length;i++){
  if(active.done.includes(i))continue;
  if(cmd!==lab.steps[i][1])continue;
  if(isRepair&&i===lab.steps.length-1){
   if(!net.applied||Object.keys(net.staged).length||!(active.id==='cx-link'?net.link.swp1==='up':net.mtu.swp2===9216))continue;
  }
  if(isRepair&&i===3&&!net.applied)continue;
  active.done.push(i);
 }
 // Applying an NVUE config cannot be credited as a repair unless the intended
 // interface and effective state are correct.
 if(isRepair&&(!net.applied||Object.keys(net.staged).length||(active.id==='cx-link'?net.link.swp1!=='up':net.mtu.swp2!==9216)))active.done=active.done.filter(i=>i<3);
 active.done.sort((a,b)=>a-b);active.at=active.done.length;
 if(active.done.length===lab.steps.length){completed.add(lab.id);save()}
}
function runCommand(e){
 e.preventDefault();let el=$('#command'),cmd=el?.value.trim();if(!cmd)return;
 let out=output(cmd);
 history.push({cmd,out});if(history.length>120)history.shift();
 evaluateAinGoals(cmd,out);render();$('#command')?.focus();
}
function terminal(){let l=active&&AIN_LABS.find(x=>x.id===active.id),n=l?.steps.length||0;let left=l?`<section class="lab-panel"><div class="lab-panel-top"><div><span class="eyebrow">${active.fromMock?'MOCK EXAM LAB':'GUIDED LAB'}</span><h2>${esc(l.name)}</h2></div></div><p>${esc(l.story)}</p><div class="scenario-brief"><strong>Training incident context</strong><p>Environment: isolated synthetic ${esc(l.domain)} fabric. The symptoms above are the starting observation; diagnose the affected interface or host before changing configuration. Do not assume a physical repair is possible in this simulator.</p><p>Available evidence: use <code>help</code> to see supported commands. Review output after every command. Commands below are supported in this training lab, but exact syntax depends on your software version.</p>${active.fromMock?'':`<details><summary>Guided command examples</summary><pre>${esc(l.steps.map(x=>x[1]).join('\n'))}</pre></details>`}<p><a href="https://www.nvidia.com/en-us/learn/certification/ai-networking-professional/" target="_blank" rel="noopener">Official NCP-AIN exam topics ↗</a></p></div><div class="lab-meter"><span>${active.at}/${n} steps</span><span>${Math.round(active.at/n*100)}%</span></div><div class="progress"><div style="width:${active.at/n*100}%"></div></div>${active.at===n?`<h3 class="success">✓ Lab completed</h3>${active.fromMock?button('Submit lab','submitLab()','primary'):button('Return to labs',`go('faults')`,'primary')}`:`<div class="objective-box"><span class="eyebrow">CURRENT OBJECTIVE</span><p>${esc((l.steps.find((_,i)=>!active.done.includes(i))||l.steps[0])[0])}</p><p class="muted">Use terminal output to determine what is happening. Type hint if needed.</p></div>`}<ol class="checklist">${l.steps.map((s,i)=>`<li class="${active.done.includes(i)?'done':i===active.at?'current':''}">${active.done.includes(i)?'✓':'○'} ${esc(s[0])}</li>`).join('')}</ol><p>${['cx-link','cx-mtu'].includes(active.id)?'State-based repair: the intended configuration must be applied and verified.':'Diagnostic triage: collect the independent measurements; physical faults are not automatically repaired.'}</p></section>`:`<section class="lab-panel"><h2>Free practice</h2><p>Start a guided scenario or explore the command catalog. Commands run against a synthetic network state.</p>${button('Browse labs',`go('faults')`,'primary')}</section>`;return `<div class="lab-workspace guided"><div class="workspace-head"><div><h1>Lab workspace</h1><p>Scenario and terminal side by side, matching the AIO workflow.</p></div>${active?.fromMock?button('Submit / skip lab','submitLab()'):button('All labs',`go('faults')`)}</div><div class="workspace-grid">${left}<section class="terminal-panel"><div class="terminalbar"><span>⌘ ncp-ain@fabric-training</span>${button('Clear',`quick('clear')`)}</div><div id="output" class="output" role="log">${history.map(x=>`$ ${esc(x.cmd)}\n${esc(x.out)}\n`).join('\n')||'Synthetic NVIDIA networking training terminal. Type help to begin.'}</div><form class="cmdline" onsubmit="runCommand(event)"><span class="prompt">$</span><input id="command" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal command" placeholder="Enter command…"><button class="button primary" type="submit">Run ↵</button></form><div class="terminal-shortcuts">${active?.fromMock?'':button('Hint',`quick('hint')`)}${button('Help',`quick('help')`)}</div></section></div></div>`}
function quick(c){if(page!=='terminal')page='terminal';render();let el=$('#command');if(el){el.value=c;el.focus()}}
function faults(){return `<h1>NCP-AIN Networking Lab Library</h1><p>14 simulated labs: InfiniBand, Cumulus Linux, Spectrum-X/RoCE, Kubernetes network integration, and automation. Diagnostics return scenario-specific synthetic output.</p><div class="grid">${AIN_LABS.map(l=>`<div class="card"><span class="tag">${esc(l.domain)}</span><h2>${esc(l.name)}</h2><p>${esc(l.story)}</p>${completed.has(l.id)?'<p class="success">✓ Completed</p>':''}${button('Start guided lab',`start('${l.id}')`,'primary')}</div>`).join('')}</div>`}
function academy(){let item=catalog[selectedCommand]||catalog[0], [cmd,purpose,domain]=item;let syntax=cmd;let explanation=domain==='InfiniBand'?'Inspect fabric or HCA evidence and compare link state, counters and topology before escalating.':domain==='Cumulus Linux'?'Use NVUE or Linux networking commands to inspect configuration and operational state; stage and apply only approved changes.':'Inspect Spectrum Ethernet, RoCE transport, congestion, PFC/ECN or NIC status and correlate observations.';return `<h1>Command academy</h1><p class="sub">Understand the purpose, syntax, interpretation and operational context of each command.</p><div class="commands"><div class="card command-list">${catalog.map(([c,why,d],i)=>`<button class="${i===selectedCommand?'selected':''}" onclick="chooseCommand(${i})"><span class="tag">${esc(d)}</span> ${esc(c)}</button>`).join('')}</div><div class="card"><span class="tag">${esc(domain)}</span><h1 style="margin-top:12px">${esc(cmd.split(' ')[0])}</h1><h3>${esc(purpose)}</h3><h3>Syntax</h3><pre>${esc(syntax)}</pre><h3>What it does and why</h3><p>${esc(explanation)}</p><h3>How to interpret it</h3><p>Compare the returned interface, port, link, neighbor or counter fields with the expected fabric design. A single output does not establish root cause. Use related diagnostic commands and verify after an approved change.</p><div class="note">This is a simplified synthetic simulator. Confirm exact command syntax and output for your NVIDIA Cumulus Linux, NVUE, mlxlink, or InfiniBand tools version.</div><p>${button('Try in terminal',`go('terminal');quick(${JSON.stringify(cmd)})`,'primary')}</p></div></div>`}function chooseCommand(i){selectedCommand=i;render()}
function dashboard(){return `<h1>NCP-AIN Practice Sim and Mock Exam</h1><p>Same core workflow as the NCP-AIO app: dashboard, side-by-side guided terminal, command academy, fault labs and combined mock exams.</p><div class="grid"><section class="card"><h2>Networking lab simulator</h2><p>${completed.size}/${AIN_LABS.length} guided labs completed</p>${button('Launch labs',`go('faults')`,'primary')}</section><section class="card"><h2>Command academy</h2><p>${catalog.length} command/objective entries covering InfiniBand, Cumulus Linux and Spectrum-X/RoCE.</p>${button('Learn commands',`go('academy')`,'primary')}</section><section class="card"><h2>Mock exams</h2><p>4 original practice exam variants · 75 domain-weighted questions and three original practice labs. NVIDIA publishes 70–75 questions plus a hands-on component, but does not prescribe NAVIA's three practice labs.</p>${button('Start mock exams',`go('exams')`,'primary')}</section></div>`}
function buildAinQuestions(){
 const weights=[['AI Data Center Design',4],['Spectrum Networking',22],['InfiniBand Networking',23],['Kubernetes Integration',4],['Troubleshooting Tools',15],['Automation and Configuration',7]];
 const chosen=[];
 for(const [domain,required] of weights){
  const candidates=shuffle(AIN_BANK.filter(q=>q.domain===domain));const unique=new Set();let count=0;
  for(const q of candidates){
   const key=q.options[q.correct].trim().toLowerCase();
   if(unique.has(key))continue;
   unique.add(key);chosen.push(q);count++;if(count>=required)break;
  }
  if(count<required)throw Error('AIN question pool lacks distinct '+domain+' items: '+count+'/'+required);
 }
 return shuffle(chosen).map(q=>({...q,choices:shuffle(q.options.map((t,i)=>({t,ok:i===q.correct})))}));
}
function beginMock(v){
 const qs=buildAinQuestions();
 const rotations=[['InfiniBand','Cumulus Linux','Spectrum-X / RoCE'],['InfiniBand','Cumulus Linux','Kubernetes Integration'],['Spectrum-X / RoCE','Cumulus Linux','Automation and Configuration'],['InfiniBand','Spectrum-X / RoCE','Automation and Configuration']];
 const ids=rotations[v%4].map(d=>shuffle(AIN_LABS.filter(l=>l.domain===d))[0].id);
 mock={v,phase:'questions',qs,answers:Array(qs.length).fill(null),idx:0,labIds:shuffle(ids),labIndex:0,labScores:[],startedAt:Date.now()};save();render();
}
function choose(i){mock.answers[mock.idx]=i;save();render()}function next(n){mock.idx=Math.max(0,Math.min(mock.qs.length-1,mock.idx+n));save();render()}
function submitQuestions(){if(Date.now()-mock.startedAt>=7200000){finishAinMock();return;}if(mock.answers.some(x=>x===null)&&!confirm('Continue with unanswered questions?'))return;mock.phase='labs';mock.labIndex=0;start(mock.labIds[0],true);save()}
function submitLab(){if(!mock||mock.phase!=='labs')return;if(Date.now()-mock.startedAt>=7200000){finishAinMock();return;}let l=AIN_LABS.find(x=>x.id===active.id),earned=active.done.length;mock.labScores.push(Math.round(100*earned/l.steps.length));mock.labIndex++;if(mock.labIndex===3){mock.phase='results';page='exams';active=null;save();render()}else{let id=mock.labIds[mock.labIndex];save();start(id,true)}}
function finishAinMock(){if(!mock||mock.phase==='results')return;if(mock.phase==='labs'&&active){const l=AIN_LABS.find(x=>x.id===active.id);if(l)mock.labScores.push(Math.round(100*active.done.length/l.steps.length));}mock.phase='results';active=null;page='exams';save();}
function exams(){if(mock&&mock.phase!=='results'&&Date.now()-mock.startedAt>=7200000)finishAinMock();if(!mock)return `<h1>NCP-AIN Mock Exams</h1><p>Four practice variants. Each includes 75 distinct domain-weighted questions, a 120-minute shared practice timer, and three original simulated networking labs. NVIDIA confirms 70–75 questions and a hands-on component; the three practice labs and scoring are NAVIA-specific, not official exam replicas.</p><div class="grid">${[0,1,2,3].map(i=>`<section class="card"><h2>Mock exam ${i+1}</h2>${button('Start exam',`beginMock(${i})`,'primary')}</section>`).join('')}</div>`;
if(mock.phase==='labs')return terminal();if(mock.phase==='results'){let right=mock.qs.filter((q,i)=>q.choices[mock.answers[i]]?.ok).length,q=Math.round(right/mock.qs.length*100),l=Math.round(mock.labScores.reduce((a,b)=>a+b,0)/3);return `<h1>Mock ${mock.v+1} results</h1><section class="card"><h2>${Math.round((q+l)/2)}% practice score</h2><p>Questions: ${right}/${mock.qs.length} (${q}%) · Labs: ${l}% · Combined: equal-weight practice metric, not official NVIDIA weighting.</p>${button('Back to mock exams',"mock=null;go('exams')",'primary')}</section>${mock.qs.map((x,i)=>`<section class="card"><b>${i+1}. ${esc(x.q)}</b><p>${x.choices[mock.answers[i]]?.ok?'✓ Correct':'✕ Incorrect or unanswered'}</p><p>Answer: ${esc(x.choices.find(y=>y.ok).t)}</p><p>${esc(x.why)}</p></section>`).join('')}`}
let q=mock.qs[mock.idx];return `<h1>Mock ${mock.v+1} · Question ${mock.idx+1}/${mock.qs.length} · ${Math.max(0,Math.ceil((7200000-(Date.now()-mock.startedAt))/60000))} min remaining</h1><section class="card"><h2>${esc(q.q)}</h2>${q.choices.map((x,i)=>`<button class="button" style="display:block;width:100%;margin:8px 0;text-align:left;${mock.answers[mock.idx]===i?'border:2px solid #9ed35b':''}" onclick="choose(${i})">${String.fromCharCode(65+i)}. ${esc(x.t)}</button>`).join('')}<div class="flex">${button('Previous','next(-1)')}${button('Next','next(1)')}${button('Submit questions / begin labs','submitQuestions()','primary')}</div></section>`}
function render(){if(mock&&mock.phase!=='results'&&Date.now()-mock.startedAt>=7200000)finishAinMock();document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===page));app.innerHTML=({dashboard,terminal,academy,faults,exams})[page]();let out=$('#output');if(out)out.scrollTop=out.scrollHeight;if(page==='terminal')$('#command')?.focus()}
document.querySelectorAll('nav button[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));window.addEventListener('load',()=>{render()});
