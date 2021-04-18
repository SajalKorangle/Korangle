import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage, reClickPage} from '../../../../open-page';
import {getNodes, containsAll, containsFirst} from '../../../../contains';

describe('Attendance -> Change Attendance Settings', () => {

    let page: any;
    let nodes: any;
    afterEach( async () => {
        await BeforeAfterEach.afterEach();
    });

    it('Changing Settings', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/attendance/pages/settings/settings.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Attendance', 'Settings');


        await page.waitForXPath('//mat-select');


        expect((await containsAll('mat-select', 'NULL')).length).toBe(1);
        expect((await containsAll('mat-select', 'Only Absent Students')).length).toBe(1);

        nodes = await containsFirst('mat-select', 'NULL');
        await nodes.click();
        await page.waitForXPath('//mat-option');
        nodes = await containsFirst('mat-option', 'SMS');
        await nodes.click();


        nodes = await containsFirst('mat-select', 'Only Absent Students');
        await nodes.click();
        await page.waitForXPath('//mat-option');
        nodes = await containsFirst('mat-option', 'All Students');
        await nodes.click();

        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Settings Updated Successfully');
            await dialog.dismiss();
        });

        // Update Settings
        await (await containsFirst('button', 'Update')).click();

        // // Refresh Page
        await reClickPage('Settings');
        await page.waitForXPath('//mat-select');

        // // Check Expected Settings
        expect((await containsAll('mat-select', 'SMS')).length).toBe(1);
        expect((await containsAll('mat-select', 'All Students')).length).toBe(1);

    });

});
