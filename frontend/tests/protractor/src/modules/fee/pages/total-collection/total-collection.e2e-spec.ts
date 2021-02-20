import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst, containsAll, getNode, getNodes} from '../../../../contains';

describe('Fees 3.0 -> Total Collection', () => {

    let page: any;

    beforeAll(async () => {
        startBackendServer(getFixtureFiles('modules/fee/pages/total-collection/total-collection.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Fees 3.0', 'Total Collection');
        await page.waitForTimeout(1000);
        // clicking on datepicker icon

        const datePicker = await containsFirst('mat-datepicker-toggle','');
        await datePicker.click();
        
        // clicking on the particular date
        await page.waitForXPath('//*[@id="mat-datepicker-0"]/mat-calendar-header/div/div/button[1]');
        let [date] = await page.$x('//*[@id="mat-datepicker-0"]/mat-calendar-header/div/div/button[1]');
        await date.click();
      
        await page.waitForXPath('//*[@id="mat-datepicker-0"]/div/mat-multi-year-view/table/tbody/tr[2]/td[2]/div');
        [date] = await page.$x('//*[@id="mat-datepicker-0"]/div/mat-multi-year-view/table/tbody/tr[2]/td[2]/div');
        await date.click();
       
        await page.waitForXPath('//*[@id="mat-datepicker-0"]/div/mat-year-view/table/tbody/tr[2]/td[1]/div');
        [date] = await page.$x('//*[@id="mat-datepicker-0"]/div/mat-year-view/table/tbody/tr[2]/td[1]/div');
        await date.click();

        await page.waitForXPath('//*[@id="mat-datepicker-0"]/div/mat-month-view/table/tbody/tr[1]/td[2]/div');
        [date] = await page.$x('//*[@id="mat-datepicker-0"]/div/mat-month-view/table/tbody/tr[1]/td[2]/div');
        await date.click();

        // clicking on search button
        await page.waitForSelector('button[type="button"]');
        const [search] = await page.$x('//button[@class=\'btn btn-warning\']');
        await search.click();
        await page.waitForTimeout(1000);

    });

    it('Total Collection: Receipt`s Row and Column Count', async () => {
        let nodes;

        // checking the default type is valid
        nodes = await containsAll('mat-select', 'Valid Receipts');
        expect(nodes.length).toBe(1);
        // Checking the number of rows to be equals to 4 -> 3 Receipts, 1 header row
        // 1 extra receipt is cancelled so it wont be shown as default receipt type is valid receipts
        nodes = await containsAll('tr', '');  //count check
        expect(nodes.length).toBe(4);
        // Checking the number of cols to be equals to 7 -> Initially there are 7 cols
        nodes = await containsAll('th', '');  //count check
        expect(nodes.length).toBe(7);
    });

    it('Total Collection: Fee receipt Type Toggle', async () => {
        let nodes,node;

        nodes = await containsFirst('mat-select', 'Valid Receipts');
        await nodes.click();
        await page.waitForXPath('//mat-option');
         node = await containsFirst('mat-option[2]','');
        await node.click();

        // Checking the number of rows to be equals to 2 -> 1 CANCELLED Receipts, 1 header row
        nodes = await containsAll('tr', '');  //count check
        expect(nodes.length).toBe(2);

        // Checking the number of cols to be equals to 8 -> cancelled remark and cancelled by gets added automatically then there are 8 cols
        nodes = await containsAll('th', '');  //count check
        expect(nodes.length).toBe(9);

        nodes = await containsFirst('mat-select', 'Cancelled Receipts');
        await nodes.click();
        node = await containsFirst('mat-option[3]','');
        await node.click();
        await page.waitForXPath('//mat-select//following::mat-select[4]');
        // Checking the number of rows to be equals to 5 -> All 4 Receipts, 1 header row
        nodes = await containsAll('tr', '');  //count check
        expect(nodes.length).toBe(5);
        // Checking the number of cols to be equals to 7 -> Default 7 cols
        nodes = await containsAll('th', '');  //count check
        expect(nodes.length).toBe(7);

        // again selecting only valid receipts
        node = await  containsFirst('mat-select//following::mat-select[4]','');
        await node.click();
        //await page.waitForXPath('//mat-option');
        node = await containsFirst('mat-option[1]','Valid Receipts');
        await node.click();

    });

    it('Total Collection: Cancel Receipt', async () => {
        let nodes, node;

        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Fee Receipt is cancelled');
            await dialog.dismiss();
        });

        node = await containsFirst('a','Cancel Receipt');
        await node.click();

        //wait for modal to load
        node = await containsFirst('mat-dialog-container//following::textarea[1]','');
        await node.type('Invalid Receipt');
        node = await containsFirst('button', 'Cancel Receipt');
        await node.click();
        await page.waitForTimeout(1000);
        nodes = await containsAll('tr', '');  //count check again 1 should be cancelled from 4 list
        expect(nodes.length).toBe(3);

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    })
});
