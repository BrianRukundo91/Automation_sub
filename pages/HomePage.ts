import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Home Page Class
 * Handles navigation and cart interactions on the home page
 */
export class HomePage extends BasePage {
  readonly computersMenu: Locator;
  readonly notebooksSubMenu: Locator;

  constructor(page: Page) {
    super(page);
    
    this.computersMenu = this.topMenu.locator('a').filter({ hasText: /^Computers$/ });
    this.notebooksSubMenu = this.categoriesMenu.locator('a').filter({ hasText: /^Notebooks$/ });
  }

  /**
   * Navigate to home page
   */
  async goToHome(): Promise<void> {
    await this.navigateTo('');
  }



  /**
   * Go to Computers category
   */
  async goToComputers(): Promise<void> {
    await this.computersMenu.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Go to Notebooks sub-category
   */
  async goToNotebooks(): Promise<void> {
    await this.computersMenu.hover();
    await this.page.waitForTimeout(500);
    await this.notebooksSubMenu.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get shopping cart item count
   * @returns Number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    const cartText = await this.shoppingCartLink.textContent();
    if (!cartText) return 0;
    
    const match = cartText.match(/\((\d+)\)/);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Go to shopping cart
   */
  async goToShoppingCart(): Promise<void> {
    await this.shoppingCartLink.scrollIntoViewIfNeeded();
    await this.shoppingCartLink.click();
    await this.page.waitForLoadState('networkidle');
  }
}