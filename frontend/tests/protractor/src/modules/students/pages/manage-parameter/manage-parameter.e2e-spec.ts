import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst, containsAll} from '../../../../contains';

describe('ManageParameters', () => {

    let page: any;
    let value;
    let nodes;
        beforeAll(async () => {
            startBackendServer(getFixtureFiles('modules/students/pages/manage-parameter/manage-parameter.json'));
            page = await BeforeAfterEach.beforeEach();
            await openModuleAndPage('Students', 'Manage Parameter');
        });
        it('ManageParameters : View Parameters', async () => {
            await (await containsFirst('mat-select', '')).click();
            nodes = await containsAll('mat-option', '');
            expect(nodes.length).toBe(5);  // Checking the number of parameters to be equals to 5 -> 4 parameter, 1 header row
        });
        it('ManageParameters : Edit Parameter', async () => {
            nodes = await containsAll('mat-option', '');
            await nodes[3].click();
            await page.type('input[placeholder="Parameter Name"]', "No.");
            await page.click('mat-radio-button[ng-reflect-value="TEXT"');
            await (await containsFirst('button', 'Edit')).click();
            await (await containsFirst('mat-select', '')).click();
            nodes = await containsAll('mat-option', '');
            let value = await page.evaluate(el => el.textContent, nodes[4]);
            expect(value).toBe("AadharCardNo.");
        });
        describe('ManageParameters : Add Parameter', () => {

            it('Add Parameter : Add Text parameter', async() => {
                nodes = await containsAll('mat-option', '');
                await nodes[0].click(); //add new parameter
                await page.click('mat-radio-button[ng-reflect-value="TEXT"');
                await page.type('input[placeholder="Parameter Name"]', "EmergencyContact");
                await (await containsFirst('button', 'Save')).click();

                await page.waitForTimeout(500);
                await (await containsFirst('p', 'Update Profile')).click();
                await page.waitForSelector('input');
                await page.click('mat-form-field');
                await page.type('input', 'a');
                await (await containsFirst('mat-option', '')).click();
                await page.waitForTimeout(500);
                nodes = await containsAll('mat-label', '');
                value = await page.evaluate(el => el.textContent, nodes[nodes.length - 1]);
                expect(value.trim()).toBe("EmergencyContact");
                await page.waitForTimeout(500);

                await (await containsFirst('p', 'View All')).click();
                await page.click('mat-select[id="select-profile-column"]');
                await page.waitForTimeout(500);
                nodes = await containsAll('mat-checkbox', '');
                value = await page.evaluate(el => el.textContent, nodes[nodes.length - 1]);
                expect(value.trim()).toBe("EmergencyContact");
                await page.click('body');
                await page.waitForTimeout(500);

                await (await containsFirst('p', 'Update All')).click();
                await page.click('mat-select[placeholder="Select Columns"]');
                nodes = await containsAll('mat-checkbox', '');
                value = await page.evaluate(el => el.textContent, nodes[nodes.length - 1]);
                expect(value.trim()).toBe("EmergencyContact");
                await page.click('body');

                await (await containsFirst('p', 'Add Student')).click();
                await page.waitForTimeout(500);
                nodes = await containsAll('mat-label', '');
                value = await page.evaluate(el => el.textContent, nodes[nodes.length - 1]);
                expect(value.trim()).toBe("EmergencyContact");
                await page.waitForTimeout(500);

                await page.click('a[id="id_card"]');
                await (await containsFirst('p', 'Design Id Card')).click();
                await page.waitForTimeout(500);
                await page.click('mat-select[placeholder="Choose to add/edit/delete layout/s"]');
                await page.click('mat-option[ng-reflect-value="<Add New Layout>"]');
                await (await containsFirst('mat-label', ' Student Custom ')).click();
                nodes = await containsAll('mat-option', '');
                value = await page.evaluate(el => el.textContent, nodes[nodes.length - 1]);
                expect(value.trim()).toBe("EmergencyContact");
                await page.waitForTimeout(500);
                await page.click('body');
            });

            it('Add Parameter : Add Document Parameter', async() => {
                await page.click('a[id="students"]');
                await page.click('a[id="students"]');
                await (await containsFirst('p', 'Manage Parameter')).click();
                await (await containsFirst('mat-select', '')).click();
                nodes = await containsAll('mat-option', '');
                await nodes[0].click(); //add new parameter
                await page.click('mat-radio-button[ng-reflect-value="DOCUMENT"');
                await page.type('input[placeholder="Parameter Name"]', "DomicileCertificate");
                await (await containsFirst('button', 'Save')).click();
                await (await containsFirst('mat-select', '')).click();
                nodes = await containsAll('mat-option', '');
                value = await page.evaluate(el => el.textContent, nodes[6]);
                expect(value).toBe("DomicileCertificate");
            });

            it('Add Parameter : Add Filter Parameter', async() => {
                nodes = await containsAll('mat-option', '');
                await nodes[0].click(); //add new parameter
                await page.click('mat-radio-button[ng-reflect-value="FILTER"');
                await page.type('input[placeholder="Parameter Name"]', "PWD");
                await page.type('input[placeholder="Filter Name"]', "YES");
                await (await containsFirst('mat-icon', 'add')).click();
                await page.waitForTimeout(500);
                await page.type('input[placeholder="Filter Name"]', "NO");
                await (await containsFirst('mat-icon', 'add')).click();
                await page.waitForTimeout(500);
                await page.type('input[placeholder="Filter Name"]', "NOT SURE");
                await (await containsFirst('mat-icon', 'add')).click();
                await (await containsFirst('button', 'Save')).click();
                await (await containsFirst('mat-select', '')).click();
                nodes = await containsAll('mat-option', '');
                value = await page.evaluate(el => el.textContent, nodes[7]);
                expect(value).toBe("PWD");

                await (await containsFirst('p', 'Update Profile')).click();
                await (await containsFirst('p', 'Update Profile')).click();
                await page.waitForSelector('input');
                await page.click('mat-form-field');
                await page.type('input', 'a');
                await (await containsFirst('mat-option', '')).click();
                await page.waitForTimeout(500);
                nodes = await containsAll('mat-select', '');
                value = await page.evaluate(el => el.textContent, nodes[nodes.length - 1]);
                expect(value.trim()).toBe("PWD");

                await (await containsFirst('p', 'View All')).click();
                await page.click('mat-select[id="select-profile-column"]');
                nodes = await containsAll('mat-checkbox', '');
                value = await page.evaluate(el => el.textContent, nodes[nodes.length - 1]);
                expect(value.trim()).toBe('PWD');
                await page.click('body');

                await (await containsFirst('p', 'Update All')).click();
                await page.click('mat-select[placeholder="Select Columns"]');
                nodes = await containsAll('mat-checkbox', '');
                value = await page.evaluate(el => el.textContent, nodes[nodes.length - 1]);
                expect(value.trim()).toBe('PWD');
                await page.click('body');

                await (await containsFirst('p', 'Add Student')).click();
                nodes = await containsAll('mat-select', '');
                value = await page.evaluate(el => el.textContent, nodes[nodes.length - 1]);
                expect(value.trim()).toBe("PWD");
                await page.click('body');

                await page.click('a[id="id_card"]');
                await (await containsFirst('p', 'Design Id Card')).click();
                await page.waitForTimeout(500);
                await page.click('mat-select[placeholder="Choose to add/edit/delete layout/s"]');
                await page.click('mat-option[ng-reflect-value="<Add New Layout>"]');
                await (await containsFirst('mat-label', ' Student Custom ')).click();
                nodes = await containsAll('mat-option', '');
                value = await page.evaluate(el => el.textContent, nodes[nodes.length - 1]);
                expect(value).toBe(' PWD ');

                await page.click('a[id="fees"]');
                await page.click('a[id="fees"]');
                await (await containsFirst('p', 'Notify Defaulters')).click();
                await (await containsFirst('button', 'Show Custom Filters')).click();
                nodes = await containsFirst('mat-label', 'PWD');
                await page.waitForTimeout(500);

            });
    });
    it('ManageParameters : Delete Parameter', async () => {
        page.on('dialog', async dialog => {
            await dialog.accept();
        });
        await page.click('a[id="students"]');
        await page.click('a[id="students"]');
        await (await containsFirst('p', 'Manage Parameter')).click();
        await (await containsFirst('mat-select', '')).click();
        nodes = await containsAll('mat-option', '');
        await nodes[1].click();
        await (await containsFirst('button', 'Delete')).click();
        await (await containsFirst('mat-select', '')).click();
        nodes = await containsAll('mat-option', '');
        expect(nodes.length).toBe(7);
        await BeforeAfterEach.afterEach();
    });
    });
