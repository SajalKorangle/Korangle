import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';



describe('Examination -> Create Test', () => {

    let page: any;

    afterEach( async () => {
        await BeforeAfterEach.afterEach();
    });


    it('Create Test', async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/examination/pages/create-test/create-test.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Examination', 'Create Test');

        

        

    });
});
