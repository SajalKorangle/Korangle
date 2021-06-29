import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst, containsAll} from '../../../../contains';

describe('Students -> Update Profile', () => {

    let page: any;
    let nodes;
    let node;

    beforeAll(async () => {

        // Start Backend Server
        startBackendServer(getFixtureFiles('modules/students/pages/update-profile/update-profile.json'));
        page = await BeforeAfterEach.beforeEach();
        // Opening Page
        await openModuleAndPage('Students', 'Update Profile');

    });

    describe('Students -> Update profile and text/filter parameters', () => {
          it('Student : Update Profile - Address', async () => {
              await page.waitForXPath('//input[1]');
              // Type the Student name
              (await containsFirst('input', '')).type('Ajay');
              // Select the Student
              (await containsFirst('span', 'Ajay Dhangar')).click();

              // Wait for the input field to load
              await page.waitForXPath('//textarea[1]');
              const [inputElement] = await page.$x('//textarea[1]');
              // Type the updated address
              await inputElement.type('Shujalpur');

          });

            it ('Update Student : Update Custom Parameters', async() => {
              await page.click('mat-select[ng-reflect-placeholder="ContactLens"]');
              await page.waitForTimeout(500);
              nodes = await containsAll('mat-option', '');
              await nodes[1].click();
              nodes = await containsAll('input', '');
              await nodes[nodes.length - 3].type('School Teacher');

          });

          afterAll(async () => {
              // Click on UPDATE button
              const [updateButton] = await page.$x('//button[@type=\'submit\']');
              await updateButton.click();

              // Checking update successful by dialog success message
              page.on('dialog', async dialog => {
                  expect(dialog.message()).toBe('Student: Ajay Dhangar updated successfully');
                  await dialog.dismiss();
              });
          });
    });

    describe('Students -> Update documents', () => {
        it ('Update student : Update Documents', async() => {
              await page.waitForTimeout(500);
              nodes = await containsAll('input', '');
                await nodes[nodes.length - 2].uploadFile('tests/fixtures/modules/students/pages/update-profile/profile.jpg');
                await page.waitForTimeout(500);
            });

            it ('Update student : Update Multiple Documents', async() => {
            let path = 'tests/fixtures/modules/students/pages/update-profile/profile.jpg';
            let files = [path, path];
            nodes = await containsAll('input', '');
            await nodes[nodes.length - 2].uploadFile(...files);
            await page.waitForTimeout(500);
            await page.click('mat-select[ng-reflect-model="3"]');
            await page.click('mat-option');
            await page.waitForTimeout(500);
            await page.click('button[id="confirm"]');
            await page.waitForTimeout(500);
            await BeforeAfterEach.afterEach();
            });
        });
});

