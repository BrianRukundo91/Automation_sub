import dotenv from 'dotenv';
import path from 'path';

/**
 * Configuration Helper Class
 * Centralizes access to environment variables with validation
 */
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export class ConfigHelper {
  /**
   * Get base URL from environment variables
   * @returns Base URL string
   */
  static getBaseUrl(): string {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      throw new Error('BASE_URL environment variable is not set');
    }
    return baseUrl;
  }

  /**
   * Get default timeout from environment variables
   * @returns Timeout in milliseconds
   */
  static getTimeout(): number {
    return parseInt(process.env.DEFAULT_TIMEOUT || '30000');
  }

}