import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'grade'})
export class GradePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer){}
    transform(marks: any) {
        // console.log(html);
        /*if(html == "" || html == null || html == "<div>&nbsp;</div>") {
            return onEmpty;
        }*/
        if (marks > 80) {
            return 'A';
        } else if (marks > 60) {
            return 'B';
        } else if (marks > 40) {
            return 'C';
        } else if (marks > 20) {
            return 'D';
        }
        return 'E';
    }
}
