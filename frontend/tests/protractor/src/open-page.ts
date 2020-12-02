import {BeforeAfterEach} from './beforeAterEach';

export async function openModuleAndPage(moduleName, pageName) {
    await BeforeAfterEach.page.waitForXPath('//p[contains(., "' + moduleName + '")]');
    let [button] = await BeforeAfterEach.page.$x('//p[contains(., "' + moduleName + '")]');
    await button.click();
    await BeforeAfterEach.page.waitForXPath('//p[contains(., "' + pageName + '")]');
    [button] = await BeforeAfterEach.page.$x('//p[contains(., "' + pageName + '")]');
    await button.click();
}

export async function reClickPage(pageName) {
    await BeforeAfterEach.page.waitForXPath('//p[contains(., "' + pageName + '")]');
    const [button] = await BeforeAfterEach.page.$x('//p[contains(., "' + pageName + '")]');
    await button.click();
}
