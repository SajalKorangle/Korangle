import {Component, HostListener, OnInit} from '@angular/core';
import {DataStorage} from '@classes/data-storage';
import {AddEventServiceAdapter} from '@modules/event-gallery/pages/add-event/add-event.service.adapter';
import {ClassService} from '@services/modules/class/class.service';
import {EventGalleryService} from '@services/modules/event-gallery/event-gallery.service';
import {FormControl} from '@angular/forms';
import {formatDate} from '@angular/common';
import {AddEventHtmlAdapter} from '@modules/event-gallery/pages/add-event/add-event.html.adapter';
import {StudentService} from '@services/modules/student/student.service';
import {UpdateService} from '../../../../update/update-service';
import {NotificationService} from '@services/modules/notification/notification.service';
import {UserService} from '@services/modules/user/user.service';
import {SmsService} from '@services/modules/sms/sms.service';
import {Sms} from '@services/modules/sms/models/sms';
import {EmployeeService} from '@services/modules/employee/employee.service';

@Component({
    selector: 'app-add-event',
    templateUrl: './add-event.component.html',
    styleUrls: ['./add-event.component.css'],
    providers: [ClassService, EventGalleryService,StudentService, NotificationService, UserService, SmsService,EmployeeService]
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
    notifyPersonData:any;
    editingNotificationList:any;
    eventList: any;
    eventNotifyList:any;
    eventCount=0;
    loadingCount=10;
    loadMoreEvents=false;
    isEventListLoading=false;
    updateService:any;
    eventPostedMessage="A New Event \"<eventTitle>\" has been posted by the school, view the event details in View-Event page ";
    eventDeletedMessage="The Event \"<eventTitle>\" has been removed from the school event list";


    constructor(public classService: ClassService,
                public eventGalleryService: EventGalleryService,
                public studentService:StudentService,
                public notificationService:NotificationService,
                public userService:UserService,
                public smsService:SmsService,
                public employeeService:EmployeeService) {
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new AddEventServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
        
        this.updateService = new UpdateService(this.notificationService, this.userService, this.smsService);

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
