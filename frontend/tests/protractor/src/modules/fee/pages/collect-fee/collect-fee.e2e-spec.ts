import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst, containsAll, getNode, getNodes} from '../../../../contains';

describe('Fees 3.0 -> Collect Fee', () => {

    let page: any;

    beforeAll(async () => {
        startBackendServer(getFixtureFiles('modules/fee/pages/collect-fee/collect-fee.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Fees 3.0', 'Collect Fee');
        await page.waitForTimeout(1000);
        // clicking on datepicker icon
        await page.waitForXPath('//input');
        const [input] = await page.$x('//input');
        await input.type('Falak');
        let node = await getNode('span', 'FALAK KHAN');
        await node.click();
        await page.waitForTimeout(1000);

    });

    it('Collect Fee: Check Generate Receipt Button Disabling Properly', async () => {
        let nodes,node;

        await page.waitForXPath('//button[contains(.,\'Generate\')]');
        [node] = await page.$x('//button[contains(.,\'Generate\')]');
        let isDisabled = await page.evaluate(el => el.disabled, node);
        expect(isDisabled).toBe(true);

        [node] = await page.$x('//input[@type=\'number\']');
        node.type('1000');
        [node] = await page.$x('//button[contains(.,\'Generate\')]');
        isDisabled = await page.evaluate(el => el.disabled, node);
        expect(isDisabled).toBe(false);

        // Selecting Mode of Payment as Cheque
        nodes = await containsFirst('mat-select', 'Cash');
        nodes.click();
        await page.waitForXPath('//mat-option');
        [node] = await page.$x('//mat-option[2]');
        await node.click();

        // Checking generate button is disabled if cheque no.is Empty
        [node] = await page.$x('//button[contains(.,\'Generate\')]');
        isDisabled = await page.evaluate(el => el.disabled, node);
        expect(isDisabled).toBe(true);

        // Entering a cheque no
        await page.waitForXPath('//label[contains(.,\'Cheque No\')]//following::input[1]');
         [node] = await page.$x('//label[contains(.,\'Cheque No\')]//following::input[1]');
        node.type('12345678');

        // Checking generate button
        [node] = await page.$x('//button[contains(.,\'Generate\')]');
        isDisabled = await page.evaluate(el => el.disabled, node);
        expect(isDisabled).toBe(false);

    });
    //
    it('Collect Fee: Generate Fee Receipt', async () => {

        let node;

         page.on('dialog', async dialog => {

            expect(dialog.message()).toBe('Fees submitted successfully');
            await dialog.dismiss();
        });

         // Generating a receipt
        [node] = await page.$x('//button[contains(.,\'Generate\')]');
        await node.click();

        await page.waitForTimeout(1000);
        await page.goBack(); // to go back from print popup box

        // checking the receipt is added in the receipts expansion panel
        await page.waitForXPath('//mat-expansion-panel//following::mat-expansion-panel');
        let nodes=await page.$x('//mat-expansion-panel//following::mat-expansion-panel//following::tr')
        expect(nodes.length).toBe(4); // 4 rows after generate button  -> 1 mat panel heading , 2 receipts ( 1 already in fixtures, 1 now created ) , 1 discount panel heading

    });


    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    })
});
