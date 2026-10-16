import * as THREE from './vendor/three.module.js';
import { MuseumSession, formatElapsed } from './session.js';
import { buildCollection } from './collection.js';
import { createExhibitUI } from './exhibit-ui.js';

const $ = id => document.getElementById(id);
const rooms = [
  {id:'campaign',number:'01',name:'The Reparations Gallery',short:'Reparations',sub:'Versailles, American credit, and Germany’s payments.',side:-1,z:1,color:0x315c4c},
  {id:'industry',number:'02',name:'The Factory & Picket Line',short:'Business & Labor',sub:'Industry, policy, and the people between.',side:1,z:1,color:0x3c555c},
  {id:'diplomacy',number:'03',name:'The Economic Policy Files',short:'Economic Policy',sub:'Tax cuts, normalcy, and uneven prosperity.',side:-1,z:-11,color:0x365968},
  {id:'teapot',number:'04',name:'The Teapot Dome Room',short:'Teapot Dome',sub:'Public trust. Private interests.',side:1,z:-11,color:0x744a39},
  {id:'study',number:'05',name:'The Presidential Study',short:'Presidential Study',sub:'The quiet confidence of the Coolidge years.',side:-1,z:-23,color:0x5b5140},
  {id:'reference',number:'R',name:'The Reference Room',short:'Reference Room',sub:'Historical sources, objectives, and credits.',side:1,z:-23,color:0x4e604e}
];
let scene,camera,renderer,started=false,yaw=0,pitch=0,activeDoor=null,lastTime=0,elapsed=0,toastTimer,hallLight,ambientLight,keyLight,fillLight;
let collection,exhibitUI,activeCollection=null;
let pointerLocked=false,drag=null,soundEnabled=true,audioCtx,lastFootstep=0,selectedMode='explore',choosingMode=true;
const session=new MuseumSession();
const keys=new Set(),colliders=[],doors=[],doorTargets=[],wallTargets=[],visited=new Set();
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
let reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
$('motionToggle').checked=reducedMotion;
const mat=(color,roughness=.75,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const M={stone:mat(0xe9dec7),ceiling:mat(0xd8d2bf),dark:mat(0x183e35),wood:mat(0x243b31),brass:mat(0xb69a5b,.3,.65),black:mat(0x182724),cream:mat(0xf3ead2),trim:mat(0xa89060,.6,.3),glass:new THREE.MeshBasicMaterial({color:0xffe5b0}),light:new THREE.MeshBasicMaterial({color:0xfff1cd})};

function box(w,h,d,x,y,z,material,parent=scene){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
function cylinder(rt,rb,h,x,y,z,material,parent=scene,segments=24){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,segments),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
function wall(w,d,x,z,h=5.4,color=M.stone){
  const mesh=box(w,h,d,x,h/2,z,color);wallTargets.push(mesh);colliders.push({minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});
  box(w+.04,1.25,d+.04,x,.625,z,M.dark);box(w+.08,.075,d+.08,x,1.27,z,M.brass);box(w+.08,.16,d+.08,x,.08,z,M.black);
  box(w+.16,.16,d+.16,x,h-.2,z,M.cream);box(w+.1,.06,d+.1,x,h-.34,z,M.brass);return mesh;
}
function canvasTexture(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
function sign(text,small,w,h,x,y,z,rotation=0,parent=scene){
  const texture=canvasTexture(1024,256,(ctx,W,H)=>{ctx.fillStyle='#163c34';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#b99b5e';ctx.lineWidth=3;ctx.strokeRect(10,10,W-20,H-20);ctx.textAlign='center';ctx.fillStyle='#e8d4a4';ctx.font='42px Georgia';ctx.fillText(text,W/2,116);ctx.fillStyle='#c1c7b5';ctx.font='19px Arial';ctx.fillText(small,W/2,178);});
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture}));panel.position.set(x,y,z);panel.rotation.y=rotation;parent.add(panel);return panel;
}
function reparationsDecor(){
  // The old Western Front map overlapped the gallery title. Keep that area clear.
  const t=canvasTexture(900,650,(c,w,h)=>{
    c.fillStyle='#e6d5ad';c.fillRect(0,0,w,h);c.strokeStyle='#8c7044';c.lineWidth=18;c.strokeRect(24,24,w-48,h-48);c.fillStyle='#28483d';c.textAlign='center';c.font='42px Georgia';c.fillText('WALL STREET',w/2,90);c.font='19px Arial';c.fillText('NEW YORK FINANCIAL MARKETS · MUSEUM ILLUSTRATION',w/2,h-60);
    c.fillStyle='#385e50';for(let i=0;i<8;i++){const x=160+i*90,ht=110+(i%3)*48;c.fillRect(x,470-ht,58,ht);c.strokeStyle='#aa8a51';c.strokeRect(x,470-ht,58,ht);}c.strokeStyle='#9d6044';c.lineWidth=9;c.beginPath();c.moveTo(145,400);c.lineTo(290,342);c.lineTo(415,360);c.lineTo(560,260);c.lineTo(740,230);c.stroke();c.fillStyle='#254438';c.font='21px Arial';c.fillText('CREDIT AND STOCKS · 1920s',450,545);
  });
  const panel=new THREE.Mesh(new THREE.PlaneGeometry(2.1,1.5),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));
  panel.position.set(-16.07,2.6,4.55);panel.rotation.y=Math.PI/2;scene.add(panel);
}
function floor(w,d,x,z,room=false){
  const texture=canvasTexture(512,512,(ctx,W,H)=>{ctx.fillStyle=room?'#b4a185':'#d9d3c2';ctx.fillRect(0,0,W,H);const sz=128;for(let i=0;i<4;i++)for(let j=0;j<4;j++){ctx.fillStyle=(i+j)%2===0?(room?'#bba88b':'#e3dece'):(room?'#b19d80':'#c8c4b4');ctx.fillRect(i*sz+2,j*sz+2,sz-3,sz-3);ctx.strokeStyle=room?'#a18a6b55':'#ffffff40';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(i*sz+8,j*sz+28);ctx.bezierCurveTo(i*sz+40,j*sz+90,i*sz+75,j*sz+28,i*sz+120,j*sz+102);ctx.stroke();}});
  texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(w/6,d/6);texture.anisotropy=4;
  box(w,.14,d,x,-.09,z,new THREE.MeshStandardMaterial({map:texture,roughness:.48}));
  for(const dx of [-w/2+.3,w/2-.3])box(.07,.015,d-.6,x+dx,.001,z,M.brass);
  for(const dz of [-d/2+.3,d/2-.3])box(w-.6,.015,.07,x,.001,z+dz,M.brass);
}
function sconce(x,z,rot,parent=scene){const g=new THREE.Group();g.position.set(x,2.6,z);g.rotation.y=rot;parent.add(g);box(.27,.8,.08,0,0,0,M.brass,g);box(.42,.52,.17,0,.02,.11,M.light,g);for(const a of [-.17,0,.17])box(.025,.58,.03,a,.02,.22,M.brass,g);box(.47,.07,.24,0,.32,.1,M.brass,g);box(.47,.07,.24,0,-.29,.1,M.brass,g);}
function chandelier(x,z,height=5.4){cylinder(.025,.025,.75,x,height-.4,z,M.brass);cylinder(.55,.78,.22,x,height-.9,z,M.brass);cylinder(.7,.55,.25,x,height-1.14,z,M.light);cylinder(.4,.55,.2,x,height-1.36,z,M.brass);cylinder(.4,.24,.16,x,height-1.52,z,M.light);cylinder(.12,.05,.22,x,height-1.7,z,M.brass);}
function pilaster(x,z,h=5.4){box(.45,h,.48,x,h/2,z,M.stone);box(.66,.26,.66,x,.13,z,M.cream);box(.67,.25,.67,x,h-.15,z,M.cream);box(.59,.08,.59,x,1.32,z,M.brass);for(const dx of [-.13,0,.13])box(.025,h-1.9,.03,x+dx,(h+1.45)/2-.2,z+.25,M.trim);}

function buildDoor(room){
  box(.3,1.8,2.9,room.side*4,4.5,room.z,M.stone);
  const root=new THREE.Group();root.position.set(room.side*4,0,room.z);root.rotation.y=room.side===1?-Math.PI/2:Math.PI/2;scene.add(root);
  const door={room,root,open:false,amount:0,left:new THREE.Group(),right:new THREE.Group(),meshes:[]};
  const hitArea=new THREE.Mesh(new THREE.PlaneGeometry(2.35,3.3),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));hitArea.position.set(0,1.65,.11);hitArea.userData.door=door;root.add(hitArea);doorTargets.push(hitArea);
  for(const s of [-1,1]){
    box(.23,3.7,.45,s*1.31,1.85,0,M.cream,root);box(.055,3.53,.49,s*1.2,1.78,.015,M.brass,root);
    const hinge=s===-1?door.left:door.right;hinge.position.set(s*1.16,0,0);root.add(hinge);
    const cx=-s*.57,slab=box(1.14,3.24,.14,cx,1.64,0,M.wood,hinge);slab.userData.door=door;door.meshes.push(slab);doorTargets.push(slab);
    for(const face of [-1,1]){const zz=face*.081;box(.94,2.83,.024,cx,1.66,zz,M.brass,hinge);box(.88,2.77,.03,cx,1.66,zz+face*.015,M.dark,hinge);for(const yy of [.78,2.22]){box(.66,yy===.78?.6:1.15,.035,cx,yy,zz+face*.04,M.wood,hinge);}for(const off of [-.29,0,.29])box(.018,1.26,.02,cx+off,2.22,zz+face*.07,M.trim,hinge);box(.075,.44,.085,-s*1.02,1.39,zz+face*.08,M.brass,hinge);}
  }
  box(2.85,.23,.5,0,3.61,0,M.cream,root);box(2.96,.06,.53,0,3.76,0,M.brass,root);
  sign(room.number+'  /  '+room.short.toUpperCase(),'THE NORMALCY MUSEUM',3.12,.78,0,4.2,.23,0,root);
  sign('GRAND HALL','RETURN TO THE MUSEUM',2.7,.65,0,3.95,-.25,Math.PI,root);
  doors.push(door);
}
function buildMuseum(){
  floor(8,37,0,-10.5);floor(20,10,0,13);
  box(8,.18,37,0,5.49,-10.5,M.ceiling);box(20,.18,10,0,6.15,13,M.ceiling);
  // The long hall: uninterrupted carpet, brass borders, and ceiling coffers.
  box(3.7,.018,35.7,0,.022,-10.4,mat(0x284d42));
  for(const x of [-1.78,1.78])box(.055,.025,35.7,x,.027,-10.4,M.brass);
  for(let z=6;z>=-27;z-=3){box(3.55,.026,.025,0,.035,z,M.trim);}
  for(const z of [6,-5,-17,-28]){box(8,.32,.35,0,5.13,z,M.cream);box(7.9,.045,.42,0,4.94,z,M.brass);}
  for(const x of [-3.65,3.65])box(.14,.15,36.7,x,5.2,-10.5,M.cream);
  for(const z of [1,-11,-23])chandelier(0,z);
  hallLight=new THREE.PointLight(0xffd792,0,8,2);hallLight.position.set(0,4.2,-5);scene.add(hallLight);
  wall(8.3,.3,0,-29);sign('THE NORMALCY MUSEUM','AMERICA  •  1920–1929',5.1,1.27,0,3,-28.83);
  for(const side of [-1,1]){
    const gaps=[-23,-11,1].map(z=>[z-1.45,z+1.45]);let start=-29;
    for(const [a,b] of gaps){wall(.3,a-start,side*4,(a+start)/2);start=b;}wall(.3,8-start,side*4,(8+start)/2);
    for(const z of [-28,-17,-5,7]){pilaster(side*3.83,z);sconce(side*3.62,z,side===1?-Math.PI/2:Math.PI/2);}
    wall(.3,10,side*10,13,6.2);wall(6,.3,side*7,8,6.2);
    for(const z of [10,16])pilaster(side*9.8,z,6.2);
    sconce(side*9.8,13,side===1?-Math.PI/2:Math.PI/2);
  }
  wall(20,.3,0,18,6.2);sign('BEHIND THE PROMISE','A MUSEUM OF ROARING NORMALCY',7,1.75,0,3.2,17.8,Math.PI);
  for(const x of [-4.4,4.4]){pilaster(x,8,6.2);}
  box(9.5,.5,.75,0,5.8,8,M.cream);box(9.8,.09,.82,0,5.48,8,M.brass);
  // Central lobby medallion is architectural inlay, not an exhibit.
  const medallion=new THREE.Mesh(new THREE.CircleGeometry(2.4,64),M.dark);medallion.rotation.x=-Math.PI/2;medallion.position.set(0,.01,13);scene.add(medallion);
  for(const radius of [1.95,2.25,2.4]){const ring=new THREE.Mesh(new THREE.RingGeometry(radius-.025,radius,64),M.brass);ring.rotation.x=-Math.PI/2;ring.position.set(0,.016,13);scene.add(ring);}
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const m=box(.04,.02,.5,Math.sin(a)*2.04,.02,13+Math.cos(a)*2.04,M.brass);m.rotation.y=a;}
  chandelier(0,13,6.2);
  sign('GALLERIES 01–05  /  REFERENCES','EXPLORE AT YOUR OWN PACE',6.1,.83,0,4.83,8.43);
  for(const room of rooms){
    const center=room.side*10.15,w=12.3,d=10;floor(w,d,center,room.z,true);
    const color=mat(room.color);wall(w,.3,center,room.z-5,4.7,color);wall(w,.3,center,room.z+5,4.7,color);wall(.3,d,room.side*16.3,room.z,4.7,color);
    box(w,.18,d,center,4.8,room.z,M.ceiling);
    // Flat plaster paneling leaves clear wall space for the future collection.
    for(const zz of [room.z-4.81,room.z+4.81])for(let i=-1;i<=1;i++){
      const xx=center+i*3.45;box(2.65,.04,.025,xx,1.65,zz,M.trim);box(2.65,.04,.025,xx,3.7,zz,M.trim);
      for(const dx of [-1.325,1.325])box(.035,2.05,.025,xx+dx,2.67,zz,M.trim);
    }
    // The former blank side-wall poster frames overlapped with signage and flickered.
    for(const xx of [center-4.8,center+4.8]){sconce(xx,room.z-4.79,0);sconce(xx,room.z+4.79,Math.PI);}
    chandelier(center,room.z,4.7);
    sign(room.name.toUpperCase(),'GALLERY '+room.number,4.8,1.2,room.side*16.07,2.7,room.z,room.side===1?-Math.PI/2:Math.PI/2);
    buildDoor(room);
    const light=new THREE.PointLight(0xffe5b7,15,14,2);light.position.set(center,3.6,room.z);scene.add(light);
  }
  reparationsDecor();
  ambientLight=new THREE.HemisphereLight(0xfff3dd,0x677568,2.5);scene.add(ambientLight);
  keyLight=new THREE.DirectionalLight(0xffead0,2);keyLight.position.set(3,8,12);scene.add(keyLight);
  fillLight=new THREE.DirectionalLight(0xbdd7d2,1.2);fillLight.position.set(-8,5,-20);scene.add(fillLight);
}

function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2600);}
function currentRoom(){return rooms.find(r=>camera.position.x*r.side>4.2&&Math.abs(camera.position.z-r.z)<5)||null;}
function updateLocation(){const room=currentRoom();exhibitUI?.update();$('roomName').textContent=room?room.name:'The Grand Hall';$('roomSubtitle').textContent=room?room.sub:'A doorway into the twenties.';if(room)visited.add(room.id);}
function isBlocked(x,z){
  const r=.27;
  if(colliders.some(b=>x>b.minX-r&&x<b.maxX+r&&z>b.minZ-r&&z<b.maxZ+r))return true;
  for(const door of doors){if((!session.canEnter(door.room.id)||door.amount<.94)&&Math.abs(x-door.room.side*4)<.29&&Math.abs(z-door.room.z)<1.47)return true;}
  return false;
}
function move(dx,dz){const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12));for(let i=0;i<n;i++){const x=camera.position.x+dx/n,z=camera.position.z+dz/n;if(!isBlocked(x,camera.position.z))camera.position.x=x;if(!isBlocked(camera.position.x,z))camera.position.z=z;}}
function playTone(type){
  if(!soundEnabled)return;
  try{
    audioCtx??=new AudioContext();if(audioCtx.state==='suspended')audioCtx.resume();const t=audioCtx.currentTime;
    const tone=(hz,endHz,start,duration,volume,wave='sine')=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=wave;o.frequency.setValueAtTime(hz,t+start);o.frequency.exponentialRampToValueAtTime(endHz,t+start+duration);g.gain.setValueAtTime(.001,t+start);g.gain.linearRampToValueAtTime(volume,t+start+.008);g.gain.exponentialRampToValueAtTime(.001,t+start+duration);o.connect(g);g.connect(audioCtx.destination);o.start(t+start);o.stop(t+start+duration+.02);};
    if(type==='step')tone(82,35,0,.13,.018);
    else if(type==='click')tone(880,620,0,.055,.024,'triangle');
    else if(type==='success'){tone(523,523,0,.15,.035,'triangle');tone(659,659,.12,.15,.035,'triangle');tone(784,784,.24,.3,.035,'triangle');}
    else if(type==='locked'){tone(150,95,0,.1,.05,'triangle');tone(125,85,.13,.12,.035,'triangle');}
    else{
      tone(340,100,0,.065,.05,'triangle');
      if(type==='open'){tone(120,69,.055,.62,.025,'sawtooth');tone(180,100,.13,.44,.014,'triangle');}
      else{tone(100,45,.25,.22,.075);tone(280,130,.31,.075,.04,'triangle');}
    }
  }catch{}
}
function toggleDoor(door){if(!door)return;const dist=Math.hypot(camera.position.x-door.room.side*4,camera.position.z-door.room.z);if(dist>3.8){toast('Walk closer to the door.');return;}if(!session.canEnter(door.room.id)){playTone('locked');const prior=rooms[rooms.indexOf(door.room)-1];if(exhibitUI&&session.mode==='escape'&&['campaign','diplomacy','teapot'].includes(prior?.id)){exhibitUI.interact({type:'puzzle',room:prior.id});return;}toast('Locked · Complete '+prior.short+' first.');return;}if(door.open&&Math.abs(camera.position.x-door.room.side*4)<.85&&Math.abs(camera.position.z-door.room.z)<1.75){toast('Step clear of the doorway to close it.');return;}door.open=!door.open;playTone(door.open?'open':'close');toast((door.open?'Opening ':'Closing ')+door.room.short);if(door.open&&door.room.id==='reference'&&session.mode==='escape')exhibitUI?.finishAtReference();}
function targetDoor(mx=0,my=0){raycaster.setFromCamera(new THREE.Vector2(mx,my),camera);const hits=raycaster.intersectObjects([...doorTargets,...wallTargets],false);const hit=hits[0];return hit&&hit.distance<3.8?hit.object.userData.door||null:null;}
function nearbyDoor(){return doors.find(d=>Math.hypot(camera.position.x-d.room.side*4,camera.position.z-d.room.z)<2.8)||null;}
function targetCollection(mx=0,my=0){if(!collection)return null;raycaster.setFromCamera(new THREE.Vector2(mx,my),camera);const hit=raycaster.intersectObjects([...collection.targets,...doorTargets,...wallTargets],false)[0];return hit&&hit.distance<4.8?hit.object.userData.collection||null:null;}
function interactAt(mx=0,my=0){const item=targetCollection(mx,my);if(item)exhibitUI.interact(item);else toggleDoor(targetDoor(mx,my));}
function useDoor(){if(activeCollection)exhibitUI.interact(activeCollection);else toggleDoor(activeDoor||nearbyDoor());}
function menuOpen(){return choosingMode||$('mapDialog').open||$('helpDialog').open||!!exhibitUI?.isOpen();}
function showDialog(id){if(!started||choosingMode)return;if(id==='mapDialog'&&!session.mapAllowed){toast('The floor plan is available in Free Exploration.');return;}keys.clear();if(document.pointerLockElement)document.exitPointerLock();$(id).showModal();if(id==='mapDialog')drawMap();}
function goToLobby(){camera.position.set(0,1.7,14.5);yaw=0;pitch=0;keys.clear();updateLocation();toast('Back in the Grand Hall.');}
function visitDoor(room){if(!session.mapAllowed)return;camera.position.set(room.side*1.1,1.7,room.z);yaw=room.side===1?-Math.PI/2:Math.PI/2;pitch=0;$('mapDialog').close();keys.clear();updateLocation();toast('At '+room.short+' — click the door to enter.');}
function updateModeHud(){
  const competitive=session.mode==='escape';document.body.classList.toggle('escape-mode',competitive);
  if(scene){scene.background.setHex(competitive?0x353d39:0xc4c8b9);scene.fog.color.setHex(competitive?0x404841:0xb6bca9);renderer.toneMappingExposure=competitive?.77:1.05;if(ambientLight)ambientLight.intensity=competitive?1.25:2.5;if(keyLight)keyLight.intensity=competitive?1.25:2;if(fillLight)fillLight.intensity=competitive?.65:1.2;}
  $('mapBtn').hidden=competitive;$('mapHelpRow').hidden=competitive;$('stopwatch').hidden=!competitive;$('buildNotice').hidden=true;$('timerHelp').hidden=!competitive;
  $('modeLabel').textContent=competitive?'GALLERIES UNLOCKED':'FREE EXPLORATION';$('progressText').textContent=competitive?`${session.unlockedCount} / 5`:'All galleries accessible';
  $('modeButtonLabel').textContent=competitive?'Escape room':'Free exploration';$('elapsedTime').textContent=formatElapsed(session.elapsedMs);
}
function chooseMode(mode){selectedMode=mode;document.querySelectorAll('[data-mode]').forEach(b=>{const selected=b.dataset.mode===mode;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});$('modeDescription').textContent=mode==='escape'?'Begin in Gallery 1. Find the right reparations stamp, combine the economic policy files, and solve the Teapot Dome evidence box. No floor plan; the clock runs in menus.':'All six rooms are open to explore. No timer, no locked galleries.';$('enterBtn').innerHTML=(mode==='escape'?'Start escape room':'Enter free exploration')+' <span>→</span>';$('previewNote').textContent=started?'Starting either mode begins a new visit and resets your timer and progress.':'22 exhibits · 6 desk slips · 4 locks · 1 evidence challenge · Two EQ libraries';}
function setWelcomeOpen(open){choosingMode=open;$('welcome').classList.toggle('hidden',!open);for(const selector of ['.hud','.location','.bottom','#modeBtn','#touchControls','#collectionBtn'])document.querySelector(selector).inert=open;if(!open)$('world').focus();}
function startMode(){
  session.start(selectedMode);exhibitUI?.reset();started=true;keys.clear();visited.clear();drag=null;activeDoor=null;activeCollection=null;
  for(const door of doors){door.open=false;door.amount=0;door.left.rotation.y=door.right.rotation.y=0;}
  $('mapDialog').close();$('helpDialog').close();goToLobby();setWelcomeOpen(false);$('modeBtn').hidden=false;updateModeHud();playTone('click');
  toast(session.mode==='escape'?'Clock started · Begin at Gallery 01.':'All rooms unlocked · Explore at your own pace.');
}
function openModeChooser(){keys.clear();drag=null;if(document.pointerLockElement)document.exitPointerLock();$('mapDialog').close();$('helpDialog').close();chooseMode(session.mode);$('resumeBtn').hidden=false;setWelcomeOpen(true);$('enterBtn').focus();}
function drawMap(){
  const sx=x=>220+x*11,sz=z=>30+(z+29)*8;
  let svg='<rect x="176" y="30" width="88" height="296" fill="#c7c9b7" stroke="#788f7b"/><rect x="110" y="326" width="220" height="80" fill="#c7c9b7" stroke="#788f7b"/><text x="220" y="376" text-anchor="middle" font-family="Georgia" font-size="14" fill="#365345">LOBBY</text>';
  rooms.forEach(r=>{const x=r.side<0?41:264;svg+=`<g data-room="${r.id}" role="button" tabindex="0" aria-label="Visit ${r.short}" style="cursor:pointer"><rect x="${x}" y="${sz(r.z-5)}" width="135" height="80" fill="${visited.has(r.id)?'#d5c396':'#ded7c5'}" stroke="#a58e61"/><text x="${x+67.5}" y="${sz(r.z)+6}" text-anchor="middle" font-family="Georgia" font-size="22" fill="#425b4c">${r.number}</text></g>`;});
  const x=sx(camera.position.x),z=sz(camera.position.z);svg+=`<g transform="translate(${x},${z}) rotate(${-yaw*180/Math.PI})"><path d="M0,-12 L-6,4 L0,1 L6,4Z" fill="#a16d27" stroke="#fff5dc" stroke-width="2"/></g>`;
  $('floorMap').innerHTML=svg;$('floorMap').querySelectorAll('[data-room]').forEach(el=>{const act=()=>visitDoor(rooms.find(r=>r.id===el.dataset.room));el.addEventListener('click',act);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();act();}});});
}
function animate(time){
  requestAnimationFrame(animate);const dt=Math.min((time-lastTime)/1000||.016,.04);lastTime=time;elapsed+=dt;
  if(hallLight){const flicker=session.mode==='escape'&&started&&!reducedMotion;hallLight.intensity=flicker?(Math.sin(time*.013)> .92?0.15:5.2+Math.sin(time*.004)*.8):0;}
  if(started&&session.mode==='escape')$('elapsedTime').textContent=formatElapsed(session.elapsedMs);
  if(started&&!menuOpen()){
    if(keys.has('ArrowLeft'))yaw+=dt*1.5;if(keys.has('ArrowRight'))yaw-=dt*1.5;
    let f=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0);
    let s=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0);const len=Math.hypot(f,s)||1,speed=keys.has('ShiftLeft')||keys.has('ShiftRight')?5:3.1;
    const dx=(-Math.sin(yaw)*f+Math.cos(yaw)*s)/len*speed*dt,dz=(-Math.cos(yaw)*f-Math.sin(yaw)*s)/len*speed*dt;move(dx,dz);
    camera.position.y=1.7;if((f||s)&&elapsed-lastFootstep>.44){playTone('step');lastFootstep=elapsed;}
    camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld();
    activeCollection=targetCollection();activeDoor=activeCollection?null:targetDoor()||nearbyDoor();$('doorPrompt').hidden=!activeDoor&&!activeCollection;$('crosshair').classList.toggle('active',!!activeDoor||!!activeCollection);
    if(activeCollection){$('doorPrompt').classList.remove('locked');$('doorPrompt').querySelector('span').textContent=activeCollection.type==='exhibit'?'Inspect artifact':activeCollection.type==='slip'?'Read desk slip':activeCollection.type==='audio'?'Open archival audio':activeCollection.type==='puzzle'?(activeCollection.room==='study'?'Examine desk drawer':'Examine evidence desk'):'Read references';}
    if(activeDoor){const locked=!session.canEnter(activeDoor.room.id);$('doorPrompt').classList.toggle('locked',locked);$('doorPrompt').querySelector('span').textContent=(locked?'Locked':activeDoor.open?'Close':'Open')+' · '+activeDoor.room.short;}
    updateLocation();
  }else{$('doorPrompt').hidden=true;}
  for(const door of doors){const target=door.open?1:0;door.amount=reducedMotion?target:THREE.MathUtils.damp(door.amount,target,6,dt);door.left.rotation.y=door.amount*Math.PI/2;door.right.rotation.y=-door.amount*Math.PI/2;}
  renderer.render(scene,camera);
}

function wireControls(){
  $('enterBtn').onclick=startMode;document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>chooseMode(b.dataset.mode));$('modeBtn').onclick=openModeChooser;$('resumeBtn').onclick=()=>setWelcomeOpen(false);
  document.addEventListener('click',e=>{if(e.target.closest('button')&&!['soundBtn','doorPrompt','touchUse','enterBtn'].includes(e.target.closest('button').id))playTone('click');});
  $('mapBtn').onclick=()=>showDialog('mapDialog');$('helpBtn').onclick=()=>showDialog('helpDialog');$('homeBtn').onclick=goToLobby;$('doorPrompt').onclick=useDoor;$('touchUse').onclick=useDoor;
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
  $('soundBtn').onclick=()=>{soundEnabled=!soundEnabled;$('soundBtn').textContent=soundEnabled?'Sound on':'Sound off';$('soundBtn').setAttribute('aria-pressed',soundEnabled);$('soundBtn').setAttribute('aria-label',soundEnabled?'Disable sound':'Enable sound');playTone('click');};
  $('motionToggle').onchange=e=>reducedMotion=e.target.checked;
  $('immersiveBtn').onclick=async()=>{$('helpDialog').close();try{await $('world').requestPointerLock();}catch{toast('Use click-and-drag to look around in this browser.');}};
  document.addEventListener('pointerlockchange',()=>{pointerLocked=document.pointerLockElement===$('world');$('navHint').innerHTML=pointerLocked?'<kbd>W A S D</kbd> Walk <span>·</span> Mouse to look <span>·</span> <kbd>E</kbd> Interact <span>·</span> <kbd>Esc</kbd> Release mouse':'<kbd>W A S D</kbd> Walk <span>·</span> Drag to look <span>·</span> <kbd>E</kbd> Interact';});
  document.addEventListener('pointerlockerror',()=>toast('Mouse-look is unavailable. Drag the scene to look around.'));
  window.addEventListener('keydown',e=>{if(choosingMode&&e.code==='Tab'){const focusable=[...$('welcome').querySelectorAll('button:not([hidden]):not([disabled])')],first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}if(!started)return;if(e.code==='Escape'){keys.clear();if(choosingMode)setWelcomeOpen(false);return;}if(menuOpen())return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='KeyE'&&!e.repeat)useDoor();else if(e.code==='KeyM'&&!e.repeat)showDialog('mapDialog');else if(e.key==='?'&&!e.repeat)showDialog('helpDialog');keys.add(e.code);});
  window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();drag=null;});document.addEventListener('visibilitychange',()=>{if(document.hidden)keys.clear();});
  $('world').addEventListener('pointerdown',e=>{if(!started||menuOpen())return;if(pointerLocked){interactAt();return;}drag={x:e.clientX,y:e.clientY,total:0,id:e.pointerId};$('world').setPointerCapture(e.pointerId);});
  document.addEventListener('pointermove',e=>{if(!started||menuOpen())return;let dx=0,dy=0;if(pointerLocked){dx=e.movementX;dy=e.movementY;}else if(drag&&e.pointerId===drag.id){dx=e.clientX-drag.x;dy=e.clientY-drag.y;drag.total+=Math.abs(dx)+Math.abs(dy);drag.x=e.clientX;drag.y=e.clientY;}else return;yaw-=dx*.003;pitch=THREE.MathUtils.clamp(pitch-dy*.003,-1.1,1.1);});
  $('world').addEventListener('pointerup',e=>{if(drag&&drag.total<7){const rect=$('world').getBoundingClientRect();interactAt((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);}drag=null;});
  $('world').addEventListener('pointercancel',()=>drag=null);
  document.querySelectorAll('[data-move]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.move);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.move);});
  $('roomList').innerHTML=rooms.map(r=>`<button data-go="${r.id}"><b>${r.number}</b><span>${r.short}</span></button>`).join('');
  $('roomList').querySelectorAll('button').forEach(b=>b.onclick=()=>visitDoor(rooms.find(r=>r.id===b.dataset.go)));
  window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
}

try{
  renderer=new THREE.WebGLRenderer({canvas:$('world'),antialias:true,powerPreference:'high-performance'});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  scene=new THREE.Scene();scene.background=new THREE.Color(0xc4c8b9);scene.fog=new THREE.Fog(0xb6bca9,30,75);
  camera=new THREE.PerspectiveCamera(67,innerWidth/innerHeight,.07,100);camera.position.set(0,1.7,15.5);camera.rotation.order='YXZ';buildMuseum();collection=buildCollection(scene,rooms,colliders);exhibitUI=createExhibitUI({session,rooms,currentRoom,beforeOpen:()=>{keys.clear();drag=null;if(document.pointerLockElement)document.exitPointerLock();},onProgress:updateModeHud,toast,sound:playTone});wireControls();
  $('enterBtn').disabled=false;chooseMode('explore');setWelcomeOpen(true);$('enterBtn').focus();requestAnimationFrame(animate);
}catch(error){console.error(error);$('enterBtn').textContent='3D could not start';document.querySelector('.intro').textContent='Please open this museum in a browser with WebGL enabled, such as an up-to-date Chrome, Edge, Firefox, or Safari.';}
