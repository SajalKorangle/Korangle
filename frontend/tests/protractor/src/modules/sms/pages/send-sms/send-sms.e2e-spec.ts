import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsAll, containsFirst} from '../../../../contains';



describe('SMS -> Send SMS', () => {

    let page: any;

    afterEach( async () => {
        await BeforeAfterEach.afterEach();
    });


    it('Send SMS', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/sms/pages/send-sms/send-sms.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('SMS', 'Send SMS');

        //Show student list
        (await containsFirst('button', 'Show')).click();

        // Type the student name
        await BeforeAfterEach.page.waitForXPath('//input[@testId="nameFilter"]');
        const [inputElement] = await BeforeAfterEach.page.$x('//input[@testId="nameFilter"]');
        await inputElement.type('san');

        await containsFirst('div', 'Total Students: 20');
        await containsFirst('div', 'Displaying: 2');

    });

    it('Verify Purchase SMS button', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/sms/pages/send-sms/send-sms.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('SMS', 'Send SMS');

        // Type the message
        (await containsFirst('textarea', '')).type('Avinash');
        await page.waitForTimeout(1000);

        //Show the student List
        const showButtons = (await containsAll('button', 'Show'));
        (await showButtons[2]).click();

        await page.waitForTimeout(1000);

        (await containsFirst('button', 'Select All')).click();
        await page.waitForTimeout(1000);

        //Start the purchase
        (await containsFirst('button', 'Purchase SMS')).click();
        await page.waitForTimeout(1000);

        const rangeSlider = await BeforeAfterEach.page.waitForXPath('//input[@testId="slider"]');

        const bounding_box = await rangeSlider.boundingBox();

        await page.mouse.move(bounding_box.x + bounding_box.width / 3, bounding_box.y + bounding_box.height / 2);
        await page.mouse.down();
        await page.mouse.move(bounding_box.x + bounding_box.width / 3, bounding_box.y + bounding_box.height / 2);
        await page.mouse.up();

        await page.waitForTimeout(3000);

        (await containsFirst('button', 'Pay')).click();
        await page.waitForTimeout(3000);






    });
});
