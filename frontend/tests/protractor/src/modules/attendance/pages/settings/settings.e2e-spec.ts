import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage, reClickPage} from '../../../../open-page';
import {containsAll, containsFirst} from '../../../../contains';

describe('Attendance -> Change Attendance Settings', () => {

    let page: any;

    afterEach( async () => {
        await BeforeAfterEach.afterEach();
    });

    it('Changing Settings', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/attendance/pages/settings/settings.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Attendance', 'Settings');

        // Change Settings
        await page.click('#sentUpdateType');
        await page.click('mat-option[ng-reflect-value="NOTIFICATION"]');
        
        await page.click('#sentUpdateToType');
        await page.click('mat-option[ng-reflect-value="Only Absent Students"]');
        
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Settings Updated Successfully');
            await dialog.dismiss();
        });

        // Update Settings
        await (await containsFirst('button', 'UPDATE')).click();

        // Refresh Page        
        await reClickPage('Settings');

        // Check Expected Settings
        expect((await containsAll('select', 'NOTIFICATION')).length).toBe(1);
        expect((await containsAll('select', 'Only Absent Students')).length).toBe(1);
        
    });

});
