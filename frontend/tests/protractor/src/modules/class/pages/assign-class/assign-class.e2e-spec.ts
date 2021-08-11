import { BeforeAfterEach } from '../../../../beforeAterEach';
import { startBackendServer } from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import { openModuleAndPage, reClickPage } from '../../../../open-page';
import { containsFirst, containsAll } from '../../../../contains';

describe('Class -> Assign Class', () => {

    let page: any;

    afterEach(async () => {
        await BeforeAfterEach.afterEach();
    });

    it('Assign Class', async () => {

        // Start Backend Server
        await startBackendServer(getFixtureFiles('modules/class/pages/assign-class/assign-class.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Class', 'Assign Class');

        // Type the employee name
        (await containsFirst('input', '')).type('Rohi');

        // Select the employee
        (await containsFirst('span', 'Rohit Agrawal')).click();

        // Checking the confirmation message by registering dialog callback
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Permission given successfully');
            await dialog.dismiss();
        });

        // Select Class
        (await containsFirst('span', 'Class - 12')).click();
        (await containsFirst('span', 'Class - 11')).click();
        (await containsFirst('button', 'Add')).click();

        // Opening Page
        await openModuleAndPage('Attendance', 'Record Stud. Attend.');

        // Select Class - 11 & Get Student Attendance List data (it should be empty)
        (await containsFirst('option', 'Class - 11')).click();
        (await containsFirst('button', 'Get')).click();

        // Check the number of students to be 4
        expect((await containsAll('button', ' N ')).length).toBe(4);

    });

});
