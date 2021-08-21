import { BeforeAfterEach } from '../../../../beforeAterEach';
import { startBackendServer } from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import { openModuleAndPage } from '../../../../open-page';

import { getNode } from '../../../../contains';


describe('Parents -> Tutorials', () => {

    let page: any;
    let node, prop;

    beforeAll(async () => {

        await startBackendServer(getFixtureFiles('modules/parent/pages/view-tutorial/view-tutorial.json'));
        page = await BeforeAfterEach.beforeEach();
        await page.select('select[ng-reflect-model="Employee"]', 'Parent');
        await openModuleAndPage('Tutorial', '');

    });

    it('View Tutorial : View Tutorial Video', async () => {

        await page.waitForXPath('//iframe');
        node = await getNode('iframe', '');
        prop = await page.evaluate(el => el.src, node);
        prop = prop.split('?')[0];
        expect(prop).toBe("https://www.youtube.com/embed/AIgF0NJFm50");
        node = await getNode('b', 'Published');
        prop = await page.evaluate(el => el.innerHTML, node);
        expect(prop).toBe("Published On : 16th - March - 2013");

    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    });

});
