import assert from 'node:assert/strict';
import { createExhibitUI } from '../dist/exhibit-ui.js';
import { EXHIBITS, PUZZLES } from '../dist/exhibit-content.js';
import { MuseumSession, GALLERY_ORDER } from '../dist/session.js';

const nodes=new Map();
function node(id){
 if(!nodes.has(id))nodes.set(id,{innerHTML:'',open:false,insertAdjacentHTML(_where,html){this.innerHTML+=html;},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;},focus(){}});
 return nodes.get(id);
}
globalThis.document={getElementById:node};
globalThis.window={speechSynthesis:{cancel(){}}};
let clock=0,updated=0;
const session=new MuseumSession(()=>clock);session.start('escape');
const ui=createExhibitUI({session,rooms:[],currentRoom:()=>null,beforeOpen(){},onProgress(){updated++;},toast(){},sound(){}});
ui.finishAtReference();assert.equal(node('exhibitDialog').open,false,'No result before five galleries are solved');
for(const room of ['industry','study']){
 for(const e of EXHIBITS.filter(e=>e.room===room))ui.progress.inspect(e.id);
 for(const question of PUZZLES[room].steps){
  const before=ui.progress.incorrectMcq;
  assert.equal(ui.progress.answer(room,'invalid'),false);
  assert.equal(ui.progress.incorrectMcq,before,'An invalid option is not an incorrect submission');
  assert.equal(ui.progress.answer(room,question.options.find(o=>o.id!==question.answer).id),false);
  assert.equal(ui.progress.answer(room,question.answer),true);
 }
}
assert.equal(ui.progress.incorrectMcq,6,'Only valid wrong MCQ submissions count');
for(const room of GALLERY_ORDER)session.completeGallery(room);
clock=65000;assert.equal(session.finishedAt,null,'Last gallery does not stop the clock');
ui.progress.hints={industry:2,teapot:1};
ui.finishAtReference();
assert.equal(session.finishedAt,65000);assert.equal(updated,1);
assert.equal(node('exhibitDialog').open,true);
assert.match(node('exhibitBody').innerHTML,/Congratulations, historian/);
assert.match(node('exhibitBody').innerHTML,/01:05/);
assert.match(node('exhibitBody').innerHTML,/<b>6<\/b> Incorrect MCQ answers/);
assert.match(node('exhibitBody').innerHTML,/<b>3<\/b> Hints used/);
clock+=5000;ui.finishAtReference();assert.equal(session.elapsedMs,65000);assert.equal(updated,1,'Completion is idempotent');
ui.reset();assert.equal(ui.progress.incorrectMcq,0);
console.log('PASS: bibliography finish shows frozen time, incorrect MCQ submissions and hints; no early win; invalid options and reset handled.');
