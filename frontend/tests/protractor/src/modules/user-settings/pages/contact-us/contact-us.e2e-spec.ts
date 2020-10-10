import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../../../backend-server';
// import { getFixtureFiles } from '@fixtures/fixture-map';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';

describe('Settings -> Contact Us', () => {

    let page: any;

    it('Able to open Contact Us Page', async () => {

        startBackendServer(getFixtureFiles('modules/user-settings/pages/contact-us/able-to-open-contact-us.json'));

        page = await BeforeAfterEach.beforeEach();
        await page.click('#settings');
        await page.click('#settings-contact_us');
        await BeforeAfterEach.afterEach();

    });

});
