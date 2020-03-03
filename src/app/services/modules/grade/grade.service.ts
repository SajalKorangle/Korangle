import {Injectable} from '@angular/core';


import {ServiceObject} from "../../common/service-object";

@Injectable()
export class GradeService extends ServiceObject {

  protected module_url = '/grade';

  // objects urls
  public grades = '/grades';
  public sub_grades = '/sub-grades';
  public student_sub_grades = '/student-sub-grades'

}
