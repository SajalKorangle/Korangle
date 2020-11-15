import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst} from '../../../../contains';



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
});
