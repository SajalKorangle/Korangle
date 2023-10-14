import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { isMobile } from '@classes/common';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-student-list-filter-modal',
    templateUrl: './student-list-filter-modal.component.html',
    styleUrls: ['./student-list-filter-modal.component.css']
})
export class StudentListFilterModalComponent implements OnInit {

    /* Class Section List */
    classSectionList: any = [];

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
    generatedTC: boolean = false;
    issuedTC: boolean = false;
    noneTC: boolean = false;

    // Student Custom Filter List
    studentCustomFilterList: any = [];

    constructor(
        public dialogRef: MatDialogRef<StudentListFilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {

        // Starts : Populate class section List
        data.classList.forEach(classs => {
            let tempSectionList = [];
            data.sectionList.forEach(section => {
                if (data.studentSectionList.find(studentSection => {
                    return studentSection.parentClass == classs.id &&
                        studentSection.parentDivision == section.id;
                })) {
                    tempSectionList.push({
                        ...section,
                        'selected': (
                            data.studentListFilter &&
                            data.studentListFilter['selectedClassList'] &&
                            data.studentListFilter['selectedClassList'].includes(classs.name + ", " + section.name)
                        ) ? true : false
                    });
                }
            });
            if (tempSectionList.length > 0) {
                this.classSectionList.push({
                    ...classs,
                    'sectionList': tempSectionList
                });
            }
        });
        // Ends : Populate class section List

        /* Initialize Default Value of Filters */
        if (data.studentListFilter) {

            /* Initialize category */
            if (data.studentListFilter["category"]) {
                let category = data.studentListFilter["category"];
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
            if (data.studentListFilter["age"]) {
                let age = data.studentListFilter["age"];

                let newDate = new Date(age['asOnDate']);
                this.asOnDate = newDate.toJSON().slice(0, 10);
                this.minAge = age['minAge'];
                this.maxAge = age['maxAge'];
            }   //  Ends: Initialize age

            /* Initialize gender */
            if (data.studentListFilter["gender"]) {
                let gender = data.studentListFilter["gender"];
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
            if (data.studentListFilter["admission"]) {
                let admission = data.studentListFilter["admission"];
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
            if (data.studentListFilter["RTE"]) {
                let rte = data.studentListFilter["RTE"];
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
            if (data.studentListFilter["TC"]) {
                let tc = data.studentListFilter["TC"];
                if (tc.includes("Generated")) {
                    this.generatedTC = true;
                }
                if (tc.includes("Issued")) {
                    this.issuedTC = true;
                }
                if (tc.includes("NONE")) {
                    this.noneTC = true;
                }
            }   //  Ends: Initialize TC

        }  // Ends: Initialize Default Value of Filters
        else {
            let today = new Date();
            today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
            this.asOnDate = today.toJSON().slice(0, 10);
        }

        // Starts : Populate Student Parameter List
        this.studentCustomFilterList = data.studentCustomFilterList;
        this.studentCustomFilterList = data.studentCustomFilterList.map((studentCustomFilter) => ({
            ...studentCustomFilter,
            noneSelected: (
                data.studentListFilter &&
                data.studentListFilter['studentCustomFilterList'] &&
                data.studentListFilter['studentCustomFilterList'].find(item => item.id == studentCustomFilter.id) &&
                data.studentListFilter['studentCustomFilterList'].find(item => item.id == studentCustomFilter.id)['noneSelected']
            ),
            filterValues: JSON.parse(studentCustomFilter.filterValues).map((filterValue) => ({
                name: filterValue,
                selected: (
                    data.studentListFilter &&
                    data.studentListFilter['studentCustomFilterList'] &&
                    data.studentListFilter['studentCustomFilterList'].find(item => item.id == studentCustomFilter.id) &&
                    data.studentListFilter['studentCustomFilterList'].find(item => item.id == studentCustomFilter.id)['filterValues']
                        .includes(filterValue)
                ) ? true : false
            })),
            userFilterText$: new BehaviorSubject<any>(''),
        }));
        this.studentCustomFilterList.forEach(studentCustomFilter => {
            studentCustomFilter.userFilterText$.asObservable().subscribe(value => {
                if (value === '') {
                    studentCustomFilter['filteredFilterValues'] = studentCustomFilter.filterValues;
                } else {
                    studentCustomFilter['filteredFilterValues'] = studentCustomFilter.filterValues.filter((filterValue) => {
                        return filterValue.name.includes(value);
                    });
                }
            });
        });
        // Ends : Populate Student Parameter List

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

    /* Apply Button Clicked */
    applyClick(): void {

        // Starts : Checking if minimum age is less than or equals to maximum age.
        if (this.asOnDate) {
            if (this.minAge != null && !isNaN(this.minAge) && this.maxAge != null && !isNaN(this.maxAge) && this.minAge > this.maxAge) {
                alert("min-age should be less than or equal to max-age.");
                return;
            }
        }
        // Ends : Checking if minimum age is less than or equals to maximum age.

        // Starts : Checking if date field is populated or not when age filters are set
        if ((this.minAge != null && !isNaN(this.minAge)) || (this.maxAge != null && !isNaN(this.maxAge))) {
            if (!this.asOnDate) {
                alert("Please choose a date from the age section.");
                return;
            }
        }
        // Ends : Checking if date field is populated or not when age filters are set

        let studentListFilter = {};

        /* Class-Section */
        let selectedClassList = [];
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                if (section.selected) {
                    selectedClassList.push(classs.name + ", " + section.name);
                    section.selected = false;
                }
            });
        });
        if (selectedClassList.length > 0) {
            studentListFilter["selectedClassList"] = selectedClassList;
        }
        /* Ends: Class-Section */

        /* Age */
        let age = {};
        if (this.asOnDate && ((this.minAge && !isNaN(this.minAge)) ||  (this.maxAge && !isNaN(this.maxAge)))) {
            age['asOnDate'] = this.asOnDate;

            if (this.minAge != null && !isNaN(this.minAge)) {
                age['minAge'] = this.minAge;
            } else {
                age['minAge'] = null;
            }

            if (this.maxAge != null && !isNaN(this.maxAge)) {
                age['maxAge'] = this.maxAge;
            } else {
                age['maxAge'] = null;
            }

            studentListFilter["age"] = age;
        }
        /* Ends: Age */

        /* Category */
        let categoryList = [];
        if (this.scSelected) {
            categoryList.push("SC");
        }
        if (this.stSelected) {
            categoryList.push("ST");
        }
        if (this.obcSelected) {
            categoryList.push("OBC");
        }
        if (this.generalSelected) {
            categoryList.push("Gen.");
        }
        if (this.noneCategory) {
            categoryList.push("NONE");
        }
        if (categoryList.length > 0) {
            studentListFilter["category"] = categoryList;
        }
        /* Ends: Category */

        /* Gender */
        let genderList = [];
        if (this.maleSelected) {
            genderList.push("Male");
        }
        if (this.femaleSelected) {
            genderList.push("Female");
        }
        if (this.otherGenderSelected) {
            genderList.push("Other");
        }
        if (this.noneGender) {
            genderList.push("NONE");
        }
        if (genderList.length > 0) {
            studentListFilter["gender"] = genderList;
        }
        /* Ends: Gender */

        /* Admission */
        let admissionList = [];
        if (this.newAdmission) {
            admissionList.push("New");
        }
        if (this.oldAdmission) {
            admissionList.push("Old");
        }
        if (this.noneAdmission) {
            admissionList.push("NONE");
        }
        if (admissionList.length > 0) {
            studentListFilter["admission"] = admissionList;
        }
        /* Ends: Admission */

        /* RTE */
        let rteList = [];
        if (this.yesRTE) {
            rteList.push("YES");
        }
        if (this.noRTE) {
            rteList.push("NO");
        }
        if (this.noneRTE) {
            rteList.push("NONE");
        }
        if (rteList.length > 0) {
            studentListFilter["RTE"] = rteList;
        }
        /* Ends: RTE */

        /* TC */
        let tcList = [];
        if (this.generatedTC) {
            tcList.push("Generated");
        }
        if (this.issuedTC) {
            tcList.push("Issued");
        }
        if (this.noneTC) {
            tcList.push("NONE");
        }
        if (tcList.length > 0) {
            studentListFilter["TC"] = tcList;
        }
        /* Ends: TC */

        // Starts : Populate filters data with student parameter list
        let selectedStudentCustomFilterList = [];
        this.studentCustomFilterList.forEach(studentCustomFilter => {
            let tempParameter = {
                id: studentCustomFilter.id,
                name: studentCustomFilter.name,
                noneSelected: false,
                filterValues: []
            };
            if (studentCustomFilter.noneSelected) {
                tempParameter['noneSelected'] = true;
            }
            let selectedFilterValues = studentCustomFilter.filterValues.filter(item => item.selected);
            if (selectedFilterValues.length > 0) {
                tempParameter['filterValues'] = selectedFilterValues.map(item => item.name);
            }
            if (tempParameter['noneSelected'] || tempParameter['filterValues'].length > 0) {
                selectedStudentCustomFilterList.push(tempParameter);
            }
        });
        if (selectedStudentCustomFilterList.length > 0) {
            studentListFilter["studentCustomFilterList"] = selectedStudentCustomFilterList;
        }
        // Ends : Populate filters data with student parameter list

        this.dialogRef.close({studentListFilter: studentListFilter});

    }  // Ends: applyClick()

}
