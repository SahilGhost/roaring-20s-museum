export const GALLERY_ORDER = ['campaign','industry','diplomacy','teapot','study'];

// Session rules stay independent of rendering so future artifact puzzles can use them.
export class MuseumSession {
  constructor(now = () => performance.now()) { this.now=now;this.mode='explore';this.startedAt=null;this.finishedAt=null;this.solved=new Set(); }
  start(mode) { if(!['explore','escape'].includes(mode))throw new Error('Unknown museum mode');this.mode=mode;this.startedAt=this.now();this.finishedAt=null;this.solved.clear(); }
  canEnter(id) { return id==='reference'?(this.mode==='explore'||this.solved.size===5):(GALLERY_ORDER.includes(id)&&(this.mode==='explore'||GALLERY_ORDER.indexOf(id)<=this.solved.size)); }
  get unlockedCount() { return this.mode==='explore'?5:Math.min(5,this.solved.size+1); }
  get mapAllowed() { return this.mode==='explore'; }
  get elapsedMs() { return this.mode==='escape'&&this.startedAt!==null?Math.max(0,(this.finishedAt??this.now())-this.startedAt):0; }
  // Call only after an exhibit puzzle validates its evidence, never on room entry.
  completeGallery(id) { if(this.mode!=='escape'||id!==GALLERY_ORDER[this.solved.size]||this.finishedAt!==null)return false;this.solved.add(id);return true; }
  finish() { if(this.mode!=='escape'||this.solved.size!==5||this.finishedAt!==null)return false;this.finishedAt=this.now();return true; }
}
export function formatElapsed(ms) { const total=Math.floor(Math.max(0,ms)/1000),seconds=String(total%60).padStart(2,'0'),minutes=String(Math.floor(total/60)%60).padStart(2,'0');return total>=3600?`${Math.floor(total/3600)}:${minutes}:${seconds}`:`${minutes}:${seconds}`; }
