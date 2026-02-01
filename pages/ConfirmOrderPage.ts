import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Confirm Order Page
 * Handles order confirmation and retrieval of order information
 */
export class ConfirmOrderPage extends BasePage {
  readonly confirmButton: Locator;
  readonly orderDetailsLink: Locator;
  readonly pageContent: Locator;

  constructor(page: Page) {
    super(page);
    
    this.confirmButton = page.locator('input[type="button"].confirm-order-next-step-button[onclick*="ConfirmOrder.save()"]');
    this.orderDetailsLink = page.locator('a[href*="/orderdetails"]');
    this.pageContent = page.locator('body');
  }

  /**
   * Click Confirm Order button to place the order
   */
  async clickConfirmOrder(): Promise<void> {
    await this.clickButton(this.confirmButton, 'Confirm Order');
  }

  /**
   * Get the order number from the confirmation page
   */
  async getOrderNumber(): Promise<string | null> {
    try {
      const content = await this.pageContent.textContent();
      
      if (!content) {
        return null;
      }
      
      // Extract order number from text (e.g., "Order number: 2207784")
      const match = content.match(/Order number[:\s]+([\d]+)/i);
      if (match && match[1]) {
        return match[1];
      }
      
      // Fallback: try to extract from order details link href
      const href = await this.orderDetailsLink.getAttribute('href').catch(() => null);
      if (href) {
        const orderMatch = href.match(/\/orderdetails\/(\d+)/);
        if (orderMatch && orderMatch[1]) {
          return orderMatch[1];
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting order number:', error);
      return null;
    }
  }

  /**
   * Click the order details link to view full order information
   */
  async clickOrderDetails(): Promise<void> {
    await this.orderDetailsLink.waitFor({ state: 'visible', timeout: 3000 });
    await this.orderDetailsLink.click({ timeout: 5000 });
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title for verification
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
