import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserData } from '../utils/data-helper';

/**
 * Checkout Page Class
 * Handles the complete checkout process
 */
export class CheckoutPage extends BasePage {
  // Checkout as guest section (from screenshot 8)
  readonly checkoutAsGuestButton: Locator;
  
  // Billing address form (from screenshot 9)
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly companyInput: Locator;
  readonly countryDropdown: Locator;
  readonly stateDropdown: Locator;
  readonly cityInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly faxNumberInput: Locator;
  readonly continueBillingButton: Locator;
  
  // Shipping method (from analysis)
  readonly inStorePickupCheckbox: Locator;
  readonly continueShippingButton: Locator;
  
  // Payment method (from screenshot 13)
  readonly cashOnDeliveryRadio: Locator;
  readonly continuePaymentButton: Locator;
  
  // Payment information (from screenshot 13)
  readonly continuePaymentInfoButton: Locator;
  
  // Confirm order (from screenshot 13 & 14)
  readonly confirmOrderButton: Locator;
  readonly orderNumberText: Locator;
  readonly orderDetailsLink: Locator;
  readonly continueButton: Locator;
  
  // Order confirmation (from screenshot 15)
  readonly orderInfoSection: Locator;
  readonly billingAddressSection: Locator;
  readonly paymentMethodSection: Locator;
  readonly shippingMethodSection: Locator;
  readonly productsTable: Locator;
  readonly orderTotalSection: Locator;

  constructor(page: Page) {
    super(page);
    
    // Checkout as guest
    this.checkoutAsGuestButton = page.locator('input[value="Checkout as Guest"]');
    
    // Billing address form
    this.firstNameInput = page.locator('input#BillingNewAddress_FirstName');
    this.lastNameInput = page.locator('input#BillingNewAddress_LastName');
    this.emailInput = page.locator('input#BillingNewAddress_Email');
    this.companyInput = page.locator('input#BillingNewAddress_Company');
    this.countryDropdown = page.locator('select#BillingNewAddress_CountryId');
    this.stateDropdown = page.locator('select#BillingNewAddress_StateProvinceId');
    this.cityInput = page.locator('input#BillingNewAddress_City');
    this.address1Input = page.locator('input#BillingNewAddress_Address1');
    this.address2Input = page.locator('input#BillingNewAddress_Address2');
    this.zipCodeInput = page.locator('input#BillingNewAddress_ZipPostalCode');
    this.phoneNumberInput = page.locator('input#BillingNewAddress_PhoneNumber');
    this.faxNumberInput = page.locator('input#BillingNewAddress_FaxNumber');
    this.continueBillingButton = page.locator('input[onclick^="Billing.save()"]');
    
    // Shipping method
    this.inStorePickupCheckbox = page.locator('input[onclick*="togglePickUpInStore"]').or(page.locator('input#PickUpInStore'));
    this.continueShippingButton = page.locator('input[onclick^="Shipping.save()"]');
    
    // Payment method
    this.cashOnDeliveryRadio = page.locator('input#paymentmethod_0');
    this.continuePaymentButton = page.locator('input[onclick^="PaymentMethod.save()"]');
    
    // Payment information
    this.continuePaymentInfoButton = page.locator('input[onclick^="PaymentInfo.save()"]');
    
    // Confirm order
    this.confirmOrderButton = page.locator('input[onclick^="ConfirmOrder.save()"]');
    this.orderNumberText = page.locator('text=Order number:');
    this.orderDetailsLink = page.locator('a:has-text("order details")');
    this.continueButton = page.locator('input[value="Continue"]');
    
    // Order confirmation
    this.orderInfoSection = page.locator('.order-overview');
    this.billingAddressSection = page.locator('.billing-info');
    this.paymentMethodSection = page.locator('.payment-method-info');
    this.shippingMethodSection = page.locator('.shipping-method-info');
    this.productsTable = page.locator('.cart');
    this.orderTotalSection = page.locator('.cart-total');
  }

  /**
   * Checkout as guest
   */
  async checkoutAsGuest(): Promise<void> {
    await this.checkoutAsGuestButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill billing address form
   * @param userData User data object
   */
  async fillBillingAddress(userData: UserData): Promise<void> {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.emailInput.fill(userData.email);
    await this.companyInput.fill(userData.company);
    await this.countryDropdown.selectOption({ label: userData.country });
    await this.cityInput.fill(userData.city);
    await this.address1Input.fill(userData.address1);
    await this.address2Input.fill(userData.address2);
    await this.zipCodeInput.fill(userData.zipCode);
    await this.phoneNumberInput.fill(userData.phoneNumber);
    
    if (userData.faxNumber) {
      await this.faxNumberInput.fill(userData.faxNumber);
    }
    
    await this.continueBillingButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select shipping method (In-Store Pickup)
   */
  async selectShippingMethod(): Promise<void> {
    // Target: <input id="PickUpInStore" name="PickUpInStore" onclick="Shipping.togglePickUpInStore(this)" type="checkbox" value="true">
    const checkbox = this.page.locator('input#PickUpInStore[type="checkbox"]');
    
    // Check current state
    let isChecked = await checkbox.isChecked();
    
    if (!isChecked) {
      // Use JavaScript to set checked and call the onclick handler
      await this.page.evaluate(() => {
        const checkboxElem = document.getElementById('PickUpInStore') as HTMLInputElement;
        if (checkboxElem) {
          // Set checked to true
          checkboxElem.checked = true;
          
          // Call Shipping.togglePickUpInStore(this) - the onclick handler
          if (typeof (window as any).Shipping !== 'undefined' && typeof (window as any).Shipping.togglePickUpInStore === 'function') {
            (window as any).Shipping.togglePickUpInStore(checkboxElem);
          }
          
          // Dispatch change event
          checkboxElem.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
      
      await this.page.waitForTimeout(1500);
    }
    
    // Click the Continue button for shipping
    await this.continueShippingButton.scrollIntoViewIfNeeded();
    await this.continueShippingButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.continueShippingButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select payment method (Cash On Delivery)
   */
  async selectPaymentMethod(): Promise<void> {
    await this.cashOnDeliveryRadio.check();
    await this.continuePaymentButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Continue payment information (no additional info needed for COD)
   */
  async continuePaymentInformation(): Promise<void> {
    await this.continuePaymentInfoButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Confirm order
   */
  async confirmOrder(): Promise<void> {
    await this.confirmOrderButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get order number from confirmation page
   * @returns Order number as string
   */
  async getOrderNumber(): Promise<string> {
    try {
      // Look for text containing "Order number:"
      const element = this.page.locator(':text("Order number:")');
      const elementText = await element.textContent({ timeout: 5000 }).catch(() => null);
      
      if (elementText) {
        // Extract number from "Order number: 2207822" format
        const match = elementText.match(/Order number:\s*(\d+)/);
        if (match) return match[1];
      }
      
      // Fallback: search the entire page content
      const pageText = await this.page.content();
      const numberMatch = pageText.match(/Order number:\s*(\d+)/);
      if (numberMatch) return numberMatch[1];
      
      console.warn('Could not extract order number from page');
      return '';
    } catch (error) {
      console.warn('Error getting order number:', error);
      return '';
    }
  }

  /**
   * Click order details link
   */
  async viewOrderDetails(): Promise<void> {
    await this.orderDetailsLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get order total from confirmation page
   * @returns Order total as number
   */
  async getOrderTotal(): Promise<number> {
    const totalText = await this.orderTotalSection.locator('.value-summary').last().textContent();
    if (!totalText) return 0;
    
    const match = totalText.match(/[\d,.]+/);
    if (!match) return 0;
    
    return parseFloat(match[0].replace(',', ''));
  }

  /**
   * Verify order contains all products
   * @param productNames Array of product names
   */
  async verifyOrderContainsProducts(productNames: string[]): Promise<boolean> {
    for (const productName of productNames) {
      const productInTable = this.productsTable.locator(`:has-text("${productName}")`);
      if (!(await productInTable.isVisible())) {
        return false;
      }
    }
    return true;
  }

  /**
   * Complete the entire checkout process
   * @param userData User data object
   */
  async completeCheckout(userData: UserData): Promise<string> {
    // Step 1: Checkout as guest
    await this.checkoutAsGuest();
    
    // Step 2: Fill billing address
    await this.fillBillingAddress(userData);
    
    // Step 3: Select shipping method
    await this.selectShippingMethod();
    
    // Step 4: Select payment method
    await this.selectPaymentMethod();
    
    // Step 5: Continue payment information
    await this.continuePaymentInformation();
    
    // Step 6: Confirm order
    await this.confirmOrder();
    
    // Get order number
    return await this.getOrderNumber();
  }
}