
import {CreateExaminationComponent} from './create-examination.component';

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
            sessionId: this.vm.user.activeSchool.currentSessionDbId,
            schoolId: this.vm.user.activeSchool.dbId,
        };

        this.vm.examinationService.getExaminationList(request_examination_data, this.vm.user.jwt).then(value => {
            this.populateExaminationList(value);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    populateExaminationList(examinationList: any): void {
        this.vm.examinationList = examinationList;
        this.vm.examinationList.forEach(examination => {
            examination['newName'] = examination['name'];
            examination['updating'] = false;
        })
    }

    // Create Examination
    createExamination(): void {

        if (this.vm.examinationNameToBeAdded === null
            || this.vm.examinationNameToBeAdded == "") {
            alert('Examination Name should be populated');
            return;
        }

        let nameAlreadyExists = false;
        this.vm.examinationList.every(examination => {
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

        let data = {
            'name': this.vm.examinationNameToBeAdded,
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.examinationService.createExamination(data, this.vm.user.jwt).then(value => {
            this.addToExaminationList(value);
            this.vm.examinationNameToBeAdded = '';
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    addToExaminationList(examination: any): void {
        examination['newName'] = examination['name'];
        examination['updating'] = false;
        this.vm.examinationList.push(examination);
    }

    // Update Examination
    updateExamination(examination: any): void {

        if (examination.newName === null
            || examination.newName == "") {
            alert('Examination Name should be populated');
            return;
        }

        let nameAlreadyExists = false;
        this.vm.examinationList.every(item => {
            if (item.name === examination.newName) {
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

        let data = {
            'id': examination.id,
            'name': examination.newName,
            'parentSchool': examination.parentSchool,
            'parentSession': examination.parentSession,
        };

        this.vm.examinationService.updateExamination(data, this.vm.user.jwt).then(value => {
            examination.name = value.name;
            examination.updating = false;
        }, error => {
            examination.updating = false;
        });

    }

}