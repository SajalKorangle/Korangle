import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst} from '../../../../contains';
import {By, element} from 'protractor';



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

        //Confirming the total number no of students
        var el = element(By.binding('studentSectionList.length'));
        expect(el.getText()).toBe('122');
       


    });
});