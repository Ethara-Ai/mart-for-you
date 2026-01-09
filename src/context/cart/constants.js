/**
 * Cart Constants
 *
 * Shared constants for the cart module.
 * Separated from components to support React Fast Refresh.
 */

/**
 * Checkout stages for tracking progress through checkout flow
 */
export const CHECKOUT_STAGES = {
  CART: 'cart',
  SHIPPING: 'shipping',
  PAYMENT: 'payment',
  REVIEW: 'review',
  CONFIRMATION: 'confirmation',
};
