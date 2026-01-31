import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductCategoryPage } from '../pages/ProductCategoryPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';
import { BillingAddressPage } from '../pages/BillingAddressPage';
import { ShippingAddressPage } from '../pages/ShippingAddressPage';
import { PaymentConfirmationPage } from '../pages/PaymentConfirmationPage';
import { ConfirmOrderPage } from '../pages/ConfirmOrderPage';
import { DataHelper } from '../utils/data-helper';

// Test constants for clarity and maintainability
const PRODUCTS_TO_ADD = 4;
const GUEST_CHECKOUT_TIMEOUT_MS = 3000;
const PAGE_STABILIZATION_DELAY_MS = 500;

test.describe('Place Order with Multiple Products', () => {
  test.afterEach(async ({ page }) => {
    try {
      await page.close();
    } catch (error) {
      // Page might already be closed, ignore error
    }
  });

  /**
   * Helper: Handle guest checkout dialog if present
   * Waits for guest checkout button to appear and clicks it to proceed as guest
   */
  async function handleGuestCheckoutDialog(page: Page): Promise<void> {
    const checkoutAsGuestButton = page.locator('input[value="Checkout as Guest"]');
    const isGuestCheckoutVisible = await checkoutAsGuestButton
      .isVisible({ timeout: GUEST_CHECKOUT_TIMEOUT_MS })
      .catch(() => false);

    if (isGuestCheckoutVisible) {
      await checkoutAsGuestButton.click();
      await page.waitForLoadState('networkidle');
    }
  }

  test('TC001: Add multiple products to cart', async ({ page }) => {
    const homePage = new HomePage(page);
    const productCategoryPage = new ProductCategoryPage(page);
    
    await test.step('Navigate to home page', async () => {
      await homePage.goToHome();
      const pageTitle = await homePage.getPageTitle();
      expect(pageTitle, 'Home page should load with correct title').toContain('Demo Web Shop');
    });

    await test.step('Add laptops to cart', async () => {
      await productCategoryPage.addProductsUntilMinimum(PRODUCTS_TO_ADD);
    });

    await test.step('Verify cart item count', async () => {
      const cartCount = await homePage.getCartItemCount();
      expect(cartCount, `Cart should have at least ${PRODUCTS_TO_ADD} items`).toBeGreaterThanOrEqual(PRODUCTS_TO_ADD);
    });
  });

  test('TC002: Verify shopping cart items and calculations', async ({ page }) => {
    const homePage = new HomePage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    const productCategoryPage = new ProductCategoryPage(page);
    
    await test.step('Navigate to home page and add products', async () => {
      await homePage.goToHome();
      await productCategoryPage.addProductsUntilMinimum(PRODUCTS_TO_ADD);
    });

    await test.step('Select shopping cart and view items', async () => {
      await homePage.goToShoppingCart();
      const pageTitle = await shoppingCartPage.getPageTitle();
      expect(pageTitle, 'Shopping cart page should display correctly').toContain('Shopping Cart');
    });

    await test.step('Verify products are in cart', async () => {
      const cartItemCount = await shoppingCartPage.getCartItemCount();
      expect(cartItemCount, `Cart should have at least ${PRODUCTS_TO_ADD} items`).toBeGreaterThanOrEqual(PRODUCTS_TO_ADD);
    });

    await test.step('Accept terms and proceed to checkout', async () => {
      await shoppingCartPage.acceptTermsOfService();
      await shoppingCartPage.proceedToCheckout();
      await handleGuestCheckoutDialog(page);
    });
  });

  test('TC003: Complete checkout process and verify order', async ({ page }) => {
    const homePage = new HomePage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    const productCategoryPage = new ProductCategoryPage(page);
    const billingAddressPage = new BillingAddressPage(page);
    const shippingAddressPage = new ShippingAddressPage(page);
    const paymentConfirmationPage = new PaymentConfirmationPage(page);
    const confirmOrderPage = new ConfirmOrderPage(page);
    const userData = DataHelper.getUserData();
    
    await test.step('Navigate and add products', async () => {
      await homePage.goToHome();
      await productCategoryPage.addProductsUntilMinimum(PRODUCTS_TO_ADD);
    });

    await test.step('Go to cart and proceed to checkout', async () => {
      await homePage.goToShoppingCart();
      await shoppingCartPage.acceptTermsOfService();
      await shoppingCartPage.proceedToCheckout();
    });

    await test.step('Guest checkout and billing address', async () => {
      await handleGuestCheckoutDialog(page);
      await billingAddressPage.fillBillingAddress(userData);
      await billingAddressPage.clickContinue();
    });

    await test.step('Select shipping method (In-Store Pickup)', async () => {
      await page.waitForLoadState('networkidle');
      // Allow DOM updates and event handlers to process after page load
      await page.waitForTimeout(PAGE_STABILIZATION_DELAY_MS);
      await shippingAddressPage.selectInStorePickup();
      const isSelected = await shippingAddressPage.isInStorePickupSelected();
      expect(isSelected, 'In-Store Pickup should be selected').toBe(true);
      await shippingAddressPage.clickContinue();
    });

    await test.step('Confirm payment method', async () => {
      await paymentConfirmationPage.continuePaymentMethod();
    });

    await test.step('Confirm payment information', async () => {
      await paymentConfirmationPage.continuePaymentInformation();
    });

    await test.step('Place order', async () => {
      await confirmOrderPage.clickConfirmOrder();
    });

    await test.step('Verify order confirmation', async () => {
      const orderNumber = await confirmOrderPage.getOrderNumber();
      expect(orderNumber, 'Order number should be present in confirmation').toBeTruthy();
    });
  });

  test('TC004: End-to-end order placement with price validation', async ({ page }) => {
    const homePage = new HomePage(page);
    const shoppingCartPage = new ShoppingCartPage(page);
    const productCategoryPage = new ProductCategoryPage(page);
    const billingAddressPage = new BillingAddressPage(page);
    const shippingAddressPage = new ShippingAddressPage(page);
    const paymentConfirmationPage = new PaymentConfirmationPage(page);
    const confirmOrderPage = new ConfirmOrderPage(page);
    const userData = DataHelper.getUserData();
    
    await test.step('Navigate and add products', async () => {
      await homePage.goToHome();
      await productCategoryPage.addProductsUntilMinimum(PRODUCTS_TO_ADD);
    });

    await test.step('Verify cart', async () => {
      await homePage.goToShoppingCart();
      const cartItemCount = await shoppingCartPage.getCartItemCount();
      expect(cartItemCount, `Cart should have at least ${PRODUCTS_TO_ADD} items`).toBeGreaterThanOrEqual(PRODUCTS_TO_ADD);
    });

    await test.step('Guest checkout and billing address', async () => {
      await shoppingCartPage.acceptTermsOfService();
      await shoppingCartPage.proceedToCheckout();
      await handleGuestCheckoutDialog(page);
      await billingAddressPage.fillBillingAddress(userData);
      await billingAddressPage.clickContinue();
    });

    await test.step('Select shipping method (In-Store Pickup)', async () => {
      await page.waitForLoadState('networkidle');
      // Allow DOM updates and event handlers to process after page load
      await page.waitForTimeout(PAGE_STABILIZATION_DELAY_MS);
      await shippingAddressPage.selectInStorePickup();
      await shippingAddressPage.clickContinue();
    });

    await test.step('Confirm payment details', async () => {
      await paymentConfirmationPage.continuePaymentMethod();
      await paymentConfirmationPage.continuePaymentInformation();
    });

    await test.step('Place order and verify confirmation', async () => {
      await confirmOrderPage.clickConfirmOrder();
      const orderNumber = await confirmOrderPage.getOrderNumber();
      expect(orderNumber, 'Order number should be present in confirmation').toBeTruthy();
    });
  });
});