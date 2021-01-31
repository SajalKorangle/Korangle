import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HomeworkService extends ServiceObject {

    protected module_url = '/homework';

    // objects urls
    public homework_question =  '/homework-question';
    public homework_question_image = '/homework-question-image';
    public homework_answer = '/homework-answer';
    public homework_answer_image = '/homework-answer-image';
    public homework_settings = '/homework-settings';
    
    constructor(private http_class: HttpClient) {
        super(http_class);
    }
}
