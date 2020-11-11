import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsAll, containsFirst} from '../../../../contains';
import {browser, by, element} from 'protractor';



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

        //Show employee list
        //(await containsFirst('button', 'Show')).click();

      
        //Confirming the total number no of students

        // Type the student name
        await page.waitForSelector('input[name="keywords"]');
        await page.type('input[name="keywords"]', 'San'); // Types instantly

        // var el = element(by.id('totalStudent'));
        // browser.sleep(3000);
        // expect(await(el.getText())).toBe('3');
 
      //  (await containsFirst('span', 'Show')).click();
       // browser.sleep(5000);

        

        
        
       


    });
});