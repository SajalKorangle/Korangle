import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst, containsAll, getNode, getNodes} from '../../../../contains';

describe('Accounts -> Manage Accounts', () => {
    let confirmDeleteDialog = async dialog => {
        expect(dialog.message()).toBe('Are you sure you want to delete this account?');
        await dialog.accept();
        page.removeListener('dialog', confirmDeleteDialog);
        page.on('dialog', deleteDialog);
    };

    let deleteDialog = async dialog => {
        expect(dialog.message()).toBe('Account Deleted Successfully');
        await dialog.accept();
        page.removeListener('dialog', deleteDialog);
    };

    let successDialog = async dialog => {
        expect(dialog.message()).toBe('Account Updated Successfully');
        await dialog.dismiss();
        page.removeListener('dialog', successDialog);
    };

    let accountCreated = async dialog => {
        expect(dialog.message()).toBe('Account Created Successfully');
        await dialog.dismiss();
        page.removeListener('dialog', accountCreated);
    };



    let page: any;
    let node: any;

    beforeAll(async () => {
        startBackendServer(getFixtureFiles('modules/accounts/pages/manage-accounts/manage-accounts.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Accounts', 'Manage Accounts');
        await page.waitForTimeout(3000);
    });
    it('Edit Account', async () => {
        page.on('dialog', successDialog);

        node = await containsFirst('span', 'expense');
        await node.click();

        await page.waitForSelector('input[ng-reflect-model="expense"]');
        await page.type('input[ng-reflect-model="expense"]', 'Account');

        await page.waitForSelector('input[ng-reflect-placeholder="Change Balance"]');
        await page.type('input[ng-reflect-placeholder="Change Balance"]', '00');

        node = await containsFirst('span', 'Edit Account');
        await node.click();

        await page.waitForTimeout(3000);
    });
    it ('Delete Account', async () => {
        page.on('dialog', confirmDeleteDialog);

        await page.waitForTimeout(1000);

        node = await containsFirst('span', 'assests1');
        await node.click();
        node = await containsFirst('span', 'Delete Account');
        await node.click();

        await page.waitForTimeout(1000);
    });

    it ('Add Account', async () => {
        page.on('dialog', accountCreated);

        node = await containsFirst('button', 'Create Account');
        await node.click();

        await page.waitForSelector('input[placeholder="Account Name *"]');
        await page.type('input[placeholder="Account Name *"]', 'liability backup');

        node = await containsFirst('mat-select', '');
        await node.click();

        node = await containsFirst('mat-option', 'Liability SubGroup');
        await node.click();

        node = await containsFirst('span', 'Add Account');
        await node.click();

        await page.waitForTimeout(1000);
    });
});