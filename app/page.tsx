import Link from 'next/link'

const features = [
  ['⚡','Streaming Stabil','Nikmati streaming tanpa buffering dan gangguan.'],
  ['🛡️','Aman & Terpercaya','Data akun dan akses premium dikelola dengan aman.'],
  ['💎','Premium Features','Buka fitur eksklusif untuk pengalaman streaming lebih lengkap.'],
  ['🖥️','Support Multi Device','Satu akun untuk website dan aplikasi Stream Tools.'],
  ['🎙️','Voice Studio','Noise suppression, voice effects, mixer, dan mic tools.'],
  ['🤖','AI Studio','Caption, clip, highlight, enhancement, dan copilot.'],
]

export default function Home(){return <main className="page"><div className="container"><nav className="nav"><Link href="/" className="brand"><img src="/images/logo.png" alt="Stream Tools"/></Link><div className="navlinks"><Link href="/premium">Premium</Link><Link href="/auth/login" className="btn">Login</Link><Link href="/auth/sign-up" className="btn primary">Daftar</Link></div></nav><section className="hero"><div className="hero-content"><span className="eyebrow">STREAMING PLATFORM • CREATOR TOOLS</span><h1>Semua kebutuhan<br/><span className="gradient">streaming kamu.</span></h1><p>Stream Tools membantu kamu mengelola streaming, voice, overlay, AI, VTuber, dan berbagai tools creator dalam satu ekosistem yang modern.</p><div className="actions"><Link className="btn primary" href="/auth/sign-up">🚀 Mulai Sekarang</Link><Link className="btn ghost" href="/download">⬇ Download APK</Link></div></div></section><div className="section-title"><div><h2>Fitur utama</h2><p className="muted">Dibuat untuk creator yang ingin streaming lebih praktis.</p></div></div><section className="grid">{features.map(([icon,title,desc])=><article className="card feature-card" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p></article>)}</section></div><footer className="footer">© {new Date().getFullYear()} Stream Tools • Your Stream. Anywhere.</footer></main>}
