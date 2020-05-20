import {BeforeAfterEach} from '../beforeAterEach';

describe('workspace-project App', () => {

    let page: any;

    beforeEach( async () => {
        page = await BeforeAfterEach.beforeEach();
    });

    it('login check', async () => {

        console.log('Just Checking logging');

    });

    afterEach(async () => {
        await BeforeAfterEach.afterEach();
    })

});
