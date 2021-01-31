import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import { getFixtureFiles } from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst} from '../../../../contains';

describe('Update All', () => {

    let page: any;
    let columns;
    let rows;    
        beforeAll(async () => {
            startBackendServer(getFixtureFiles('modules/students/pages/update-all/update-all.json'));
            page = await BeforeAfterEach.beforeEach();
            await openModuleAndPage('Students','Update All');
        });
        it ('Update All : Update fix parameters',async()=>{
        	await page.waitForSelector('mat-select');
            await page.click('mat-select');
            await page.waitForTimeout(500);
            await page.waitForSelector('mat-checkbox');
            await (await containsFirst('mat-checkbox','')).click();
            await page.waitForTimeout(500);
            await page.click('body');
            await page.type('input[ng-reflect-model="Aditi Musunur"]',' sarbalia');
            await page.click('body');
            await page.waitForSelector('input[ng-reflect-model="Aditi Musunur sarbalia"]');
            await page.type('input[ng-reflect-model="Advitiya Sujeet"]',' Tewariya');
            await page.click('body');
            await page.waitForSelector('input[ng-reflect-model="Advitiya Sujeet Tewariya"]');
            await page.type('input[ng-reflect-model="Sam Poduri"]',' Jank');
            await page.click('body');
            await page.waitForSelector('input[ng-reflect-model="Sam Poduri Jank"]');
            await page.type('input[id="4mobileNumber"]','9935727534');
            await page.click('body');
            await page.waitForSelector('input[ng-reflect-model="9935727534"]');
            await page.waitForTimeout(500);
            await BeforeAfterEach.afterEach()
        });
        // it('Update All : Update Documents',async()=>{
        //     let node;
        //     let files='tests/fixtures/modules/students/pages/update-profile/profile.jpg';
        //     await page.waitForTimeout(500);
        //     await page.click('mat-select[placeholder="Select Columns"]');
        //     await page.click('mat-checkbox[id="mat-checkbox-49"]');
        //     await page.waitForTimeout(500);
        //     await page.click('mat-checkbox[id="mat-checkbox-44"]');
        //     await page.click('body');
        //     [node] = await page.$x('//input[@id="2-3"]');
        //     await node.uploadFile(files);
        //     await page.click('body');
        //     [node] = await page.$x('//input[@id="5-4"]');
        //     await node.uploadFile(files);
        //     await page.click('body');
        //     await page.waitForTimeout(5000);
        //     await BeforeAfterEach.afterEach();
        // })
    });
