import {Injectable} from '@angular/core';


import {ServiceObject} from "./common/service-object";

@Injectable()
export class EmployeeService extends ServiceObject {

    protected module_url = '/employee';

    // objects urls
    public employees = '/employees';

}
