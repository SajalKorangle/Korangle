import { BeforeAfterEach } from '../../../../beforeAterEach';
import { startBackendServer } from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import { openModuleAndPage } from '../../../../open-page';



describe('SMS -> Purchase SMS', () => {

    let page: any;

    afterEach(async () => {
        await BeforeAfterEach.afterEach();
    });


    it('Verify Purchase', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/sms/pages/purchase-sms/purchase-sms.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('SMS', 'Purchase SMS');

        const rangeSlider = await BeforeAfterEach.page.waitForXPath('//input[@testId="slider"]');

        const bounding_box = await rangeSlider.boundingBox();

        await page.mouse.move(bounding_box.x + bounding_box.width / 3, bounding_box.y + bounding_box.height / 2);
        await page.mouse.down();
        await page.mouse.move(bounding_box.x + bounding_box.width / 3, bounding_box.y + bounding_box.height / 2);
        await page.mouse.up();

        await page.waitForTimeout(3000);

    });
});
