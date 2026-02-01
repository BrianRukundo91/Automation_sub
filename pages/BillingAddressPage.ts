import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserData } from '../utils/data-helper';

/**
 * Billing Address Page
 * Handles filling in billing address information during checkout
 */
export class BillingAddressPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly companyInput: Locator;
  readonly countrySelect: Locator;
  readonly stateSelect: Locator;
  readonly cityInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly faxNumberInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    
    this.firstNameInput = page.locator('input#BillingNewAddress_FirstName');
    this.lastNameInput = page.locator('input#BillingNewAddress_LastName');
    this.emailInput = page.locator('input#BillingNewAddress_Email');
    this.companyInput = page.locator('input#BillingNewAddress_Company');
    this.countrySelect = page.locator('select#BillingNewAddress_CountryId');
    this.stateSelect = page.locator('select#BillingNewAddress_StateProvinceId');
    this.cityInput = page.locator('input#BillingNewAddress_City');
    this.address1Input = page.locator('input#BillingNewAddress_Address1');
    this.address2Input = page.locator('input#BillingNewAddress_Address2');
    this.zipCodeInput = page.locator('input#BillingNewAddress_ZipPostalCode');
    this.phoneNumberInput = page.locator('input#BillingNewAddress_PhoneNumber');
    this.faxNumberInput = page.locator('input#BillingNewAddress_FaxNumber');
    this.continueButton = page.locator('input[onclick^="Billing.save()"]');
  }

  /**
   * Fill in the billing address form with user data
   */
  async fillBillingAddress(userData: UserData): Promise<void> {
    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.emailInput.fill(userData.email);
    await this.companyInput.fill(userData.company);
    
    // Select country
    await this.countrySelect.selectOption(userData.country);
    await this.page.waitForTimeout(500);
    
    // Select state
    await this.stateSelect.selectOption(userData.state);
    await this.page.waitForTimeout(500);
    
    await this.cityInput.fill(userData.city);
    await this.address1Input.fill(userData.address1);
    await this.address2Input.fill(userData.address2);
    await this.zipCodeInput.fill(userData.zipCode);
    await this.phoneNumberInput.fill(userData.phoneNumber);
    await this.faxNumberInput.fill(userData.faxNumber);
  }

  /**
   * Click Continue button to proceed to shipping address
   */
  async clickContinue(): Promise<void> {
    await this.clickButton(this.continueButton, 'Continue on Billing Address');
    // Allow page to transition to next step before proceeding
    await this.page.waitForTimeout(1000);
  }

  /**
   * Get page title to verify we're on the correct page
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
