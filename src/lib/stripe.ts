import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const STRIPE_PLANS = {
  PRO: {
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    name: 'Pro',
    price: 9.99,
  },
  AGENCY: {
    priceId: process.env.STRIPE_AGENCY_PRICE_ID!,
    name: 'Agency',
    price: 29.99,
  }
}