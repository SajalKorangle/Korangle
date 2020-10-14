import * as puppeteer from 'puppeteer';
import {stopBackendServer} from './backend-server';

// Q: How to take Screenshot
// A: await page.screenshot({ path: 'e2e/before-login.png' });

export class BeforeAfterEach {

    static browser: any;
    static page: any;

    static async beforeEach() {

        BeforeAfterEach.browser = await puppeteer.launch();
        // BeforeAfterEach.browser = await puppeteer.launch({headless: false});
        // BeforeAfterEach.browser = await puppeteer.launch({headless: false, slowMo: 500});
        BeforeAfterEach.page = await BeforeAfterEach.browser.newPage();
        await BeforeAfterEach.page.setViewport({
            width: 1220,
            height: 1080
        });
        // await BeforeAfterEach.page.setDefaultNavigationTimeout(0);
        await BeforeAfterEach.page.goto('http://localhost:4200');
        await BeforeAfterEach.page.type('#username', '1234567890'); // Types instantly
        await BeforeAfterEach.page.type('#password', '1234567890'); // Types instantly
        // await BeforeAfterEach.page.type('#password', '1234567890', {delay: 100}); // Types slower, like a user
        await BeforeAfterEach.page.click('button[type="submit"]');
        await BeforeAfterEach.page.waitForSelector('div.sidebar');
        return BeforeAfterEach.page;

    }

    static async afterEach() {

        stopBackendServer();

        await BeforeAfterEach.page.waitForSelector('a#Logout');
        await BeforeAfterEach.page.click('a#Logout');
        await BeforeAfterEach.browser.close();

    }

}
