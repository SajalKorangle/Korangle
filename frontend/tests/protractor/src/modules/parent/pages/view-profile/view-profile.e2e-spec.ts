import { BeforeAfterEach } from '../../../../beforeAterEach';
import { startBackendServer } from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import { openModuleAndPage } from '../../../../open-page';

import { getNode } from '../../../../contains';

describe('Parents -> View Profile', () => {

    let page: any;
    let node, prop;

    beforeAll(async () => {

        await startBackendServer(getFixtureFiles('modules/parent/pages/view-profile/view-profile.json'));
        page = await BeforeAfterEach.beforeEach();
        await page.select('select[ng-reflect-model="Employee"]', 'Parent');
        await openModuleAndPage('Profile', '');

    });

    it('View Profile : View Class And Section', async () => {

        node = await getNode('b', 'Class');
        prop = await page.evaluate(el => el.innerHTML, node);
        expect(prop).toBe("Class - 12 , Section - A");

        await BeforeAfterEach.afterEach();
    });

});
