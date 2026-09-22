import Link from 'next/link'

export default function ConfirmedPage() {
  return <main className="auth"><div className="authbox"><Link href="/" className="brand"><span className="logo">▶</span>STREAM TOOLS</Link><div className="card" style={{marginTop:18,textAlign:'center'}}><div style={{fontSize:54}}>✅</div><h1>Email berhasil dikonfirmasi</h1><p className="sub">Akun Stream Tools kamu sudah aktif. Sekarang kamu bisa masuk ke dashboard.</p><div style={{display:'grid',gap:10,marginTop:22}}><Link className="btn primary full" href="/dashboard">Buka Dashboard</Link><Link className="btn full" href="/auth/login">Login</Link></div></div></div></main>
}
