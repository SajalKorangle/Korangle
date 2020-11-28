import {BeforeAfterEach} from './beforeAterEach';

export async function containsFirst(tag, content) {
    await BeforeAfterEach.page.waitForXPath('//' + tag + '[contains(., "' + content + '")]');
    const [button] = await BeforeAfterEach.page.$x('//' + tag + '[contains(., "' + content + '")]');
    return button;
}

export async function containsAll(tag, content) {
    await BeforeAfterEach.page.waitForXPath('//' + tag + '[contains(., "' + content + '")]');
    const button = await BeforeAfterEach.page.$x('//' + tag + '[contains(., "' + content + '")]');
    return button;
}

export async function getNode(tag, content) {
    const [button] = await BeforeAfterEach.page.$x('//' + tag + '[contains(., "' + content + '")]');
    return button;
}

export async function getNodes(tag, content) {
    const button = await BeforeAfterEach.page.$x('//' + tag + '[contains(., "' + content + '")]');
    return button;
}