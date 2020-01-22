import { AppPage } from './app.po';
import { browser, logging, element, by } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage; 
   
  beforeEach(() => {
    page = new AppPage();
  });

  it('check',()=>{
    page.navigateTo();
    browser.sleep(5000);
    //expect('hello').toBe('hello');
    expect(element(by.id('hello')).getText()).toBe('RANDOM TEXT');
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
