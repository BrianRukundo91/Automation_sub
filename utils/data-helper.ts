import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for user data structure
 */
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  country: string;
  state: string;
  city: string;
  address1: string;
  address2: string;
  zipCode: string;
  phoneNumber: string;
  faxNumber: string;
}

/**
 * Interface for product data structure
 */
export interface ProductData {
  category: string;
  name: string;
  price: number;
  quantity: number;
  type: string;
  configuration?: {
    processor: string;
    ram: string;
    hdd: string;
  };
}

/**
 * Test Data Helper Class
 * Handles reading and processing test data from external files
 */
export class DataHelper {
  /**
   * Read user data from JSON file
   * @returns UserData object
   */
  static getUserData(): UserData {
    try {
      const dataPath = path.resolve(__dirname, '../test-data/users.json');
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const data = JSON.parse(rawData);
      return data.guestUser;
    } catch (error) {
      throw new Error(`Failed to read user data: ${error}`);
    }
  }
}