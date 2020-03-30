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

    console.log('Opening Student');
    element(by.id('Employee-Students')).click();
    browser.sleep(2000);    
    element(by.id('Students-Update Profile')).click();
    console.log('Clicked On update profile');
    browser.sleep(10000);
    element(by.buttonText('Get')).click();

  });

  afterEach(() => {
    page.afterEach();
  });

});
