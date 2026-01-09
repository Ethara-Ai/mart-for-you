/**
 * Cart Constants Module
 *
 * This module exports all cart-related constants.
 * Separated from component files to support React Fast Refresh.
 */

/**
 * Checkout stages for tracking progress
 */
export const CHECKOUT_STAGES = {
  CART: 'cart',
  SHIPPING: 'shipping',
  PAYMENT: 'payment',
  REVIEW: 'review',
  CONFIRMATION: 'confirmation',
};
