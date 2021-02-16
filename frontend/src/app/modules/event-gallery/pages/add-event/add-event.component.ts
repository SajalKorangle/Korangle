import {Component, HostListener, OnInit} from '@angular/core';
import {DataStorage} from '@classes/data-storage';
import {AddEventServiceAdapter} from '@modules/event-gallery/pages/add-event/add-event.service.adapter';
import {ClassService} from '@services/modules/class/class.service';
import {EventGalleryService} from '@services/modules/event-gallery/event-gallery.service';
import {FormControl} from '@angular/forms';
import {formatDate} from '@angular/common';
import {AddEventHtmlAdapter} from '@modules/event-gallery/pages/add-event/add-event.html.adapter';

@Component({
    selector: 'app-add-event',
    templateUrl: './add-event.component.html',
    styleUrls: ['./add-event.component.css'],
    providers: [ClassService, EventGalleryService]
})
export class AddEventComponent implements OnInit {

    user: any;
    serviceAdapter: AddEventServiceAdapter;
    htmlAdapter:AddEventHtmlAdapter;

    imageList: any;
    notifySelectionList: any;
    selectionList = new FormControl();
    editing = false;
    editingEvent: any;
    newEvent: any;
    isLoading = false;
    searchString: any;
    eventList: any;
    eventNotifyList:any;
    eventCount=0;
    loadingCount=10;
    loadMoreEvents=false;
    isEventListLoading=false;


    constructor(public classService: ClassService,
                public eventGalleryService: EventGalleryService) {
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new AddEventServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        
        this.htmlAdapter = new AddEventHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);
        
        this.initializeNewEvent();
    }
    
    
    @HostListener('window:scroll', ['$event']) onScrollEvent(event){
        if((document.documentElement.clientHeight + document.documentElement.scrollTop) > (0.7*document.documentElement.scrollHeight) && this.loadMoreEvents && !this.isEventListLoading){
            this.serviceAdapter.fetchLoadingCount();
        }
    }
    
    initializeNewEvent():void {
        let currentDate = new Date();
        const todayDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');

        this.newEvent = {
            'title': null,
            'description': null,
            'heldOn': todayDate,
        };
    }
    
}
