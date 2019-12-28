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

    public get_classes = '/classes';
    public get_sections = '/sections';
    constructor(private http_class: HttpClient) {
        super(http_class);
        this.constant_list[this.classs] = CLASS_CONSTANT;
        this.constant_list[this.division] = DIVISION_CONSTANT;
        this.file_list[this.class_teacher_signature] = this.class_teacher_signature;
    }

    getClassList(): Promise<any> {
        if (!CacheStorage.getInstance().classList) {
            let url = this.module_url + this.get_classes;
            return super.getData(url).then(response => {
                CacheStorage.getInstance().classList = response;
                return response;
            });
        }
        return Promise.resolve(CacheStorage.getInstance().classList);
    }

    getSectionList(): Promise<any> {
        if (!CacheStorage.getInstance().sectionList) {
            let url = this.module_url + this.get_sections;
            return super.getData(url).then(response => {
                CacheStorage.getInstance().sectionList = response;
                return response;
            });
        }
        return Promise.resolve(CacheStorage.getInstance().sectionList);
    }

}
