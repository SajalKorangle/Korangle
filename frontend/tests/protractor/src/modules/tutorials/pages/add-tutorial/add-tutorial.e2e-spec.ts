import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {BeforeAfterEach} from '../../../../beforeAterEach';
import {openModuleAndPage, reClickPage} from '../../../../open-page';
import {containsAll, containsFirst, getNodes} from '../../../../contains';

describe('Tutorials -> Add Tutorial', () => {

    let page: any;

    beforeAll(async () => {
        startBackendServer(getFixtureFiles('modules/tutorials/pages/add-tutorial/add-tutorial.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page

        await openModuleAndPage('Tutorials', 'Add Tutorial');

        await page.waitForSelector('button[type="submit"]');
        (await containsFirst('mat-select', '')).click();
        (await containsFirst('mat-option', 'Class - 3, Section - A')).click();
        const [select] = await page.$x('//mat-select//following::mat-select[1]');
        await select.click();
        (await containsFirst('mat-option', 'English')).click();
        (await containsFirst('button', 'GET')).click();
        await page.waitForTimeout(1000);
    });

    it('Add  a new tutorial ', async () => {
            let nodes;

        nodes = await containsAll('span', 'No Tutorial Videos added yet!');  //count check
        expect(nodes.length).toBe(1);
        // Entering the required text
        const [chapter] = await page.$x('//input[1]');
        await chapter.type('Tutorial Chapter');
        const [topic] = await page.$x('//input//following::input[1]');
        await topic.type('Tutorial Topic');
        const [order] = await page.$x('//input//following::input[2]');
        await order.type('1.5');
        const [link] = await page.$x('//textarea[1]');
        await link.type('https://www.youtube.com/watch?v=07d2dXHYb94');
        nodes = await containsAll('iframe', '');
        expect(nodes.length).toBe(1);

        await page.waitForXPath('//button[contains(text(),\'Add\')]');
        const [add] = await page.$x('//button[contains(text(),\'Add\')]');
        await add.click();
        await page.waitForTimeout(1000);

        nodes = await containsAll('tr', '');  //count check
        expect(nodes.length).toBe(2);

    });

    it('Edit an existing tutorial', async () => {

        let nodes;


        await page.waitForXPath('//table[1]');
        nodes = await getNodes('tr', '');
        expect(nodes.length).toBe(2);

        await page.waitForXPath('//button[contains(.,\'Edit\')][1]');
        const [Edit] = await page.$x('//button[contains(.,\'Edit\')][1]');
        await Edit.click();

        await page.waitForXPath('//button[contains(.,\'Save\')]//preceding::input[1]');
        const [topic] = await page.$x('//button[contains(.,\'Save\')]//preceding::input[1]');
        await topic.type(' Edited');

        await page.waitForXPath('//button[contains(.,\'Save\')][1]');
        const [save] = await page.$x('//button[contains(.,\'Save\')][1]');
        await save.click();

        nodes = await getNodes('td', 'Tutorial Topic Edited');
        expect(nodes.length).toBe(1);

    });

    it('Remove an existing tutorial', async () => {

        let nodes;

        await page.waitForXPath('//table[1]');
        nodes = await getNodes('tr', '');
        expect(nodes.length).toBe(2);

        // Deleting the existing tutorial by clicking Remove button
        await page.waitForXPath('//button[contains(.,\'Remove\')][1]');
        const [Remove] = await page.$x('//button[contains(.,\'Remove\')][1]');
        await Remove.click();

        await reClickPage('Add Tutorial');
        nodes = await getNodes('tr', '');
        expect(nodes.length).toBe(0);


    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    })
});
