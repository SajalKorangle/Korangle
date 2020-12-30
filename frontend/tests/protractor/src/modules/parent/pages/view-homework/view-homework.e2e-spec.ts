import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst} from '../../../../contains';


describe('Parents -> View Profile', () => {

    let page: any;
    let node,prop;

    beforeAll(async () => {

        startBackendServer(getFixtureFiles('modules/parent/pages/view-profile/view-profile.json'));
        page = await BeforeAfterEach.beforeEach();
        await page.select('select[ng-reflect-model="Employee"]','Parent'); 
        await openModuleAndPage('Profile','');

    });

    it('View Homework : View And Submit Homework', async () => {
        await (await containsFirst('mat-panel-title', 'First Homework')).click();

        await (await containsFirst('button', 'Submit Answer')).click();
        
        await BeforeAfterEach.page.waitForXPath('textarea[ng-model="toSubmitHomework.answerText"]');
        const [inputElement] = await BeforeAfterEach.page.$x('textarea[ng-model="toSubmitHomework.answerText"]');
        await inputElement.type('Answer for the first homework');
        
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Click OK to submit the current Answer');
            await dialog.accept();
        });

        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Homework Answer Recorded Successfully');
            await dialog.dismiss();
        });

        await (await containsFirst('button', 'Submit Answer')).click();

        await page.select('select[ng-reflect-model="Parent"]','Employee'); 
        await openModuleAndPage('Homework','Check Homework');


        await BeforeAfterEach.page.waitForXPath('//a[@testId="homeworkCount"]');
        const [listElement] = await BeforeAfterEach.page.$x('//a[@testId="homeworkCount"]');
        await listElement.click();

        const submittedHomework = await page.$x('//button[contains(., " S ")]');
        expect(submittedHomework.length).toBe(1);

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });

});
