import { BeforeAfterEach } from '../../../../beforeAterEach';
import { startBackendServer } from '../../../../backend-server';
// import { getFixtureFiles } from '@fixtures/fixture-map';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import { openModuleAndPage } from '../../../../open-page';
import { containsFirst, containsAll, getNode, getNodes } from '../../../../contains';

describe('Examination -> View Marks', () => {

    let page: any;

    beforeAll(async () => {
        await startBackendServer(getFixtureFiles('modules/examination/pages/view-marks/view-marks.json'));

        page = await BeforeAfterEach.beforeEach();
        page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.dismiss();
            expect(true).toBe(false);
        });

        // Opening Page
        await openModuleAndPage('Examination', 'View Marks');

        // Waiting & Clicking the GET button to get the data from backend
        await page.waitForSelector('button[type="submit"]');
        (await containsFirst('button', 'GET')).click();
        await page.waitForTimeout(1000);
    });

    describe('set1', () => {

        it('View Marks: Student`s Count', async () => {
            let nodes;

            // Checking the number of rows to be equals to 70 -> 68 students, 1 header row, 1 bottom row for employee information
            nodes = await containsAll('tr', '');  //count check
            expect(nodes.length).toBe(70);
        });

        it('View Marks: Subjects Filter', async () => {

            // Checking that filters are not shown by default
            let nodes, node, col_count;
            nodes = await getNodes('label', 'Hindi'); //  Subjects for filter should not be available
            expect(nodes.length).toBe(0);
            nodes = containsAll('th', 'Hindi');
            expect(nodes.length).not.toBe(0);

            // Checking the number of columns to be equal to 9 -> 1 Rank, 1 Student, 1 Total marks, 6 tests
            nodes = await getNodes('th', '');  // columns count
            col_count = nodes.length;
            expect(col_count).toBe(9);

            // Clicking the show subjects filter button to view the filters
            node = await getNode('button', 'Show Subjects Filter');  // click show subject filter button
            node.click();
            await page.waitForTimeout(500);

            // Click on Hindi Filter to make the column disappear
            node = await page.evaluate(() => {
                nodes = document.evaluate(
                    '//label[contains(text(), "Hindi")]/parent::span/preceding-sibling::div/input',
                    document,
                    null,
                    XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
                    null);
                node = nodes.iterateNext();
                node.click();
            });

            await page.waitForTimeout(500);

            // Checking the drop of count from 9 to 8
            nodes = await getNodes('th', '');  // columns count
            col_count = nodes.length;
            expect(col_count).toBe(8);

        });

        it('View Marks: Default Ordering', async () => {
            let nodes, node, roll = -1, prop;
            nodes = await page.$$('table tbody tr:nth-child(n)');
            nodes.pop();
            nodes.forEach(async element => {
                node = await element.$('td:nth-child(3)');
                prop = await page.evaluate(el => el.innerHTML, node);
                prop = parseInt(prop);
                prop = Number.isNaN(prop) ? roll : prop;
                expect(prop).toBeGreaterThanOrEqual(roll);
                roll = prop;
            });
        });
    });

    describe('set2', () => {
        beforeAll(async () => {
            // Ordering rows in the 'Rank' order
            let node;
            node = await containsFirst('th', 'Rank');
            node.click();
            await page.waitForTimeout(500);
        });

        it('Rank Order and Total Check', async () => {
            let node, nodes, tot = 100, prop;
            nodes = await page.$$('table tbody tr:nth-child(n)');
            nodes.pop();
            nodes.forEach(async (element, index) => {
                // console.log(index)
                node = await element.$('td:nth-child(1)');
                prop = await page.evaluate(el => el.innerHTML, node);
                prop = parseInt(prop);
                expect(prop).toBe(index + 1);

                node = await element.$('td:nth-child(4) span');
                prop = await page.evaluate(el => el.innerHTML, node);
                prop = prop.trim();
                prop = parseFloat(prop.substring(1, prop.length - 1));
                expect(prop).toBeLessThanOrEqual(tot);
                tot = prop;
            });
        });

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });
});
