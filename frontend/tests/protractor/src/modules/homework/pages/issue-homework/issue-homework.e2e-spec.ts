import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage, reClickPage} from '../../../../open-page';
import {containsFirst} from '../../../../contains';

describe('Homework -> Issue Homework', () => {

    let page: any;

    it('Creating Homework', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/homework/pages/issue-homework/issue-homework.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Homework', 'Issue Homework');

        // Get Homework Create Template
        await (await containsFirst('button', 'GET')).click();

        await BeforeAfterEach.page.waitForXPath('//input[@testId="homeworkName"]');
        const [inputElement] = await BeforeAfterEach.page.$x('//input[@testId="homeworkName"]');
        await inputElement.type('Chapter 1, Ex 1');

        // Checking the confirmation message by registering dialog callback
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Homework has been successfully created');
            await dialog.dismiss();
        });

        //Creating the homework
        await (await containsFirst('button', 'CREATE')).click();

        //Verifying Created Homework in Check Homework Page
        await reClickPage('Check Homework');

        await page.waitForXPath('//a[@testId="homeworkCount"]');
        const list = await page.$x('//a[@testId="homeworkCount"]');
        expect(list.length).toBe(1);

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });

});
