import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const screenshotDir = '/tmp/techhub-screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 }
});
const page = await context.newPage();

let screenshotCounter = 1;

async function takeScreenshot(name, fullPage = true) {
  const filename = screenshotCounter.toString().padStart(2, '0') + '_' + name + '.png';
  await page.screenshot({ 
    path: path.join(screenshotDir, filename),
    fullPage: fullPage
  });
  console.log('Screenshot saved: ' + filename);
  screenshotCounter++;
  await page.waitForTimeout(500);
}

try {
  console.log('Starting TechHub Electronics UI/UX Review...\n');

  console.log('1. Visiting Home Page...');
  await page.goto('http://localhost', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await takeScreenshot('home_page');

  console.log('2. Visiting Shop Page...');
  try {
    await page.goto('http://localhost/shop', { waitUntil: 'networkidle' });
    await takeScreenshot('shop_page');
  } catch (e) {
    console.log('Shop page not accessible:', e.message);
  }

  console.log('3. Visiting Product Details...');
  try {
    await page.goto('http://localhost/products/1', { waitUntil: 'networkidle' });
    await takeScreenshot('product_details');
  } catch (e) {
    console.log('Product details not accessible');
  }

  console.log('4. Visiting Cart Page...');
  try {
    await page.goto('http://localhost/cart', { waitUntil: 'networkidle' });
    await takeScreenshot('cart_page');
  } catch (e) {
    console.log('Cart page not accessible');
  }

  console.log('5. Visiting Login Page...');
  try {
    await page.goto('http://localhost/login', { waitUntil: 'networkidle' });
    await takeScreenshot('login_page');
  } catch (e) {
    console.log('Login page not accessible');
  }

  console.log('6. Visiting Register Page...');
  try {
    await page.goto('http://localhost/register', { waitUntil: 'networkidle' });
    await takeScreenshot('register_page');
  } catch (e) {
    console.log('Register page not accessible');
  }

  console.log('7. Testing Mobile View (375px)...');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost', { waitUntil: 'networkidle' });
  await takeScreenshot('mobile_home');

  console.log('\nReview complete! Screenshots saved to: ' + screenshotDir);

} catch (error) {
  console.error('Error during review:', error);
} finally {
  await browser.close();
}
