import { Component, OnInit } from '@angular/core';
import { DataStorage } from "@classes/data-storage";
import { GenericService } from '@services/generic/generic-service';
import {
    FormControl,
    Validators,
    AbstractControl,
    ValidationErrors,
    ValidatorFn
} from '@angular/forms';

function notDecimalNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const forbidden = !Number.isInteger(control.value);
        return forbidden ? { notDecimalNumber: { value: control.value } } : null;
    };
}

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [GenericService]
})
export class SettingsComponent implements OnInit {
    user: any;

    isLoading: boolean = false;

    maxStudentIssueCountFormControl = new FormControl(0, [Validators.min(0), Validators.required, notDecimalNumberValidator()]);
    maxEmployeeIssueCountFormControl = new FormControl(0, [Validators.min(0), Validators.required, notDecimalNumberValidator()]);

    settingsDbId: number = null;

    constructor(public genericService: GenericService) { }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.getSchoolSettings();
    }

    getSchoolSettings() {
        this.isLoading = true;
        let query = {
            filter: {
                parentSchool_id: this.user.activeSchool.dbId
            }
        };

        this.genericService.getObject({ library_app: "SchoolLibrarySettings" }, query)
            .then(async (settings) => {
                if (!settings) {
                    settings = await this.genericService.createObject({ library_app: "SchoolLibrarySettings" }, {
                        parentSchool: this.user.activeSchool.dbId
                    });
                }

                this.settingsDbId = settings.id;
                this.maxStudentIssueCountFormControl.setValue(settings.maxStudentIssueCount);
                this.maxEmployeeIssueCountFormControl.setValue(settings.maxEmployeeIssueCount);
                this.isLoading = false;
            });
    }

    isUpdateDisabled() {
        return this.maxStudentIssueCountFormControl.errors || this.maxEmployeeIssueCountFormControl.errors;
    }

    updateSettings() {
        this.isLoading = true;

        this.genericService.partiallyUpdateObject({ library_app: "SchoolLibrarySettings" }, {
            id: this.settingsDbId,
            maxStudentIssueCount: this.maxStudentIssueCountFormControl.value,
            maxEmployeeIssueCount: this.maxEmployeeIssueCountFormControl.value
        }).then((res) => {
            alert("School Library Settings updated Successfully!");
            this.isLoading = false;
        });
    }
}
