import {Injectable} from '@angular/core';

import {ServiceObject} from "../../common/service-object";

import { CLASS_CONSTANT } from "./classs";
import { DIVISION_CONSTANT } from "./division";

@Injectable()
export class ClassService extends ServiceObject {

    protected module_url = '/class';

    // objects urls
    public classs = '/class';
    public division = '/division';

    constructor() {
        this.constant_list[this.classs] = CLASS_CONSTANT;
        this.constant_list[this.division] = DIVISION_CONSTANT;
    }

}
