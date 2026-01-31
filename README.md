# Playwright Automation Project - Demo Web Shop

A professional automation testing framework using Playwright with TypeScript for the Demo Web Shop application.

## Project Status

✅ **ALL TESTS PASSING** - 12/12 tests (100% pass rate)  
**Last Run**: February 1, 2026  
**Execution Time**: ~1.3 minutes (all 3 browsers)  
**Browsers**: Chromium ✓ | Firefox ✓ | WebKit ✓

## Project Overview

This project automates comprehensive e-commerce checkout testing for https://demowebshop.tricentis.com using Playwright with TypeScript. It includes 4 automated test cases covering the complete order flow with multi-browser support and professional reporting.

### Test Cases

- **TC001**: Add multiple products to cart
- **TC002**: Verify shopping cart items and calculations
- **TC003**: Complete checkout process and verify order
- **TC004**: End-to-end order placement with price validation

## Features

- **Page Object Model** design pattern for maintainable, scalable code
- **TypeScript** for type safety and better developer experience
- **Multi-browser Testing**: Chromium, Firefox, WebKit
- **Environment Configuration** for secure data management
- **External Test Data** from JSON and CSV files
- **Professional Reporting** with clean console output
- **Test Constants** for easy maintenance and updates
- **Comprehensive Documentation** with setup and execution guides

## Prerequisites

- **Node.js** v16+ (check with `node --version`)
- **npm** v8+ (check with `npm --version`)
- **Git** (for cloning the repository)

## Project Structure

```
.
├── pages/                    # Page Object Model classes
│   ├── BasePage.ts          # Abstract base page with common functionality
│   ├── HomePage.ts          # Home page interactions
│   ├── ProductCategoryPage.ts   # Product catalog and cart management
│   ├── ShoppingCartPage.ts  # Cart verification and checkout flow
│   ├── BillingAddressPage.ts   # Billing address form
│   ├── ShippingAddressPage.ts  # Shipping method selection
│   ├── PaymentConfirmationPage.ts   # Payment method and information
│   └── ConfirmOrderPage.ts  # Order confirmation
├── tests/
│   └── place-order.spec.ts  # All 4 test cases
├── utils/
│   ├── config-helper.ts     # Configuration management
│   ├── data-helper.ts       # Test data loading and parsing
│   └── report-helper.ts     # Reporting utilities
├── test-data/
│   ├── users.json          # Test user credentials
│   ├── products.json       # Product catalog data
│   └── checkout-data.csv   # Billing and shipping data
├── reports/                # Test execution reports
├── screenshots/            # Test failure screenshots
├── test-results/           # Detailed test results
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Project dependencies
├── .env.example          # Environment variable template
└── README.md             # This file
```

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "b_automation project"
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- Playwright (v1.58.1)
- TypeScript
- All required dependencies

### Step 3: Configure Environment

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

**Edit `.env` file** with your configuration:

```env
# Application URL
BASE_URL=https://demowebshop.tricentis.com

# Test timeout settings (in milliseconds)
DEFAULT_TIMEOUT=30000

# Guest checkout timeout (for slower networks)
GUEST_CHECKOUT_TIMEOUT_MS=3000

# Page stabilization delay
PAGE_STABILIZATION_DELAY_MS=500
```

### Step 4: Verify Setup

```bash
npm run type-check
```

Expected output: TypeScript compilation successful

---

## Running Tests

### Quick Start

```bash
npm test
```

Runs all tests in headless mode on all configured browsers (Chromium, Firefox, WebKit).

### Running Tests by Browser

**Chromium Only (Recommended for CI/CD)**
```bash
npm run test:chrome
```
*Fastest execution, ~26 seconds*

**Firefox Only**
```bash
npm run test:firefox
```

**WebKit Only**
```bash
npm run test:webkit
```

### Running Tests in Headed Mode (Visible Browser)

**All Browsers**
```bash
npm run test:headed
```

### Running Specific Tests

**Single Test Case**
```bash
npx playwright test --grep "TC001"
```

**Multiple Test Cases**
```bash
npx playwright test --grep "TC001|TC002"
```

### Test Execution Modes

**Debug Mode** (Step through tests)
```bash
npm run test:debug
```

**HTML Report Generation**
```bash
npm run test:report
```

**View HTML Report**
```bash
npm run show-report
```

---

## Test Results & Reports

### View Test Results

**After running tests**, view results in terminal:
```bash
cat test-results.json
```

**HTML Report** (if enabled)
```bash
open reports/html-reports/index.html
```

### Report Locations

- **Console Output**: Displayed in terminal during execution
- **JSON Results**: `reports/test-results.json`
- **JUnit XML**: `reports/junit-results.xml`
- **HTML Report**: `reports/html-reports/index.html`
- **Reporting Tools**: `reports/` directory with Test Report, HTML reports, and JSON results
- **Detailed Test Results**: `test-results/` directory
- **Test Screenshots**: `screenshots/` directory

---

## Test Data

### User Credentials (test-data/users.json)

```json
{
  "guestUser": {
    "email": "guest@example.com",
    "firstName": "Guest",
    "lastName": "User"
  }
}
```

### Products (test-data/products.json)

Contains product catalog with names, prices, and availability

### Checkout Data (test-data/checkout-data.csv)

Billing and shipping address data for various test scenarios

---

## Configuration Details

### playwright.config.ts

Key configuration:
- **Browsers**: Chromium (default), Firefox, WebKit
- **Base URL**: From `.env` file
- **Timeout**: 30 seconds (configurable)
- **Headless**: True by default, disable with `--headed`
- **Reporters**: Line reporter (console output only)

### tsconfig.json

TypeScript configuration with:
- Target: ES2020
- Module: CommonJS
- Strict mode enabled

---

## Troubleshooting

### Tests Hanging or Slow

**Solution**: Verify `.env` configuration
```bash
cat .env
```

Ensure timeout values are reasonable:
- `DEFAULT_TIMEOUT`: 30000ms
- `GUEST_CHECKOUT_TIMEOUT_MS`: 3000ms

### Selector Not Found Errors

**Check**: Verify selectors in page classes match current DOM
```bash
npx playwright test --debug
```

Use the Inspector to validate selectors in real-time

### Tests Failing in Specific Browser

**Check**: Browser-specific compatibility
```bash
npx playwright test --project=chromium --headed
```

Watch test execution to identify browser-specific issues

### Network/Timeout Issues

**Try**: Increase timeout values in `.env`
```env
DEFAULT_TIMEOUT=60000
GUEST_CHECKOUT_TIMEOUT_MS=5000
```

---

## Development & Contribution

### Adding New Test Cases

1. Create test in `tests/place-order.spec.ts`
2. Use existing page classes or create new ones
3. Follow naming convention: `test('TC###: Description', async ({page}) => {})`
4. Run tests to verify
5. Update documentation

### Adding New Pages

1. Create file in `pages/` directory
2. Extend `BasePage` class
3. Implement page-specific selectors and methods
4. Export class for test usage

### Code Quality

- TypeScript strict mode enabled
- No console errors
- Professional code standards
- Meaningful assertion messages

---

## Performance Metrics

### Test Execution Times (Headless, Chromium)

- **Individual Test**: ~6-7 seconds
- **All 4 Tests**: ~26 seconds
- **All 3 Browsers** (12 tests): ~1m 18s

### Browser Comparison

| Browser | Speed | Reliability |
|---------|-------|-------------|
| Chromium | Fastest | Excellent |
| Firefox | Medium | Excellent |
| WebKit | Medium | Excellent |

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Run Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: reports
          path: reports/
```

---

## Additional Documentation

This project includes comprehensive documentation:

- **[Test Report](./reports/TEST_REPORT_INTERVIEW.md)** - Professional test execution report with detailed metrics, results, and failure analysis
- **[AI Acceleration Document](./AI_ACCELERATION_DOCUMENT.md)** - Strategic guide for using AI tools to accelerate test automation development
- **[Manual Test Cases](./test-data/test-cases.md)** - 5 detailed manual test cases for the Demo Web Shop with complete test steps and expected results
- **[Performance Testing Plan](./test-data/performance-test-plan.md)** - Comprehensive performance testing strategy with test scenarios, parameters, and metrics

---

## License

This project is provided as-is for testing and educational purposes.

---

**Last Updated**: February 1, 2026  
**Playwright Version**: v1.58.1  
**Test Status**: ✅ 12/12 Passing (100%)  
**Status**: Production Ready  
**GitHub**: https://github.com/BrianRukundo91/Automation_sub
