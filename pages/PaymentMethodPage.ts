import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Payment Method Page
 * Handles payment method actions
 */
export class PaymentMethodPage extends BasePage {
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // The Continue button: <input type="button" class="button-1 payment-method-next-step-button" onclick="PaymentMethod.save()" value="Continue">
    this.continueButton = page.locator('input[type="button"].payment-method-next-step-button[onclick*="PaymentMethod.save()"]');
  }

  /**
   * Click Continue button to proceed to payment information
   */
  async clickContinue(): Promise<void> {
    console.log('Clicking Continue button on Payment Method page...');
    console.log('Button selector: input[type="button"].payment-method-next-step-button[onclick*="PaymentMethod.save()"]');
    
    await this.continueButton.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Continue button is visible');
    
    // Log button details before click
    const buttonHTML = await this.continueButton.evaluate(el => el.outerHTML);
    console.log('Button HTML:', buttonHTML);
    
    try {
      console.log('Attempting to click Continue button...');
      await this.continueButton.click({ timeout: 5000 });
      console.log('Click executed successfully');
    } catch (error) {
      console.error('Click failed:', error);
      throw error;
    }
  }
}
