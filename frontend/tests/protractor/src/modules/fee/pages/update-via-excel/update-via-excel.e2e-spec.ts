import { BeforeAfterEach } from '../../../../beforeAterEach';
import { startBackendServer } from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import { openModuleAndPage } from '../../../../open-page';
import { containsFirst, containsAll, getNode, getNodes } from '../../../../contains';


describe('Fees 3.0 -> Upload Excel', () => {

    let page: any;

    let successDialog = async dialog => {
        expect(dialog.message()).toBe('Data Upload Successful');
        await dialog.dismiss();
    };

    let failureDialog = async dialog => {
        expect(dialog.message()).toBe('No Fee Data To Upload');
        await dialog.dismiss();
    };

    let noDialog = async dialog => {
        expect(true).toBe(false);
        await dialog.dismiss();
    };

    beforeAll(async () => {

        await startBackendServer(getFixtureFiles('modules/fee/pages/update-via-excel/update-via-excel.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening and waiting for page load
        await openModuleAndPage('Fees 3.0', 'Upload Excel');
        await page.waitForXPath('//button[contains(., "Download Template")]');  // waiting for page load after spinner
    });

    describe('set1: Sheet Download', () => {

        it('Upload Excel: Downloaded Button Check', async () => {
            let node = await getNode('button', 'Download Template');
            expect(node).not.toBeUndefined();
        });
    });

    describe('set2: Same Sheet Upload', () => {
        beforeAll(async () => {
            page.on('dialog', failureDialog);

            await page.waitForXPath('//button[contains(., "Download Template")]');
        });

        it('Unchanged Sheet Data Upload', async () => {
            let node;
            [node] = await page.$x('//input[@type="file"]');
            await node.uploadFile('tests/fixtures/modules/fee/pages/update-via-excel/SheetBlank.xlsx');
            await page.waitForTimeout(500);
            await page.waitForXPath('//button[contains(., "Download Template")]');
            await page.waitForTimeout(500);

            //Clicking download button and waiting for the action to finish
            node = await containsFirst('button', 'Upload Data');
            node.click();
            await page.waitForTimeout(500);
            await page.waitForXPath('//button[contains(., "Download Template")]');
        });

        afterAll(async () => {
            page.removeListener('dialog', failureDialog);
        });
    });

    describe('set3: Error Sheet', () => {
        beforeAll(async () => {
            page.on('dialog', noDialog);

            await page.waitForXPath('//button[contains(., "Download Template")]');

            const [node] = await page.$x('//input[@type="file"]');    // file input
            await node.uploadFile('tests/fixtures/modules/fee/pages/update-via-excel/SheetError.xlsx');
            await page.waitForTimeout(500);
            await page.waitForXPath('//button[contains(., "Download Template")]');  // waiting for sinner to disappear
            await page.waitForTimeout(500);
        });

        it('Cell Error/Warning test', async () => {
            let node, nodes;

            let isWarning = await page.$eval('tbody tr:nth-child(25) td:nth-child(7)', element => isWarning = element.classList.contains("bgWarning"));
            expect(isWarning).toBe(true);

            node = await containsFirst('button', 'Errors');
            node.click();

            nodes = await containsAll('tr', '');    //  table rows
            expect(nodes.length).toBe(9);
        });

        afterAll(async () => {
            page.removeListener('dialog', noDialog);
        });
    });


    describe('set4: Sheet Upload', () => {
        beforeAll(async () => {
            page.on('dialog', successDialog);

            let node;
            [node] = await page.$x('//input[@type="file"]');    // file input
            await node.uploadFile('tests/fixtures/modules/fee/pages/update-via-excel/Sheet.xlsx');
            await page.waitForTimeout(500);
            await page.waitForXPath('//button[contains(., "Download Template")]');  // waiting for spinner to disappear
            await page.waitForTimeout(5000);
        });

        it('Row-column Count', async () => {
            let node, nodes;
            nodes = await containsAll('tr', '');    //  table rows
            expect(nodes.length).toBe(69);

            [node] = nodes;
            nodes = await node.$x('//th');  // table columns
            expect(nodes.length).toBe(9);
        });

        it('Sheet data test ', async () => {
            let nodes, row, node;
            let count50 = 0, count20 = 0, count100 = 0;

            nodes = await containsAll('tr', '');
            nodes = nodes.slice(1);

            for (let i = 0; i < nodes.length; i += 1) {  // counting cells that contains 20, 50 and 100
                row = nodes[i];
                let cells;

                cells = await row.$x('.//td[position()>6 and contains(., "100")]');
                count100 += cells.length;

                cells = await row.$x('.//td[position()>6 and contains(., "50")]');
                count50 += cells.length;

                cells = await row.$x('.//td[position()>6 and contains(., "20")]');
                count20 += cells.length;
            }

            expect(count100).toBe(26);  // checking counts
            expect(count50).toBe(21);
            expect(count20).toBe(22);

            //edge cases
            [node] = await nodes[0].$x('.//td[position()>6 and contains(., "50")]');
            expect(node).toBeUndefined();
            [node] = await nodes[1].$x('.//td[position()>6 and contains(., "50")]');
            expect(node).not.toBeUndefined();

            [node] = await nodes[1].$x('.//td[position()>6 and contains(., "20")]');
            expect(node).toBeUndefined();
            [node] = await nodes[2].$x('.//td[position()>6 and contains(., "20")]');
            expect(node).not.toBeUndefined();

            [node] = await nodes[0].$x('.//td[position()>6 and contains(., "100")]');
            expect(node).not.toBeUndefined();
        });

        afterAll(async () => {
            let node;

            //Clicking download button and waiting for the spinner to disappear
            node = await containsFirst('button', 'Upload Data');
            node.click();
            await page.waitForTimeout(500);
            await page.waitForXPath('//button[contains(., "Download Template")]');  // waiting for page load after spinner

        });

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });
});
