import {AddEventComponent} from '@modules/event-gallery/pages/add-event/add-event.component';

export class AddEventServiceAdapter {
    vm: AddEventComponent;

    classList: any;

    constructor() {
    }


    initializeAdapter(vm: AddEventComponent): void {
        this.vm = vm;
    }

    initializeData(): void {
        this.vm.isLoading = true;
        this.vm.eventList = [];
        this.vm.imageList = [];
        this.vm.eventNotifyList = [];
        this.vm.loadMoreEvents = true;
        this.fetchLoadingCount();
    }

    fetchLoadingCount() {
        this.vm.isEventListLoading = true;

        let event_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'korangle__order': '-heldOn',
            'korangle__count': this.vm.eventCount.toString() + ',' + (this.vm.eventCount + this.vm.loadingCount).toString()
        }

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),//0
            this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event, event_data),//1

        ]).then(value => {
            this.classList = value[0];
            value[1].forEach(event => {
                this.vm.eventList.push(event);
            })
            if (value[1].length < this.vm.loadingCount) {
                this.vm.loadMoreEvents = false;
            }
            this.vm.eventCount += value[1].length;
            this.populateNotifySelectionList(value[0]);

            let image_data = {
                'parentEvent__in': value[1].map(e => e.id).join(),
            }
            let notify_class_data = {
                'parentEvent__in': value[1].map(e => e.id).join(),
            }

            Promise.all([
                this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_notify_class, notify_class_data),//2
                this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_image, image_data),//3

            ]).then(value2 => {

                value2[0].forEach(val => {
                    this.vm.eventNotifyList.push(val);
                });

                value2[1].forEach(val => {
                    this.vm.imageList.push(val);
                });

                this.vm.isEventListLoading = false;
                this.vm.isLoading = false;
            });
        });
    }

    populateNotifySelectionList(classList: any) {
        this.vm.notifySelectionList = [];
        let employee = {name: 'Employees', selected: false};
        this.vm.notifySelectionList.push(employee);
        classList.forEach(classs => {
            classs['selected'] = false;
            this.vm.notifySelectionList.push(classs);
        });
    }


    postEvent() {
        this.vm.isLoading = true;
        let notifyList = this.vm.notifySelectionList.filter(notify => notify.selected == true && notify.name != 'Employees');

        let event_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'title': this.vm.newEvent.title,
            'description': this.vm.newEvent.description,
            'heldOn': this.vm.newEvent.heldOn,
            'notifyEmployees': this.vm.notifySelectionList.some(x => x.name == 'Employees' && x.selected == true),
        }

        Promise.all([
            this.vm.eventGalleryService.createObject(this.vm.eventGalleryService.event, event_data),//0
        ]).then(value1 => {
            let notify_list_data = [];
            notifyList.forEach(notifyToClass => {
                let notify_data = {'parentEvent': value1[0].id, 'parentClass': notifyToClass.id}
                notify_list_data.push(notify_data);//0
            });
            Promise.all([this.vm.eventGalleryService.createObjectList(this.vm.eventGalleryService.event_notify_class, notify_list_data)]).then(value2 => {
                this.vm.eventList.push(value1[0]);
                value2[0].forEach(eachVal => {
                    this.vm.eventNotifyList.push(eachVal);
                });
                this.vm.initializeNewEvent();
                this.vm.htmlAdapter.unSelectAll();
                this.vm.eventList = this.vm.eventList.sort((a, b) => {
                    // @ts-ignore
                    return new Date(b.heldOn) - new Date(a.heldOn)
                });
                this.vm.isLoading = false;
            });
        });
    }

    saveChanges() {
        this.vm.isLoading = true;
        let notifyList = this.vm.notifySelectionList.filter(notify => notify.selected == true && notify.name != 'Employees');

        let data = {'parentEvent': this.vm.editingEvent.id};

        Promise.all([
            this.vm.eventGalleryService.deleteObjectList(this.vm.eventGalleryService.event_notify_class, data),//0
        ]).then(value => {
            let notify_list_data = [];
            this.vm.eventNotifyList = this.vm.eventNotifyList.filter(element => element.parentEvent != this.vm.editingEvent.id);
            notifyList.forEach(notifyToClass => {
                let notify_data = {'parentEvent': this.vm.editingEvent.id, 'parentClass': notifyToClass.id}
                notify_list_data.push(notify_data);//0
            });
            Promise.all([this.vm.eventGalleryService.createObjectList(this.vm.eventGalleryService.event_notify_class, notify_list_data)]).then(value2 => {

                value2[0].forEach(eachVal => {
                    this.vm.eventNotifyList.push(eachVal);
                });

                let event_data = {
                    'id': this.vm.editingEvent.id,
                    'parentSchool': this.vm.user.activeSchool.dbId,
                    'title': this.vm.editingEvent.title,
                    'description': this.vm.editingEvent.description,
                    'heldOn': this.vm.editingEvent.heldOn,
                    'notifyEmployees': this.vm.notifySelectionList.some(x => x.name == 'Employees' && x.selected == true),
                }

                Promise.all([
                    this.vm.eventGalleryService.updateObject(this.vm.eventGalleryService.event, event_data),//0
                ]).then(value => {
                    Object.assign(this.vm.eventList.find(t => t.id === this.vm.editingEvent.id), JSON.parse(JSON.stringify(value[0])));
                    this.vm.htmlAdapter.unSelectAll();
                    this.vm.eventList = this.vm.eventList.sort((a, b) => {
                        // @ts-ignore
                        return new Date(b.heldOn) - new Date(a.heldOn)
                    });
                    this.vm.editing = false;
                    this.vm.isLoading = false;
                });
            });
        });

    }

    deleteEvent(editingEvent: any) {
        if (confirm('Are you sure want to delete this Event?')) {
            this.vm.isLoading = true;
            Promise.all([
                this.vm.eventGalleryService.deleteObject(this.vm.eventGalleryService.event, {'id': editingEvent.id}),//0
            ]).then(value => {
                this.vm.eventList = this.vm.eventList.filter(event => event.id != editingEvent.id);
                this.vm.editing = false;
                this.vm.isLoading = false;
                this.vm.htmlAdapter.unSelectAll();
            });
        }
    }

}