import { AppPage } from './app.po';
import { browser, logging, element, by } from 'protractor';

var scrollIntoView = function (element) {
  arguments[0].scrollIntoView();
};

describe('Testing', () => {
  let page: AppPage; 
   
  beforeEach(() => {
    page = new AppPage();
    browser.driver.manage().window().maximize();
  });

  it('Checking Login Functionality',()=>{
    browser.waitForAngularEnabled(false);
    page.navigateTo();    

    element(by.name('username')).sendKeys('6264439636');
    element(by.name('password')).sendKeys('6264439636');
    element(by.buttonText('Login')).click();
    browser.sleep(5000);
    //console.log('Logged In');
  })

  it('Checking update profile page of Examination',()=>{
    //console.log('Openening Examination');    
    element(by.id('Students')).click();
    browser.sleep(7000);    
    element(by.id('Update Profile')).click();
    //console.log('Clicked On update profile');
    browser.sleep(7000);
    element(by.buttonText('Get')).click();
  })

  it('Checking Contact Us Page',()=>{
    browser.executeScript(scrollIntoView,element(by.id('settings')));
    element(by.id('settings')).click();
    browser.sleep(7000);
  
    browser.executeScript(scrollIntoView,element(by.id('Contact Us')));
    element(by.id('Contact Us')).click();
    browser.sleep(7000);
  })

  it('Checking View Marks Page',()=>{
    browser.executeScript(scrollIntoView,element(by.id('Examination')));
    element(by.id('Examination')).click();
    browser.sleep(7000);
  
    browser.executeScript(scrollIntoView,element(by.id('View Marks')));
    element(by.id('View Marks')).click();
    browser.sleep(7000);

    element.all(by.tagName('mat-form-field')).last().element((by.tagName('mat-select'))).click();
    browser.sleep(7000);

    element(by.cssContainingText('mat-option', 'Class - 7, Section - A')).click();    

    element(by.buttonText('GET')).click();
    browser.sleep(20000);    
  })

  it('Checking Log Out',()=>{
    browser.executeScript(scrollIntoView,element(by.id('Logout')));
    element(by.id('Logout')).click();    
    browser.sleep(10000); 
  })

  /*it('Checking View Marks Page',()=>{
    browser.waitForAngularEnabled(false);
    page.navigateTo();    

    element(by.name('username')).sendKeys('6264439636');
    element(by.name('password')).sendKeys('6264439636');
    element(by.buttonText('Login')).click();
    browser.sleep(5000);
    console.log('Logged In');

    // console.log('Openening Examination');    
    // element(by.id('Students')).click();
    // browser.sleep(10000);    
    // element(by.id('Update Profile')).click();
    // console.log('Clicked On update profile');
    // browser.sleep(10000);
    // element(by.buttonText('Get')).click();
    
    // browser.executeScript(scrollIntoView,element(by.id('settings')));
    // element(by.id('settings')).click();
    // browser.sleep(10000);
  
    // browser.executeScript(scrollIntoView,element(by.id('Contact Us')));
    // element(by.id('Contact Us')).click();
    // browser.sleep(10000);

    browser.executeScript(scrollIntoView,element(by.id('Examination')));
    element(by.id('Examination')).click();
    browser.sleep(10000);
  
    browser.executeScript(scrollIntoView,element(by.id('View Marks')));
    element(by.id('View Marks')).click();
    browser.sleep(10000);

    element.all(by.tagName('mat-form-field')).last().element((by.tagName('mat-select'))).click();
    browser.sleep(10000);

    element(by.cssContainingText('mat-option', 'Class - 7, Section - A')).click();
    //element.all(by.tagName('mat-select'))..click();

    element(by.buttonText('GET')).click();
    browser.sleep(20000);    

    browser.executeScript(scrollIntoView,element(by.id('Logout')));
    element(by.id('Logout')).click();    
    browser.sleep(10000);    
  })  */
});