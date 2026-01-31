import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Payment Information Page
 * Handles payment information confirmation (for COD, usually just a confirmation page)
 */
export class PaymentInformationPage extends BasePage {
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // The Continue button: <input type="button" class="button-1 payment-info-next-step-button" onclick="PaymentInfo.save()" value="Continue">
    this.continueButton = page.locator('input[type="button"].payment-info-next-step-button[onclick*="PaymentInfo.save()"]');
  }

  /**
   * Click Continue button to proceed to order confirmation
   */
  async clickContinue(): Promise<void> {
    console.log('Clicking Continue button on Payment Information page...');
    console.log('Button selector: input[type="button"].payment-info-next-step-button[onclick*="PaymentInfo.save()"]');
    
    await this.continueButton.waitFor({ state: 'visible', timeout: 5000 });
    console.log('Continue button is visible');
    
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

  /**
   * Get page title for verification
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
