import { browser, logging, element, by } from 'protractor';
import {AppPage} from "../app.po";

var scrollIntoView = function (element) {
    arguments[0].scrollIntoView();
};


describe('workspace-project App', () => {

    let page = new AppPage();

    beforeEach(() => {
        page.beforeEach();
    });

    it('login-check',()=>{

        console.log('Just Testing login');
        browser.sleep(10000);

    });

    afterEach(() => {
        page.afterEach();
    });

});
