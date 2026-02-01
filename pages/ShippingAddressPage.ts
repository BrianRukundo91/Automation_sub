import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Shipping Address Page
 * Handles shipping method selection (In-Store Pickup)
 */
export class ShippingAddressPage extends BasePage {
  readonly inStorePickupCheckbox: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    
    this.inStorePickupCheckbox = page.locator('input[id="PickUpInStore"]');
    this.continueButton = page.locator('input[type="button"].new-address-next-step-button[onclick*="Shipping.save()"]');
  }

  /**
   * Check if In-Store Pickup is currently selected
   */
  async isInStorePickupSelected(): Promise<boolean> {
    return await this.inStorePickupCheckbox.isChecked();
  }

  /**
   * Click the In-Store Pickup checkbox - MUST be selected before continuing
   */
  async selectInStorePickup(): Promise<void> {
    try {
      const exists = (await this.inStorePickupCheckbox.count()) > 0;
      
      if (!exists) {
        throw new Error('In-Store Pickup checkbox not found on the Shipping Address page');
      }

      let isSelected = await this.isInStorePickupSelected();

      if (!isSelected) {
        await this.inStorePickupCheckbox.waitFor({ state: 'visible', timeout: 5000 });
        await this.inStorePickupCheckbox.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await this.inStorePickupCheckbox.click();
        await this.page.waitForTimeout(1500);

        isSelected = await this.isInStorePickupSelected();

        if (!isSelected) {
          throw new Error('Failed to select In-Store Pickup checkbox after click attempt');
        }
      }
    } catch (error) {
      const errorMessage = `Error selecting In-Store Pickup: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Click Continue button to proceed to Payment Method
   */
  async clickContinue(): Promise<void> {
    await this.clickButton(this.continueButton, 'Continue on Shipping Address');
  }
}
