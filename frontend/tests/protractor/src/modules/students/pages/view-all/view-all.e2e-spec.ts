import { BeforeAfterEach } from '../../../../beforeAterEach';
import { startBackendServer } from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import { openModuleAndPage } from '../../../../open-page';
import { containsFirst } from '../../../../contains';

describe('View All', () => {

    let page: any;
    let columns;
    let rows;
    beforeAll(async () => {
        startBackendServer(getFixtureFiles('modules/students/pages/view-all/view-all.json'));
        page = await BeforeAfterEach.beforeEach();
        await openModuleAndPage('Students', 'View All');
    });
    describe('Pofile filter :', () => {
        it('View Parameters : All Columns', async () => {
            await page.waitForXPath('//mat-select[@id="select-profile-column"]');
            await page.click('mat-select[id="select-profile-column"]');
            await page.click('button[id="select-all-profile-columns"]');
            await page.waitForTimeout(500);
            columns = await page.$$('th[class="hidden"]');
            await expect(columns.length).toBe(0);
        });
        it('View Parameters : All Rows', async () => {
            await page.click('body');
            await page.click('mat-select[id="select-class"]');
            await page.click('button[id="select-all-classes"]');
            rows = await page.$$('tr');
            await expect(rows.length).toBe(21); //total 21 -> 20 students + 1 header
        });
        it('Download List', async () => {
            await page.click('button[id="download"]');
            await page.waitForTimeout(500);
        });
    });
    describe('Documents filter :', () => {
        let rows;
        let failureDialog = async dialog => {
            expect(dialog.message()).toBe('No documents are available for download.');
            await dialog.dismiss();
        };
        let successDialog = async dialog => {
            expect(dialog.message()).toBe("Your are about to download 40 files of size 5.484128 MB");
            await dialog.accept();
        };
        beforeAll(async () => {
            await page.click('mat-select[ng-reflect-model="Profile"]');
            await page.click('mat-option[value="Documents"]');
        });
        it('View Parameters : All rows', async () => {
            rows = await page.$$('tr');
            await expect(rows.length).toBe(21); // total 21-> 20 students + 1 header
        });
        it('View Parameters : Download with no document field selected', async () => {
            page.on('dialog', failureDialog);
            await page.click('mat-select[id="select-document-column"]');
            await page.click('button[id="unselect-all-document-columns"]');
            await page.click('body');
            await page.click('button[id="download"]');
            await page.waitForTimeout(500);
            page.removeListener('dialog', failureDialog);
        });
        it('View Parameters : Download with no student selected', async () => {
            page.on('dialog', failureDialog);
            await page.click('mat-select[id="select-document-column"]');
            await page.click('button[id="select-all-document-columns"]');
            await page.click('body');
            await (await containsFirst('button', 'Clear All')).click();
            await page.waitForTimeout(500);
            await page.click('button[id="download"]');
            await page.waitForTimeout(500);
            page.removeListener('dialog', failureDialog);

        });
        it('View Parameters : Download files', async () => {
            page.on('dialog', successDialog);
            await (await containsFirst('button', 'Select All')).click();
            await page.waitForTimeout(500);
            await page.click('button[id="download"]');
            await page.waitForTimeout(500);
            page.removeListener('dialog', successDialog);
            await page.waitForTimeout(500);
            await BeforeAfterEach.afterEach();
        });
    });

    // it ('Print List',async()=>{
    //     page.on('dialog', async dialog => {
    //         console.log("what");
    //         await dialog.dismiss();
    //     });
    //     await page.click('button[id="select-all-profile-columns"]');
    //     await page.waitForTimeout(500);
    //     await page.click('button[id="print-list"]');
    //     await page.click('button[id="print-list"]');
    //     await page.waitForTimeout(500);
    //     await page.containsFirst('button','Save');
    // });

});
