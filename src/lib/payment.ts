import { stripe, STRIPE_PLANS } from './stripe'
import { prisma } from './db'

export class PaymentService {
  async createCheckoutSession(planId: 'PRO' | 'AGENCY', userId: string, userEmail: string) {
    const plan = STRIPE_PLANS[planId]
    
    if (!plan) {
      throw new Error('Plan invalide')
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      payment_method_types: ['card'],
      line_items: [{
        price: plan.priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true&plan=${planId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        planId,
      },
    })

    return session
  }

  async createPortalSession(customerId: string) {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
    })

    return session
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break
        
      case 'customer.subscription.deleted':
        await this.handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
        break
        
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break
        
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
        break
    }
  }

  private async handleSubscriptionChange(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId
    if (!userId) return

    const planId = subscription.metadata?.planId as 'PRO' | 'AGENCY'
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: planId,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        credits: -1, // Illimité pour les plans payants
      }
    })
  }

  private async handleSubscriptionCanceled(subscription: Stripe.Subscription) {
    const userId = subscription.metadata?.userId
    if (!userId) return

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'FREE',
        stripeSubscriptionId: null,
        credits: 3, // Retour aux crédits gratuits
      }
    })
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    // Log du paiement réussi
    console.log('Paiement réussi:', invoice.id)
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    // Gérer l'échec de paiement
    console.log('Échec de paiement:', invoice.id)
    
    const subscription = await stripe.subscriptions.retrieve(
      invoice.subscription as string
    )
    
    const userId = subscription.metadata?.userId
    if (userId) {
      // Optionnel: envoyer un email de notification
      console.log('Notification échec paiement pour user:', userId)
    }
  }
}

export const paymentService = new PaymentService()