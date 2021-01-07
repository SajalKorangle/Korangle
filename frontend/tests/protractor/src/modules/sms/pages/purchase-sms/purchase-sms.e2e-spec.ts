import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst} from '../../../../contains';



describe('SMS -> Purchase SMS', () => {

    let page: any;

    afterEach( async () => {
        await BeforeAfterEach.afterEach();
    });


    it('Verify Purchase', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/sms/pages/purchase-sms/purchase-sms.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('SMS', 'Purchase SMS');



    });
});
