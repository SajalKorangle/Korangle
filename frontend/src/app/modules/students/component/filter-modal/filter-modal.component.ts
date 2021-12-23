import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-filter-modal',
    templateUrl: './filter-modal.component.html',
    styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent implements OnInit {
    classSectionList = [];
    studentParameterList = [];
    
    filter;
    isEditing = false;

    /* Row Name */
    name = "";

    /* Age Check */
    minAge: number = 0;
    maxAge: number = 1000;
    asOnDate = new Date();

    /* Category Options */
    scSelected = false;
    stSelected = false;
    obcSelected = false;
    generalSelected = false;
    noneCategory = false;

    /* Gender Options */
    maleSelected = false;
    femaleSelected = false;
    otherGenderSelected = false;
    noneGender = false;

    /* Admission Session Options */
    newAdmission = false;
    oldAdmission = false;
    noneAdmission = false;

    /* RTE Options */
    yesRTE = false;
    noRTE = false;
    noneRTE = false;

    /* TC Options */
    noTC = false;
    yesTC = false;

    constructor(
        public dialogRef: MatDialogRef<FilterModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {
        this.classSectionList = data.classSectionList;
        this.studentParameterList = data.studentParameterList;

        if(data.filter) {
            this.isEditing = true;
            this.filter = data.filter;
            this.studentParameterList = this.filter["studentParameterList"];
            this.name = this.filter["name"];

            if(this.filter["selectedClass"]) {
                let selectedClass = this.filter["selectedClass"];
                this.classSectionList.forEach((classs) => {
                    classs.sectionList.forEach((section) => {
                        let classSectionName = classs.name + ", " + section.name;
                        if(selectedClass.includes(classSectionName)) {
                            section.selected = true;
                        }
                    });
                });
            }

            if(this.filter["category"]) {
                let category = this.filter["category"];
                if(category.includes("SC")) {
                    this.scSelected = true;
                }
                if(category.includes("ST")) {
                    this.stSelected = true;
                }
                if(category.includes("OBC")) {
                    this.obcSelected = true;
                }
                if(category.includes("GEN")) {
                    this.generalSelected = true;
                }
                if(category.includes("NONE")) {
                    this.noneCategory = true;
                }
            }

            if(this.filter["age"]) {
                let age = this.filter["age"];
                this.asOnDate = age[0];
                console.log("AsOnDate: ", this.asOnDate);
                this.minAge = age.length > 1 ? age[1] : 0;
                this.maxAge = age.length > 2 ? age[2] : 1000;
            }

            if(this.filter["gender"]) {
                let gender = this.filter["gender"];
                if(gender.includes("Male")) {
                    this.maleSelected = true;
                }
                if(gender.includes("Female")) {
                    this.femaleSelected = true;
                }
                if(gender.includes("Other")) {
                    this.otherGenderSelected = true;
                }
                if(gender.includes("NONE")) {
                    this.noneGender = true;
                }
            }

            if(this.filter["admission"]) {
                let admission = this.filter["admission"];
                if(admission.includes("New")) {
                    this.newAdmission = true;
                }
                if(admission.includes("Old")) {
                    this.oldAdmission = true;
                }
                if(admission.includes("NONE")) {
                    this.noneAdmission = true;
                }
            }

            if(this.filter["RTE"]) {
                let rte = this.filter["RTE"];
                if(rte.includes("YES")) {
                    this.yesRTE = true;
                }
                if(rte.includes("NO")) {
                    this.noRTE = true;
                }
                if(rte.includes("NONE")) {
                    this.noneRTE = true;
                }
            }

            if(this.filter["TC"]) {
                let tc = this.filter["TC"];
                if(tc.includes("YES")) {
                    this.yesTC = true;
                }
                if(tc.includes("NO")) {
                    this.noTC = true;
                }
            }
        }
    }

    ngOnInit() {
    }

    unselectAllClasses(): void {
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = false;
            });
        });
    }

    selectAllClasses(): void {
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = true;
            });
        });
    }

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
    }

    getFilteredStudentParameterList = () => this.studentParameterList.filter((x) => x.parameterType === 'FILTER');

    getFilteredFilterValues(parameter: any): any {
        if (parameter.filterFilterValues === '') {
            return parameter.filterValues;
        }
        return parameter.filterValues.filter((x) => {
            return x.name.includes(parameter.filterFilterValues);
        });
    }

    deleteClick(): void {
        let conformation = confirm("Do you really want to delete this?");
        if(conformation) {
            this.unselectAllClasses();
            if(this.isEditing) {
                let filtersData = {};
                filtersData["operation"] = "delete";
                this.dialogRef.close({ filtersData: filtersData });
            }
            else {
                this.dialogRef.close();
            }
        }
    }

    applyClick(): void {
        if(!this.name) {
            alert("Please enter the name.");
            return;
        }

        let filtersData = {};
        /* Class-Section */
        let selectedClass = [];
        this.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                if(section.selected) {
                    selectedClass.push(classs.name + ", " + section.name);
                    section.selected = false;
                }
            });
        });
        if(selectedClass.length > 0) {
            filtersData["selectedClass"] = selectedClass;
        }

        /* Name */
        if(this.name) {
            filtersData["name"] = this.name;
        }

        /* Age */
        let age = [];
        if (this.asOnDate) {
            age.push(this.asOnDate);
        }
        if (this.minAge != null && !isNaN(this.minAge)) {
            age.push(Math.max(this.minAge, 0));
        } else {
            age.push(0);
        }
        if (this.maxAge != null && !isNaN(this.maxAge)) {
            age.push(Math.max(this.maxAge, 0));
        } else {
            age.push(1000);
        }
        filtersData["age"] = age;

        /* Category */
        let category = [];
        if(this.scSelected) {
            category.push("SC");
        }
        if(this.stSelected) {
            category.push("ST");
        }
        if(this.obcSelected) {
            category.push("OBC");
        }
        if(this.generalSelected) {
            category.push("GEN");
        }
        if(this.noneCategory) {
            category.push("NONE");
        }
        if(category.length > 0) {
            filtersData["category"] = category;
        }

        /* Gender */
        let gender = [];
        if(this.maleSelected) {
            gender.push("Male");
        }
        if(this.femaleSelected) {
            gender.push("Female");
        }
        if(this.otherGenderSelected) {
            gender.push("Other");
        }
        if(this.noneGender) {
            gender.push("NONE");
        }
        if(gender.length > 0) {
            filtersData["gender"] = gender;
        }

        /* Admission */
        let admission = [];
        if(this.newAdmission) {
            admission.push("New");
        }
        if(this.oldAdmission) {
            admission.push("Old");
        }
        if(this.noneAdmission) {
            admission.push("NONE");
        }
        if(admission.length > 0) {
            filtersData["admission"] = admission;
        }

        /* RTE */
        let rte = [];
        if(this.yesRTE) {
            rte.push("YES");
        }
        if(this.noRTE) {
            rte.push("NO");
        }
        if(this.noneRTE) {
            rte.push("NONE");
        }
        if(rte.length > 0) {
            filtersData["RTE"] = rte;
        }

        /* TC */
        let tc = [];
        if(this.yesTC) {
            tc.push("YES");
        }
        if(this.noTC) {
            tc.push("NO");
        }
        if(tc.length > 0) {
            filtersData["TC"] = tc;
        }

        filtersData["studentParameterList"] = this.studentParameterList;

        if(this.isEditing) {
            filtersData["operation"] = "update";
            this.dialogRef.close({ filtersData: filtersData });
        } else {
            this.dialogRef.close({ filtersData: filtersData });
        }
    }
}
