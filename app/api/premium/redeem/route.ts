import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'

export async function POST(request: Request){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
  const body=await request.json().catch(()=>({}));
  const code=typeof body.code==='string'?body.code:'';
  if(!code.trim())return NextResponse.json({error:'Code wajib diisi'},{status:400});
  const {data,error}=await supabase.rpc('redeem_premium_code',{p_code:code});
  if(error)return NextResponse.json({error:error.message},{status:400});
  return NextResponse.json({success:true,premium_until:data});
}
