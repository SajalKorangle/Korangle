
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
            this.vm.gradeList = value;
            let request_sub_grade_data = {
                'parentGrade__in': value.map(a => a.id)
            };
            this.vm.gradeService.getObjectList(this.vm.gradeService.sub_grades,request_sub_grade_data).then(value1=>{
                this.populateSubGradeList(value1);
                this.vm.subGradeList = value1;
                this.vm.isLoading = false;
            });
        }, error => {
            this.vm.isLoading = false;
        });

    }

    getSubGradeListOfAnyGrade(gradeId: any){
        return this.vm.subGradeList.filter(a => {
            return gradeId == a.parentGrade
        })
    }

    populateSubGradeList(subGradeList: any): void{
        subGradeList.forEach(subGrade => {
            subGrade["isUpdating"] = false;
        });
        this.vm.subGradeList = subGradeList;
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
        if (this.vm.gradeNameToBeAdded == null
            || this.vm.gradeNameToBeAdded == "") {
            alert('Name should be populated');
            return;
        }

        let nameAlreadyExists = false;
        this.vm.gradeList.every(grade => {
            if (grade.name === this.vm.gradeNameToBeAdded) {
                nameAlreadyExists = true;
                return false;
            }
            return true;
        });

        if (nameAlreadyExists) {
            alert('Name already Exists');
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
        this.vm.gradeList.push(grade);
    }

    createSubGrade(grade: any){
        if (this.vm.subGradeNameToBeAdded == null
            || this.vm.subGradeNameToBeAdded == "") {
            alert('Name should be populated');
            return;
        }


        let nameAlreadyExists = false;
        this.vm.subGradeList.every(subGrade => {
            if (subGrade.name === this.vm.subGradeNameToBeAdded) {
                nameAlreadyExists = true;
                return false;
            }
            return true;
        });

        if (nameAlreadyExists) {
            alert('Name already Exists');
            return;
        }

        this.vm.isLoading = true;

        let data = {
            'name': this.vm.subGradeNameToBeAdded,
            'parentGrade' : grade.id
        };
        console.log(data);
        this.vm.subGradeNameToBeAdded = "";

        this.vm.gradeService.createObject(this.vm.gradeService.sub_grades,data).then(value => {
            this.addToSubGradelist(value);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    addToSubGradelist(subGrade: any){
        subGrade["isUpdating"] = false;
        this.vm.subGradeList.push(subGrade)
    }


    editSubGrade(grade:any,subGrade:any){
        if(subGrade['isUpdating']==false){
            subGrade['isUpdating'] = true;
            return ;
        }
        if(this.vm.newSubGradeName == null
            || this.vm.newSubGradeName == ""
            || this.vm.newSubGradeName == subGrade.name){
            alert("Nothing to update");
            this.vm.newSubGradeName = "";
            subGrade['isUpdating'] = false;
            return;
        }
        else if(subGrade.name != this.vm.newSubGradeName){
            let data = {
                'id': subGrade.id,
                'name' : this.vm.newSubGradeName,
            };
            this.vm.gradeService.partiallyUpdateObject(this.vm.gradeService.sub_grades,data).then(value =>{
                alert("Name Updated");
                subGrade.name = value.name;
            })
        }
        this.vm.newSubGradeName = "";
        subGrade['isUpdating'] = false;
    }

    deleteSubGrade(grade: any,subGrade: any){
        this.vm.isLoading = true;
        let data = {
            'id':subGrade.id
        };
        this.vm.gradeService.deleteObject(this.vm.gradeService.sub_grades,data).then(value => {
            this.removeFromSubGradeList(grade,subGrade);
            this.vm.isLoading = false;
        })
        .catch(err => {
            alert("An error Occurred");
            this.vm.isLoading = false;
        })
    }

    removeFromSubGradeList(grade:any,subGrade:any){
        let indexOfSubGrade = null;
        this.vm.subGradeList.every((subGradee,index) => {
            if(subGradee.id == subGrade.id && subGradee.parentGrade == grade.id){
                indexOfSubGrade = index;
                return false;
            }
            return true;
        });
        if(indexOfSubGrade != null){
            this.vm.subGradeList.splice(indexOfSubGrade,1);
        }
    }


    deleteGrade(grade: any){
        if(this.getSubGradeListOfAnyGrade(grade.id).length > 0){
            alert("Warning : All student marks of this grade will be deleted")
        }
        this.vm.isLoading = true;
        let data = {
            'parentGrade': grade.id
        };
        this.vm.gradeService.deleteObjectList(this.vm.gradeService.sub_grades,data).then(value => {
            let grade_data = {
                'id': grade.id
            };
            this.vm.gradeService.deleteObject(this.vm.gradeService.grades,grade_data).then(value => {
                let countOfSubGrade = 0;
                this.vm.subGradeList.every((subGradee) => {
                    if(subGradee.parentGrade == grade.id){
                        countOfSubGrade = countOfSubGrade + 1;
                    }
                    return true;
                });

                for(var i=0;i<=countOfSubGrade;i++){
                    let indexOfSubGrade = null;
                    this.vm.subGradeList.every((subGradee,index) => {
                        if(subGradee.parentGrade == grade.id){
                            indexOfSubGrade = index;
                            return false;
                        }
                        return true;
                    });
                    if(indexOfSubGrade != null){
                        this.vm.subGradeList.splice(indexOfSubGrade,1);
                    }
                }

                let indexOfGrade = null;
                this.vm.gradeList.every((value,index) => {
                    if(value.id == grade.id){
                        indexOfGrade = index;
                        return false;
                    }
                    return true;
                });
                if(indexOfGrade != null){
                    this.vm.gradeList.splice(indexOfGrade,1);
                }
                this.vm.isLoading = false;
            });
        })
    }
}
