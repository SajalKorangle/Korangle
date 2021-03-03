import {ViewEventComponent} from '@modules/event-gallery/pages/view-event/view-event.component';

export class ViewEventServiceAdapter {
    vm: ViewEventComponent;


    constructor() {
    }


    initializeAdapter(vm: ViewEventComponent): void {
        this.vm = vm;
    }


    initializeData(): void {
        this.vm.isLoading = true;
        this.vm.eventList = [];
        this.vm.imageList = [];
        this.vm.imageTagList = [];
        this.vm.tagList = [];
        this.vm.eventNotifyList = [];
        this.vm.loadMoreEvents = true;
        this.getStudentsClassData();
        this.fetchLoadingCount();
    }

    getStudentsClassData() {
        this.vm.studentsClass = [];

        if (this.vm.user.activeSchool.role === 'Parent') {
            let student_list = {
                'parentStudent__in': this.vm.user.activeSchool.studentList.map(s => s.id).join(),
            }
            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_list),//0
            ]).then(value => {
                value[0].forEach(classs => {
                    this.vm.studentsClass.push(classs);
                })

            });
        }
    }

    fetchLoadingCount() {
        this.vm.isEventListLoading = true;

        let event_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'korangle__order': '-heldOn',
            'korangle__count': this.vm.eventCount.toString() + ',' + (this.vm.eventCount + this.vm.loadingCount).toString()
        }

        Promise.all([
            this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event, event_data),//0
        ]).then(value => {
            value[0].forEach(event => {
                this.vm.eventList.push(event);
            })
            if (value[0].length < this.vm.loadingCount) {
                this.vm.loadMoreEvents = false;
            }
            this.vm.eventCount += value[0].length;

            let image_data = {
                'parentEvent__in': value[0].map(e => e.id).join(),
                'korangle__order': '-id',
            }
            let tag_data = {
                'parentEvent__in': value[0].map(e => e.id).join(),
            }
            let image_tag_data = {
                'parentEventImage__parentEvent__in': value[0].map(e => e.id).join(),
            }

            let notify_data = {
                'parentEvent__in': value[0].map(e => e.id).join(),
            }


            Promise.all([
                this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_tag, tag_data),//0
                this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_image, image_data),//1
                this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_image_tag, image_tag_data),//2
                this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_notify_class, notify_data),//3
            ]).then(value2 => {

                this.vm.eventList = this.vm.eventList.filter(event => {
                    let hasEmployeeVisibility = false;
                    let hasParentVisibility = false;
                    if (this.vm.user.activeSchool.role === 'Employee') {
                        hasEmployeeVisibility = event.notifyEmployees;
                    }
                    value2[3].some(classs => {
                        return hasParentVisibility = !!(classs.parentEvent === event.id && this.vm.studentsClass.some(studentClass => classs.parentClass === studentClass.parentClass));
                    });
                    return hasEmployeeVisibility || hasParentVisibility;
                });


                value2[0].forEach(val => {
                    this.vm.tagList.push(val);
                });

                value2[1].forEach(image => {
                    image['selected'] = false;
                    image['tagList'] = [];
                    value2[2].forEach(imageEvent => {
                        if (imageEvent.parentEventImage == image.id) {
                            image['tagList'].push(imageEvent.parentEventTag);
                        }
                    });
                    this.vm.imageList.push(image);
                });

                value2[2].forEach(val => {
                    this.vm.imageTagList.push(val);
                });

                this.vm.isEventListLoading = false;
                this.vm.isLoading = false;
            });
        });
    }
}