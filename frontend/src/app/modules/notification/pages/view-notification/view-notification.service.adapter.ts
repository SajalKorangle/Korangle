import { ViewNotificationComponent } from './view-notification.component';

export class ViewNotificationServiceAdapter {
    vm: ViewNotificationComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: ViewNotificationComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        let count = this.vm.notificationList.length;

        let notification_data = {
            parentUser: this.vm.user.id,
            korangle__order: '-sentDateTime',
            korangle__count: count.toString() + ',' + (count + this.vm.loadingCount).toString(),
        };

        this.vm.isLoading = true;

        Promise.all([this.vm.notificationService.getObjectList(this.vm.notificationService.notification, notification_data)]).then(
            (value) => {
                this.vm.notificationList = this.vm.notificationList.concat(value[0]);
                if (value[0].length < this.vm.loadingCount) {
                    this.vm.loadMoreNotifications = false;
                }
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    loadMoreNotifications(): void {
        let count = this.vm.notificationList.length;

        let notification_data = {
            parentUser: this.vm.user.id,
            korangle__order: '-sentDateTime',
            korangle__count: count.toString() + ',' + (count + this.vm.loadingCount).toString(),
        };

        this.vm.isLoadingMoreNotification = true;

        Promise.all([this.vm.notificationService.getObjectList(this.vm.notificationService.notification, notification_data)]).then(
            (value) => {
                this.vm.notificationList = this.vm.notificationList.concat(value[0]);
                if (value[0].length < this.vm.loadingCount) {
                    this.vm.loadMoreNotifications = false;
                }
                this.vm.isLoadingMoreNotification = false;
            },
            (error) => {
                this.vm.isLoadingMoreNotification = false;
            }
        );
    }

    deleteNotification(notification: any) {
        if (!confirm('Are you sure you want to delete this notification')) {
            return;
        }
        this.vm.notificationBeingDeleted = notification;
        const notification_delete_data = {
            id: notification.id,
        };
        this.vm.notificationService
            .deleteObject(this.vm.notificationService.notification, notification_delete_data)
            .then((val) => {
                const idx = this.vm.notificationList.indexOf(notification);
                this.vm.notificationList.splice(idx, 1);
                this.vm.notificationBeingDeleted = null;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
