import { CreateExaminationComponent } from './create-examination.component';

export class CreateExaminationServiceAdapter {
    vm: CreateExaminationComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: CreateExaminationComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        let request_examination_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data).then(
            (value) => {
                this.populateExaminationList(value);
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    populateExaminationList(examinationList: any): void {
        this.vm.examinationList = examinationList;
        this.vm.examinationList.forEach((examination) => {
            examination['newName'] = examination['name'];
            examination['newMarksUpdationStatus'] = examination['marksUpdationStatus'];
            examination['newStatus'] = examination['status'];
            examination['updating'] = false;
        });
    }

    // Create Examination
    createExamination(): void {
        if (this.vm.examinationNameToBeAdded === null || this.vm.examinationNameToBeAdded == '') {
            alert('Examination Name should be populated');
            return;
        }

        let nameAlreadyExists = false;
        this.vm.examinationList.every((examination) => {
            if (examination.name === this.vm.examinationNameToBeAdded) {
                nameAlreadyExists = true;
                return false;
            }
            return true;
        });

        if (nameAlreadyExists) {
            alert('Examination Name already Exists');
            return;
        }

        this.vm.isLoading = true;

        /*if (this.vm.examinationStatusToBeAdded == 'None') {
            this.vm.examinationStatusToBeAdded = null;
        }*/

        let data = {
            name: this.vm.examinationNameToBeAdded,
            status: 'Created', // this.vm.examinationStatusToBeAdded,
            marksUpdationStatus: this.vm.MARKS_UPDATION_UNLOCKED_STATUS_BACKEND,
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        console.log(data);

        this.vm.examinationService.createObject(this.vm.examinationService.examination, data).then(
            (value) => {
                this.addToExaminationList(value);
                this.vm.examinationNameToBeAdded = null;
                // this.vm.examinationStatusToBeAdded = null;
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    addToExaminationList(examination: any): void {
        examination['newName'] = examination['name'];
        examination['newStatus'] = examination['status'];
        examination['newMarksUpdationStatus'] = examination['marksUpdationStatus'];
        examination['updating'] = false;
        this.vm.examinationList.push(examination);
    }

    // Update Examination
    updateExamination(examination: any): void {
        if (examination.newName === null || examination.newName == '') {
            alert('Examination Name should be populated');
            return;
        }

        let nameAlreadyExists = false;
        this.vm.examinationList.every((item) => {
            if (item.name === examination.newName && item.id !== examination.id) {
                nameAlreadyExists = true;
                return false;
            }
            return true;
        });

        if (nameAlreadyExists) {
            alert('Examination Name already Exists');
            return;
        }

        examination.updating = true;

        this.vm.isLoading = true;

        if (examination.newStatus == 'None') {
            examination.newStatus = null;
        }

        let data = {
            id: examination.id,
            name: examination.newName,
            status: examination.newStatus,
            marksUpdationStatus: examination.newMarksUpdationStatus,
            parentSchool: examination.parentSchool,
            parentSession: examination.parentSession,
        };

        this.vm.examinationService.updateObject(this.vm.examinationService.examination, data).then(
            (value) => {
                alert('Examination updated successfully');
                examination.name = value.name;
                examination.status = value.status;
                examination.marksUpdationStatus = value.marksUpdationStatus;
                examination.updating = false;
                this.vm.isLoading = false;
            },
            (error) => {
                examination.updating = false;
                this.vm.isLoading = false;
            }
        );
    }
}
