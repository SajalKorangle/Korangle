import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class EmployeeService extends ServiceObject {

    protected module_url = '/employee';

    // objects urls
    public employees = '/employees';

    public employee_permissions = '/employee-permissions';

    public employee_session_detail = '/employee-session-detail'

    public employee_parameter = '/employee-parameter';

    public employee_parameter_value = '/employee-parameter-value';

}
