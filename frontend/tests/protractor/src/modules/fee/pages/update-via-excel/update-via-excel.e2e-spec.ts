import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
// import { getFixtureFiles } from '@fixtures/fixture-map';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import { openModuleAndPage } from '../../../../open-page';
import {containsFirst, containsAll, getNode, getNodes} from '../../../../contains';

describe('Fees 3.0 -> Update Via Excel', () => {

    let page: any;

    beforeAll(async () => {
        startBackendServer(getFixtureFiles('modules/fee/pages/update-via-excel/update-via-excel.json'));
        
        page = await BeforeAfterEach.beforeEach();
        // page.on('dialog', async dialog => {
        //     console.log(dialog.message());
        //     await dialog.dismiss();
        //     expect(true).toBe(false);
        // });

        // Opening Page
        await openModuleAndPage('Fees 3.0', 'Update Via Excel');

        // Waiting & Clicking the GET button to get the data from backend
        // await page.waitForSelector('button[type="submit"]');
        // (await containsFirst('button', 'GET')).click();
        // await page.waitForTimeout(1000);
    });

    describe('set1', () => { 

        it('View Marks: Student`s Count', async () => {
            // let nodes;

            // // Checking the number of rows to be equals to 70 -> 68 students, 1 header row, 1 bottom row for employee information
            // nodes = await containsAll('tr', '');  //count check
            // expect(nodes.length).toBe(70);
        });

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    })
});
