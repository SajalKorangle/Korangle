import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { isMobile } from '@classes/common';

@Component({
    selector: 'app-filter-modal',
    templateUrl: './filter-modal.component.html',
    styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent implements OnInit {

    filter: any;
    isEditing: boolean = false;

    /* Row Name */
    name: string = "";
    isNameProvided: boolean = true;

    /* Age Check */
    minAge: number;
    maxAge: number;
    asOnDate;

    /* Category Options */
    scSelected: boolean = false;
    stSelected: boolean = false;
    obcSelected: boolean = false;
    generalSelected: boolean = false;
    noneCategory: boolean = false;

    /* Gender Options */
    maleSelected: boolean = false;
    femaleSelected: boolean = false;
    otherGenderSelected: boolean = false;
    noneGender: boolean = false;

    /* Admission Session Options */
    newAdmission: boolean = false;
    oldAdmission: boolean = false;
    noneAdmission: boolean = false;

    /* RTE Options */
    yesRTE: boolean = false;
    noRTE: boolean = false;
    noneRTE: boolean = false;

    /* TC Options */
    noTC: boolean = false;
    yesTC: boolean = false;

    classSectionList: any = [];
    studentParameterList: any = [];

    constructor(
        public dialogRef: MatDialogRef<FilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.classSectionList = data.classSectionList;
        this.studentParameterList = data.studentParameterList;

        /* Initialize Default Value of Filters */
        if (data.filter) {
            this.isEditing = true;
            this.filter = data.filter;
            this.studentParameterList = this.filter["studentParameterList"];
            this.name = this.filter["name"];

            /* Initialize class-section */
            if (this.filter["selectedClass"]) {
                let selectedClass = this.filter["selectedClass"];
                this.classSectionList.forEach((classs) => {
                    classs.sectionList.forEach((section) => {
                        let classSectionName = classs.name + ", " + section.name;
                        if (selectedClass.includes(classSectionName)) {
                            section.selected = true;
                        }
                    });
                });
            }   //  Ends: Initialize class-section

            /* Initialize category */
            if (this.filter["category"]) {
                let category = this.filter["category"];
                if (category.includes("SC")) {
                    this.scSelected = true;
                }
                if (category.includes("ST")) {
                    this.stSelected = true;
                }
                if (category.includes("OBC")) {
                    this.obcSelected = true;
                }
                if (category.includes("Gen.")) {
                    this.generalSelected = true;
                }
                if (category.includes("NONE")) {
                    this.noneCategory = true;
                }
            }   //  Ends: Initialize category

            /* Initialize age */
            if (this.filter["age"]) {
                let age = this.filter["age"];

                let newDate = new Date(age[0]);
                this.asOnDate = newDate.toJSON().slice(0, 10);
                this.minAge = age[1];
                this.maxAge = age[2];
            }   //  Ends: Initialize age

            /* Initialize gender */
            if (this.filter["gender"]) {
                let gender = this.filter["gender"];
                if (gender.includes("Male")) {
                    this.maleSelected = true;
                }
                if (gender.includes("Female")) {
                    this.femaleSelected = true;
                }
                if (gender.includes("Other")) {
                    this.otherGenderSelected = true;
                }
                if (gender.includes("NONE")) {
                    this.noneGender = true;
                }
            }   //  Ends: Initialize gender

            /* Initialize admission */
            if (this.filter["admission"]) {
                let admission = this.filter["admission"];
                if (admission.includes("New")) {
                    this.newAdmission = true;
                }
                if (admission.includes("Old")) {
                    this.oldAdmission = true;
                }
                if (admission.includes("NONE")) {
                    this.noneAdmission = true;
                }
            }   //  Ends: Initialize admission

            /* Initialize RTE */
            if (this.filter["RTE"]) {
                let rte = this.filter["RTE"];
                if (rte.includes("YES")) {
                    this.yesRTE = true;
                }
                if (rte.includes("NO")) {
                    this.noRTE = true;
                }
                if (rte.includes("NONE")) {
                    this.noneRTE = true;
                }
            }   //  Ends: Initialize RTE

            /* Initialize TC */
            if (this.filter["TC"]) {
                let tc = this.filter["TC"];
                if (tc.includes("YES")) {
                    this.yesTC = true;
                }
                if (tc.includes("NO")) {
                    this.noTC = true;
                }
            }   //  Ends: Initialize TC

        }  // Ends: Initialize Default Value of Filters
        else {
            let today = new Date();
            today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
            this.asOnDate = today.toJSON().slice(0, 10);
        }
    }

    ngOnInit() { }

    /* Check Width - maxidth (575) */
    /* It is being used to style the page based on width.
     For a very small device, some "<br />" needs to removed. */
    checkWidth(): boolean {
        if (window.innerWidth > 991) {
            return false;
        }
        return true;
    }

    /* For mobile-application */
    checkMobile(): boolean {
        return isMobile();
    }

    /* Unselect All Classes */
    unselectAllClasses(): void {
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = false;
            });
        });
    }  // Ends: unselectAllClasses()

    /* Select All Classes */
    selectAllClasses(): void {
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = true;
            });
        });
    }  // Ends: selectAllClasses()

    /* Show Section Name */
    showSectionName(classs: any): boolean {
        let sectionLength = 0;
        classs.sectionList.every((section) => {
            if (section.containsStudent) {
                ++sectionLength;
            }
            if (sectionLength > 1) {
                return false;
            } else {
                return true;
            }
        });
        return sectionLength > 1;
    }  // Ends: showSectionName()

    getFilteredStudentParameterList = () => this.studentParameterList.filter((x) => x.parameterType === 'FILTER');

    /* Get parameter value */
    getFilteredFilterValues(parameter: any): any {
        if (parameter.filterFilterValues === '') {
            return parameter.filterValues;
        }
        return parameter.filterValues.filter((x) => {
            return x.name.includes(parameter.filterFilterValues);
        });
    }  // Ends: getFilteredFilterValues()

    /* Make input-date non-typeable */
    handleOnKeyDown(event: any) {
        let keyPressed = event.keyCode;
        if (keyPressed != 8 && keyPressed != 46) { //check if it is not delete
            return false; // don't allow to input any value
        }
    }  // Ends: handleOnKeyDown()

    /* Delete Button Clicked */
    deleteClick(): void {
        let conformation = confirm("Do you really want to delete this?");
        if (conformation) {
            this.unselectAllClasses();
            if (this.isEditing) {
                let filtersData = {};
                filtersData["operation"] = "delete";
                this.dialogRef.close({ filtersData: filtersData });
            }
            else {
                this.dialogRef.close();
            }
        }
    }  // Ends: deleteClick()

    /* Apply Button Clicked */
    applyClick(): void {
        if (!this.name.toString().trim()) {
            this.isNameProvided = false;
            alert("Please enter the name.");
            return;
        }
        this.isNameProvided = true;

        if (this.asOnDate) {
            if (this.minAge != null && !isNaN(this.minAge) && this.maxAge != null && !isNaN(this.maxAge) && this.minAge > this.maxAge) {
                alert("min-age should be less than or equal to max-age.");
                return;
            }
        }

        if ((this.minAge != null && !isNaN(this.minAge)) || (this.maxAge != null && !isNaN(this.maxAge))) {
            if (!this.asOnDate) {
                alert("Please choose a date from the age section.");
                return;
            }
        }

        let filtersData = {};

        /* Class-Section */
        let selectedClass = [];
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                if (section.selected) {
                    selectedClass.push(classs.name + ", " + section.name);
                    section.selected = false;
                }
            });
        });
        if (selectedClass.length > 0) {
            filtersData["selectedClass"] = selectedClass;
        }
        /* Ends: Class-Section */

        /* Name */
        filtersData["name"] = this.name.toString().trim();

        /* Age */
        let age = [];
        if (this.asOnDate) {
            age.push(this.asOnDate);

            if (this.minAge != null && !isNaN(this.minAge)) {
                age.push(this.minAge);
            } else {
                age.push(null);
            }

            if (this.maxAge != null && !isNaN(this.maxAge)) {
                age.push(this.maxAge);
            } else {
                age.push(null);
            }

            filtersData["age"] = age;
        }
        /* Ends: Age */

        /* Category */
        let category = [];
        if (this.scSelected) {
            category.push("SC");
        }
        if (this.stSelected) {
            category.push("ST");
        }
        if (this.obcSelected) {
            category.push("OBC");
        }
        if (this.generalSelected) {
            category.push("Gen.");
        }
        if (this.noneCategory) {
            category.push("NONE");
        }
        if (category.length > 0) {
            filtersData["category"] = category;
        }
        /* Ends: Category */

        /* Gender */
        let gender = [];
        if (this.maleSelected) {
            gender.push("Male");
        }
        if (this.femaleSelected) {
            gender.push("Female");
        }
        if (this.otherGenderSelected) {
            gender.push("Other");
        }
        if (this.noneGender) {
            gender.push("NONE");
        }
        if (gender.length > 0) {
            filtersData["gender"] = gender;
        }
        /* Ends: Gender */

        /* Admission */
        let admission = [];
        if (this.newAdmission) {
            admission.push("New");
        }
        if (this.oldAdmission) {
            admission.push("Old");
        }
        if (this.noneAdmission) {
            admission.push("NONE");
        }
        if (admission.length > 0) {
            filtersData["admission"] = admission;
        }
        /* Ends: Admission */

        /* RTE */
        let rte = [];
        if (this.yesRTE) {
            rte.push("YES");
        }
        if (this.noRTE) {
            rte.push("NO");
        }
        if (this.noneRTE) {
            rte.push("NONE");
        }
        if (rte.length > 0) {
            filtersData["RTE"] = rte;
        }
        /* Ends: RTE */

        /* TC */
        let tc = [];
        if (this.yesTC) {
            tc.push("YES");
        }
        if (this.noTC) {
            tc.push("NO");
        }
        if (tc.length > 0) {
            filtersData["TC"] = tc;
        }
        /* Ends: TC */

        filtersData["studentParameterList"] = this.studentParameterList;

        /* Operation Type */
        if (this.isEditing) {
            filtersData["operation"] = "update";
            this.dialogRef.close({ filtersData: filtersData });
        } else {
            this.dialogRef.close({ filtersData: filtersData });
        }
        /* Ends:  Operation Type */
    }  // Ends: applyClick()
}
