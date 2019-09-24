import {Injectable} from '@angular/core';

import {ServiceObject} from "../../common/service-object";

import { CLASS_CONSTANT } from "./models/classs";
import { DIVISION_CONSTANT } from "./models/division";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ClassService extends ServiceObject {

    protected module_url = '/class';

    // objects urls
    public classs = '/class';
    public division = '/division';

    constructor(private http_class: HttpClient) {
        super(http_class);
        this.constant_list[this.classs] = CLASS_CONSTANT;
        this.constant_list[this.division] = DIVISION_CONSTANT;
    }

}
