import {BeforeAfterEach} from '../../beforeAterEach';
import {by, element} from 'protractor';

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
        page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.dismiss();
        });;
        await page.click('#students');
        await page.click('#students-add_student');
        await page.waitForSelector('input[name="name"]');
        await page.type('input[name="name"]', 'Sanjay Rathore'); // Types instantly
        await page.type('input[name="fatherName"]', 'Shiva Rathore');
        await page.click('#selectClass');
        await page.click('mat-option[ng-reflect-value="7"]');
        await page.click('#selectSection');
        await page.waitForTimeout(500)
        await page.waitForSelector('#section-button-6')
        await page.click('#section-button-6');
        await page.type('input#mat-input-4', '1231231230')
        await page.click('#action-add-student');
        await page.click('#students-view_all');
        await page.waitForSelector('#select-class')
        await page.click('#select-class');
        await page.waitForTimeout(500);
        await page.waitForSelector('#select-all-classes')
        await page.click('#select-all-classes');
        // await page.waitForSelector('#student-value-SanjayRathore');
    });

    afterEach(async () => {
        await BeforeAfterEach.afterEach();
    })

});
