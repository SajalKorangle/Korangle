import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HomeworkService extends ServiceObject {

    protected module_url = '/homework';

    // objects urls
    public homeworks =  '/homework';
    public homework_question = '/homework-question';
    public homework_status = '/homework-status';
    public homework_answer = '/homework-answer';
    public homework_settings = '/homework-settings';
    
    constructor(private http_class: HttpClient) {
        super(http_class);
        this.file_list[this.homework_question] = this.homework_question;
        this.file_list[this.homework_answer] = this.homework_answer;
    }
}
