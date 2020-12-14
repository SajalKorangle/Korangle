import { IssueHomeworkComponent } from './issue-homework.component';

export class IssueHomeworkServiceAdapter {

    vm: IssueHomeworkComponent;
    questionImagesFormData : any;
    constructor() {}

    // Data

    initializeAdapter(vm: IssueHomeworkComponent): void {
        this.vm = vm;
        this.questionImagesFormData = [];
    }

    //initialize data
    initializeData(): void {

        let request_class_subject_list = {
            'parentSchool' : this.vm.user.activeSchool.dbId, 
            'parentEmployee': this.vm.user.activeSchool.employeeId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId
        }

        this.vm.isSessionLoading = true;

        Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, request_class_subject_list),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
        ]).then(value => {
            // console.log(value[0]);
            // console.log(value[1]);
            // console.log(value[2]);
            // console.log(value[3]);
            this.vm.initialiseClassSubjectData(value[0], value[1], value[2], value[3]);
            this.vm.isSessionLoading =false;
        },error =>{
            this.vm.isSessionLoading =false;
        });
    }

    getHomeworks():any{
        this.vm.isLoading = true;
        this.vm.homeworkList = [];
        this.vm.studentList = [];
        
        let student_section_data = {
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentClass': this.vm.selectedClassSection.classDbId,
            'parentDivision': this.vm.selectedClassSection.divisionDbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'fields__korangle': 'parentStudent',
        }

        const homework_data = {
            parentHomework__parentClassSubject: this.vm.selectedSubject.classSubjectDbId,
        };

        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homeworks, {parentClassSubject: this.vm.selectedSubject.classSubjectDbId}),
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, homework_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
            // this.vm.
        ]).then(value =>{
            this.vm.homeworkImagesList = value[1];
            this.initialiseHomeworks(value[0], value[1]);       
            let studentIdList = [];
            value[2].forEach(student =>{
                studentIdList.push(student.parentStudent);
            });
            let student_data = {
                'id__in': studentIdList,
                'fields__korangle': 'name,mobileNumber',
            }
            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
            ]).then(value =>{
                value[0].forEach(element =>{
                    let tempData = {
                        name: element.name,
                        mobileNumber: element.mobileNumber,
                        subject: this.vm.selectedSubject.name,
                        homeworkName: null,
                        deadLine: null,
                    }
                    this.vm.studentList.push(tempData);
                })
                this.fetchGCMDevices(this.vm.studentList);
                this.vm.isLoading = false;
            });
            
        },error =>{
            this.vm.isLoading = false;
        });

    }

    initialiseHomeworks(homeworksList: any, homeworkImageList: any):any{
        this.vm.homeworkList = [];
        homeworksList.forEach(currentHomework =>{
            let tempHomework = this.vm.homeworkList.find(homework => homework.id ==  currentHomework.id);
            if(tempHomework === undefined){
                let tempData = {
                    id: currentHomework.id,
                    homeworkName: currentHomework.homeworkName,
                    parentClassSubject: currentHomework.parentClassSubject,
                    startDate: currentHomework.startDate,
                    startTime: currentHomework.startTime,
                    endDate: currentHomework.endDate,
                    endTime: currentHomework.endTime,
                    homeworkText: currentHomework.homeworkText,
                    homeworkImages: [],
                }
                this.vm.homeworkList.push(tempData);
                tempHomework = this.vm.homeworkList.find(homework => homework.id ==  currentHomework.id);
            }
            homeworkImageList.forEach(image =>{
                if(image.parentHomework == currentHomework.id){
                    tempHomework.homeworkImages.push(image);
                }
            })

        });

        this.vm.homeworkList.forEach(homework =>{
            homework.homeworkImages.sort((a, b) => a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0)
        })

    }


    deleteHomework(homeworkId: any): any{

        if(!confirm("Are you sure you want to delete this homework?")) {
            return;
        }
        this.vm.isLoading = true;
        this.vm.homeworkService.deleteObject(this.vm.homeworkService.homeworks, {id: homeworkId}).then(value =>{
            this.vm.homeworkList.forEach( (homework,index) =>{
                if(homework.id == homeworkId){
                    this.vm.homeworkList.splice(index, 1);
                }
            });
            alert('Homework Deleted')
            this.vm.isLoading = false;
        }),error =>{
            this.vm.isLoading = false;
        };
    }

    updateHomework(data :any): any{
        
        const promises = [];
        let previousHomework = this.vm.homeworkList.find(homework => homework.id === data.id);

        let tempHomeworkData = {
            id: data.id,
            homeworkName: data.homeworkName ,
            parentClassSubject: data.parentClassSubject,
            startDate: data.startDate,
            startTime: data.startTime,
            endDate: data.endDate,
            endTime: data.endTime,
            homeworkText: data.homeworkText,
        }

        promises.push(this.vm.homeworkService.updateObject(this.vm.homeworkService.homeworks, tempHomeworkData));

        let index = 0;
        data.homeworkImages.forEach(image =>{
            let temp = previousHomework.homeworkImages.find(images => images.questionImage === image.questionImage);
            if(temp === undefined){
                let tempData = {
                    orderNumber: index,
                    parentHomework: data.id,
                    questionImage: image.questionImage,
                }
                let temp_form_data = new FormData();
                const layout_data = { ...tempData,};
                Object.keys(layout_data).forEach(key => {
                    if (key === 'questionImage' ) {
                        temp_form_data.append(key, this.vm.dataURLtoFile(layout_data[key], 'questionImage' + index +'.jpeg'));
                    } else {
                        temp_form_data.append(key, layout_data[key]);
                    }
                });
                promises.push(this.vm.homeworkService.createObject(this.vm.homeworkService.homework_question, temp_form_data));
            }
            else{
                let tempData ={
                    id: temp.id,
                    orderNumber: index,
                }
                promises.push(this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_question, tempData));
            }
            index = index + 1;
        });

        previousHomework.homeworkImages.forEach(image =>{
            let temp = data.homeworkImages.find(images => images.questionImage === image.questionImage);
            if(temp === undefined){
                promises.push(this.vm.homeworkService.deleteObject(this.vm.homeworkService.homework_question,{'id': image.id}));
            }
        });

        Promise.all(promises).then(value =>{
            this.getHomeworks();
            alert('Homework Edited Successfully');
            this.vm.isLoading = false;
        }),error =>{
            this.vm.isLoading = false;
        }
        
    }



    fetchGCMDevices: any = (studentList: any) => {
        // console.log(studentList);
        this.vm.isLoading = true;
        const service_list = [];
        const iterationCount = Math.ceil(studentList.length / this.vm.STUDENT_LIMITER);
        let loopVariable = 0;

        while (loopVariable < iterationCount) {
            const mobile_list = studentList.filter(item => item.mobileNumber).map(obj => obj.mobileNumber.toString());
            const gcm_data = {
                'user__username__in': mobile_list.slice(
                    this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1)
                ),
                'active': 'true__boolean',
            }
            // console.log(gcm_data);
            const user_data = {
                'fields__korangle': 'username,id',
                'username__in': mobile_list.slice(this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1)),
            };
            // console.log(user_data);
            service_list.push(this.vm.notificationService.getObjectList(this.vm.notificationService.gcm_device, gcm_data));
            service_list.push(this.vm.userService.getObjectList(this.vm.userService.user, user_data));
            // console.log(service_list);
            loopVariable = loopVariable + 1;
        }

        Promise.all(service_list).then((value) => {
            let temp_gcm_list = [];
            let temp_user_list = [];
            let loopVariable = 0;
            while (loopVariable < iterationCount) {
                temp_gcm_list = temp_gcm_list.concat(value[loopVariable * 2]);
                temp_user_list = temp_user_list.concat(value[loopVariable * 2 + 1]);
                loopVariable = loopVariable + 1;
            }

            const notif_usernames = temp_user_list.filter(user => {
                return temp_gcm_list.find(item => {
                    return item.user == user.id;
                }) != undefined;
            })
            // Storing because they're used later
            this.vm.notif_usernames = notif_usernames;

            let notification_list;

            notification_list = studentList.filter(obj => {
                return notif_usernames.find(user => {
                    return user.username == obj.mobileNumber;
                }) != undefined;
            });
            studentList.forEach((item, i) => {
                item.notification = false;
            })
            notification_list.forEach((item, i) => {
                item.notification = true;
            })


            this.vm.isLoading = false;
        })
    }


    sendNotification: any = (mobile_list: any) => {
        let service_list = [];
        let notification_list = [];
        
        notification_list = mobile_list.filter(obj => {
            return obj.notification;
        });
        
        
        let notif_mobile_string = '';
        notification_list.forEach((item, index) => {
            notif_mobile_string += item.mobileNumber + ', ';
        });
        // notif_mobile_string = notif_mobile_string.slice(0, -2);

        notif_mobile_string = notif_mobile_string.slice(0, -2);
        const notification_data = notification_list.map(item => {
            return {
                    'parentMessageType': 1,
                    'content': this.vm.getMessageFromTemplate(this.vm.studentUpdateMessage, item),
                    'parentUser': this.vm.notif_usernames.find(user => { return user.username == item.mobileNumber.toString(); }).id,
                    'parentSchool': this.vm.user.activeSchool.dbId,
                
            };
        });
        service_list = [];
        if (notification_data.length > 0 ) {
            service_list.push(this.vm.notificationService.createObjectList(this.vm.notificationService.notification, notification_data));
        }

        Promise.all(service_list).then(value =>{
            this.vm.isLoading = false;
        });
    }
}
