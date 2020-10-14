import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage, reClickPage} from '../../../../open-page';
import {contains} from '../../../../contains';

describe('Attendance -> Record Employee Attendance', () => {

    let page: any;

    it('Recording Employee Attendance', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/attendance/pages/record-employee-attendance/record-employee-attendance.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Attendance', 'Record Empl. Attend.');

        // Getting Employee Attendance Data (Data should be empty since no attendance is taken till now)
        await (await contains('button', 'Get')).click();

        // Marking attendance for odd employees to Present and even employees to Absent
        for (let i = 0; i < 6; ++i) {
            const button = await contains('button', ' N ');
            if (i % 2 === 0) { await button.click(); }
            await button.click();
        }

        // Checking the confirmation message by registering dialog callback
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Employee Attendance recorded successfully');
            await dialog.dismiss();
        });

        // Updating the attendance
        await (await contains('button', 'Update')).click();

        // Re clicking the page to open it with a fresh start
        await reClickPage('Record Empl. Attend.');

        // Getting Employee Attendance Data (Data should be filled since attendance is taken just above)
        await (await contains('button', 'Get')).click();

        // Waiting for data to show
        await page.waitForXPath('//button[contains(text(), " P ")]');

        // Confirming the number of present attendance
        const presentAttendance = await page.$x('//button[contains(., " P ")]');
        expect(presentAttendance.length).toBe(3);

        // Confirming the number of absent attendance
        const absentAttendance  = await page.$x('//button[contains(., " A ")]');
        expect(absentAttendance.length).toBe(3);

    });

});
