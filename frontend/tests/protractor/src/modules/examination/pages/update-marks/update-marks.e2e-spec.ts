import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import { containsAll, containsFirst } from '../../../../contains';



describe('Examination -> Update Marks', () => {

    let page: any;

    beforeAll(async () => {

        startBackendServer(getFixtureFiles('modules/examination/pages/update-marks/update-marks.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Examination', 'Update marks');

        (await containsFirst('button', 'GET')).click();
    });


    it('Verify fetched test list', async () => {

        let rows;
        //68 Rows for tests and 1 head row
        rows = await containsAll('tr', '');
        expect(rows.length).toBe(69);
    });


    it('Update marks of any one and update', async () => {

        const [marks] = await page.$x('//input[1]');
        await marks.type('75');

        // clicking somewhere else on the page to update
        (await containsFirst('span', 'Max. Marks')).click();

        await page.waitForTimeout(3000);

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });


});
