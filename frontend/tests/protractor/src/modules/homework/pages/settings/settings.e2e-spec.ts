import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage, reClickPage} from '../../../../open-page';
import {containsFirst, containsAll} from '../../../../contains';

describe('Homework -> Settings', () => {

    let page: any;

    afterEach( async () => {
        await BeforeAfterEach.afterEach();
    });

    it('Changing Settings', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/homework/pages/settings/settings.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Homework', 'Settings');

        await page.waitForSelector('select[ng-model="sentUpdateType"');
        await page.click('select[ng-model="sentUpdateType"');
        await page.click('mat-option[ng-reflect-value="SMS"]');

        
        await page.waitForSelector('checkbox[ng-model="sendCreateUpdate"]');
        await page.click('checkbox[ng-model="sendCreateUpdate"]');

        await page.waitForSelector('checkbox[ng-model="sendDeleteUpdate"]');
        await page.click('checkbox[ng-model="sendDeleteUpdate"]');
        
        
        await reClickPage('Settings');

        expect((await containsAll('select', 'SMS')).length).toBe(1);
        const checkbox1 = await page.$('checkbox[ng-model="sendCreateUpdate"]');
        expect(checkbox1.toBeTruthy());
        const checkbox2 = await page.$('checkbox[ng-model="sendEditUpdate"]');
        expect(checkbox2.toBeFalsy());
        const checkbox3 = await page.$('checkbox[ng-model="sendDeleteUpdate"]');
        expect(checkbox3.toBeTruthy());
        const checkbox4 = await page.$('checkbox[ng-model="sendCheckUpdate"]');
        expect(checkbox4.toBeFalsy());
        const checkbox5 = await page.$('checkbox[ng-model="sendResubmissionUpdate"]');
        expect(checkbox5.toBeFalsy());

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });

});
