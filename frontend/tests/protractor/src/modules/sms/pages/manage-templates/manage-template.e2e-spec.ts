import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsAll, containsFirst} from '../../../../contains';


describe('SMS -> Manage Templates', () => {

    let page: any;

    beforeAll(async () => {
        startBackendServer(getFixtureFiles('modules/sms/pages/manage-templates/manage-templates.json'));

        page = await BeforeAfterEach.beforeEach();

        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Are you sure want to delete this Template?');
            await dialog.accept();
        });

        // Opening Page
        await openModuleAndPage('SMS', 'Manage Templates');
        await page.waitForTimeout(1000);

    });

    it('Checks No: of events', async () => {
        let nodes = await containsAll('mat-nav-list', '');
        expect(nodes.length).toBe(6);
    });

    it('ADD New General Template', async () => {
        let nodes, node;

        node = await containsFirst('mat-nav-list', 'General');
        await node.click();

        nodes = await containsAll('mat-expansion-panel', '');
        expect(nodes.length).toBe(1);

        node = await containsFirst('mat-expansion-panel', 'New Template');
        await node.click();

        node = await containsFirst('mat-select', '');
        await node.click();
        node = await containsFirst('mat-option', 'TESTNG');
        await node.click();

        node = await containsFirst('input[@placeholder="Template ID"]', '');
        await node.type('12345998');

        node = await containsFirst('input[@placeholder="Template Name"]', '');
        await node.type('New Template');

        node = await containsFirst('mat-select', 'Communication Type');
        await node.click();
        node = await containsFirst('mat-option', 'SERVICE IMPLICIT');
        await node.click();

        node = await containsFirst('textarea', '');
        await node.type('Hello {#var#} this is a template2');

        node = await containsFirst('button', 'Add Template');
        await node.click();

        nodes = await containsAll('mat-expansion-panel', '');
        expect(nodes.length).toBe(2);

    });

    it('Checks General Template Content and Deletes', async () => {
        let nodes, node;
        node = await containsFirst('mat-expansion-panel', '1');
        node.click();

        nodes = await containsAll('mat-expansion-panel//following::div[contains(text(),"Hello {#var#} this is a template2")]', '');
        expect(nodes.length).toBe(1);

        await page.evaluate(() => {
            //@ts-ignore
            document.querySelector('button.custom-button').click();
        });

        nodes = await containsAll('mat-expansion-panel', '');
        expect(nodes.length).toBe(1);

        node = await containsFirst('button', 'Go Back');
        await node.click();
    });

    it('Create Attendance Settings ', async () => {
        let nodes, node;

        node = await containsFirst('mat-nav-list', 'Attendance');
        await node.click();

        node = await containsFirst('mat-expansion-panel', 'Attendance Creation');
        await node.click();

        node = await containsFirst('mat-select[@placeholder="Send via"]', '');
        await node.click();

        node = await containsFirst('mat-option', 'NOTIFICATION');
        await node.click();

        node = await containsFirst('mat-select[@placeholder="Send Update To"]', '');
        await node.click();

        node = await containsFirst('mat-option', 'All Students');
        await node.click();

        node = await containsFirst('button', 'Create');
        await node.click();

        nodes = await containsAll('button', 'Update');
        expect(nodes.length).toBe(1);
    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });

});
