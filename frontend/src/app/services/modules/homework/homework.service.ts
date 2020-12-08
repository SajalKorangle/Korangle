import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class HomeworkService extends ServiceObject {

    protected module_url = '/homework';

    // objects urls
    public homeworks =  '/homework';
    public homework_question = '/homework-question';
    public homework_status = '/homework-status';
    public homework_answer = '/homework-answer';
    // public employees = '/employees';

}
