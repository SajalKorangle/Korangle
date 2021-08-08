import { BeforeAfterEach } from '../beforeAterEach';
import { startBackendServer, stopBackendServer } from '../backend-server';
import { getFixtureFiles } from '../../../fixtures/fixture-map';
import * as puppeteer from 'puppeteer';

describe('Login', () => {

    let page: any;

    describe('login should pass', () => {

        it('test case', async () => {
            await startBackendServer(getFixtureFiles('authentication/login-should-pass.json'));

            page = await BeforeAfterEach.beforeEach();
            await BeforeAfterEach.afterEach();
        });

    });

    describe('login should fail', () => {

        it('test case', async () => {
            await startBackendServer(getFixtureFiles('authentication/login-should-pass.json'));

            BeforeAfterEach.browser = await puppeteer.launch();
            BeforeAfterEach.page = await BeforeAfterEach.browser.newPage();
            await BeforeAfterEach.page.setViewport({
                width: 1920,
                height: 1080
            });
            await BeforeAfterEach.page.setDefaultNavigationTimeout(0);

            page.on('dialog', async dialog => {
                expect(dialog.message()).toBe('Login failed: Invalid username or password');
                await dialog.dismiss();
            });
            await BeforeAfterEach.page.goto('http://localhost:4200');
            await BeforeAfterEach.page.type('#username', '1234567890'); // Types instantly
            await BeforeAfterEach.page.type('#password', '1234567891', { delay: 100 }); // Types slower, like a user
            await BeforeAfterEach.page.click('button[type="submit"]');

            stopBackendServer();

            await BeforeAfterEach.browser.close();
        });


    });

});
