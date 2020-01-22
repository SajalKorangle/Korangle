import { browser, by, element } from 'protractor';

export class AppPage {
  navigateToURL(url) {
    return browser.get(browser.baseUrl + url) as Promise<any>;
  }

  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root .content span')).getText() as Promise<string>;
  }
}
