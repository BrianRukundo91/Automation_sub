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
   */
  async continuePaymentMethod(): Promise<void> {
    await this.paymentMethodContinueButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.paymentMethodContinueButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Click Continue button on payment information page
   */
  async continuePaymentInformation(): Promise<void> {
    await this.paymentInfoContinueButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.paymentInfoContinueButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title for verification
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
