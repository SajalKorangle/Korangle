import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class FeatureService extends ServiceObject {

    protected module_url = '/feature';

    // objects urls
    public feature = '/feature';

}
