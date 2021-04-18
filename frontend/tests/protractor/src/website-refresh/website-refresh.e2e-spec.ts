import {BeforeAfterEach} from '../beforeAterEach';
import {startBackendServer} from '../backend-server';
import {getFixtureFiles} from '../../../fixtures/fixture-map';
import {openModuleAndPage} from '../open-page';
import {browser} from 'protractor';

describe('Website -> Refresh and Back button', () => {

    let page: any;
    let url:any;
    let nameBeforeRefresh:any;

    beforeAll(async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('website-refresh/website-refresh.json'));
        page = await BeforeAfterEach.beforeEach();
        await browser.waitForAngularEnabled(false);


    });

    it('Check page refresh click', async () => {

        // Opening Page
        await openModuleAndPage('Job Details', 'View Profile');
        url=browser.getCurrentUrl();
        nameBeforeRefresh = await page.$x('//input[1]');
        browser.waitForAngular();
        browser.navigate().refresh();
        expect(browser.getCurrentUrl()).toBe(url);
        const nameAfterRefresh=await page.$x('//input[1]');
        expect(nameBeforeRefresh.value).toBe(nameAfterRefresh.value); // checking whether the component values are same

        });

    it('Check back button click', async () => {

        await openModuleAndPage('Student', 'Update Profile');
        browser.waitForAngular();
        browser.navigate().back();
        expect(browser.getCurrentUrl()).toBe(url);
        const name = await page.$x('//input[1]');
        expect(nameBeforeRefresh.value).toBe(name.value); // checking whether the component values are correct

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });
});
