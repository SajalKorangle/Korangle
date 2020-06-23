import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class IdCardService extends ServiceObject {

    protected module_url = '/id-card';

    // objects urls
    public id_card_layout = '/id-card-layout';

    constructor(private http_class: HttpClient) {
        super(http_class);
        this.file_list[this.id_card_layout] = this.id_card_layout;
    }

}