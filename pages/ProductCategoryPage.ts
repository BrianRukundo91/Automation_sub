import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ProductData } from '../utils/data-helper';
import { ConfigHelper } from '../utils/config-helper';

/**
 * Product Category Page Class
 * Handles interactions with product listing and product pages
 */
export class ProductCategoryPage extends BasePage {
  readonly productGrid: Locator;
  readonly productItems: Locator;
  readonly pageTitle: Locator;
  readonly sortByDropdown: Locator;
  readonly displayPerPageDropdown: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    super(page);
    
    this.productGrid = page.locator('.product-grid');
    this.productItems = page.locator('.product-item');
    this.pageTitle = page.locator('.page-title');
    this.sortByDropdown = page.locator('select#products-orderby');
    this.displayPerPageDropdown = page.locator('select#products-pagesize');
    this.addToCartButtons = page.locator('input[value="Add to cart"]');
  }

  /**
   * Get product item by name
   * @param productName Name of the product
   * @returns Locator for the product item
   */
  getProductByName(productName: string): Locator {
    return this.page.locator(`.product-item:has-text("${productName}")`);
  }

  /**
   * Add product to cart
   * @param productName Name of the product to add
   * @param quantity Quantity to add (default: 1)
   */
  async addProductToCart(productName: string, quantity: number = 1): Promise<void> {
    const productItem = this.getProductByName(productName);
    
    // Click the product link to go to product details page
    await productItem.locator('h2.product-title a').click();
    await this.page.waitForLoadState('networkidle');
    
    // Handle configurable products (like computers)
    if (productName.includes('Build your own cheap computer')) {
      await this.configureComputer();
    }
    
    // Set quantity if more than 1
    if (quantity > 1) {
      const quantityInput = this.page.locator('input.qty-input');
      await quantityInput.fill(quantity.toString());
    }
    
    // Click add to cart button (use button-1 class to target details page button, not catalog buttons)
    const addToCartButton = this.page.locator('input.button-1.add-to-cart-button');
    await addToCartButton.click();
    
    // Wait for success notification
    await this.page.waitForSelector('.bar-notification.success', { timeout: 10000 });
    
    // Close the notification if it appears
    const closeNotification = this.page.locator('.bar-notification.success .close');
    if (await closeNotification.isVisible()) {
      await closeNotification.click();
    }
    
    // Go back to category page for next product
    await this.page.goBack();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Configure computer product (based on screenshot data)
   */
  private async configureComputer(): Promise<void> {
    // Based on screenshot: Processor: Medium [+15.00], RAM: 2 GB, HDD: 320 GB
    
    // Select RAM (2 GB)
    await this.page.selectOption('select#product_attribute_72_5_18', { label: '2 GB' });
    
    // Select HDD (320 GB)
    await this.page.selectOption('select#product_attribute_72_6_19', { label: '320 GB' });
    
    // Select Processor (Medium [+15.00])
    await this.page.selectOption('select#product_attribute_72_3_20', { label: 'Medium [+$15.00]' });
    
    // Wait for price update if needed
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get product price from product page
   * @param productName Name of the product
   * @returns Price as number
   */
  async getProductPrice(productName: string): Promise<number> {
    const productItem = this.getProductByName(productName);
    const priceText = await productItem.locator('.price').textContent();
    
    if (!priceText) return 0;
    
    // Extract numeric value from price string
    const match = priceText.match(/[\d,.]+/);
    if (!match) return 0;
    
    return parseFloat(match[0].replace(',', ''));
  }

  /**
   * Add laptop products to cart until minItems are reached
   * Focuses on the notebooks/laptops category only
   * @param minItems Minimum number of items to add to cart (default: 4)
   */
  async addProductsUntilMinimum(minItems: number = 4): Promise<void> {
    let cartItemCount = 0;
    
    try {
      console.log(`Starting to add ${minItems} laptops to cart`);
      
      // Navigate to notebooks (laptops) section
      await this.page.goto(`${ConfigHelper.getBaseUrl()}/notebooks`);
      await this.page.waitForTimeout(2000);
      
      // Keep adding laptops until we reach minItems
      while (cartItemCount < minItems) {
        // Get all "Add to cart" buttons from catalog (button-2 class)
        const addButtons = this.page.locator('input.button-2.product-box-add-to-cart-button');
        const buttonCount = await addButtons.count();
        
        if (buttonCount === 0) {
          console.warn('No laptops available to add');
          break;
        }
        
        // Pick a random laptop from available ones
        const randomIndex = Math.floor(Math.random() * buttonCount);
        const randomButton = addButtons.nth(randomIndex);
        
        try {
          await randomButton.waitFor({ state: 'visible', timeout: 3000 });
          await randomButton.click();
          
          console.log(`Added laptop ${cartItemCount + 1}/${minItems}`);
          
          // Wait for notification and item to be added
          await this.page.waitForTimeout(2000);
          
          cartItemCount++;
          
        } catch (error) {
          console.log(`Failed to add laptop, retrying...`);
          // Wait and try again without reload
          await this.page.waitForTimeout(1500);
        }
      }
      
      console.log(`Completed: ${cartItemCount} laptops added to cart`);
    } catch (error) {
      console.error('Error adding laptops to cart:', error);
      throw error;
    }
  }
}