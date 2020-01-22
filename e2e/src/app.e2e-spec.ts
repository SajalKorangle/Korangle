import { AppPage } from './app.po';
import { browser, logging, element, by } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage; 
   
  beforeEach(() => {
    page = new AppPage();
    //browser.driver.manage().window().setSize(1280, 1024);
  });

  it('check',()=>{
    browser.waitForAngularEnabled(false);
    page.navigateTo();
    //page.navigateToURL('/notification/view_notifications');
    //expect('hello').toBe('hello');
    //var EC = browser.ExpectedConditions;
    //browser.wait(EC.visibilityOf(element(by.id('hello'))));
    element(by.name('username')).sendKeys('6264439636');
    element(by.name('password')).sendKeys('6264439636');
    element(by.buttonText('Login')).click();
    browser.sleep(5000);
    element(by.id('Students')).click();
    browser.sleep(2000);
    element(by.id('Update Profile')).click();
    browser.sleep(10000);
    element(by.buttonText('Get')).click();
    // browser.executeScript('window.scrollTo(100,620);').then(function() {
    //   element(by.id('settings')).click();
    // });
    //expect(element(by.id('settings')).getText()).toBe('Settings');
    //element(by.id('settings')).click();
    // var filter = browser.findElement(by.id('settings'));
    // var scrollIntoView = function () {
    //   arguments[0].scrollIntoView();
    // };
    // browser.executeScript(scrollIntoView, filter);
    // browser.actions().mouseMove(element(by.id('settings'))).perform();
    // element(by.id('settings')).click();
    // browser.sleep(2000);
    // browser.actions().mouseMove(element(by.id('Contact Us'))).perform();
    // element(by.id('Contact Us')).click();
    // var filter = browser.findElement(by.id('Contact Us'));
    // var scrollIntoView = function () {
    //   arguments[0].scrollIntoView();
    // };
    // browser.executeScript(scrollIntoView, filter);
    browser.sleep(8000);
    //expect(element(by.id('hello')).getText()).toBe('RANDOM TEXT');
  })
  // beforeEach(() => {
  //   page = new AppPage();
  // });

  // it('should display welcome message', () => {
  //   page.navigateTo();
  //   expect(page.getTitleText()).toEqual('test-app app is running!');
  // });

  // afterEach(async () => {
  //   // Assert that there are no errors emitted from the browser
  //   const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  //   expect(logs).not.toContain(jasmine.objectContaining({
  //     level: logging.Level.SEVERE,
  //   } as logging.Entry));
  // });
});
