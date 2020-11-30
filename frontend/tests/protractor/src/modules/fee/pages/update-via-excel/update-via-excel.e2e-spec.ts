import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';

import {openModuleAndPage} from '../../../../open-page';

describe('Fees 3.0 -> Update Via Excel', () => {

    let page: any;

    it('Add student', async () => {

        // startBackendServer(getFixtureFiles('modules/students/pages/add-student/add-student.json'));

        // page = await BeforeAfterEach.beforeEach();
        page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.dismiss();
        });

        // Opening Page
        await openModuleAndPage('Fees 3.0', 'Update Via Excel');


    });

});
