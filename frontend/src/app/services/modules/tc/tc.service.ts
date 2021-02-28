import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class TCService extends ServiceObject {

    protected module_url = '/tc';

    // objects urls
    public tc_layout = '/tc-layout';
    public tc_layout_sharing = '/tc-layout-sharing';
    public tc_settings = '/transfer-certificate-settings';
    public transfer_certificate = 'transfer-certificate-new';

}
