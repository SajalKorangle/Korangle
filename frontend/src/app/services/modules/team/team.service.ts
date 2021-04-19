import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class TeamService extends ServiceObject {
    protected module_url = '/team';

    // objects urls
    public module = '/module';
    public task = '/task';
}
