
import { ViewSentComponent } from './view-sent.component';

export class ViewSentServiceAdapter {

    vm: ViewSentComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: ViewSentComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
    }

    // Get Delivery Report
    getDeliveryReport(sms: any): void {

        if (sms.deliveryReportList) {
            this.vm.selectedStatus = this.vm.getStatusList(sms)[0];
            return;
        }

        sms['isLoading'] = true;

        let data = {
            'requestId': sms.requestId,
        };

        this.vm.smsService.getMsgClubDeliveryReport(data).then(value => {
            sms['deliveryReportList'] = value;
            this.vm.selectedStatus = this.vm.getStatusList(sms)[0];
            sms.isLoading = false;
        }, error => {
            sms.isLoading = false;
        });

    }

}