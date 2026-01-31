import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ProductData } from '../utils/data-helper';

/**
 * Shopping Cart Page Class
 * Handles interactions with the shopping cart page
 */
export class ShoppingCartPage extends BasePage {
  readonly cartTable: Locator;
  readonly cartRows: Locator;
  readonly updateCartButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly termsOfServiceCheckbox: Locator;
  readonly checkoutButton: Locator;
  readonly subtotalLabel: Locator;
  readonly shippingLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    super(page);
    
    // Cart table and items
    this.cartTable = page.locator('.cart');
    this.cartRows = page.locator('.cart-item-row');
    
    // Cart actions
    this.updateCartButton = page.locator('input[name="updatecart"]');
    this.continueShoppingButton = page.locator('input[name="continueshopping"]');
    
    // Checkout section
    this.termsOfServiceCheckbox = page.locator('input#termsofservice');
    this.checkoutButton = page.locator('button#checkout');
    
    // Price elements
    this.subtotalLabel = page.locator('.cart-total-right:has-text("Sub-Total") + td');
    this.shippingLabel = page.locator('.cart-total-right:has-text("Shipping") + td');
    this.taxLabel = page.locator('.cart-total-right:has-text("Tax") + td');
    this.totalLabel = page.locator('.cart-total-right:has-text("Total") + td');
  }

  /**
   * Navigate to shopping cart
   */
  async goToCart(): Promise<void> {
    await this.navigateTo('cart');
  }

  /**
   * Get number of items in cart (total quantity)
   * @returns Total number of cart items
   */
  async getCartItemCount(): Promise<number> {
    try {
      // First, try to get the count from the cart table rows
      const rows = await this.cartRows.count();
      if (rows === 0) return 0;
      
      let totalQuantity = 0;
      
      // Sum up quantities from all cart rows with a simple approach
      for (let i = 0; i < rows; i++) {
        try {
          const row = this.cartRows.nth(i);
          const quantityInput = row.locator('input.qty-input');
          const value = await quantityInput.evaluate((el: HTMLInputElement) => el.value || '1');
          totalQuantity += parseInt(value) || 1;
        } catch {
          // If we can't get quantity, assume 1
          totalQuantity += 1;
        }
      }
      
      return Math.max(totalQuantity, rows);
    } catch (error) {
      // Fallback: return 0 if any error
      return 0;
    }
  }

  /**
   * Get product row by product name
   * @param productName Name of the product
   * @returns Locator for the product row
   */
  getProductRow(productName: string): Locator {
    return this.page.locator(`.cart-item-row:has-text("${productName}")`);
  }

  /**
   * Get product quantity from cart
   * @param productName Name of the product
   * @returns Quantity as number
   */
  async getProductQuantity(productName: string): Promise<number> {
    const productRow = this.getProductRow(productName);
    const quantityInput = productRow.locator('input.qty-input');
    const value = await quantityInput.getAttribute('value');
    return value ? parseInt(value) : 0;
  }

  /**
   * Get product unit price from cart
   * @param productName Name of the product
   * @returns Unit price as number
   */
  async getProductUnitPrice(productName: string): Promise<number> {
    const productRow = this.getProductRow(productName);
    const priceCell = productRow.locator('.product-unit-price');
    const priceText = await priceCell.textContent();
    return this.extractPrice(priceText || '0');
  }

  /**
   * Get product total price from cart
   * @param productName Name of the product
   * @returns Total price as number
   */
  async getProductTotalPrice(productName: string): Promise<number> {
    const productRow = this.getProductRow(productName);
    const totalCell = productRow.locator('.product-subtotal');
    const priceText = await totalCell.textContent();
    return this.extractPrice(priceText || '0');
  }

  /**
   * Extract price from text
   * @param priceText Text containing price
   * @returns Price as number
   */
  private extractPrice(priceText: string): number {
    const match = priceText.match(/[\d,.]+/);
    if (!match) return 0;
    return parseFloat(match[0].replace(',', ''));
  }

  /**
   * Get subtotal from cart
   * @returns Subtotal as number
   */
  async getSubtotal(): Promise<number> {
    const subtotalText = await this.subtotalLabel.textContent();
    return this.extractPrice(subtotalText || '0');
  }

  /**
   * Get shipping cost from cart
   * @returns Shipping cost as number
   */
  async getShippingCost(): Promise<number> {
    const shippingText = await this.shippingLabel.textContent();
    return this.extractPrice(shippingText || '0');
  }

  /**
   * Get tax from cart
   * @returns Tax amount as number
   */
  async getTax(): Promise<number> {
    const taxText = await this.taxLabel.textContent();
    return this.extractPrice(taxText || '0');
  }

  /**
   * Get total from cart
   * @returns Total amount as number
   */
  async getTotal(): Promise<number> {
    const totalText = await this.totalLabel.textContent();
    return this.extractPrice(totalText || '0');
  }

  /**
   * Verify cart contains all expected products
   * @param products Array of ProductData objects
   */
  async verifyCartContainsProducts(products: ProductData[]): Promise<boolean> {
    for (const product of products) {
      const productRow = this.getProductRow(product.name);
      if (!(await productRow.isVisible())) {
        return false;
      }
      
      const quantity = await this.getProductQuantity(product.name);
      if (quantity !== product.quantity) {
        return false;
      }
    }
    return true;
  }

  /**
   * Calculate expected total based on cart items
   * @param products Array of ProductData objects
   * @returns Expected total amount
   */
  async calculateExpectedCartTotal(products: ProductData[]): Promise<number> {
    let expectedTotal = 0;
    
    for (const product of products) {
      const unitPrice = await this.getProductUnitPrice(product.name);
      expectedTotal += unitPrice * product.quantity;
    }
    
    return expectedTotal;
  }

  /**
   * Accept terms of service
   */
  async acceptTermsOfService(): Promise<void> {
    // Try to find and check the terms of service checkbox
    const termsCheckbox = this.page.locator('input[type="checkbox"][id*="terms"]').first();
    
    await termsCheckbox.scrollIntoViewIfNeeded();
    await termsCheckbox.waitFor({ state: 'visible', timeout: 5000 });
    await termsCheckbox.check();
  }

  /**
   * Proceed to checkout (assumes terms already accepted)
   */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}