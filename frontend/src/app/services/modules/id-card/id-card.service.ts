import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class IdCardService extends ServiceObject {

    protected module_url = '/id-card';

    // objects urls
    public id_card_layout = '/id-card-layout';
    public id_card_text_structure = '/id-card-text-structure';
    public id_card_date_structure = '/id-card-date-structure';
    public id_card_image_structure = '/id-card-image-structure';

    constructor(private http_class: HttpClient) {
        super(http_class);
        this.file_list[this.id_card_layout] = this.id_card_layout;
    }

}
