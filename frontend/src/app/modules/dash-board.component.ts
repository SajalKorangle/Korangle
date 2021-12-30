import {Component, OnInit} from '@angular/core';
import {CommonFunctions} from '@classes/common-functions';
import {ModalVideoComponent} from '@basic-components/modal-video/modal-video.component';
import {MatDialog} from '@angular/material/dialog';
import {User} from '@classes/user';
import {DataStorage} from '@classes/data-storage';

@Component({
    styleUrls: ['../app.component.css'],
    templateUrl: './dash-board.component.html',
})
export class DashBoardComponent implements OnInit {

    user: User;

    constructor(private dialog: MatDialog) {
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    showTutorial(url: any) {
        this.dialog.open(ModalVideoComponent, {
            height: '80vh',
            width: '80vw',
            data: {
                videoUrl: url,
            },
        });
    }

    userHasAssignTaskCapability(): boolean {
        for (let i = 0; i < this.user.activeSchool.moduleList.length; i++) {
            if (this.user.activeSchool.moduleList[i].path === 'employees') {
                const cd = this.user.activeSchool.moduleList[i];
                for (let j = 0; j < cd.taskList.length; j++) {
                    if (cd.taskList[j].path === 'assign_task') {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    getExpiryStatement(): any {
        // 1. User exists, 2. Active School is present, 3. Active School has a date of expiry
        // 4. show only in desktop,
        // 5. User has assign task permission of the School, So that expiry statement is shown only to administrator,
        // 6. Date of Expiry is less than 10 days away
        if (this.user
            && this.user.activeSchool
            && this.user.activeSchool.dateOfExpiry
            && !CommonFunctions.getInstance().isMobileMenu()
            && this.userHasAssignTaskCapability()) {
            let dateOfExpiryInDateObject = new Date(this.user.activeSchool.dateOfExpiry + 'T23:59:59');
            let todaysDate = new Date();
            if (Math.abs(dateOfExpiryInDateObject.getTime() - todaysDate.getTime()) / (1000 * 60 * 60 * 24) < 15) {
                return 'Your school will expire on ' + this.formatDate(dateOfExpiryInDateObject);
            }
        }
        return '';
    }

    formatDate(date): any {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }

        return [day, month, year].join('-');
    }
}
