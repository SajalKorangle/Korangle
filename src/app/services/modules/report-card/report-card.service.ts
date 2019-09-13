import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class ReportCardService extends ServiceObject {

    protected module_url = '/report-card';

}
