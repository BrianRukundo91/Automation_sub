import { Page, Locator } from '@playwright/test';
import { ConfigHelper } from '../utils/config-helper';

/**
 * Base Page Class
 * Contains common methods and locators used across all pages
 */
export abstract class BasePage {
  readonly page: Page;
  
  readonly shoppingCartLink: Locator;
  readonly topMenu: Locator;
  readonly categoriesMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.shoppingCartLink = page.locator('a.ico-cart').first();
    this.topMenu = page.locator('.top-menu');
    this.categoriesMenu = page.locator('.block-category-navigation');
  }

  /**
   * Navigate to a specific URL
   * @param path URL path to navigate to
   */
  async navigateTo(path: string = ''): Promise<void> {
    const url = `${ConfigHelper.getBaseUrl()}/${path}`;
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   * @returns Page title as string
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Helper method: Click a button with consistent wait and error handling
   * @param locator Button locator
   * @param buttonName Button name for error messages
   * @param timeout Optional custom timeout in milliseconds
   */
  protected async clickButton(locator: Locator, buttonName: string, timeout: number = 5000): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      await locator.click({ timeout });
    } catch (error) {
      const errorMessage = `Failed to click ${buttonName}`;
      console.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Helper method: Fill form input with validation
   * @param locator Input locator
   * @param value Value to fill
   * @param fieldName Field name for error messages
   */
  protected async fillInput(locator: Locator, value: string, fieldName: string): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      await locator.fill(value);
    } catch (error) {
      const errorMessage = `Failed to fill ${fieldName}`;
      console.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Helper method: Select option from dropdown with validation
   * @param locator Select locator
   * @param value Value to select
   * @param fieldName Field name for error messages
   */
  protected async selectDropdown(locator: Locator, value: string, fieldName: string): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      await locator.selectOption(value);
    } catch (error) {
      const errorMessage = `Failed to select ${fieldName}`;
      console.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  }
}