import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { generateDemandLetter } from '@/lib/claude'

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, us_state')
    .eq('id', user.id)
    .single()

  if (!profile || !['pro', 'agency'].includes(profile.plan)) {
    return NextResponse.json(
      { error: 'Payment demand letters require a Pro plan or higher.' },
      { status: 403 }
    )
  }

  const body = await req.json()
  const {
    clientName,
    projectName,
    amountOwed,
    paymentDueDate,
    projectDescription,
    freelancerName,
    pastDueDays,
  } = body

  if (!clientName || !projectName || !amountOwed || !paymentDueDate || !freelancerName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const letter = await generateDemandLetter({
      clientName,
      projectName,
      amountOwed: Number(amountOwed),
      paymentDueDate,
      projectDescription: projectDescription || '',
      freelancerName,
      usState: profile.us_state || 'United States',
      pastDueDays: Number(pastDueDays) || 0,
    })
    return NextResponse.json({ letter })
  } catch (err) {
    console.error('[demand-letter] Claude error:', err)
    return NextResponse.json(
      { error: 'Failed to generate letter. Please try again.' },
      { status: 500 }
    )
  }
}
