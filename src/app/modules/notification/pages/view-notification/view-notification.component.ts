import { Component } from '@angular/core';

import {DataStorage} from "../../../../classes/data-storage";
import {NotificationService} from "../../../../services/modules/notification/notification.service";
import {ViewNotificationServiceAdapter} from "./view-notification.service.adapter";

@Component({
  selector: 'view-notification',
  templateUrl: './view-notification.component.html',
  styleUrls: ['./view-notification.component.css'],
})

export class ViewNotificationComponent {

    user;

    loadingCount = 20;

    loadMoreNotifications = true;

    notificationList = [];

    serviceAdapter: ViewNotificationServiceAdapter;

    isLoading = false;

    isLoadingMoreNotification = false;

    hasChecked = false;
    
    constructor (public notificationService: NotificationService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewNotificationServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    getNotificationTitle(notification: any): any {
        let result = this.user.schoolList.find(school => {
            return school.dbId == notification.parentSchool;
        });
        if (result != undefined) {
            return result.printName;
        } else {
            return '-';
        }
    }

}
