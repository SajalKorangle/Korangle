import {Component, Input } from '@angular/core';

import { SchoolService } from './school.service';

@Component({
  selector: 'app-school-profile',
  templateUrl: './school-profile.component.html',
  styleUrls: ['./school-profile.component.css'],
    providers: [  ],
})

export class SchoolProfileComponent {

    @Input() user;

    isLoading = false;

    constructor (private schoolService: SchoolService) { }

    updateSchoolProfile(): void {
        const data = {
            getData: {
                schoolDbId: this.user.schoolDbId,
            },
            postData: {
                printName: this.user.schoolPrintName,
                diseCode: this.user.schoolDiseCode,
            },
        }
        this.schoolService.updateSchoolProfile(data, this.user.jwt).then(
            message => {

            }
        )
    }

}
