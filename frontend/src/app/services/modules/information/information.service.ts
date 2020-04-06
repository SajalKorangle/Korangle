import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class InformationService extends ServiceObject {

    protected module_url = '/information';

    // objects urls
    public message_type = '/message-type';

}
