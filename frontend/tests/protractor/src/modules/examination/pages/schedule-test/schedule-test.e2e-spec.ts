import { BeforeAfterEach } from '../../../../beforeAterEach';
import { startBackendServer } from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import { openModuleAndPage } from '../../../../open-page';
import { containsFirst } from '../../../../contains';
import { Keys } from '@swimlane/ngx-datatable/release/utils';



describe('Examination -> Schedule Test', () => {

    let page: any;

    beforeAll(async () => {

        await startBackendServer(getFixtureFiles('modules/examination/pages/schedule-test/schedule-test.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Examination', 'Schedule Test');

        //Select Exam-type and class Section
        await page.waitForSelector('#selectExam');
        await page.click('#selectExam');
        await page.click('mat-option[ng-reflect-value="1"]');

        await page.waitForSelector('#selectClassSection');
        await page.click('#selectClassSection');
        //i have to select the first option from mat-option please suggest a way to do so
        await page.click('#selectClassSection');
        //Check if this line works or not
        // const option = (await containsFirst('mat-option', 'Class-3, Section-A'));
        // await option.click({ clickCount: 2 })

        (await containsFirst('button', 'GET')).click();
        (await containsFirst('button', 'GET')).click();
    });


    it('Verify fetched test list', async () => {

        await page.waitForXPath('//td[@testId="count"]');
        const list = await page.$x('//td[@testId="count"]');
        expect(list.length).toBe(5);
    });


    it('Schedule a Test and update', async () => {

        const Date = await page.$('input');
        await page.waitForXPath('//input[@testId="startTime"]');
        const startTime = await page.$x('//input[@testId="startTime"]');


        await Date.click({ clickCount: 3 });
        await Date.type('10/10/2018');
        await Date.press('Enter');

        await startTime[0].type('1030');
        await startTime[0].press('Enter');


        (await containsFirst('button', 'Update')).click();
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Updated Test list!!!');
            await dialog.dismiss();
        });

        await page.waitForTimeout(3000);


    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });


});
