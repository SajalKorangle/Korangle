import {ManageEventComponent} from '@modules/event-gallery/pages/manage-event/manage-event.component';

export class ManageEventServiceAdapter {
    vm: ManageEventComponent;


    constructor() {
    }


    initializeAdapter(vm: ManageEventComponent): void {
        this.vm = vm;
    }


    initializeData(): void {
        this.vm.isLoading = true;
        this.vm.eventList = [];
        this.vm.filteredEventList = [];
        let event_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event, event_data),//1

        ]).then(value => {
            this.vm.eventList = value[0];
            this.vm.isLoading = false;
        });
    }

    getEventData(event:any): void {
        this.vm.isEventLoading=true;
        this.vm.eventImageData=[];
        this.vm.notifyToList=[];
        this.vm.eventTagData=[];
        this.vm.eventImageTagData=[];
        
        let image_data={
            'parentEvent':event.id,
        };
        let notify_data={
            'parentEvent':event.id,
        };
        let tag_data={
            'parentEvent':event.id,
        };
        let image_tag_data={
            'parentEvent':event.id,
        };
        
        Promise.all([
            this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_image, image_data),//0
            this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_notify_class, notify_data),//1
            this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_tag, tag_data),//2
            this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_image_tag, image_tag_data),//3
        ]).then(value => {
            this.vm.eventImageData = value[0];
            this.vm.notifyToList = value[1];
            this.vm.eventTagData = value[2];
            this.vm.eventImageTagData = value[3];
            this.vm.isEventLoading=false;
        });
    }
}