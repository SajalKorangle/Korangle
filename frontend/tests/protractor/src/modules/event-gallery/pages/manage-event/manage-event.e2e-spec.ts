import {BeforeAfterEach} from '../../../../beforeAterEach';
import {startBackendServer} from '../../../../backend-server';
import {getFixtureFiles} from '../../../../../../fixtures/fixture-map';
import {openModuleAndPage} from '../../../../open-page';
import {containsFirst, containsAll, getNode, getNodes} from '../../../../contains';

describe('Event Gallery -> Manage Event', () => {

    let page: any;

    beforeAll(async () => {
        startBackendServer(getFixtureFiles('modules/event-gallery/pages/manage-event/manage-event.json'));

        page = await BeforeAfterEach.beforeEach();

        // Opening Page
        await openModuleAndPage('Event Gallery', 'Manage Event');
        await page.waitForTimeout(1000);
        
        let node = await containsFirst('input', ''); 
        await node.type('Annual');
        
        node = await containsFirst('mat-option', 'Annual Day'); 
        await node.click();
        
    });

    it('Manage Event : Checks tag\'s functions', async () => {
        let nodes, node;
        
        nodes = await containsAll('div[contains(@class, \'btn\') and contains(@class, \'ng-star-inserted\')]','')
        expect(nodes.length).toBe(2);
        
        node = await containsFirst('button', '+'); 
        await node.click();
        
        await page.keyboard.type('New Tag')
        
        //const editor = document.getElementById('new-tag');
        // node = await page.$x('//div[@id=\'new-tag\']');
        // await page.evaluate(el => el.innerHTML = 'New Tag',node);
        //
        //
        // setTimeout(() => {
        //     editor.focus();
        //     document.execCommand('insertText', false, 'New Tag');
        // }, 1000);
        
        node = await containsFirst('div', '');  
        await node.click();
        
        await page.waitForXPath('//div[contains(., "New Tag")]');
        
        nodes = await containsAll('div[contains(@class, \'btn\') and contains(@class, \'ng-star-inserted\')]','')
        expect(nodes.length).toBe(3);
        
        node=await containsFirst('div[contains(@class, \'btn\') and contains(@class, \'ng-star-inserted\')]','');
        await node.click();
      
        nodes = await containsFirst('a', 'Edit Tag');  
        await nodes.click();
        
        await node.type('edited');
        
        node = await containsFirst('div', '');  
        await node.click();
        
        nodes = await containsAll('div[contains(@class, \'btn\') and contains(@class, \'ng-star-inserted\')]', 'edited');  
        expect(nodes.length).toBe(1);   
        
        
        node=await containsFirst('div[contains(@class, \'btn\') and contains(@class, \'ng-star-inserted\')]','');
        await node.click();
        
        nodes = await containsFirst('a', 'Delete Tag');  
        await nodes.click();
        
        nodes = await containsAll('div[contains(@class, \'btn\') and contains(@class, \'ng-star-inserted\')]', '');  
        expect(nodes.length).toBe(2);
        
    });

    it('Manage Event : Checks Image\'s functions', async () => {
        let nodes, node;

        await page.waitForXPath('//mat-card//following::img//following::img');
        
        nodes = await containsAll('mat-card//following::img', '');  
        expect(nodes.length).toBe(2);
        
        
        await page.waitForSelector('input[type=file]');
        await page.waitForTimeout(1000);

        // get the ElementHandle of the selector above
        [node] = await page.$x('//input[@type="file"]');    // file input
        await node.uploadFile('src/assets/img/korangle.jpg');
        
        
        await page.waitForXPath('//span[contains(.,"Upload media or drop it here")]')
        
        nodes = await containsAll('mat-card//following::img', '');  
        expect(nodes.length).toBe(3);
        
        nodes = await containsFirst('input[@type=\'checkbox\']//following::img', '');  
        await nodes.click();
        
        nodes = await containsFirst('a', 'Delete Media');  
        await nodes.click();
        
        await page.waitForXPath('//span[contains(.,"Delete Media")]');
       
        nodes = await containsAll('mat-card//following::img', '');  
        expect(nodes.length).toBe(2);

    });
    //
    it('Manage Event : Check Assign Function', async () => {
        let node,nodes;
        let selectedMediaCount=0;

        node=await containsFirst('div[contains(@class, \'btn\') and contains(@class, \'ng-star-inserted\')]','');
        await node.click();
        
       
        let checkBoxes = await page.$$eval('input[type=\'checkbox\']', e=>e.map((a)=>a.checked))
        
        await checkBoxes.forEach(checked=>{
            if(checked){
                selectedMediaCount+=1;
            }
        });
        
        await expect(selectedMediaCount).toBe(0);
        
        selectedMediaCount=0;

        nodes = await containsFirst('input[@type=\'checkbox\']//following::img', '');
        await nodes.click();
        
        nodes = await containsFirst('span', 'Assign Tag');  
        await nodes.click();
        
        node = await containsFirst('div[contains(@class, \'btn\') and contains(@class, \'ng-star-inserted\')]', '');
        await node.click();
        
        checkBoxes = await page.$$eval('input[type=\'checkbox\']', e => e.map((a) => a.checked))

        checkBoxes.forEach(checked => {
            if (checked) {
                selectedMediaCount += 1;
            }
        });

        expect(selectedMediaCount).toBe(1);
    });

    afterAll(async () => {
        await BeforeAfterEach.afterEach();
    })
});
