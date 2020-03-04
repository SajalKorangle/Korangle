
import { CreateGradeComponent } from './create-grade.component';

export class CreateGradeServiceAdapter {

    vm: CreateGradeComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: CreateGradeComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        let request_grade_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId
        };

        this.vm.isLoading = true;
        this.vm.gradeService.getObjectList(this.vm.gradeService.grades, request_grade_data).then(value => {

            value.forEach(grade => {
                let request_sub_grade_data = {
                    'parentGrade': grade.id
                };
                this.vm.gradeService.getObjectList(this.vm.gradeService.sub_grades,request_sub_grade_data).then(value1=>{
                    grade['subGradeList'] = value1;
                    this.populateGradeList(grade);
                });
            });

            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    populateGradeList(grade: any): void{
        grade['newName'] = grade['name'];
        grade['updating'] = false;
        grade['subGradeList'].forEach(subGrade => {
            subGrade['newName'] = subGrade['name'];
            subGrade['updating'] = false;
        });
        this.vm.gradeList.push(grade);
    }

    // populateGradeList(data: any): void {
    //     this.vm.gradeList = data;
    //     console.log(this.vm.gradeList);
    //     this.vm.gradeList.forEach(grade => {
    //         grade['newName'] = grade['name'];
    //         grade['updating'] = false;
    //         // if(grade['subGradeList']==null){
    //         //     console.log(grade);
    //         // }
    //         console.log(grade['subGradeList']);
    //         grade['subGradeList'].forEach(subGrade => {
    //             subGrade['newName'] = subGrade['name'];
    //             subGrade['updating'] = false;
    //         })
    //     });
    // }

    createGrade(){
        if (this.vm.gradeNameToBeAdded === null
            || this.vm.gradeNameToBeAdded == "") {
            alert('Name should be populated');
            return;
        }

        this.vm.isLoading = true;

        let data = {
            'name': this.vm.gradeNameToBeAdded,
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId
        };

        this.vm.gradeService.createObject(this.vm.gradeService.grades,data).then(value => {
            this.addToGradelist(value);
            this.vm.gradeNameToBeAdded = null;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    addToGradelist(grade:any){
        grade['newName'] = grade['name'];
        grade['updating'] = false;
        this.vm.gradeList.push(grade);
    }

    createSubGrade(){
        if (this.vm.subGradeNameToBeAdded === null
            || this.vm.subGradeNameToBeAdded == "") {
            alert('Name should be populated');
            return;
        }

        this.vm.isLoading = true;

        let data = {
            'name': this.vm.subGradeNameToBeAdded,
            'parentGrade' : this.vm.selectedGrade.id
        };

        this.vm.gradeService.createObject(this.vm.gradeService.sub_grades,data).then(value => {
            this.addToSubGradelist(value);
            this.vm.gradeNameToBeAdded = null;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });


    }

    addToSubGradelist(subGrade: any){
        this.vm.selectedGrade['subGradeList'].push(subGrade)
    }

}
