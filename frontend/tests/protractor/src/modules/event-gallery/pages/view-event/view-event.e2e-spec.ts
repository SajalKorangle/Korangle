import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst, containsAll, getNode, getNodes} from '../../../../contains';

describe('Event Gallery -> Manage Event', () => {

    let page: any;

    beforeAll(async () => {
        startBackendServer(getFixtureFiles('modules/event-gallery/pages/view-event/view-event.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Event Gallery', 'View Event');
        await page.waitForTimeout(1000);

        let node = await containsFirst('mat-card', '');
        await node.click();
    }); -

    it('View Event : Check All Data', async () => {
        let nodes, node;

        nodes = await containsAll('span', 'Annual Day Celebration');
        expect(nodes.length).toBe(1);

        nodes = await containsAll('span', '10 Aug 2020');
        expect(nodes.length).toBe(1);

        nodes = await containsAll('span', 'It was a Great Day for us');
        expect(nodes.length).toBe(1);

        await page.waitForXPath('//div[contains(., "Mountain")]');
        nodes = await containsAll('div[contains(@class, \'btn\') and contains(@class, \'ng-star-inserted\')]', '');
        expect(nodes.length).toBe(2);

        await page.waitForXPath('//mat-card//following::img[2]');
        nodes = await containsAll('mat-card//following::img', '');
        expect(nodes.length).toBe(2);


    });

    it('View Event : Check Tagged Images', async () => {
        let  node;
        let selectedMediaCount = 0;

        node = await containsFirst('div[contains(@class, \'btn\') and contains(@class, \'ng-star-inserted\')]', '');
        await node.click();


        let checkBoxes = await page.$$eval('input[type=\'checkbox\']', e => e.map((a) => a.checked));

        await checkBoxes.forEach(checked => {
            if (checked) {
                selectedMediaCount += 1;
            }
        });

        await expect(selectedMediaCount).toBe(1);

    });


    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });
});
