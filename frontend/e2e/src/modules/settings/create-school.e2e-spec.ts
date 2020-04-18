import { browser, logging, element, by } from 'protractor';
import {AppPage} from "../../app.po";

var scrollIntoView = function (element) {
    arguments[0].scrollIntoView();
};


describe('workspace-project App', () => {

    let page = new AppPage();

    beforeEach(() => {
        page.beforeEach();
    });

    it('check',()=>{

        console.log('Opening Settings');
        browser.executeScript(scrollIntoView,element(by.id('Settings')));
        element(by.id('Settings')).click();
        browser.sleep(2000);

        browser.executeScript(scrollIntoView,element(by.id('Settings-Create School')));
        element(by.id('Settings-Create School')).click();
        browser.sleep(3000);

    });

    afterEach(() => {
        page.afterEach();
    });

});
