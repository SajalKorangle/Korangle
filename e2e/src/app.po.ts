import { browser, by, element } from 'protractor';

var scrollIntoView = function (element) {
    arguments[0].scrollIntoView();
};

export class AppPage {

  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  beforeEach() {

      browser.driver.manage().window().maximize();
      browser.waitForAngularEnabled(false);
      this.navigateTo();

      element(by.name('username')).sendKeys('6264439636');
      element(by.name('password')).sendKeys('6264439636');
      element(by.buttonText('Login')).click();
      browser.sleep(5000);
      console.log('Logged In');

  }

  afterEach() {
      browser.executeScript(scrollIntoView,element(by.id('Logout')));
      element(by.id('Logout')).click();
      browser.sleep(2000);
  }

}
