import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {ViewEventServiceAdapter} from '@modules/event-gallery/pages/view-event/view-event.service.adapter';
import {DataStorage} from '@classes/data-storage';
import {ManageEventServiceAdapter} from '@modules/event-gallery/pages/manage-event/manage-event.service.adapter';
import {map} from 'rxjs/operators';
import {AddEventHtmlAdapter} from '@modules/event-gallery/pages/add-event/add-event.html.adapter';
import {ViewEventHtmlAdapter} from '@modules/event-gallery/pages/view-event/view-event.html.adapter';
import {EventGalleryService} from '@services/modules/event-gallery/event-gallery.service';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css'],
  providers:[EventGalleryService]
})
export class ViewEventComponent implements OnInit {

  serviceAdapter:ViewEventServiceAdapter;  
  htmlAdapter:ViewEventHtmlAdapter;
  user:any;
    
    imageList: any;
    notifySelectionList: any;
    selectionList = new FormControl();
    editing = false;
    editingEvent: any;
    newEvent: any;
    isLoading = false;
    selectedEvent:any;
    searchString: any;
    tagList:any;
    imageTagList:any;
    notifyPersonData:any;
    editingNotificationList:any;
    eventList: any;
    eventNotifyList:any;
    eventCount=0;
    loadingCount=10;
    loadMoreEvents=false;
    isEventListLoading=false;
  isImageDownloading: boolean;
  
  constructor(public eventGalleryService:EventGalleryService) { }

  ngOnInit() {

      this.user = DataStorage.getInstance().getUser();
      this.serviceAdapter = new ViewEventServiceAdapter();
      this.serviceAdapter.initializeAdapter(this);
      this.serviceAdapter.initializeData();

      this.htmlAdapter = new ViewEventHtmlAdapter();
      this.htmlAdapter.initializeAdapter(this);
  }


  viewSelectedEvent(event: any) {
     this.selectedEvent=event;
  }

  selectTag($event: any, eventTag: any) {
    console.log($event);
    if ($event.target.innerHTML != '' && ($event.target.contentEditable == 'false' || $event.target.contentEditable == 'inherit')) {
      eventTag.selected = !eventTag.selected;
      this.selectTaggedImages(eventTag);
    }
  }

  selectTaggedImages(eventTag: any) {
    this.imageList.forEach(img => {
      img.tagList.some(tag => {
        if (tag === eventTag.id) {
          img.selected = eventTag.selected;
        }
      });
    });
  }
  
  downloadSelectedImages() {
    
  }
  
  getSelectedImagesCount():any{
        return this.imageList.filter(img=> img.selected==true).length;
    }

  selectAllMedia($event) {
    if ($event.checked) {
      this.imageList.forEach(image => image.selected = true);
    } else {
      this.imageList.forEach(image => image.selected = false);
    }
  }

  showPreview($event: any, image: any, i: any) {
    
  }
}
