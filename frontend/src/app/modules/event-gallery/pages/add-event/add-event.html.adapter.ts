import {AddEventComponent} from '@modules/event-gallery/pages/add-event/add-event.component';
import {CommonFunctions} from '@classes/common-functions';

export class AddEventHtmlAdapter {
    vm: AddEventComponent;

    constructor() {
    }


    initializeAdapter(vm: AddEventComponent): void {
        this.vm = vm;
    }


    unSelectAll(): void {
        if(this.vm.editing) {
            this.vm.editingNotificationList.forEach(selection => selection.selected = false);
        }else{
            this.vm.notifySelectionList.forEach(selection => selection.selected = false);
        }
    };

    selectAll(): void {
        if(this.vm.editing) {
            this.vm.editingNotificationList.forEach(selection => selection.selected = true);
        }else{
            this.vm.notifySelectionList.forEach(selection => selection.selected = true);
        }
    };

    editEvent(event): void {
        this.vm.editing = true;
        this.vm.editingEvent = {};

        Object.keys(event).forEach(key => {
            this.vm.editingEvent[key] = event[key];
        });
        this.vm.notifySelectionList.forEach(notifyTo => {
            notifyTo.selected = (!!this.vm.eventNotifyList.find(eventNotify => eventNotify.parentEvent === event.id && eventNotify.parentClass === notifyTo.id)) || (notifyTo.name == 'Employees' && event.notifyEmployees);
        });
        this.vm.editingNotificationList = JSON.parse(JSON.stringify(this.vm.notifySelectionList))
    }


    areInputsValid(): boolean {
        if (this.vm.editing && this.vm.editingEvent.title && this.vm.editingEvent.description) {
            return this.vm.editingEvent.title !== '' && this.vm.editingEvent.title.trim() !== '' && this.vm.editingEvent.description !== '' && this.vm.editingEvent.description.trim() !== '';
        } else {
            return this.vm.newEvent.title && this.vm.newEvent.description && this.vm.newEvent.title !== '' && this.vm.newEvent.title.trim() !== '' && this.vm.newEvent.description !== '' && this.vm.newEvent.description.trim() !== '';
        }
    }

    getPlaceHolder(): any {
        let actualList = this.vm.editing ? this.vm.editingNotificationList : this.vm.notifySelectionList;
        let notifyList = actualList.filter(list => {
            if (list.selected === true) {
                return true
            }
        }).map(item => item.name);
        if (notifyList.length > 0) {
            if (notifyList.length == this.vm.notifySelectionList.length) {
                return 'All Selected';
            } else {
                return notifyList;
            }
        } else {
            return 'None';
        }
    }


    getEventImageUrl(event: any, index: number): string {
        let url = this.vm.imageList.filter(img => img.parentEvent == event.id)[index];
        return url ? url.eventImage : '/assets/img/noImageAvailable.jpg';
    }

    getEventList(): any {
        if (this.vm.searchString && this.vm.searchString.trim() != '') {
            return this.vm.eventList.filter(event => {
                if (event.title.toLowerCase().includes(this.vm.searchString.toLowerCase())) {
                    return true;
                }
            });
        } else {
            return this.vm.eventList;
        }
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

    checkMobileAndEdit(event: any): void {
        if (this.isMobile()) {
            this.editEvent(event);
        }
    }

    getNotificationList() {
        return this.vm.editing ? this.vm.editingNotificationList : this.vm.notifySelectionList;
    }

    checkForChanges() {
        return (JSON.stringify(this.vm.eventList.find(event => event.id == this.vm.editingEvent.id)) != JSON.stringify(this.vm.editingEvent)) || (JSON.stringify(this.vm.notifySelectionList) != JSON.stringify(this.vm.editingNotificationList));
    }
}