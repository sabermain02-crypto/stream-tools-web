'use client'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase/client'

export default function LoginPage(){
 const router=useRouter(); const supabase=createClient(); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false)
 async function submit(e:FormEvent){e.preventDefault();setError('');setLoading(true);const {error}=await supabase.auth.signInWithPassword({email,password});setLoading(false);if(error){setError(error.message);return}router.push('/dashboard');router.refresh()}
 return <main className="auth"><div className="authbox"><Link href="/" className="brand"><span className="logo">▶</span>STREAM TOOLS</Link><div className="card" style={{marginTop:18}}><h1>Masuk</h1><p className="sub">Login ke akun Stream Tools kamu.</p>{error&&<div className="notice error">{error}</div>}<form onSubmit={submit}><label className="label">Email</label><input className="input" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="kamu@email.com"/><label className="label">Password</label><input className="input" type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/><button className="btn primary full" disabled={loading}>{loading?'Memproses…':'Login'}</button></form><p className="muted small center" style={{marginTop:18}}>Belum punya akun? <Link href="/auth/sign-up" style={{color:'#c4b5fd'}}>Daftar</Link></p></div></div></main>
}
