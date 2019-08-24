import { Component } from '@angular/core';

import {DataStorage} from "../../../../classes/data-storage";
import {NotificationService} from "../../../../services/notification/notification.service";
import {ViewNotificationServiceAdapter} from "./view-notification.service.adapter";

@Component({
  selector: 'view-notification',
  templateUrl: './view-notification.component.html',
  styleUrls: ['./view-notification.component.css'],
})

export class ViewNotificationComponent {

    user;

    loadingCount = 10;

    notificationList = [];

    serviceAdapter: ViewNotificationServiceAdapter;

    isLoading = false;

    constructor (public notificationService: NotificationService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new ViewNotificationServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

}
