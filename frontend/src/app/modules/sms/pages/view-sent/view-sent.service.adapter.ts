import {ViewSentComponent} from './view-sent.component';

export class ViewSentServiceAdapter {
    vm: ViewSentComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: ViewSentComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {
        this.vm.stateKeeper.isLoading = true;
        Promise.all([this.vm.informationService.getObjectList(this.vm.informationService.message_type, {}),
        this.vm.smsService.getObjectList(this.vm.smsService.sms_event, {})]).then((value) => {
            this.vm.backendData.messageTypeList = value[0];
            this.vm.backendData.SMSEventList = value[1];
            this.populateMessageTypeAndSMSEventList();
            this.getSMSList();
            this.vm.stateKeeper.isLoading = false;
        });
    }

    async getSMSList() {
        const data = {
            startDateTime: this.vm.startDate.toString() + ' 00:00:00+05:30',
            endDateTime: this.vm.endDate.toString() + ' 23:59:59+05:30',
            parentSchool: this.vm.user.activeSchool.dbId,
            sentStatus: 'true',
        };

        this.vm.stateKeeper.isLoading = true;
        this.vm.backendData.smsList = null;
        this.vm.populatedSMSList = null;
        const smsList = await this.vm.smsService.getObjectList(this.vm.smsService.sms, data);
        this.vm.stateKeeper.isLoading = false;
        this.vm.backendData.smsList = smsList;
        this.vm.populatedSMSList = JSON.parse(JSON.stringify(smsList));

    }


    // Get Delivery Report
    async getDeliveryReport(sms: any) {
        if (sms.deliveryReportList) {
            this.vm.userInput.selectedStatus = this.vm.getStatusList(sms)[0];
            return;
        }

        if (sms.requestId == -1 || sms.requestId == 0) {
            return;
        }

        sms['isLoading'] = true;

        let data = {
            requestId: sms.requestId,
            fetchedDeliveryStatus: sms.fetchedDeliveryStatus,
            smsGateWayHubVendor: sms.smsGateWayHubVendor,
            mobileNumberContentJson: sms.mobileNumberContentJson,
            parentSMSId: sms.parentSMSId
        };

        sms['deliveryReportList'] = await this.vm.smsService.getObjectList(this.vm.smsService.sms_delivery_report, data);
        this.vm.userInput.selectedStatus = this.vm.getStatusList(sms)[0];
        sms.isLoading = false;
    }

    populateMessageTypeAndSMSEventList(): void {
        this.vm.populatedSMSEventList = JSON.parse(JSON.stringify(this.vm.backendData.SMSEventList));
        this.vm.populatedSMSEventList.forEach(event => {
            event['selected'] = true;
        });
        this.vm.populatedMessageTypeList = JSON.parse(JSON.stringify(this.vm.backendData.messageTypeList));
        this.vm.populatedMessageTypeList.forEach(type => {
            type['selected'] = true;
        });
    }
}
