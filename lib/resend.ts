import { Resend } from 'resend'

const FROM_EMAIL = 'FreelanceShield <noreply@freelanceshield.com>'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder')
}

export async function sendSignupConfirmation(email: string) {
  if (!process.env.RESEND_API_KEY) return
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to FreelanceShield',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Welcome to FreelanceShield</h1>
          <p>Thanks for signing up! You can now upload your first contract for AI-powered risk analysis.</p>
          <p>Your free plan includes 1 contract review per month.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/review/new"
             style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">
            Review your first contract
          </a>
          <p style="color: #666; font-size: 12px; margin-top: 32px;">
            FreelanceShield is a software tool that explains contract language. It is not a law firm and does not provide legal advice.
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('[email] Failed to send signup confirmation:', error)
  }
}

export async function sendAnalysisComplete(email: string, reviewId: string, riskScore: number) {
  if (!process.env.RESEND_API_KEY) return
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your contract analysis is ready — Risk Score: ${riskScore}/10`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Your contract analysis is ready</h1>
          <p>We've finished analyzing your contract. Here's a quick summary:</p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <strong>Risk Score: ${riskScore}/10</strong>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/review/${reviewId}"
             style="background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">
            View full analysis
          </a>
          <p style="color: #666; font-size: 12px; margin-top: 32px;">
            FreelanceShield is a software tool that explains contract language. It is not a law firm and does not provide legal advice.
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('[email] Failed to send analysis complete:', error)
  }
}

export async function sendPaymentFailed(email: string) {
  if (!process.env.RESEND_API_KEY) return
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Action required: Payment failed for FreelanceShield',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Payment failed</h1>
          <p>We were unable to process your payment for FreelanceShield. Please update your payment method to continue your subscription.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings"
             style="background: #dc2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin-top: 16px;">
            Update payment method
          </a>
        </div>
      `,
    })
  } catch (error) {
    console.error('[email] Failed to send payment failed email:', error)
  }
}
