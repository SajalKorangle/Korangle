import {BeforeAfterEach} from '../../beforeAterEach';

describe('workspace-project App', () => {

    let page: any;

    beforeEach( async () => {
        page = await BeforeAfterEach.beforeEach();
    });

    it('Contact Us Page', async () => {

        await page.click('#settings');
        await page.click('#settings-contact_us');

    });

    afterEach(async () => {
        await BeforeAfterEach.afterEach();
    })

});
