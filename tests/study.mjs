import assert from 'node:assert/strict';
import {createExhibitUI} from '../dist/exhibit-ui.js';
import {STUDY_SLIPS} from '../dist/study-puzzle.js';
import {EXHIBITS, PUZZLES, SOURCES} from '../dist/exhibit-content.js';
import {MuseumSession, GALLERY_ORDER} from '../dist/session.js';

// Exercise the actual dialog handlers, including submissions and room access.
const nodes=new Map();
function node(id){
 if(!nodes.has(id))nodes.set(id,{innerHTML:'',value:'',open:false,
  insertAdjacentHTML(_where,html){this.innerHTML+=html;},querySelectorAll(){return [];},
  addEventListener(){},showModal(){this.open=true;},close(){this.open=false;},focus(){}});
 return nodes.get(id);
}
globalThis.document={getElementById:node};
globalThis.window={speechSynthesis:{cancel(){}}};
const rooms=GALLERY_ORDER.map((id,i)=>({id,name:id,short:id,number:i+1}));
let room=rooms.find(r=>r.id==='study'),clock=0,updates=0;
const session=new MuseumSession(()=>clock);session.start('escape');
const ui=createExhibitUI({session,rooms,currentRoom:()=>room,beforeOpen(){},onProgress(){updates++;},toast(){},sound(){}});
const drawer=()=>ui.interact({type:'puzzle',room:'study'});
const submit=(id,value)=>{node(id).value=value;node(id==='slipInput'?'slipForm':'drawerForm').onsubmit({preventDefault(){}});};
drawer();assert.equal(node('exhibitDialog').open,false,'Cannot interact with a locked gallery');
for(const id of GALLERY_ORDER.slice(0,4))session.completeGallery(id);
drawer();assert.match(node('exhibitBody').innerHTML,/0 \/ 6 slips solved/);
assert.doesNotMatch(node('exhibitBody').innerHTML,/first letter|initials/i,'Acrostic method is not revealed');
submit('drawerInput','SILENT');assert.equal(ui.progress.complete('study'),false,'Knowing the word cannot bypass all six slips');
for(const [index,slip] of STUDY_SLIPS.entries()){
 assert.ok(slip.sources.every(id=>SOURCES.some(s=>s.id===id)),'Every desk slip has valid historical references');
 ui.interact({type:'slip',id:slip.id,room:'study'});
 assert.match(node('exhibitBody').innerHTML,new RegExp(`${slip.answer.length} letters`));
 assert.doesNotMatch(node('exhibitBody').innerHTML,new RegExp(`value="${slip.answer}"`),'Unsolved word is not prefilled');
 submit('slipInput','wrong');assert.equal(ui.progress.slipAnswers[slip.id],undefined);
 submit('slipInput','  '+slip.answer.toLowerCase()+'  ');assert.equal(ui.progress.slipAnswers[slip.id],slip.answer);
 assert.equal(ui.progress.ready('study'),index===5,'The final slip is required');
}
assert.equal(STUDY_SLIPS[1].answer.length,10,'INJUNCTION is ten letters');
assert.equal(STUDY_SLIPS[2].answer,'LOAN','Banker slip uses the singular answer');
drawer();submit('drawerInput','WRONG');assert.equal(session.canEnter('reference'),false);
node('hintBtn').onclick();assert.equal(ui.progress.hints.study,1);
submit('drawerInput','silent');assert.equal(session.canEnter('reference'),true);
assert.equal(updates,1);assert.equal(ui.progress.incorrectMcq,0,'Word errors do not count as MCQ errors');
assert.equal(session.finishedAt,null,'Opening drawer must not stop the clock');
assert.match(node('exhibitBody').innerHTML,/Coolidge was famous for saying little/);
assert.match(node('exhibitBody').innerHTML,/Discuss the evidence/);
clock=62000;ui.finishAtReference();assert.equal(session.elapsedMs,62000);
assert.match(node('exhibitBody').innerHTML,/<b>1<\/b> Hints used/);

session.start('explore');ui.reset();
for(const exhibit of EXHIBITS.filter(e=>e.media)){
 room=rooms.find(r=>r.id===exhibit.room);
 ui.interact({type:'audio',room:exhibit.room,media:exhibit.media});
 assert.match(node('exhibitBody').innerHTML,/WALL AUDIO STATION/);
 assert.ok(node('exhibitBody').innerHTML.includes(SOURCES.find(s=>s.id===exhibit.media).url));
 assert.equal(ui.progress.inspected.size,0,'Wall audio does not require opening an artifact');
}
room=rooms.find(r=>r.id==='study');ui.interact({type:'exhibit',id:'study-1'});
assert.match(node('exhibitBody').innerHTML,/Second Annual Message/,'Original history remains accessible');
ui.reset();assert.deepEqual(ui.progress.slipAnswers,{});
assert.equal(PUZZLES.study.code,STUDY_SLIPS.map(s=>s.answer[0]).join(''));
console.log('PASS: six desk slips, early/incorrect lock submissions, drawer unlock, hints, final timing, original exhibits, independent audio and reset.');
