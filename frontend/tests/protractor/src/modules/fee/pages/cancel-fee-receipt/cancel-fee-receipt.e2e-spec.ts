import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst, containsAll, getNode, getNodes} from '../../../../contains';

describe('Fees 3.0 -> Cancel Fee Receipt', () => {

    let page: any;

    beforeAll(async () => {
        startBackendServer(getFixtureFiles('modules/fee/pages/cancel-fee-receipt/cancel-fee-receipt.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Fees 3.0', 'Cancel Fee Receipt');
        await page.waitForTimeout(1000);

        // On all test cases we are going to cancel the receipt so it gives us alert
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Fee Receipt is cancelled');
            await dialog.dismiss();
        });

    });

    it('Cancel Fee Receipt: Search using Receipt no & Cheque No', async () => {
        let nodes, node;

        // Typing Receipt Number And click Get button
        await page.waitForXPath('//input');
        [node] = await page.$x('//input');
        await node.type('1');
        [node] = await page.$x('//button[contains(text(),\'Get\')]');
        await node.click();

        // Checking Mat Card ( Fee receipts ) Count
        nodes = await containsAll('mat-card', '');  //count check
        expect(nodes.length).toBe(1);


        // Clicking Cancel Button to show modal
        await page.waitForXPath('//button[contains(text(),\'Cancel\')]');
        node = await getNode('button', 'Cancel');
        await node.click();

        // Typing the Cancel remark and clicking cancel in modal
        await page.waitForXPath('//mat-dialog-container//following::textarea[1]');
        [node] = await page.$x('//mat-dialog-container//following::textarea[1]');
        await node.type('Invalid Receipt 1');
        [node] = await page.$x('//mat-dialog-container//following::button[2]');  // click show subject filter button
        await node.click();

        // Checking the cancelled text exists in the mat card
        nodes = await containsAll('span', 'This fee receipt is cancelled');  //count check
        expect(nodes.length).toBe(1);

        // Typing Cheque no.
        [node]=await page.$x("//input");
        await page.evaluate(el => el.value = '12345',node);
        [node] = await page.$x('//button[contains(text(),\'Get\')]');
        await node.click();

        // Checking Mat Card ( Fee receipts ) Count
        nodes = await containsAll('mat-card', '');  //count check
        expect(nodes.length).toBe(1);

    });

    it('Cancel Fee Receipt: Search using Student Name', async () => {
        let nodes, node;

        // Selecting search using Student Name
        nodes = await containsFirst('mat-select', '');
        await nodes.click();
        await page.waitForXPath('//mat-option');
        [node] = await page.$x('//mat-option[contains(.,\'Student\')]');
        await node.click();

        // Entering the student name and selecting a student
        await page.waitForXPath('//input');
        [node] = await page.$x('//input');
        await node.type('Falak');
        node = await containsFirst('span', 'FALAK KHAN');
        await node.click();

        // Checking mat card ( Fee receipts ) is 2 for this student
        await page.waitForXPath('//mat-card[2]');
        nodes = await containsAll('mat-card', '');  //count check
        expect(nodes.length).toBe(2);

        // Clicking Cancel Button to show modal
        await page.waitForXPath('//button[contains(text(),\'Cancel\')]');
        node = await getNode('button', 'Cancel');
        await node.click();

        // Typing the Cancel remark and clicking cancel in modal
        await page.waitForXPath('//mat-dialog-container//following::textarea[1]');
        [node] = await page.$x('//mat-dialog-container//following::textarea[1]');
        await node.type('Invalid Receipt 2');
        [node]= await page.$x('//mat-dialog-container//following::button[2]'); 
        await node.click();

        // Checking the cancelled text exists in the mat cards
        await page.waitForXPath('//strong[contains(.,\'Invalid Receipt 2\')]');
        nodes = await containsAll('span', 'This fee receipt is cancelled');  //count check
        expect(nodes.length).toBe(2);

    });

    it('Cancel Fee Receipt: Search using Parent Number', async () => {
        let nodes, node;

        // Selecting Parent's Number search
        nodes = await containsFirst('mat-select', '');
        await nodes.click();
        [node] = await page.$x('//mat-option[contains(.,\'Parent\')]')
        node.click();

        // Entering the Parent Number and selecting the parent
        await page.waitForXPath('//input');
        [node] = await page.$x('//input');
        await node.type('9617159429');
        node = await containsFirst('mat-option', 'VIJAY PARCHHE');
        await node.click();

        // Checking mat card is only one
        await page.waitForXPath('//mat-card');
        nodes = await containsAll('mat-card', '');  //count check
        expect(nodes.length).toBe(1);

        // Clicking Cancel Button to show modal
        await page.waitForXPath('//button[contains(.,\'Cancel\')]');
        node = await getNode('button', 'Cancel');
        await node.click();

        // Typing the Cancel remark and clicking cancel in modal
        await page.waitForXPath('//mat-dialog-container//following::textarea[1]');
         [node] = await page.$x('//mat-dialog-container//following::textarea[1]');
        await node.type('Invalid Receipt 3');

         await page.waitForXPath('//mat-dialog-container//following::button[2]');
         [node] = await page.$x('//mat-dialog-container//following::button[2]');  // click show subject filter button
         node.click();

        // Checking the cancelled text exists in the mat cards
        nodes = await containsAll('span', 'This fee receipt is cancelled');  //count check
        expect(nodes.length).toBe(1);

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    })
});
