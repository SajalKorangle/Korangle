import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {BeforeAfterEach} from '../../../../beforeAterEach';
import {openModuleAndPage, reClickPage} from '../../../../open-page';
import {containsFirst, getNodes} from '../../../../contains';

describe('Settings -> Suggest Feature', () => {

    let page: any;

    beforeEach(async () => {
        startBackendServer(getFixtureFiles('modules/user-settings/pages/suggest-feature/suggest-feature.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Settings', 'Suggest Feature');
        await page.waitForXPath('//input[1]');
        await page.waitForTimeout(1000);
    });

    it('Adds a new suggestion', async () => {

        // Entering the required text
        const [title] = await page.$x('//input[1]');
        await title.type('Feature Title');
        const [description] = await page.$x('//textarea[1]');
        await description.type('Description of the Feature');
        const [advantage] = await page.$x('//textarea//following::textarea[1]');
        await advantage.type('Advantage of the Feature');
        const [frequency] = await page.$x('//textarea//following::textarea[2]');
        await frequency.type('Frequency of the Feature');
        // Commenting the managedBy to check whether null texts are handled or not
        /*const [managedBy] = await page.$x('//textarea//following::textarea[3]');
        await managedBy.type('Currently managed by');*/

        // Checking success dialog message
        page.on('dialog', async dialog => {
            page.waitForTimeout(5000);
            expect(dialog.message()).toBe('Feature submitted successfully');
            await dialog.dismiss();
        });

        // Clicking on Submit button
        await page.waitForXPath('//button[contains(text(),\'Submit\')]');
        const [submit] = await page.$x('//button[contains(text(),\'Submit\')]');
        await submit.click();

    });

    it('Deletes an existing suggestion', async () => {

        let nodes, featureCount;

        // Re-clicking the page and checking no of features are 1
        await reClickPage('Suggest Feature');
        await page.waitForXPath('//mat-expansion-panel-header');
        nodes = await getNodes('mat-expansion-panel-header', '');
        featureCount = nodes.length;
        expect(featureCount).toBe(1);

        // Deleting the existing suggestion by clicking DELETE button
        const [expand] = await page.$x('//mat-expansion-panel-header[1]');
        await expand.click();
        await page.waitForXPath('//button[contains(text(),\'Delete\')]');
        const [Delete] = await page.$x('//button[contains(text(),\'Delete\')]');
        await Delete.click();

        // Re-clicking the page and checking the no of features are 0
        await reClickPage('Suggest Feature');
        nodes = await getNodes('mat-expansion-panel-header', '');
        featureCount = nodes.length;
        expect(featureCount).toBe(0);

    });

    afterEach(async () => {
        await BeforeAfterEach.afterEach();
    })
});
