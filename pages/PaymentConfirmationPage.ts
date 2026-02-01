import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Payment Confirmation Page
 * Handles payment method and payment information confirmation during checkout
 */
export class PaymentConfirmationPage extends BasePage {
  readonly paymentMethodContinueButton: Locator;
  readonly paymentInfoContinueButton: Locator;

  constructor(page: Page) {
    super(page);
    
    this.paymentMethodContinueButton = page.locator('input[type="button"].payment-method-next-step-button[onclick*="PaymentMethod.save()"]');
    this.paymentInfoContinueButton = page.locator('input[type="button"].payment-info-next-step-button[onclick*="PaymentInfo.save()"]');
  }

  /**
   * Click Continue button on payment method page
   * Uses extended timeout (8000ms) as payment buttons need extra time to become visible
   */
  async continuePaymentMethod(): Promise<void> {
    await this.clickButton(this.paymentMethodContinueButton, 'Continue on Payment Method', 8000);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click Continue button on payment information page
   * Uses extended timeout (8000ms) as payment buttons need extra time to become visible
   */
  async continuePaymentInformation(): Promise<void> {
    await this.clickButton(this.paymentInfoContinueButton, 'Continue on Payment Information', 8000);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title for verification
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
