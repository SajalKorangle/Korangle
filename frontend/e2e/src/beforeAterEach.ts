import * as puppeteer from 'puppeteer';

// Q: How to take Screenshot
// A: await page.screenshot({ path: 'e2e/before-login.png' });

export class BeforeAfterEach {

    static browser: any;
    static page: any;

    static async beforeEach() {

        BeforeAfterEach.browser = await puppeteer.launch();
        BeforeAfterEach.page = await BeforeAfterEach.browser.newPage();
        await BeforeAfterEach.page.setViewport({
            width: 1920,
            height: 1080
        });
        await BeforeAfterEach.page.goto('http://localhost:4200');
        await BeforeAfterEach.page.type('#username', '1234567890'); // Types instantly
        await BeforeAfterEach.page.type('#password', '1234567890', {delay: 100}); // Types slower, like a user
        await BeforeAfterEach.page.click('button[type="submit"]');
        await BeforeAfterEach.page.waitForSelector('div.sidebar')
        return BeforeAfterEach.page;

    }

    static async afterEach() {

        await BeforeAfterEach.page.waitFor('a#Logout');
        await BeforeAfterEach.page.click('a#Logout');
        await BeforeAfterEach.browser.close();

    }

}
