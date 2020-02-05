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

        browser.executeScript(scrollIntoView,element(by.id('Settings-Contact Us')));
        element(by.id('Settings-Contact Us')).click();
        browser.sleep(2000);

    });

    afterEach(() => {
        page.afterEach();
    });

});
