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
}