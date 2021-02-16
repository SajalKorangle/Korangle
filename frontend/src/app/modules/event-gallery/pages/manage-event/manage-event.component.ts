import { Component, OnInit } from '@angular/core';
import {DataStorage} from '@classes/data-storage';
import {CommonFunctions} from '@classes/common-functions';
import {ImagePreviewDialogComponent} from '@components/modal/image-preview-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {EventGalleryService} from '@services/modules/event-gallery/event-gallery.service';
import {map} from 'rxjs/operators';
import {ManageEventServiceAdapter} from '@modules/event-gallery/pages/manage-event/manage-event.service.adapter';
declare const $: any;



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
 eventImageData:any;
 isImageUploading=false;
 eventList:any;
 filteredEventList:any;
 eventFormControl=new FormControl();
 selectedEvent:any;
 notifyToList:any;
 isEventLoading:boolean;
 eventTagData:any;
 eventImageTagData:any;
    
 
  constructor(public dialog:MatDialog,
              public eventGalleryService:EventGalleryService) { }
  

  ngOnInit() {
       this.user = DataStorage.getInstance().getUser();
       this.serviceAdapter=new ManageEventServiceAdapter();
       this.serviceAdapter.initializeAdapter(this);
       this.serviceAdapter.initializeData();
       this.eventImageData=[];
       
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
        var generateHere = document.getElementById("generate-tags-btn");
        
        function saveTag(event) {
            console.log('I am Called');
            let tag = event.target.childNodes[0];
            if (tag) {
                console.log(tag.data);
                if (event.target.childNodes[0].data != '') {
                    event.target.attributes[0].value = 'false';
                }
            }
        }

        if(!generateHere.nextElementSibling || generateHere.nextElementSibling.innerHTML !== '') {
            var div = document.createElement('div');
            div.contentEditable = 'true';
            div.style.background = '#ABABAB';
            div.style.height = '28px';
            div.style.padding = '5px';
            div.style.marginLeft = '5px';
            div.style.textTransform='none';
            div.onkeydown=function (event){
                if(event.key === 'Enter'){
                    event.preventDefault();
                    div.contentEditable='false';
                    saveTag(event);
                }
                
            }
            div.onpaste=function (event){
                event.preventDefault()
                var text = event.clipboardData.getData('text/plain')
                text =text.replace(/(\r\n|\n|\r)/gm," ");
                document.execCommand('insertText', false, text)
            }
            // div.ondblclick=function (event){
            //     div.contentEditable = 'true';
            // };
            div.onblur= function(event) { 
                console.log(event);
                saveTag(event);
            };
            div.onclick=function (event){
                if(div.innerHTML!='' && div.contentEditable=='false') {
                    div.classList.toggle("selectedTag");
                    if (div.style.background === 'rgb(171, 171, 171)') {
                        div.style.background = '#3BB847';
                    } else {
                        div.style.background = '#ABABAB';
                    }
                }
            };
            div.classList.add("btn");
            generateHere.parentNode.insertBefore(div, generateHere.nextElementSibling);
            div.focus();
        }
    }


    assignSelectedTags() {
        
    }

    getButtonColor():string {
        let selectedTags = document.getElementsByClassName("selectedTag");
        if(selectedTags.length>0){
            return 'warning';
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
        let selectedTags = document.getElementsByClassName("selectedTag");
        if(selectedTags.length==1){
            return 'active';
        }else{
             return 'inactive';
        }
    }

    deleteSelectedTag():void {
        if(this.checkTagEditable()=='active'){
            let selectedTag = document.getElementsByClassName("selectedTag");
            selectedTag[0].remove();
        }
    }
    
    
    dragEnter(value){
        $(".dropinput").css({"z-index":"6"})
    }

    onDrop(value){
        $('.dropinput').css({"z-index":"-1"})
    }
    


    readURL(event):void {
       if (event.target.files && event.target.files[0]) {
           this.isImageUploading=true;
           let image = event.target.files[0];
           if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
               alert('File type should be either jpg, jpeg, or png');
               return;
           }
           console.log(image);
           const reader = new FileReader();
           reader.onload = e => {
               let tempImageData = {
                   orderNumber: null,
                   parentEvent: null,
                   questionImage: reader.result,
               }
               this.eventImageData.push(tempImageData);
           };
           reader.readAsDataURL(image);
           this.isImageUploading=false;
       }
    }
    
    openImagePreviewDialog(homeworkImages: any, index: any, editable: any): void {
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: {'homeworkImages': homeworkImages, 'index': index, 'editable': editable, 'isMobile': this.isMobile()}
        });
        dialogRef.afterClosed();
    }

    deleteSelectedMedia() {
        
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
}
