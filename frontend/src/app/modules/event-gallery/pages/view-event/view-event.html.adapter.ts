import {ViewEventComponent} from '@modules/event-gallery/pages/view-event/view-event.component';

export class ViewEventHtmlAdapter {
    vm: ViewEventComponent;

    constructor() {
    }


    initializeAdapter(vm: ViewEventComponent): void {
        this.vm = vm;
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

    getImageLength(event: any) {
        return this.vm.imageList.filter(img => img.parentEvent == event.id).length;
    }
}