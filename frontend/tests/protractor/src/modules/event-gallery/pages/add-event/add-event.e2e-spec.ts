import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst, containsAll, getNode, getNodes} from '../../../../contains';

describe('Event Gallery -> Add Event', () => {

    let page: any;

    beforeAll(async () => {
        startBackendServer(getFixtureFiles('modules/event-gallery/pages/add-event/add-event.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Event Gallery', 'Add Event');
        await page.waitForTimeout(1000);

    });

    it('Add Event : Adds a New Event', async () => {
        let nodes, node;

        nodes = await containsAll('mat-card', '');  //count check
        expect(nodes.length).toBe(1);

        node = await containsFirst('input', '');
        await node.type('Sports Day');
        node = await containsFirst('textarea', '');
        await node.type('There were many participants for the event');

        node = await containsFirst('mat-select', '');
        await node.click();

        node = await containsFirst('button', 'Select All');
        await node.click();

        node = await containsFirst('button', 'Post Event');
        await node.click();
        await node.click();

        await page.waitForXPath('//mat-card//following::mat-card');
        nodes = await containsAll('mat-card', '');  //count check
        expect(nodes.length).toBe(2);

    });

    it('Add Event : Deletes an exiting Event', async () => {
        let nodes, node;

        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Are you sure want to delete this Event?');
            await dialog.accept();
        });

        // Selecting search using Student Name
        node = await containsFirst('button', 'Edit Event');
        await node.click();

        node = await containsFirst('a', 'Delete Event');
        await node.click();

        nodes = await containsAll('mat-card', '');  //count check
        expect(nodes.length).toBe(1);

    });

    it('Add Event : Edit an existing Event', async () => {
        let node;

        // Selecting Parent's Number search
        node = await containsFirst('button', 'Edit Event');
        await node.click();

        node = await containsFirst("input", '');
        await node.type(' edited');

        node = await containsFirst("textarea", '');
        await node.type(' edited');

        node = await containsFirst('button', 'Save Changes');
        await node.click();

        node = await containsAll('strong', ' edited');
        expect(node.length).toBe(1);

        node = await containsAll('mat-card-content', ' edited');
        expect(node.length).toBe(1);

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });
});
