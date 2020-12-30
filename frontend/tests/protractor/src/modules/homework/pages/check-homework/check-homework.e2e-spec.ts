import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage, reClickPage} from '../../../../open-page';
import {containsFirst} from '../../../../contains';

describe('Homework -> Check Homework', () => {

    let page: any;

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });

    it('Checking Homework', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/homework/pages/check-homework/check-homework.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Homework', 'Check Homework');

        await BeforeAfterEach.page.waitForXPath('//a[contains(., "' + 'First Homework' + '")]');
        const [button] = await BeforeAfterEach.page.$x('//a[contains(., "' + 'First Homework' + '")]');
        await button.click();

        // for (let i = 0; i < 10; ++i) {
        //     const button = await containsFirst('button', ' G ');
        //     if (i % 2 === 0) { await button.click(); }
        //     await button.click();
        // }

        // await reClickPage('Check Homework');

        // await BeforeAfterEach.page.waitForXPath('//a[contains(., "' + 'First Homework' + '")]');
        // const [button1] = await BeforeAfterEach.page.$x('//a[contains(., "' + 'First Homework' + '")]');
        // await button1.click();


        // // Waiting for data to show
        // await page.waitForXPath('//button[contains(text(), " S ")]');

        // const submittedHomework = await page.$x('//button[contains(., " S ")]');
        // expect(submittedHomework.length).toBe(5);

        // const checkedHomework  = await page.$x('//button[contains(., " C ")]');
        // expect(checkedHomework.length).toBe(5);

    });


});
