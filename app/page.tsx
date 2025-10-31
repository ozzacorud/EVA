'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [userId, setUserId] = useState('DEMO_USER');
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [memories, setMemories] = useState<any[]>([]);
  const [privacy, setPrivacy] = useState<'private'|'circle'|'public'>('private');

  async function loadMemories() {
    const res = await fetch(`/api/memories?userId=${userId}`);
    const data = await res.json();
    setMemories(data);
  }
  useEffect(() => { loadMemories(); }, []);

  async function upload() {
    if (!file) return alert('Seleziona un file');
    const upRes = await fetch('/api/upload-url', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ userId, filename:file.name, contentType:file.type||'application/octet-stream' })
    });
    const up = await upRes.json();
    if (up.error) return alert(up.error);
    const form = new FormData();
    form.append('file', file);
    const putRes = await fetch(up.url, { method:'POST', body: form });
    if (!putRes.ok) return alert('Upload fallito');
    const createRes = await fetch('/api/memories', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ userId, type:file.type.startsWith('image')?'photo':file.type.startsWith('video')?'video':'audio', storageUrl:up.path, privacy, caption })
    });
    const created = await createRes.json();
    if (created.error) return alert(created.error);
    setCaption(''); setFile(null); await loadMemories();
  }

  return (<main>
    <h1>EVA — MVP</h1>
    <section style={{margin:'24px 0',padding:16,border:'1px solid #eee',borderRadius:12}}>
      <input value={userId} onChange={e=>setUserId(e.target.value)} placeholder='user id'/><br/><br/>
      <input type='file' onChange={e=>setFile(e.target.files?.[0]||null)} /><br/><br/>
      <input value={caption} onChange={e=>setCaption(e.target.value)} placeholder='didascalia'/><br/><br/>
      <select value={privacy} onChange={e=>setPrivacy(e.target.value as any)}>
        <option value='private'>Privato</option>
        <option value='circle'>Cerchia</option>
        <option value='public'>Pubblico</option>
      </select><br/><br/>
      <button onClick={upload}>Carica</button>
    </section>
    <section>
      {memories.map(m=>(<div key={m.id} style={{border:'1px solid #eee',marginBottom:12,padding:8}}>
        <p>{m.caption}</p><p>{m.privacy}</p>
      </div>))}
    </section>
  </main>);
}
