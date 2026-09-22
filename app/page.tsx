import Link from 'next/link'

const features = [
  ['🎥','Stream Studio','Kelola scene, sumber, kamera, mic, dan screen capture.'],
  ['🎙️','Voice Studio','Noise suppression, voice effects, mixer, dan mic tools.'],
  ['🌐','Live Translate','Ubah ucapan menjadi subtitle terjemahan secara realtime.'],
  ['🧑‍🎤','VTuber Studio','Avatar, tracking, ekspresi, dan overlay untuk live.'],
  ['🤖','AI Studio','Caption, clip, highlight, enhancement, dan copilot.'],
  ['🎛️','Floating Controls','Kontrol stream mengambang saat bermain game.'],
]

export default function Home() {
  return <main className="page"><div className="container"><nav className="nav"><Link href="/" className="brand"><span className="logo">▶</span>STREAM TOOLS</Link><div className="navlinks"><Link href="/premium">Premium</Link><Link href="/auth/login" className="btn">Login</Link></div></nav><section className="hero"><span className="eyebrow">MOBILE STREAMING • CREATOR TOOLS</span><h1>Your Stream.<br/><span className="gradient">Anywhere.</span></h1><p>Platform streaming mobile untuk menggabungkan screen capture, overlay, voice, VTuber, AI, chat, dan kontrol live dalam satu aplikasi.</p><div className="actions"><Link className="btn primary" href="/auth/sign-up">Buat Akun Gratis</Link><Link className="btn ghost" href="/download">Download Aplikasi</Link></div></section><section className="grid">{features.map(([icon,title,desc])=><article className="card" key={title}><div className="icon">{icon}</div><h3>{title}</h3><p>{desc}</p></article>)}</section></div><footer className="footer">© {new Date().getFullYear()} Stream Tools. Built for mobile creators.</footer></main>
}
