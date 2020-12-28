import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage, reClickPage} from '../../../../open-page';
import {containsFirst} from '../../../../contains';

describe('Homework -> Issue Homework', () => {

    let page: any;

    afterEach( async () => {
        await BeforeAfterEach.afterEach();
    });

    it('Checking Homework', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/homework/pages/check-homework/check-homework.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Homework', 'Check Homework');
        
        await BeforeAfterEach.page.waitForXPath('//a[@testId="homeworkCount"]');
        const [listElement] = await BeforeAfterEach.page.$x('//a[@testId="homeworkCount"]');
        await listElement.click();

        for (let i = 0; i < 10; ++i) {
            const button = await containsFirst('button', ' G ');
            if (i % 2 === 0) { await button.click(); }
            await button.click();
        }

        await reClickPage('Check Homework');

        // Getting Student Attendance Data (Data should be filled since attendance is taken just above)
        await BeforeAfterEach.page.waitForXPath('//a[@testId="homeworkCount"]');
        const [listsElement] = await BeforeAfterEach.page.$x('//a[@testId="homeworkCount"]');
        await listsElement.click();

        // Waiting for data to show
        await page.waitForXPath('//button[contains(text(), " S ")]');

        // Confirming the number of present attendance
        const presentAttendance = await page.$x('//button[contains(., " S ")]');
        expect(presentAttendance.length).toBe(5);

        // Confirming the number of absent attendance
        const absentAttendance  = await page.$x('//button[contains(., " C ")]');
        expect(absentAttendance.length).toBe(5);

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });

});
