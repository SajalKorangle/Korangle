import {Injectable} from '@angular/core';

import {ServiceObject} from "../../common/service-object";

import { BOARD_CONSTANT } from "./models/board";
import { SESSION_CONSTANT } from "./models/session";

import { HttpClient } from "@angular/common/http";

@Injectable()
export class SchoolService extends ServiceObject {

    protected module_url = '/school';

    // objects urls
    public board = '/board';
    public session = '/session'

    constructor(private http_class: HttpClient) {
        super(http_class);
        this.constant_list[this.session] = SESSION_CONSTANT;
        this.constant_list[this.board] = BOARD_CONSTANT;
    }

}
