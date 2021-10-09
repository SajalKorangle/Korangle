import { Component, HostListener, OnInit } from '@angular/core';
import { DataStorage } from '@classes/data-storage';
import { AddEventServiceAdapter } from '@modules/event-gallery/pages/add-event/add-event.service.adapter';
import { ClassService } from '@services/modules/class/class.service';
import { EventGalleryService } from '@services/modules/event-gallery/event-gallery.service';
import { FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { AddEventHtmlAdapter } from '@modules/event-gallery/pages/add-event/add-event.html.adapter';
import { StudentService } from '@services/modules/student/student.service';
import { MessageService } from '@services/message-service';
import { NotificationService } from '@services/modules/notification/notification.service';
import { UserService } from '@services/modules/user/user.service';
import { SmsService } from '@services/modules/sms/sms.service';
import { EmployeeService } from '@services/modules/employee/employee.service';
import {SmsOldService} from '@services/modules/sms/sms-old.service';
import {TCService} from '@services/modules/tc/tc.service';

@Component({
    selector: 'app-add-event',
    templateUrl: './add-event.component.html',
    styleUrls: ['./add-event.component.css'],
    providers: [ClassService, EventGalleryService, StudentService, NotificationService, UserService, SmsService, EmployeeService, TCService, SmsOldService],
})
export class AddEventComponent implements OnInit {
    user: any;

    serviceAdapter: AddEventServiceAdapter;
    htmlAdapter: AddEventHtmlAdapter;
    messageService: any;

    imageList: any;
    notifySelectionList: any;
    selectionList = new FormControl();
    eventList: any;
    eventNotifyList: any;
    editingNotificationList: any;

    editing = false;
    editingEvent: any;
    newEvent: any;
    searchString: any;
    notifyPersonData: any;
    eventCount = 0;
    loadingCount = 10;

    EVENT_GALLERY_CREATION_EVENT_DBID = 15;
    EVENT_GALLERY_UPDATION_EVENT_DBID = 16;
    EVENT_GALLERY_DELETION_EVENT_DBID = 17;

    isLoading = false;
    loadMoreEvents = false;
    isEventListLoading = false;

    dataForMapping = {} as any;
    smsBalance = 0;

    constructor(
        public classService: ClassService,
        public eventGalleryService: EventGalleryService,
        public studentService: StudentService,
        public notificationService: NotificationService,
        public userService: UserService,
        public smsService: SmsService,
        public employeeService: EmployeeService,
        public tcService: TCService,
        public smsOldService : SmsOldService,
    ) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new AddEventServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.messageService = new MessageService(this.notificationService, this.userService, this.smsService);

        this.htmlAdapter = new AddEventHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);

        this.initializeNewEvent();
    }

    @HostListener('window:scroll', ['$event']) onScrollEvent(event) {
        if (
            document.documentElement.clientHeight + document.documentElement.scrollTop > 0.7 * document.documentElement.scrollHeight &&
            this.loadMoreEvents &&
            !this.isEventListLoading
        ) {
            this.serviceAdapter.fetchLoadingCount();
        }
    }

    initializeNewEvent(): void {
        let currentDate = new Date();
        const todayDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');

        this.newEvent = {
            title: null,
            description: null,
            heldOn: todayDate,
        };
    }
}
