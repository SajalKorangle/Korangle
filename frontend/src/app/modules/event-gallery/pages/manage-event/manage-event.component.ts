import { Component, OnInit } from '@angular/core';
import {DataStorage} from '@classes/data-storage';
import {CommonFunctions} from '@classes/common-functions';
import {ImagePreviewDialogComponent} from '@components/modal/image-preview-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {EventGalleryService} from '@services/modules/event-gallery/event-gallery.service';
import {map} from 'rxjs/operators';
import {ManageEventServiceAdapter} from '@modules/event-gallery/pages/manage-event/manage-event.service.adapter';
import {ViewImageModalComponent} from '@components/view-image-modal/view-image-modal.component';



@Component({
  selector: 'app-manage-event',
  templateUrl: './manage-event.component.html',
  styleUrls: ['./manage-event.component.css'], 
  providers:[EventGalleryService]
})
export class ManageEventComponent implements OnInit {
    
 serviceAdapter:ManageEventServiceAdapter;  
    
 searchString:any;
 isLoading:boolean;
 user:any;
 selectedImagesCount=0;
 eventImageList:any;
 isImageUploading=false;
 eventList:any;
 filteredEventList:any;
 eventFormControl=new FormControl();
 selectedEvent:any;
 notifyToList:any;
 isTagCreating:boolean;
 isEventLoading:boolean;
 eventTagList:any;
 eventImageTagList:any;
 isDeletingImages:boolean;
 isAssigning:boolean;
    
 
  constructor(public dialog:MatDialog,
              public eventGalleryService:EventGalleryService) { }
  

  ngOnInit() {
       this.user = DataStorage.getInstance().getUser();
       this.serviceAdapter=new ManageEventServiceAdapter();
       this.serviceAdapter.initializeAdapter(this);
       this.serviceAdapter.initializeData();
       this.eventImageList=[];
       
       this.filteredEventList = this.eventFormControl.valueChanges.pipe(
            map(value => typeof value === 'string' ? value: (value as any).title),
            map(name => this.filterEventList(name.toString()))
        );
  }

    filterEventList(value: string): any {
        if (value === null || value === '') {
            return [];
        }
        return this.eventList.filter(event => {
            return event.title.toLowerCase().indexOf(value.toLowerCase()) === 0;
        });
    }

    generateNewTag():void{
        var newTag = document.getElementById("new-tag");
        newTag.style.display='inline-block';
        newTag.focus();
    }


    assignSelectedTags() {
        this.serviceAdapter.assignImageTags();
    }

    checkTagSelected():string {
        let selectedTagsLength = this.eventTagList.filter(tag=>tag.selected == true).length;
        if(selectedTagsLength > 0 ){
            return 'active';
        }else{
             return 'inactive';
        }
    }

    editSelectedTag():void {
        if(this.checkTagEditable()=='active'){
            let selectedTag = document.getElementsByClassName("selectedTag")[0];
            // @ts-ignore
            selectedTag.contentEditable='true';
             // @ts-ignore
            selectedTag.focus();
        }
    }

    checkTagEditable():string {
        let selectedTagsLength = this.eventTagList.filter(tag=>tag.selected == true).length;
        if(selectedTagsLength==1 && !this.isDeletingImages && !this.isAssigning){
            return 'active';
        }else{
             return 'inactive';
        }
    }

    deleteSelectedTag():void {
        if(this.checkTagSelected()=='active'){
            this.serviceAdapter.deleteSelectedTagList();
        }
    }


    readURL(event): void {
        if (event.target.files && event.target.files[0] && !this.isImageUploading) {
            this.isImageUploading = true;
            let files = []
            for (let i = 0; i < event.target.files.length; i++) {
                if (event.target.files[i].type !== 'image/jpeg' && event.target.files[i].type !== 'image/png') {
                    alert('File type should be either jpg, jpeg, or png');
                    this.isImageUploading = false;
                } else {
                    files.push(event.target.files[i]);
                }
            }

            files.forEach(image => {
                const reader = new FileReader();
                reader.onload = e => {
                    let tempImageData = {
                        parentEvent: this.selectedEvent.id,
                        eventImage: reader.result,
                        imageSize:image.size,
                    }
                    this.serviceAdapter.uploadImage(tempImageData,image.type.split('/')[1]);
                };
                reader.readAsDataURL(image);
            });
        }
    }
    
    openImagePreviewDialog(eventImages: any, index: any, editable: any): void {
      eventImages.forEach(img=>{
          img.imageUrl=img.eventImage;
      });
        const dialogRef = this.dialog.open(ViewImageModalComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: {'imageList': eventImages, 'index': index, 'type': 1,'fileType':'image','isMobile': this.isMobile()}
        });
        dialogRef.afterClosed();
    }

    deleteSelectedMedia() {
        if(this.checkMediaSelected()=='active' && !this.isDeletingImages){
            let images = this.eventImageList.filter(image=> image.selected == true);
            images.forEach(image=> {
                this.serviceAdapter.deleteSelectedImage(image);
            });
        }
    }
    
    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }

    handleEventSelection(event: any) {
      this.serviceAdapter.getEventData(event);
      this.selectedEvent=event;
    }
    
     displayEventTitle(event?: any): any {
        if (event) {
            if (typeof event == "string") {
                return event;
            } else {
                return event.title
            }
        }
        return '';
    }
    

    onPaste($event: any) {
        console.log($event);
    }

    selectTag($event: any, eventTag: any) {
        console.log($event);
        if ($event.target.innerHTML != '' && ($event.target.contentEditable == 'false' || $event.target.contentEditable == 'inherit')) {
            eventTag.selected = !eventTag.selected;
            this.selectTaggedImages(eventTag);
        }
    }

    saveTag($event: any,eventTag:any) {
      if($event.target.innerHTML != eventTag.tagName) {
          this.serviceAdapter.updateTag(eventTag,$event.target.innerHTML);
          $event.target.contentEditable='false';
      }else if($event.target.innerHTML == '' || $event.target.innerHTML.trim() == ''){
          $event.target.innerHTML=eventTag.tagName;
          $event.target.contentEditable='false';
      }
    }

    onKeyDown($event: any) {
      console.log($event);
        if ($event.key === 'Enter') {
            $event.preventDefault();
        }
    }

    createTag($event: any) {
        console.log($event);
        if ($event.target.innerHTML != '' && $event.target.innerHTML.trim() != '') {
            this.serviceAdapter.createTag($event.target.innerHTML);
            $event.target.innerHTML='';
            $event.target.style.display='none';
        }
    }
    

    selectAllMedia($event) {
      if($event.checked) {
          this.eventImageList.forEach(image => image.selected = true);
      }else{
          this.eventImageList.forEach(image => image.selected = false);
      }
    }

    getSelectedImagesCount():any{
        return this.eventImageList.filter(img=> img.selected==true).length;
    }

    checkMediaSelected():any { 
         if(this.eventImageList.filter(img=> img.selected==true).length>0){
             return 'active';
         }else{
             return 'inactive';
         }
    }

    showPreview($event: any, image: any, i: number) {
        $event.preventDefault();
        this.openImagePreviewDialog(this.eventImageList,i,true)
    }

    selectTaggedImages(eventTag: any) {
        this.eventImageList.forEach(img => {
            img.tagList.some(tag => {
                if (tag === eventTag.id) {
                    img.selected = eventTag.selected;
                }
            });
        });
    }
    
}
