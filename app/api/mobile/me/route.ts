import { NextResponse } from 'next/server'
export async function GET(request: Request){
  const auth=request.headers.get('authorization')
  if(!auth?.startsWith('Bearer '))return NextResponse.json({error:'Bearer token required'},{status:401})
  const token=auth.slice(7)
  const { createClient: createSupabaseClient }=await import('@supabase/supabase-js')
  const supabase=createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{global:{headers:{Authorization:`Bearer ${token}`}}})
  const {data:{user},error}=await supabase.auth.getUser(token)
  if(error||!user)return NextResponse.json({error:'Invalid token'},{status:401})
  const {data:profile,error:profileError}=await supabase.from('profiles').select('id,email,display_name,plan,premium_until').eq('id',user.id).single()
  if(profileError)return NextResponse.json({error:profileError.message},{status:500})
  const premium=profile.plan==='premium'&&(!profile.premium_until||new Date(profile.premium_until)>new Date())
  return NextResponse.json({user:{id:user.id,email:user.email},profile:{...profile,premium}})
}
