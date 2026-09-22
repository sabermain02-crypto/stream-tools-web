import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'
import Link from 'next/link'

async function createCode(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'admin') redirect('/dashboard')
  const code = String(formData.get('code') || '').trim().toUpperCase()
  const duration = Number(formData.get('duration') || 30)
  const maxUses = Number(formData.get('max_uses') || 1)
  if (!code || !Number.isInteger(duration) || duration < 1 || !Number.isInteger(maxUses) || maxUses < 1) return
  await supabase.from('premium_codes').insert({ code, duration_days: duration, max_uses: maxUses })
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (me?.role !== 'admin') redirect('/dashboard')
  const [{ data: profiles }, { data: codes }] = await Promise.all([
    supabase.from('profiles').select('id,email,display_name,plan,premium_until,created_at').order('created_at',{ascending:false}),
    supabase.from('premium_codes').select('code,duration_days,max_uses,used_count,expires_at,created_at').order('created_at',{ascending:false}).limit(30)
  ])
  return <main className="page"><div className="container"><nav className="nav"><Link href="/" className="brand"><span className="logo">▶</span>STREAM TOOLS</Link><div className="navlinks"><Link href="/dashboard">Dashboard</Link></div></nav><section className="dash"><div className="dashhead"><div><p className="muted small">Owner Panel</p><h1>Admin Stream Tools 👑</h1></div><span className="badge premium">ADMIN</span></div><div className="statgrid"><div className="card stat"><span className="muted small">Users</span><strong>{profiles?.length ?? 0}</strong></div><div className="card stat"><span className="muted small">Premium</span><strong>{profiles?.filter(p=>p.plan==='premium' && (!p.premium_until || new Date(p.premium_until)>new Date())).length ?? 0}</strong></div><div className="card stat"><span className="muted small">Free</span><strong>{profiles?.filter(p=>p.plan!=='premium').length ?? 0}</strong></div></div><div className="card section"><h2>🎟️ Buat Premium Code</h2><form action={createCode} style={{display:'grid',gap:12,maxWidth:700}}><input className="input" name="code" required placeholder="ST-PREMIUM-30-ABC123"/><div className="row"><input className="input" name="duration" type="number" min="1" defaultValue="30"/><input className="input" name="max_uses" type="number" min="1" defaultValue="1"/></div><button className="btn primary" type="submit">Generate Code</button></form></div><div className="card section"><h2>👥 Users</h2><div style={{overflowX:'auto'}}><table className="table"><thead><tr><th>Email</th><th>Nama</th><th>Plan</th><th>Premium sampai</th></tr></thead><tbody>{profiles?.map(p=><tr key={p.id}><td>{p.email}</td><td>{p.display_name}</td><td>{p.plan}</td><td>{p.premium_until?new Date(p.premium_until).toLocaleDateString('id-ID'):'—'}</td></tr>)}</tbody></table></div></div><div className="card section"><h2>🎟️ Premium Codes</h2><div style={{overflowX:'auto'}}><table className="table"><thead><tr><th>Code</th><th>Durasi</th><th>Terpakai</th><th>Dibuat</th></tr></thead><tbody>{codes?.map(c=><tr key={c.code}><td><code>{c.code}</code></td><td>{c.duration_days} hari</td><td>{c.used_count}/{c.max_uses}</td><td>{new Date(c.created_at).toLocaleDateString('id-ID')}</td></tr>)}</tbody></table></div></div></section></div></main>
}
