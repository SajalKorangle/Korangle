import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class FeatureService extends ServiceObject {

    protected module_url = '/feature';

    // objects urls
    public feature = '/feature';

    constructor(private http_class: HttpClient) {
        super(http_class);
    }

}
