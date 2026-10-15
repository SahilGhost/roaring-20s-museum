import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../dist/vendor/three.module.js';
import {MuseumSession,formatElapsed} from '../dist/session.js';

// Exercise the actual museum geometry and navigation without a browser/GPU.
const drawing = new Proxy({}, {get:()=>()=>{},set:()=>true});
const elements = new Map();
const element = id => {if(!elements.has(id))elements.set(id,{checked:false,textContent:'',classList:{add(){},remove(){}},querySelector(){return element(id+' child');}});return elements.get(id);};
const context = vm.createContext({THREE,MuseumSession,formatElapsed,console,setTimeout,clearTimeout,matchMedia:()=>({matches:false}),document:{getElementById:element,createElement:()=>({width:0,height:0,getContext:()=>drawing})}});
let source=fs.readFileSync(new URL('../dist/museum.js',import.meta.url),'utf8');
source=source.replace(/^import .*;$/gm,'');
source=source.replace("import { MuseumSession, formatElapsed } from './session.js';",'');
source=source.slice(0,source.lastIndexOf('\ntry{'));
console.log('Building museum geometry for navigation checks…');
vm.runInContext(source+`\nscene=new THREE.Scene(); camera=new THREE.PerspectiveCamera(67,1,.07,100);camera.rotation.order='YXZ';buildMuseum();globalThis.test={rooms,doors,camera,scene,isBlocked,move,currentRoom,targetDoor,toggleDoor,session,visitDoor};`,context,{timeout:10000});
const t=context.test;
assert.equal(t.rooms.length,6);assert.equal(t.doors.length,6);
for(const d of t.doors){
  const {side,z}=d.room;
  t.camera.position.set(side*1.1,1.7,z);t.camera.rotation.set(0,side===1?-Math.PI/2:Math.PI/2,0,'YXZ');t.scene.updateMatrixWorld(true);t.camera.updateMatrixWorld(true);
  assert.ok(t.targetDoor()===d,'Door must be clickable from its map arrival point: '+d.room.id);
  t.move(side*5,0);assert.ok(Math.abs(t.camera.position.x)<3.8,'Closed door must block passage');
  t.camera.position.set(side*2,1.7,z);t.toggleDoor(d);assert.equal(d.open,true,'Interaction must open the door');
  d.amount=1;d.left.rotation.y=Math.PI/2;d.right.rotation.y=-Math.PI/2;
  t.move(side*8,0);assert.equal(t.currentRoom().id,d.room.id,'Open doorway must lead into its own room');
  t.move(side*15,0);assert.ok(Math.abs(t.camera.position.x)<16.1,'Outer wall must block escape');
  t.camera.position.set(side*10,1.7,z);t.move(0,-15);assert.ok(t.camera.position.z>z-4.7,'Room back wall must block crossing');
  t.camera.position.set(side*4,1.7,z);t.toggleDoor(d);assert.equal(d.open,true,'Door must not close onto visitor');
  t.move(-side*4,0);assert.equal(t.currentRoom(),null,'Visitor must be able to return to hall');
  t.camera.position.set(side*2,1.7,z);t.toggleDoor(d);assert.equal(d.open,false,'Door can close when visitor clears threshold');d.amount=0;
}
t.camera.position.set(0,1.7,15);t.move(0,-50);assert.ok(t.camera.position.z>-28.7,'Hall end wall must block escape');
t.camera.position.set(0,1.7,15);t.move(0,20);assert.ok(t.camera.position.z<17.7,'Lobby front wall must block escape');
assert.ok(t.scene.children.length>400,'Architectural shell must be present');
console.log('PASS: all 6 doors are ray-clickable; closed/open collisions, room entry/exit, anti-trap closing, room boundaries, and lobby boundaries.');
t.session.mode='escape';
for(const d of t.doors){if(d.room.id==='campaign')continue;t.camera.position.set(d.room.side*2,1.7,d.room.z);t.toggleDoor(d);assert.equal(d.open,false,'Competitive lock must reject interaction');d.amount=1;t.move(d.room.side*8,0);assert.ok(Math.abs(t.camera.position.x)<3.8,'Lock must block even a stale open-door animation');d.amount=0;}
t.camera.position.set(0,1.7,14);t.visitDoor(t.rooms[4]);assert.equal(t.camera.position.x,0,'Competitive mode must reject map teleport');
console.log('PASS: locked doors cannot be opened or crossed, and competitive map navigation is blocked.');

let navClock=0;t.session.now=()=>navClock;t.session.start("escape");
for(const room of t.rooms.filter(r=>r.id!=="reference"))t.session.completeGallery(room.id);
assert.equal(t.session.finishedAt,null);
vm.runInContext("exhibitUI={finishAtReference(){session.finish();}}",context);
const referenceDoor=t.doors.find(d=>d.room.id==="reference");referenceDoor.open=false;
t.camera.position.set(referenceDoor.room.side*2,1.7,referenceDoor.room.z);navClock=123000;t.toggleDoor(referenceDoor);
assert.equal(referenceDoor.open,true);assert.equal(t.session.finishedAt,123000,"Opening bibliography door stops clock");navClock+=10000;assert.equal(t.session.elapsedMs,123000);
console.log("PASS: actual bibliography door interaction completes escape and freezes time.");
