import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import { containsAll, containsFirst } from '../../../../contains';



describe('Examination -> Create Test', () => {

    let page: any;
    
    beforeAll(async () => {

        startBackendServer(getFixtureFiles('modules/examination/pages/create-test/create-test.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Examination', 'Create Test');

        //Select Exam-type and class Section
        await page.waitForSelector('#selectExam');
        await page.click('#selectExam');
        await page.click('mat-option[ng-reflect-value="1"]');

        await page.waitForSelector('#selectClassSection');
        await page.click('#selectClassSection');
        await page.click('mat-option[ng-reflect-value="1"]');
        

        (await containsFirst('button', 'GET')).click();
        (await containsFirst('button', 'GET')).click();

        await page.waitForTimeout(1000);
    });


    it('Verify fetched test list', async () => {

        await page.waitForXPath('//td[@testId="count"]');
        const list = await page.$x('//td[@testId="count"]');
        expect(list.length).toBe(5);
    });


    it('Delete a Test and verify', async () => {
        
        (await containsFirst('button', 'DEL')).click();

        await page.waitForTimeout(1000);

        (await containsFirst('button', 'Update')).click();

        await page.waitForTimeout(3000);

        await page.waitForXPath('//td[@testId="count"]');
        const list = await page.$x('//td[@testId="count"]');
        expect(list.length).toBe(4);
        
    });

    it('Add a Test and verify', async () => {    
        
        await page.waitForSelector('#selectSubject');
        await page.click('#selectSubject');
        await page.click('mat-option[ng-reflect-value="3"]');

        await page.waitForSelector('#selectTestType');
        await page.click('#selectTestType');
        await page.click('mat-option[ng-reflect-value="Oral"]');

        (await containsFirst('button', 'ADD')).click();

        await page.waitForTimeout(1000);

        (await containsFirst('button', 'Update')).click();

        await page.waitForTimeout(3000);

        await page.waitForXPath('//td[@testId="count"]');
        const newlist = await page.$x('//td[@testId="count"]');
        expect(newlist.length).toBe(5);
        



    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    })

    
});
