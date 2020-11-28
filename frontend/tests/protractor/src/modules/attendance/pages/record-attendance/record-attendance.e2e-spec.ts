import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage, reClickPage} from '../../../../open-page';
import {containsFirst} from '../../../../contains';

describe('Attendance -> Record Student Attendance', () => {

    let page: any;

    afterEach( async () => {
        await BeforeAfterEach.afterEach();
    });

    it('Recording Attendance', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/attendance/pages/record-attendance/record-attendance.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Attendance', 'Record Stud. Attend.');

        // Getting Student Attendance Data (Data should be empty since no attendance is taken till now)
        await (await containsFirst('button', 'Get')).click();

        // Marking attendance for odd students to Present and even students to Absent
        for (let i = 0; i < 5; ++i) {
            const button = await containsFirst('button', ' N ');
            if (i % 2 === 0) { await button.click(); }
            await button.click();
        }

        // Checking the confirmation message by registering dialog callback
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Student Attendance recorded successfully');
            await dialog.dismiss();
        });

        // Updating the attendance
        await (await containsFirst('button', 'Update')).click();

        // Re clicking the page to open it with a fresh start
        await reClickPage('Record Stud. Attend.');

        // Getting Student Attendance Data (Data should be filled since attendance is taken just above)
        await (await containsFirst('button', 'Get')).click();

        // Waiting for data to show
        await page.waitForXPath('//button[contains(text(), " P ")]');

        // Confirming the number of present attendance
        const presentAttendance = await page.$x('//button[contains(., " P ")]');
        expect(presentAttendance.length).toBe(2);

        // Confirming the number of absent attendance
        const absentAttendance  = await page.$x('//button[contains(., " A ")]');
        expect(absentAttendance.length).toBe(3);

    });

});
