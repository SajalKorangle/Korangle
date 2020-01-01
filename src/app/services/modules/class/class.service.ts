import {Injectable} from '@angular/core';

import {ServiceObject} from "../../common/service-object";

import { CLASS_CONSTANT } from "./models/classs";
import { DIVISION_CONSTANT } from "./models/division";
import { HttpClient } from "@angular/common/http";

import {CacheStorage} from "../../../classes/cache-storage";


@Injectable()
export class ClassService extends ServiceObject {

    protected module_url = '/class';

    // objects urls
    public classs = '/class';
    public division = '/division';
    public class_teacher_signature = '/class-teacher-signature';

    constructor(private http_class: HttpClient) {
        super(http_class);
        this.constant_list[this.classs] = CLASS_CONSTANT;
        this.constant_list[this.division] = DIVISION_CONSTANT;
        this.file_list[this.class_teacher_signature] = this.class_teacher_signature;
    }
}
