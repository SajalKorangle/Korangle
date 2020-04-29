import {BeforeAfterEach} from '../../beforeAterEach';

describe('workspace-project App', () => {

    let page: any;

    beforeEach( async () => {
        page = await BeforeAfterEach.beforeEach();

        /*page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.dismiss();
        });*/

    });

    it('Add Student Page', async () => {
        await page.click('#students');
        await page.screenshot({ path: 'add-student.png' });
        await page.click('#students-add_student');
        await page.waitForSelector('input[name="name"]');
        await page.type('input[name="name"]', 'Sanjay Rathore'); // Types instantly
        await page.type('input[name="fatherName"]', 'Shiva Rathore');
        await page.click('#selectClass');
        await page.click('mat-option[ng-reflect-value="7"]');
        await page.click('#selectSection');
        await page.click('#section-button-3');
        await page.screenshot({ path: 'add-student.png' });
        await page.click('#action-add-student');
        await page.click('#students-view_all');
    });

    afterEach(async () => {
        await BeforeAfterEach.afterEach();
    })

});
