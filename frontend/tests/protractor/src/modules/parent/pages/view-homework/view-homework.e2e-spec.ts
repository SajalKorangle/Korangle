import { BeforeAfterEach } from '../../../../beforeAterEach';
import { startBackendServer } from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import { openModuleAndPage } from '../../../../open-page';
import { containsFirst } from '../../../../contains';


describe('Parents -> View Homework', () => {

    let page: any;
    let node, prop;

    beforeAll(async () => {

        await startBackendServer(getFixtureFiles('modules/parent/pages/view-homework/view-homework.json'));
        page = await BeforeAfterEach.beforeEach();
        await page.select('select[ng-reflect-model="Employee"]', 'Parent');
        await openModuleAndPage('Homework', '');

    });

    it('View Homework : View And Submit Homework', async () => {
        await (await containsFirst('mat-panel-title', 'First Homework')).click();

        await (await containsFirst('button', 'Submit Answer')).click();

        await page.waitForXPath('//textarea');
        let nodes = await containsFirst('textarea', '');
        await nodes.type('Answer for the first homework');


        page.on('dialog', async dialogs => {
            page.on('dialog', async dialog => {
                await dialog.accept();
            });
            await dialogs.accept();

        });



        await (await containsFirst('button', 'Submit Answer')).click();


        await page.select('select[ng-reflect-model="Parent"]', 'Employee');
        await openModuleAndPage('Homework', 'Check Homework');


        await BeforeAfterEach.page.waitForXPath('//a[@testId="homeworkCount"]');
        const [listElement] = await BeforeAfterEach.page.$x('//a[@testId="homeworkCount"]');
        await listElement.click();

        await page.waitForXPath('//button[contains(text(), " S ")]');

        const submittedHomework = await page.$x('//button[contains(., " S ")]');
        expect(submittedHomework.length).toBe(1);

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });

});
