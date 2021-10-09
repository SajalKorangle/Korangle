import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsAll, containsFirst} from '../../../../contains';


describe('SMS -> Manage SMS ID', () => {

    let page: any;

    beforeAll(async () => {
        startBackendServer(getFixtureFiles('modules/sms/pages/manage-sms-id/manage-sms-id.json'));

        page = await BeforeAfterEach.beforeEach();

        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        // Opening Page
        await openModuleAndPage('SMS', 'Manage SMS ID');
        await page.waitForTimeout(1000);
    });

    it('ADD SMS ID', async () => {
        let nodes, node;
        nodes = await containsAll('tr', '');
        expect(nodes.length).toBe(2);

        nodes = await containsAll('td', 'ACTIVATED');
        expect(nodes.length).toBe(1);

        node = await containsFirst('input', '');
        await node.type('Testing Entity Name');
        node = await containsFirst('input[1]//following::input[1]', '');
        await node.type('12345');
        node = await containsFirst('input[1]//following::input[2]', '');
        await node.type('TSTING');
        node = await containsFirst('input[1]//following::input[3]', '');
        await node.type('54321');

        node = await containsFirst('button', 'ADD');
        await node.click();

        nodes = await containsAll('tr', '');
        expect(nodes.length).toBe(3);

        nodes = await containsAll('td', 'PENDING');
        expect(nodes.length).toBe(1);

    });

    it('Checks Filter by Status', async () => {
        let nodes, node;
        nodes = await containsAll('tr', '');
        expect(nodes.length).toBe(3);

        let matSelect = await containsFirst('mat-select', '');
        await matSelect.click();
        node = await containsFirst('mat-option', 'ACTIVATED');
        await node.click();

        nodes = await containsAll('tr', '');
        expect(nodes.length).toBe(2);

        nodes = await containsAll('td', 'ACTIVATED');
        expect(nodes.length).toBe(1);

        await matSelect.click();
        node = await containsFirst('mat-option', 'PENDING');
        await node.click();

        nodes = await containsAll('tr', '');
        expect(nodes.length).toBe(2);

        nodes = await containsAll('td', 'PENDING');
        expect(nodes.length).toBe(1);

        await matSelect.click();
        node = await containsFirst('mat-option', 'ALL');
        await node.click();
    });

    it('DELETE SMS ID', async () => {
        let nodes, node;
        nodes = await containsAll('tr', '');
        expect(nodes.length).toBe(3);

        node = await containsFirst('button', 'delete');
        await node.click();

        nodes = await containsAll('tr', '');
        expect(nodes.length).toBe(2);
    });


    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });
});
