import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage, reClickPage} from '../../../../open-page';
import {containsFirst, containsAll, getNodes} from '../../../../contains';

describe('Homework -> Settings', () => {

    let page: any;

    afterEach( async () => {
        await BeforeAfterEach.afterEach();
    });

    it('Changing Settings', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/homework/pages/settings/settings.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Homework', 'Settings');

        await page.waitForXPath('//mat-select');
        let nodes = await containsFirst('mat-select', 'NULL');
        await nodes.click();


        await page.waitForXPath('//mat-option');
        nodes = await getNodes('mat-option', '');
        const [option] = await page.$x('//mat-option[2]');
        await option.click();

        await page.waitForXPath('//mat-checkbox');
        nodes = await getNodes('mat-checkbox', '');
        const [checkbox] = await page.$x('//mat-checkbox[1]');
        await checkbox.click();


        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Settings Updated');
            await dialog.dismiss();
        });

        await (await containsFirst('button', 'Update')).click();

        await reClickPage('Settings');


        await page.waitForXPath('//mat-select');
        let select = await containsAll('mat-select', 'SMS');
        expect(select.length).toBe(1);

        await page.waitForXPath('//mat-checkbox');
        nodes = await getNodes('mat-checkbox', '');
        const [checkbox1] = await page.$x('//mat-checkbox[1]');
        expect(checkbox1).toBeTruthy();

    });
});
