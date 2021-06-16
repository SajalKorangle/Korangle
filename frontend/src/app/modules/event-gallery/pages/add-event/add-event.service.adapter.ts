import { AddEventComponent } from '@modules/event-gallery/pages/add-event/add-event.component';
import { INFORMATION_TYPE_LIST } from '@classes/constants/information-type';

export class AddEventServiceAdapter {
    vm: AddEventComponent;

    classList: any;
    notifyPersonData: any;
    informationMessageType: any;

    constructor() {}

    initializeAdapter(vm: AddEventComponent): void {
        this.vm = vm;
        this.informationMessageType = INFORMATION_TYPE_LIST.indexOf('General') + 1;
    }

    initializeData(): void {
        this.vm.isLoading = true;
        this.vm.eventList = [];
        this.vm.imageList = [];
        this.vm.eventNotifyList = [];
        this.vm.loadMoreEvents = true;
        this.fetchLoadingCount();
        this.getNotificationPersonData();
    }

    fetchLoadingCount() {
        this.vm.isEventListLoading = true;

        let event_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            korangle__order: '-heldOn',
            korangle__count: this.vm.eventCount.toString() + ',' + (this.vm.eventCount + this.vm.loadingCount).toString(),
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), //0
            this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event, event_data), //1
            this.vm.smsOldService.getSMSCount({ parentSchool: this.vm.user.activeSchool.dbId }, this.vm.user.jwt), //2
        ]).then((value) => {
            this.classList = value[0];
            this.vm.smsBalance = value[2].count;

            value[1].forEach((event) => {
                this.vm.eventList.push(event);
            });
            if (value[1].length < this.vm.loadingCount) {
                this.vm.loadMoreEvents = false;
            }
            this.vm.eventCount += value[1].length;
            this.populateNotifySelectionList(value[0]);

            let image_data = {
                parentEvent__in: value[1].map((e) => e.id).join(),
                korangle__order: '-id',
            };
            let notify_class_data = {
                parentEvent__in: value[1].map((e) => e.id).join(),
            };

            Promise.all([
                this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_notify_class, notify_class_data), //2
                this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_image, image_data), //3
            ]).then((value2) => {
                value2[0].forEach((val) => {
                    this.vm.eventNotifyList.push(val);
                });

                value2[1].forEach((val) => {
                    this.vm.imageList.push(val);
                });
                console.log(this.vm.imageList);

                this.vm.isEventListLoading = false;
                this.vm.dataForMapping['school'] = this.vm.user.activeSchool;
                this.vm.isLoading = false;
            });
        });
    }

    populateNotifySelectionList(classList: any) {
        this.vm.notifySelectionList = [];
        let employee = { name: 'Employees', selected: false };
        this.vm.notifySelectionList.push(employee);
        classList.forEach((classs) => {
            classs['selected'] = false;
            this.vm.notifySelectionList.push(classs);
        });
    }

    populateNotifyPersonData(studentData: any, employeeData: any) {
        this.notifyPersonData = [];
        studentData.forEach((student) => {
            student['student'] = true;
            this.notifyPersonData.push(student);
        });
        employeeData.forEach((employee) => {
            employee['employee'] = true;
            this.notifyPersonData.push(employee);
        });
        this.vm.messageService.fetchGCMDevicesNew(this.notifyPersonData);
    }

    postEvent() {
        this.vm.isLoading = true;
        let notifyList = this.vm.notifySelectionList.filter((notify) => notify.selected == true);
        this.vm.notifyPersonData = [];
        let event_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            title: this.vm.newEvent.title,
            description: this.vm.newEvent.description,
            heldOn: this.vm.newEvent.heldOn,
            notifyEmployees: this.vm.notifySelectionList.some((x) => x.name == 'Employees' && x.selected == true),
        };

        Promise.all([
            this.vm.eventGalleryService.createObject(this.vm.eventGalleryService.event, event_data), //0
        ]).then((value1) => {
            let notify_list_data = [];
            notifyList.forEach((notifyToClass) => {
                if (notifyToClass.name !== 'Employees') {
                    let notify_data = { parentEvent: value1[0].id, parentClass: notifyToClass.id };
                    notify_list_data.push(notify_data); //0
                }
            });
            Promise.all([
                this.vm.eventGalleryService.createObjectList(this.vm.eventGalleryService.event_notify_class, notify_list_data),
            ]).then((value2) => {
                this.vm.eventList.push(value1[0]);
                value2[0].forEach((eachVal) => {
                    this.vm.eventNotifyList.push(eachVal);
                });
                this.populatePersonListAndNotify('Event Gallery Creation', value1[0]);
                this.vm.initializeNewEvent();
                this.vm.eventList = this.vm.eventList.sort((a, b) => {
                    // @ts-ignore
                    return new Date(b.heldOn) - new Date(a.heldOn);
                });
                this.vm.htmlAdapter.unSelectAll();
                this.vm.isLoading = false;
            });
        });
    }

    saveChanges() {
        this.vm.isLoading = true;
        let editedNotifyList = this.vm.editingNotificationList.filter((notify) => notify.selected == true && notify.name != 'Employees');
        let actualNotifyList = this.vm.notifySelectionList.filter((notify) => notify.selected == true && notify.name != 'Employees');
        let actualEvent = this.vm.eventList.find((event) => event.id == this.vm.editingEvent.id);
        let data = { parentEvent: this.vm.editingEvent.id };

        let event_data = {
            id: this.vm.editingEvent.id,
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            title: this.vm.editingEvent.title,
            description: this.vm.editingEvent.description,
            heldOn: this.vm.editingEvent.heldOn,
            notifyEmployees: this.vm.editingNotificationList.some((x) => x.name == 'Employees' && x.selected == true),
        };

        Promise.all([
            this.vm.eventGalleryService.updateObject(this.vm.eventGalleryService.event, event_data), //0
        ]).then((value) => {

            if (actualEvent.title != this.vm.editingEvent.title || actualEvent.description != this.vm.editingEvent.description ||
                actualEvent.heldOn != this.vm.editingEvent.heldOn) {
                this.populatePersonListAndNotify('Event Gallery Updation', this.vm.editingEvent);
            }

            Object.assign(
                this.vm.eventList.find((t) => t.id === this.vm.editingEvent.id),
                JSON.parse(JSON.stringify(value[0]))
            );
            this.vm.eventList = this.vm.eventList.sort((a, b) => {
                // @ts-ignore
                return new Date(b.heldOn) - new Date(a.heldOn);
            });

            if (!(JSON.stringify(editedNotifyList) === JSON.stringify(actualNotifyList))) {
                console.log('Different');
                Promise.all([
                    this.vm.eventGalleryService.deleteObjectList(this.vm.eventGalleryService.event_notify_class, data), //0
                ]).then((value1) => {
                    let notify_list_data = [];

                    this.vm.eventNotifyList = this.vm.eventNotifyList.filter((element) => element.parentEvent != this.vm.editingEvent.id);
                    editedNotifyList.forEach((notifyToClass) => {
                        let notify_data = { parentEvent: this.vm.editingEvent.id, parentClass: notifyToClass.id };
                        notify_list_data.push(notify_data); //0
                    });

                    Promise.all([
                        this.vm.eventGalleryService.createObjectList(this.vm.eventGalleryService.event_notify_class, notify_list_data),
                    ]).then((value2) => {
                        value2[0].forEach((eachVal) => {
                            this.vm.eventNotifyList.push(eachVal);
                        });
                    });
                });
            }
            this.vm.editing = false;
            this.vm.htmlAdapter.unSelectAll();
            this.vm.isLoading = false;
        });
    }

    deleteEvent(editingEvent: any) {
        if (confirm('Are you sure want to delete this Event?')) {
            this.vm.isLoading = true;
            Promise.all([
                this.vm.eventGalleryService.deleteObject(this.vm.eventGalleryService.event, { id: editingEvent.id }), //0
            ]).then((value) => {
                this.vm.eventList = this.vm.eventList.filter((event) => event.id != editingEvent.id);
                this.vm.editing = false;
                this.populatePersonListAndNotify('Event Gallery Deletion', editingEvent);
                this.vm.initializeNewEvent();
                this.vm.htmlAdapter.unSelectAll();
                this.vm.isLoading = false;
            });
        }
    }

    getNotificationPersonData() {

        let student__section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentStudent__parentTransferCertificate: 'null__korangle',
        };

        let employee_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            fields__korangle: 'id,name,mobileNumber',
        };

        Promise.all([this.vm.studentService.getObjectList(this.vm.studentService.student_section, student__section_data)]).then((value1) => {
            let student_data = {
                id__in: value1[0].map((section) => section.parentStudent).join(),
                fields__korangle: 'id,name,mobileNumber',
            };

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
                this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_data),
            ]).then((value2) => {
                this.populateNotifyPersonData(value2[0], value2[1]);
                this.populateStudentClassList(this.notifyPersonData, value1[0]);
            });
        });
    }

    populatePersonListAndNotify(eventName: any, eventObject: any) {
        this.vm.notifySelectionList.forEach((notifyTo) => {
            notifyTo.selected =
                !!this.vm.eventNotifyList.find(
                    (eventNotify) => eventNotify.parentEvent === eventObject.id && eventNotify.parentClass === notifyTo.id
                ) ||
                (notifyTo.name == 'Employees' && eventObject.notifyEmployees);
        });
        let notifyList = this.vm.notifySelectionList.filter((notify) => notify.selected == true);
        this.vm.notifyPersonData = this.notifyPersonData.filter((person) =>
            notifyList.some(
                (notify) => notify.id === person.parentClass || (notify.name === 'Employee' && person.employee === true)
            )
        );
        this.vm.notifyPersonData = this.vm.notifyPersonData.filter(
            (v, i, a) => a.findIndex((t) => t.mobileNumber === v.mobileNumber) === i
        );
        let personList = [];
        this.vm.dataForMapping['event'] = eventObject;
        this.vm.dataForMapping['studentList'] = this.vm.notifyPersonData.filter(x => x.student);
        this.vm.dataForMapping['employeeList'] = this.vm.notifyPersonData.filter(x => x.employee);
        if (this.vm.dataForMapping['studentList'].length > 0) {
            personList.push('student');
        }
        if (this.vm.dataForMapping['employeeList'].length > 0) {
            personList.push('employee');
        }
        this.vm.messageService.sendEventNotification(
            this.vm.dataForMapping,
            personList,
            eventName,
            this.vm.user.activeSchool.dbId,
            this.vm.smsBalance,
        );
    }

    populateStudentClassList(notifyPersonData: any, studentSection: any) {
        notifyPersonData.forEach((person) => {
            if (person.student == true) {
                person['parentClass'] = studentSection.find((studSec) => studSec.parentStudent == person.id).parentClass;
            }
        });
    }
}
