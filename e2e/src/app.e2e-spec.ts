import { AppPage } from './app.po';
import { browser, logging, element, by } from 'protractor';

var scrollIntoView = function (element) {
  arguments[0].scrollIntoView();
};


describe('workspace-project App', () => {
  let page: AppPage; 
   
  beforeEach(() => {
    page = new AppPage();
    browser.driver.manage().window().maximize();
  });

  it('check',()=>{
    browser.waitForAngularEnabled(false);
    page.navigateTo();

    element(by.name('username')).sendKeys('6264439636');
    element(by.name('password')).sendKeys('6264439636');
    element(by.buttonText('Login')).click();
    browser.sleep(5000);
    console.log('Logged In');

    console.log('Opening Student');
    element(by.id('Employee-Students')).click();
    browser.sleep(2000);    
    element(by.id('Students-Update Profile')).click();
    console.log('Clicked On update profile');
    browser.sleep(10000);
    element(by.buttonText('Get')).click();
    
    browser.executeScript(scrollIntoView,element(by.id('Settings')));
    element(by.id('Settings')).click();
    browser.sleep(1000);
  
    browser.executeScript(scrollIntoView,element(by.id('Settings-Contact Us')));
    element(by.id('Settings-Contact Us')).click();
    browser.sleep(1000);

    browser.executeScript(scrollIntoView,element(by.id('Logout')));
    element(by.id('Logout')).click();    
    browser.sleep(10000);    
  })  
});
