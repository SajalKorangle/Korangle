import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import { containsAll } from '../../../../contains';

describe('Students -> Add Student', () => {

    let page: any;

    it('Add student', async () => {

        startBackendServer(getFixtureFiles('modules/students/pages/add-student/add-student.json'));

        page = await BeforeAfterEach.beforeEach();
        page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.dismiss();
        });

        let node;
        let nodes;

        // Opening Page
        await openModuleAndPage('Students', 'Add Student');

        await page.waitForSelector('input[name="name"]');
        await page.type('input[name="name"]', 'Sanjay Rathore'); // Types instantly
        await page.type('input[name="fatherName"]', 'Shiva Rathore');
        await page.click('#selectClass');
        await page.click('mat-option[ng-reflect-value="7"]');
        await page.click('#selectSection');
        await page.waitForTimeout(500);
        await page.waitForSelector('#section-button-6');
        await page.click('#section-button-6');
        await page.waitForTimeout(500);
        nodes = await containsAll('input', '');
        await nodes[3].type('1234567890');
        await page.waitForTimeout(500);
        await nodes[nodes.length - 3].type('HouseWife');
        await page.waitForTimeout(500);
        nodes = await containsAll('mat-select', '');
        await nodes[nodes.length - 1].click();
        node = await containsAll('mat-option', '');
        await node[1].click();
        await page.waitForTimeout(500);
        await page.click('#action-add-student');
        await page.click('#students-view_all');
        await page.waitForSelector('#select-class');
        await page.click('#select-class');
        await page.waitForTimeout(500);
        await page.waitForSelector('#select-all-classes');
        await page.click('#select-all-classes');
        await BeforeAfterEach.afterEach();
    });

});
