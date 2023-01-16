import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

import { BOARD_CONSTANT } from './models/board';

import { HttpClient } from '@angular/common/http';

@Injectable()
export class SchoolService extends ServiceObject {
    protected module_url = '/school';

    // objects urls
    public board = '/board';
    public bus_stop = '/bus-stops';
    public school_summary = '/school-summary';

    constructor(private http_class: HttpClient) {
        super(http_class);
        this.constant_list[this.board] = BOARD_CONSTANT;
    }
}
