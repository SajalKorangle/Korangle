import {ManageEventComponent} from '@modules/event-gallery/pages/manage-event/manage-event.component';
import {CommonFunctions} from '@classes/common-functions';

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
        this.vm.eventImageList=[];
        this.vm.notifyToList=[];
        this.vm.eventTagList=[];
        this.vm.eventImageTagList=[];
        
        let image_data={
            'parentEvent':event.id,
            'korangle__order':'-id',
        };
        let notify_data={
            'parentEvent':event.id,
        };
        let tag_data={
            'parentEvent':event.id,
            'korangle__order':'-id',
        };
        let image_tag_data={
            'parentEventImage__parentEvent':event.id,
        };
        
        Promise.all([
            this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_image, image_data),//0
            this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_notify_class, notify_data),//1
            this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_tag, tag_data),//2
            this.vm.eventGalleryService.getObjectList(this.vm.eventGalleryService.event_image_tag, image_tag_data),//3
        ]).then(value => {
            value[0].forEach(image=>{
                image['selected']=false;
                image['tagList']=[];
                value[3].forEach(imageEvent=>{
                    if (imageEvent.parentEventImage == image.id){
                        image['tagList'].push(imageEvent.parentEventTag);
                    }
                });
                this.vm.eventImageList.push(image);
            });
            this.vm.notifyToList = value[1];
            value[2].forEach(evenTag=>{
                evenTag['selected']=false;
                this.vm.eventTagList.push(evenTag);
            });
            this.vm.eventImageTagList = value[3];
            this.vm.isEventLoading=false;
        });
    }

    createTag(tagName:any) {
        this.vm.isTagCreating=true;
          let tag_data={
            'parentEvent':this.vm.selectedEvent.id,
            'tagName':tagName,
        }
        Promise.all([
            this.vm.eventGalleryService.createObject(this.vm.eventGalleryService.event_tag, tag_data),//0
        ]).then(value => {
            value[0]['selected']=false;
            this.vm.eventTagList.push(value[0]);
            this.vm.eventTagList = this.vm.eventTagList.sort((a, b) => {
                return b.id - a.id
            });
            this.vm.isTagCreating=false;
        });
    }

    updateTag(eventTag: any,newTagName:any) {
          let tag_data={
             'id':eventTag.id,
             'parentEvent':this.vm.selectedEvent.id,
             'tagName':newTagName,
        }
        Promise.all([
            this.vm.eventGalleryService.updateObject(this.vm.eventGalleryService.event_tag, tag_data),//0
        ]).then(value => {
            value[0]['selected']=false;
            Object.assign(this.vm.eventTagList.find(t => t.id === value[0].id), JSON.parse(JSON.stringify(value[0])));
        });
    }

    deleteSelectedTagList() {
         let tag_data={
             'id__in':this.vm.eventTagList.filter(tags=> tags.selected == true).map(tag=>tag.id).join(),
        }
        Promise.all([
            this.vm.eventGalleryService.deleteObjectList(this.vm.eventGalleryService.event_tag, tag_data),//0
        ]).then(value => {
            this.vm.eventTagList=this.vm.eventTagList.filter(tags=> tags.selected != true);
        });
    }

    uploadImage(tempImageData: any,type:any) {
        this.vm.isImageUploading = true;
        let temp_form_data = new FormData();
        const layout_data = {...tempImageData,};
        Object.keys(layout_data).forEach(key => {
            if (key === 'eventImage') {
                temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'eventImage' + Date.now() +'.'+type));
            } else {
                temp_form_data.append(key, layout_data[key]);
            }
        });
        Promise.all([
            this.vm.eventGalleryService.createObject(this.vm.eventGalleryService.event_image, temp_form_data),//0
        ]).then(value => {
            value[0]['selected'] = false;
            value[0]['tagList'] = [];
            this.vm.eventImageTagList.forEach(imageEvent => {
                if (imageEvent.parentImage == value[0].id) {
                    value[0]['tagList'].push(imageEvent.parentTag);
                }
            });
            this.vm.eventImageList.push(value[0]);
            this.vm.eventImageList = this.vm.eventImageList.sort((a, b) => {
                return b.id - a.id
            });
            this.vm.isImageUploading = false;
        });
    }

    deleteSelectedImage(image:any) {
        this.vm.isDeletingImages=true;
        let image_data = {
             'id':image.id,
        }
        Promise.all([
            this.vm.eventGalleryService.deleteObject(this.vm.eventGalleryService.event_image, image_data),//0
        ]).then(value => {
            this.vm.eventImageList=this.vm.eventImageList.filter(img=> img.id != image.id);
            this.vm.isDeletingImages=false;
        });
    }

    assignImageTags() {
        this.vm.isAssigning=true;
        let event_image_tag_data = [];
        let selectedTags= this.vm.eventTagList.filter(tag=> tag.selected == true);
        let selectedImages= this.vm.eventImageList.filter(image=> image.selected == true);

       selectedTags.forEach(tag=>{
            selectedImages.forEach(image=>{
                if (!image.tagList.find(tagId=> tagId == tag.id)) {
                    event_image_tag_data.push({
                        'parentEventImage': image.id,
                        'parentEventTag': tag.id,
                    });
                }
            })
        });
        Promise.all([
            this.vm.eventGalleryService.createObjectList(this.vm.eventGalleryService.event_image_tag, event_image_tag_data),//0
        ]).then(value => {
            value[0].forEach(imageTag => {
                let image = this.vm.eventImageList.find(img => img.id == imageTag.parentEventImage);
                if (image && !image.tagList.find(tagId=> tagId == imageTag.id)) {
                    image.tagList.push(imageTag.parentEventTag);
                }
            });
            this.vm.eventImageTagList.push(value[0]);
            this.vm.eventTagList.forEach(tag=> tag.selected=false);
            this.vm.eventImageList.forEach(tag=> tag.selected=false);
            this.vm.isAssigning=false;
        });
    }
}