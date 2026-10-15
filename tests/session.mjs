import assert from 'node:assert/strict';
import {MuseumSession,formatElapsed,GALLERY_ORDER} from '../dist/session.js';
let now=1000;const s=new MuseumSession(()=>now);
s.start('escape');assert.equal(s.unlockedCount,1);assert.equal(s.mapAllowed,false);assert.equal(s.canEnter('reference'),false);assert.equal(s.canEnter('industry'),false);
now+=65000;assert.equal(formatElapsed(s.elapsedMs),'01:05');assert.equal(s.finish(),false);assert.equal(s.completeGallery('study'),false);
for(let i=0;i<5;i++){assert.equal(s.canEnter(GALLERY_ORDER[i]),true);assert.equal(s.completeGallery(GALLERY_ORDER[i]),true);assert.equal(s.completeGallery(GALLERY_ORDER[i]),false);assert.equal(s.unlockedCount,Math.min(5,i+2));}
assert.equal(s.canEnter('reference'),true);now+=5000;assert.equal(formatElapsed(s.elapsedMs),'01:10','Timer keeps running after the fifth gallery');assert.equal(s.finish(),true);now+=10000;assert.equal(formatElapsed(s.elapsedMs),'01:10');assert.equal(s.finish(),false);
s.start('explore');assert.equal(s.elapsedMs,0);assert.equal(s.mapAllowed,true);for(const id of GALLERY_ORDER)assert.equal(s.canEnter(id),true);assert.equal(s.completeGallery('campaign'),false);
s.start('escape');assert.equal(s.unlockedCount,1);assert.equal(s.elapsedMs,0);assert.equal(s.solved.size,0);assert.equal(s.canEnter('unknown'),false);assert.equal(formatElapsed(3661000),'1:01:01');
console.log('PASS: timer uses elapsed time; progression is sequential and idempotent; final completion freezes time; mode changes reset progress.');
