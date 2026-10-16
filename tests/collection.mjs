import assert from 'node:assert/strict';
import * as THREE from '../dist/vendor/three.module.js';
import { buildCollection } from '../dist/collection.js';
import { STUDY_SLIPS } from '../dist/study-puzzle.js';
import { EvidenceProgress } from '../dist/exhibit-ui.js';
import { EXHIBITS, PUZZLES, SOURCES } from '../dist/exhibit-content.js';
import { HISTORY } from '../dist/exhibit-history.js';
import { EQ_ANSWERS } from '../dist/eq-answers.js';
import { MuseumSession, GALLERY_ORDER } from '../dist/session.js';
const drawing=new Proxy({measureText:s=>({width:s.length*19})},{get:(o,k)=>o[k]??(()=>{}),set:()=>true});
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>drawing})};
const rooms=[['campaign',-1,1],['industry',1,1],['diplomacy',-1,-11],['teapot',1,-11],['study',-1,-23],['reference',1,-23]].map(([id,side,z])=>({id,side,z}));
const scene=new THREE.Scene(),colliders=[],collection=buildCollection(scene,rooms,colliders);scene.updateMatrixWorld(true);
assert.equal(collection.instances.filter(o=>o.userData.collection.type==='exhibit').length,22);
assert.equal(collection.instances.filter(o=>o.userData.collection.type==='puzzle').length,5);
assert.equal(collection.instances.filter(o=>o.userData.collection.type==='slip').length,6);
assert.deepEqual(collection.instances.filter(o=>o.userData.collection.type==='audio').map(o=>o.userData.collection.room),['diplomacy','study']);
for(const root of collection.instances.filter(o=>['slip','audio'].includes(o.userData.collection.type))){
 const box=new THREE.Box3().setFromObject(root),target=box.getCenter(new THREE.Vector3());
 const origin=new THREE.Vector3(-12.5,1.7,target.z);
 const ray=new THREE.Raycaster(origin,target.clone().sub(origin).normalize(),0,4.8);
 assert.equal(ray.intersectObjects(collection.targets,false)[0]?.object.userData.collection,root.userData.collection,'Each desk slip and wall audio sign can be clicked from the room');
}
let triangles=0;scene.traverse(o=>{if(o.isMesh)triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;});assert.ok(triangles<90000,`Collection triangle budget: ${triangles}`);
for(const root of collection.instances){const b=new THREE.Box3().setFromObject(root),id=root.userData.collection.room,r=rooms.find(r=>r.id===id);assert.ok(b.min.y>=-.001,'All meshes supported above floor');assert.ok(b.max.y<4.65,'No ceiling intersection');assert.ok(b.min.z>r.z-4.86&&b.max.z<r.z+4.86,'Exhibit fits within room');assert.ok(b.min.x>r.side*10.15-6.01&&b.max.x<r.side*10.15+6.01,'Exhibit fits between side walls');}
for(const room of rooms.filter(r=>r.id!=='reference')){for(let x=room.side*4.8;Math.abs(x)<12.9;x+=room.side*.1){assert.ok(!colliders.some(b=>x>b.minX-.27&&x<b.maxX+.27&&room.z>b.minZ-.27&&room.z<b.maxZ+.27),'Central path remains clear');}}
const p=new EvidenceProgress();let time=0;const s=new MuseumSession(()=>time);s.start('escape');
for(const id of ['diplomacy-2','diplomacy-4','diplomacy-5'])p.inspect(id);
assert.equal(p.ready('diplomacy'),false,'Decoy files cannot satisfy the three historical clues');
p.reset();for(const id of PUZZLES.diplomacy.requiredIds)p.inspect(id);
assert.equal(p.ready('diplomacy'),true,'Three relevant files suffice without opening the decoys');
p.reset();assert.ok(EQ_ANSWERS.a1.paragraphs.length===2&&EQ_ANSWERS.d1.paragraphs.length===2);
for(const room of GALLERY_ORDER){const es=EXHIBITS.filter(e=>e.room===room);assert.equal(es.length,room==='diplomacy'?6:4);assert.ok(s.canEnter(room));if(PUZZLES[room].code)assert.equal(p.enterCode(room,PUZZLES[room].code),false,'Cannot unlock before inspecting required artifacts');else assert.equal(p.answer(room,PUZZLES[room].steps[0].answer),false,'Cannot answer before evidence');for(const e of es){assert.ok(e.sources.every(id=>SOURCES.some(s=>s.id===id)));assert.ok(HISTORY[e.id]?.event.length>180&&HISTORY[e.id]?.meaning.length>60,'Detailed history needed for '+e.id);p.inspect(e.id);}assert.equal(p.count(room),es.length);if(room==='study'){assert.equal(p.ready('study'),false);for(const slip of STUDY_SLIPS){assert.equal(p.answerSlip(slip.id,'wrong'),false);assert.equal(p.answerSlip(slip.id,slip.answer.toLowerCase()),true);}assert.equal(p.ready('study'),true);}if(PUZZLES[room].code){assert.equal(p.enterCode(room,'wrong'),false);assert.equal(p.enterCode(room,PUZZLES[room].code),true);time+=3000;}else for(const q of PUZZLES[room].steps){assert.equal(p.answer(room,'invalid'),false,'Wrong answers do not advance');assert.ok(q.options.some(o=>o.id===q.answer));assert.equal(p.answer(room,q.answer),true);time+=1000;}assert.ok(p.complete(room));assert.ok(s.completeGallery(room));assert.equal(p.answer(room,'a'),false,'Completed questions cannot repeat');}
assert.deepEqual(EXHIBITS.filter(e=>e.room==='campaign').map(e=>e.code),['0628','0108','0816','1106']);
assert.deepEqual(EXHIBITS.filter(e=>e.room==='diplomacy').map(e=>e.code),['TA','RE','XE','T','AS','S']);
assert.ok(s.finish());time+=1000;assert.equal(s.elapsedMs,15000);assert.equal(s.unlockedCount,5);p.reset();assert.equal(p.inspected.size,0);assert.equal(p.count('campaign'),0);
console.log(`PASS: 22 artifacts and 5 desks fit rooms, central paths stay clear, ${triangles} collection triangles; full evidence-to-escape progression and reset verified.`);
