import { IssueHomeworkComponent } from './issue-homework.component';
import { Homework } from '../../../../services/modules/homework/models/homework';

export class IssueHomeworkServiceAdapter {

    vm: IssueHomeworkComponent;
    constructor() {}

    
    studentNotificationList: any;
    // Data

    initializeAdapter(vm: IssueHomeworkComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        let request_class_subject_list = {
            'parentEmployee': this.vm.user.activeSchool.employeeId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId
        }

        this.vm.isInitialLoading = true;

        Promise.all([
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, request_class_subject_list), //0
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), //1
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), //2
            this.vm.classService.getObjectList(this.vm.classService.division, {}), //3
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_settings, {'parentSchool' : this.vm.user.activeSchool.dbId}), //4
            this.vm.smsOldService.getSMSCount({'parentSchool' : this.vm.user.activeSchool.dbId}, this.vm.user.jwt), //5
        ]).then(value => {
            this.vm.smsBalance = value[5];
            if(value[4].length > 0){
                this.vm.settings = value[4][0];
            }
            else{
                this.vm.settings = {
                    sentUpdateType: 'NULL',
                    sendCreateUpdate: false,
                    sendEditUpdate: false,
                    sendDeleteUpdate: false,
                }
            }
            this.initialiseClassSubjectData(value[0], value[1], value[2], value[3]);
            this.vm.isInitialLoading =false;
        },error =>{
            this.vm.isInitialLoading =false;
        });
    }

    
    initialiseClassSubjectData(classSectionSubjectList: any, subjectList: any, classList: any, divisionList: any){
        this.vm.classSectionSubjectList = [];
        if(classSectionSubjectList.length === 0){
            this.vm.noPermission = true;
            this.vm.isLoading = false;
            this.vm.isInitialLoading = false;
            return ;
        }
        classSectionSubjectList.forEach(element =>{
            let classSection = this.vm.classSectionSubjectList.find(classSection => classSection.classDbId == element.parentClass && classSection.divisionDbId == element.parentDivision);
            if(classSection === undefined)
            {
                let tempClass = classList.find(classs => classs.id == element.parentClass);
                let tempDivision = divisionList.find(division => division.id == element.parentDivision); 
                let tempClassSection ={
                    classDbId: element.parentClass,
                    divisionDbId: element.parentDivision,
                    name: tempClass.name + ' ' + tempDivision.name,
                    subjectList: []
                }
                this.vm.classSectionSubjectList.push(tempClassSection);
                classSection = this.vm.classSectionSubjectList.find(classSection => classSection.classDbId == element.parentClass && classSection.divisionDbId == element.parentDivision);
            }
            let subject = classSection.subjectList.find(subject => subject.subjectDbId == element.parentSubject);
            if(subject === undefined){
                let tempSubject = subjectList.find(subject => subject.id == element.parentSubject);
                let tempSubjectData = {
                    classSubjectDbId: element.id,
                    subjectDbId: tempSubject.id,
                    name: tempSubject.name,
                }
                classSection.subjectList.push(tempSubjectData);
            }    
        })
        
        this.vm.classSectionSubjectList.forEach(classsSection =>{
            classsSection.subjectList.sort((a, b) => a.subjectDbId < b.subjectDbId ? -1 : a.subjectDbId > b.subjectDbId ? 1 : 0);
        })
        this.vm.classSectionSubjectList.sort((a, b) => {
            if(a.classDbId > b.classDbId){
                return 1;
            }
            else if(a.classDbId < b.classDbId){
                return -1;
            }
            else{
                if(a.divisionDbId > b.divisionDbid){
                    return 1;
                }
                else{
                    return -1;
                }
            }
        });
        this.vm.selectedClassSection = this.vm.classSectionSubjectList[0];
        this.vm.selectedSubject = this.vm.selectedClassSection.subjectList[0];
    }


    getHomeworks():any{
        this.vm.isLoading = true;
        this.vm.showContent = false;
        this.vm.homeworkList = [];
        this.studentNotificationList = [];
        
        let student_section_data = {
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentClass': this.vm.selectedClassSection.classDbId,
            'parentDivision': this.vm.selectedClassSection.divisionDbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'fields__korangle': 'parentStudent',
        }

        const homework_data = {
            parentHomeworkQuestion__parentClassSubject: this.vm.selectedSubject.classSubjectDbId,
        };

        Promise.all([
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question, {parentClassSubject: this.vm.selectedSubject.classSubjectDbId}), //0
            this.vm.homeworkService.getObjectList(this.vm.homeworkService.homework_question_image, homework_data), //1 
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data), //2
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
                'fields__korangle': 'id,name,mobileNumber',
            }
            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
            ]).then(value =>{
                value[0].forEach(element =>{
                    let tempData = {
                        dbId: element.id,
                        name: element.name,
                        mobileNumber: element.mobileNumber,
                        subject: this.vm.selectedSubject.name,
                        homeworkName: null,
                        deadLine: null,
                    }
                    this.studentNotificationList.push(tempData);
                })
                this.fetchGCMDevices(this.studentNotificationList);
                this.vm.isLoading = false;
            });
            this.sortHomeworks();
            this.vm.isLoading = false;
            this.vm.showContent = true;
        },error =>{
            this.vm.isLoading = false;
            this.vm.showContent = true;
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
                if(image.parentHomeworkQuestion == currentHomework.id){
                    tempHomework.homeworkImages.push(image);
                }
            })

        });

        this.vm.homeworkList.forEach(homework =>{
            homework.homeworkImages.sort((a, b) => a.orderNumber < b.orderNumber ? -1 : a.orderNumber > b.orderNumber ? 1 : 0)
        })

    }

    getHomeworkServices(): any{
        let index = 0;
        let promises = [];
        this.vm.currentHomeworkImages.forEach(image =>{
            image.parentHomeworkQuestion = this.vm.currentHomework.id;
            image.orderNumber = index;
            let temp_form_data = new FormData();
            const layout_data = { ...image,};
            Object.keys(layout_data).forEach(key => {
                if (key === 'questionImage' ) {
                    const file = this.vm.dataURLtoFile(layout_data[key], 'questionImage' + index +'.jpeg');
                    temp_form_data.append(key, this.vm.dataURLtoFile(layout_data[key], 'questionImage' + index +'.jpeg'));
                } else {
                    temp_form_data.append(key, layout_data[key]);
                }
            });
            index = index + 1;
            promises.push(this.vm.homeworkService.createObject(this.vm.homeworkService.homework_question_image, temp_form_data));
        })

        //This part of the code is used to create student-homework initial data in homeworkAnswer model.
        let studentIdList = [];
        this.studentNotificationList.forEach(student =>{
            studentIdList.push(student.dbId);
        });

        studentIdList.forEach(student =>{
            let tempData = {
                'parentStudent': student,
                'parentHomeworkQuestion': this.vm.currentHomework.id,
                'homeworkStatus': 'GIVEN',
            }
            promises.push(this.vm.homeworkService.createObject(this.vm.homeworkService.homework_answer, tempData));
        })

        return promises;
    }

    createHomework():any{
        this.vm.isLoading = true;
        this.vm.currentHomework.parentClassSubject = this.vm.selectedSubject.classSubjectDbId;
        let currentDate = new Date();
        this.vm.currentHomework.startDate = this.vm.formatDate(currentDate, '');
        this.vm.currentHomework.startTime = this.vm.formatTime(currentDate);
        if(this.vm.currentHomework.endDate != null && this.vm.currentHomework.endTime == null){
            this.vm.currentHomework.endTime =  '23:59';
        }
        
        
        Promise.all([
            this.vm.homeworkService.createObject(this.vm.homeworkService.homework_question , this.vm.currentHomework),
        ]).then(value =>{
            this.vm.currentHomework.id = value[0].id;
            this.populateCurrentHomework();
            
            Promise.all(this.getHomeworkServices()).then(sValue =>{
                alert('Homework has been successfully created');
                this.populateStudentList(this.studentNotificationList, this.vm.currentHomework);
                this.populateCurrentHomeworkImages(value[0].id, sValue);
                this.vm.currentHomework = new Homework;
                this.vm.currentHomeworkImages = [];
                this.vm.isLoading = false;
                if(this.vm.settings.sendCreateUpdate == true && this.vm.settings.sentUpdateType !='NULL'){
                    this.sendSMSNotification(this.studentNotificationList, this.vm.homeworkCreatedMessage);
                }
            },error =>{
                this.vm.isLoading = false;
            })
        },error =>{
            this.vm.isLoading = false;
        });
        
    }

    sortHomeworks(): any{
        this.vm.homeworkList.sort((a, b) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0);
    }

    populateCurrentHomework(): any{
        let tempHomework = {
            id: this.vm.currentHomework.id,
            homeworkName: this.vm.currentHomework.homeworkName ,
            parentClassSubject: this.vm.currentHomework.parentClassSubject,
            startDate: this.vm.currentHomework.startDate,
            startTime: this.vm.currentHomework.startTime,
            endDate: this.vm.currentHomework.endDate,
            endTime: this.vm.currentHomework.endTime,
            homeworkText: this.vm.currentHomework.homeworkText,
            homeworkImages: [],
        }
        this.vm.homeworkList.push(tempHomework);
        this.sortHomeworks();
    }

    populateCurrentHomeworkImages(homeworkId: any,imagesList: any): any{
        let tempHomework = this.vm.homeworkList.find(homework => homework.id == homeworkId);
        imagesList.forEach(image =>{
            if(image.questionImage != undefined)
                tempHomework.homeworkImages.push(image);
        });
        this.sortHomeworks();
    }
    
    populateStudentList(studentList: any, homeworkData: any): any{
        studentList.forEach(student =>{
            student.homeworkName = homeworkData.homeworkName;
            student.deadLine = this.vm.displayDateTime(homeworkData.endDate, homeworkData.endTime);
        
        });
    }

    deleteHomework(homeworkId: any): any{

        if(!confirm("Are you sure you want to delete this homework?")) {
            return;
        }
        
        let tempHomeworkName;

        this.vm.isLoading = true;
        this.vm.homeworkService.deleteObject(this.vm.homeworkService.homework_question, {id: homeworkId}).then(value =>{
            this.vm.homeworkList.forEach( (homework,index) =>{
                if(homework.id == homeworkId){
                    tempHomeworkName = homework.homeworkName;
                    this.vm.homeworkList.splice(index, 1);
                }
            });
            this.populateStudentList(this.studentNotificationList, {'homeworkName': tempHomeworkName});
            if(this.vm.settings.sendDeleteUpdate == true && this.vm.settings.sentUpdateType !='NULL'){
                this.sendSMSNotification(this.studentNotificationList, this.vm.homeworkDeleteMessage);
            }
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

        promises.push(this.vm.homeworkService.updateObject(this.vm.homeworkService.homework_question, tempHomeworkData));

        let index = 0;
        data.homeworkImages.forEach(image =>{
            let temp = previousHomework.homeworkImages.find(images => images.questionImage === image.questionImage);
            if(temp === undefined){
                let tempData = {
                    orderNumber: index,
                    parentHomeworkQuestion: data.id,
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
                promises.push(this.vm.homeworkService.createObject(this.vm.homeworkService.homework_question_image, temp_form_data));
            }
            else{
                let tempData ={
                    id: temp.id,
                    orderNumber: index,
                }
                if(tempData.orderNumber != index){
                    promises.push(this.vm.homeworkService.partiallyUpdateObject(this.vm.homeworkService.homework_question_image, tempData));
                }
                let tempIndex = previousHomework.homeworkImages.indexOf(temp);
                previousHomework.homeworkImages.splice(tempIndex, 1);
            }
            index = index + 1;
        });

        previousHomework.homeworkImages.forEach(image =>{
            promises.push(this.vm.homeworkService.deleteObject(this.vm.homeworkService.homework_question_image, image));
        });

        Promise.all(promises).then(value =>{
            this.populateEditedHomework(value);
            this.populateStudentList(this.studentNotificationList, value[0]);
            if(this.vm.settings.sendEditUpdate == true && this.vm.settings.sentUpdateType !='NULL'){
                this.sendSMSNotification(this.studentNotificationList, this.vm.homeworkUpdateMessage);
            }
            alert('Homework Edited Successfully');
            this.vm.isLoading = false;
        }),error =>{
            this.vm.isLoading = false;
        }
        
    }

    populateEditedHomework(data: any): any{
        let tempHomeworkData = data[0];
        let previousHomework = this.vm.homeworkList.find(homework => homework.id === tempHomeworkData.id);
        previousHomework.homeworkName = tempHomeworkData.homeworkName;
        previousHomework.endDate = tempHomeworkData.endDate;
        previousHomework.endTime = tempHomeworkData.endTime;
        previousHomework.homeworkText = tempHomeworkData.homeworkText;
        previousHomework.homeworkImages = [];
        data.forEach(image => {
            if(image.questionImage != undefined)
                previousHomework.homeworkImages.push(image);
        });
    }

    fetchGCMDevices: any = (studentList: any) => {
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
            const user_data = {
                'fields__korangle': 'username,id',
                'username__in': mobile_list.slice(this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1)),
            };
            service_list.push(this.vm.notificationService.getObjectList(this.vm.notificationService.gcm_device, gcm_data));
            service_list.push(this.vm.userService.getObjectList(this.vm.userService.user, user_data));
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

    sendSMSNotification: any = (mobile_list: any, message: any) => {
        let service_list = [];
        let notification_list = [];
        let sms_list = [];
        if (this.vm.settings.sentUpdateType == 'SMS') {
            sms_list = mobile_list;
            notification_list = [];
        } else if (this.vm.settings.sentUpdateType == 'NOTIFICATION') {       
            sms_list = [];
            notification_list = mobile_list.filter(obj => {
                return obj.notification;
            });
        } else {
            notification_list = mobile_list.filter(obj => {
                return obj.notification;
            });
            sms_list = mobile_list.filter(obj => {
                return !obj.notification;
            })
        }
        let notif_mobile_string = '';
        let sms_mobile_string = '';
        notification_list.forEach((item, index) => {
            notif_mobile_string += item.mobileNumber + ', ';
        });
        // notif_mobile_string = notif_mobile_string.slice(0, -2);
        sms_list.forEach((item, index) => {
            sms_mobile_string += item.mobileNumber + ', ';
        })
        sms_mobile_string = sms_mobile_string.slice(0, -2);
        notif_mobile_string = notif_mobile_string.slice(0, -2);
        if ((sms_list.length > 0) && (this.getEstimatedSMSCount(message) > this.vm.smsBalance)) {
            alert('You are short by ' + (this.getEstimatedSMSCount(message) - this.vm.smsBalance) + ' SMS');
        }
        let sms_data = {};
        const sms_converted_data = sms_list.map(item => {
            return {
                'mobileNumber': item.mobileNumber.toString(),
                'isAdvanceSms': this.getMessageFromTemplate(message, item)
            }
        });
        if (sms_list.length != 0) {

            sms_data = {
                'contentType': ('english'),
                'data': sms_converted_data,
                'content': sms_converted_data[0]['isAdvanceSms'],
                'parentMessageType': 2,
                'count': this.getEstimatedSMSCount(message),
                'notificationCount': notification_list.length,
                'notificationMobileNumberList': notif_mobile_string,
                'mobileNumberList': sms_mobile_string,
                'parentSchool': this.vm.user.activeSchool.dbId,
            };

        } else {
            sms_data = {
                'contentType': ('english'),
                'data': sms_converted_data,
                'content': this.getMessageFromTemplate(message, notification_list[0]),
                'parentMessageType': 2,
                'count': this.getEstimatedSMSCount(message),
                'notificationCount': notification_list.length,
                'notificationMobileNumberList': notif_mobile_string,
                'mobileNumberList': sms_mobile_string,
                'parentSchool': this.vm.user.activeSchool.dbId,
            };
        }

        const notification_data = notification_list.map(item => {
            return {
                'parentMessageType': 2,
                'content': this.getMessageFromTemplate(message, item),
                'parentUser': this.vm.notif_usernames.find(user => { return user.username == item.mobileNumber.toString(); }).id,
                'parentSchool': this.vm.user.activeSchool.dbId,
            };
        });
        service_list = [];
        service_list.push(this.vm.smsService.createObject(this.vm.smsService.diff_sms, sms_data));
        if (notification_data.length > 0 ) {
            service_list.push(this.vm.notificationService.createObjectList(this.vm.notificationService.notification, notification_data));
        }

        this.vm.isLoading = true;

        Promise.all(service_list).then(value => {

            if ((this.vm.settings.sentUpdateType == 'SMS' ||
            this.vm.settings.sentUpdateType == 'NOTIF./SMS') &&
                (sms_list.length > 0)) {
                if (value[0].status === 'success') {
                    this.vm.smsBalance -= value[0].data.count;
                } else if (value[0].status === 'failure') {
                    this.vm.smsBalance = value[0].count;
                }
            }

            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        })
    }

    getMessageFromTemplate = (message, obj) => {
        let ret = message;
        for(let key in obj){
            ret = ret.replace('<'+key+'>', obj[key]);
        }
        return ret;
    }

    hasUnicode(message): boolean {
        for (let i=0; i<message.length; ++i) {
            if (message.charCodeAt(i) > 127) {
                return true;
            }
        }
        return false;
    }

    getEstimatedSMSCount = (message: any) => {
        let count = 0;
        if(this.vm.settings.sentUpdateType=='NOTIFICATION')return 0;
            this.studentNotificationList.filter(item => item.mobileNumber).forEach((item) => {
                if(this.vm.settings.sentUpdateType=='SMS' || item.notification==false){
                    count += this.getMessageCount(this.getMessageFromTemplate(message, item));
                }
            })

        return count;
    }

    getMessageCount = (message) => {
        if (this.hasUnicode(message)){
            return Math.ceil(message.length/70);
        }else{
            return Math.ceil( message.length/160);
        }
    }

}
