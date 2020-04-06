import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class UserService extends ServiceObject {

    protected module_url = '/user';

    // objects urls
    public user = '/users';

}
