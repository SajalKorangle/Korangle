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

    getSMSList(): void {
        const data = {
            startDateTime: this.vm.startDate.toString() + ' 00:00:00%2B05:30',
            endDateTime: this.vm.endDate.toString() + ' 23:59:59%2B05:30',
            parentSchool: this.vm.user.activeSchool.dbId,
            sentStatus: 'true__boolean',
        };

        this.vm.stateKeeper.isLoading = true;
        this.vm.backendData.smsList = null;
        this.vm.populatedSMSList = null;
        this.vm.smsOldService.getSMSList(data, this.vm.user.jwt).then(
            (smsList) => {
                this.vm.stateKeeper.isLoading = false;
                this.vm.backendData.smsList = smsList;
                this.vm.populatedSMSList = JSON.parse(JSON.stringify(smsList));
            },
            (error) => {
                this.vm.stateKeeper.isLoading = false;
            }
        );
    }


    // Get Delivery Report
    async getDeliveryReport(sms: any) {
        if (sms.deliveryReportList) {
            this.vm.userInput.selectedStatus = this.vm.getStatusList(sms)[0];
            return;
        }

        if (sms.requestId == -1 || sms.requestId == 0) {
            console.log('here');
            return;
        }

        sms['isLoading'] = true;

        let data = {
            requestId: sms.requestId,
            fetchedDeliveryStatus: sms.fetchedDeliveryStatus,
            smsGateWayHubVendor: sms.smsGateWayHubVendor,
            mobileNumberContentJson: sms.mobileNumberContentJson,
            senderId: sms.sender
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
