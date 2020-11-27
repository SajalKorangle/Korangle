import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst} from '../../../../contains';

describe('Students -> Update Profile', () => {

    let page: any;


    it('Student : Update Profile', async () => {
        let node, nodes;

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/students/pages/update-profile/update-profile.json'));
        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Students', 'Update Profile');

        // Type the Student name
        (await containsFirst('input', '')).type('Ajay');
        // Select the Student
        (await containsFirst('span', 'Ajay Dhangar')).click();

        // Wait for the input field to load
        await page.waitForXPath('//textarea[1]');
        const [inputElement] = await page.$x('//textarea[1]');
        // Type the updated address
        await inputElement.type('Shujalpur');

        // Click on UPDATE button
        node = await page.evaluate(() => {
            nodes = document.evaluate('//button[@type=\'submit\']', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            node = nodes.iterateNext();
            node.click();
        });

        // Checking update successful by dialog success message
        page.on('dialog', async dialog => {
            expect(dialog.message()).toBe('Student: Ajay Dhangar updated successfully');
            await dialog.dismiss();
        });

        await BeforeAfterEach.afterEach();

    });
});

