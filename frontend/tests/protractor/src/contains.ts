import {BeforeAfterEach} from './beforeAterEach';

export async function contains(tag, content) {
    await BeforeAfterEach.page.waitForXPath('//' + tag + '[contains(., "' + content + '")]');
    const [button] = await BeforeAfterEach.page.$x('//' + tag + '[contains(., "' + content + '")]');
    return button;
}
