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
        node = await containsFirst('input', '');
        await node.type('1');
        node = await containsFirst('button', 'Get');
        await node.click();

        // Checking Mat Card ( Fee receipts ) Count
        nodes = await containsAll('mat-card', '');  //count check
        expect(nodes.length).toBe(1);


        // Clicking Cancel Button to show modal
        node = await containsFirst('button', 'Cancel');
        await node.click();

        // Typing the Cancel remark and clicking cancel in modal
        await page.waitForXPath('//mat-dialog-container//following::textarea[1]');
        node = await containsFirst('mat-dialog-container//following::textarea[1]', '');
        await node.type('Invalid Receipt 1');
        node = await containsFirst('mat-dialog-container//following::button[2]', '');  // click show subject filter button
        await node.click();

        // Checking the cancelled text exists in the mat card
        nodes = await containsAll('span', 'This fee receipt is cancelled');  //count check
        expect(nodes.length).toBe(1);

        // Typing Cheque no.
        node = await containsFirst("input", '');
        await page.evaluate(el => el.value = '12345', node);
        node = await containsFirst('button', 'Get');
        await node.click();

        // Checking Mat Card ( Fee receipts ) Count
        nodes = await containsAll('mat-card', '');  //count check
        expect(nodes.length).toBe(1);

    });

    it('Cancel Fee Receipt: Search using Student Name', async () => {
        let nodes, node;

        // Selecting search using Student Name
        node = await containsFirst('mat-select', '');
        await node.click();

        node = await containsFirst('mat-option', 'Student');
        await node.click();

        // Entering the student name and selecting a student
        node = await containsFirst('input', '');
        await node.type('Falak');
        node = await containsFirst('span', 'FALAK KHAN');
        await node.click();

        // Checking mat card ( Fee receipts ) is 2 for this student
        await page.waitForXPath('//mat-card[2]');
        nodes = await containsAll('mat-card', '');  //count check
        expect(nodes.length).toBe(2);

        // Clicking Cancel Button to show modal
        node = await containsFirst('button', 'Cancel');
        await node.click();

        // Typing the Cancel remark and clicking cancel in modal
        node = await containsFirst('mat-dialog-container//following::textarea[1]', '');
        await node.type('Invalid Receipt 2');

        node = await containsFirst('mat-dialog-container//following::button[2]', 'Cancel');
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
        nodes = await containsFirst('mat-option', 'Parent');
        await nodes.click();


        // Entering the Parent Number and selecting the parent

        node = await containsFirst('input', '');
        await node.type('961715942');
        node = await containsFirst('span', ' 9617159429, VIJAY PARCHHE');
        await node.click();

        // Checking mat card is only one
        nodes = await containsAll('mat-card', '');  //count check
        expect(nodes.length).toBe(1);

        // Clicking Cancel Button to show modal
        node = await containsFirst('button', 'Cancel');
        await node.click();

        // Typing the Cancel remark and clicking cancel in modal
        node = await containsFirst('mat-dialog-container//following::textarea[1]', '');
        await node.type('Invalid Receipt 3');

         node = await containsFirst('mat-dialog-container//following::button[2]', 'Cancel');  // click show subject filter button
         await node.click();

        // Checking the cancelled text exists in the mat cards
        nodes = await containsAll('span', 'This fee receipt is cancelled');  //count check
        expect(nodes.length).toBe(1);

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });
});
