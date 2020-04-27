import * as puppeteer from 'puppeteer';

describe('workspace-project App', () => {
  it('Test Puppeteer screenshot', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    })
    await page.goto('http://localhost:4200');
    await page.type('#username', '1234567890'); // Types instantly
    await page.type('#pass', '1234567890', {delay: 100}); // Types slower, like a user
    await page.screenshot({ path: 'before-login.png' });
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    // await page.waitFor(10000)
    await page.waitFor('a#Logout')
    // await page.waitFor(10000)
    await page.screenshot({ path: 'after-login.png' });
    await page.click('a#Logout')
    // await page.waitForNavigation();
    // await page.waitFor(10000)
    await page.screenshot({ path: 'click-logout.png' });
    

    await browser.close();
  });
});