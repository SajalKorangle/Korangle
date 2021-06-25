import { ViewSentComponent } from './view-sent.component';
import {SMS_EVENT_LIST} from '@modules/constants-database/SMSEvent';

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
        Promise.all([this.vm.informationService.getObjectList(this.vm.informationService.message_type, {})]).then((value) => {
            this.vm.backendData.messageTypeList = value[0];
            this.vm.backendData.smsEventList = SMS_EVENT_LIST;
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
    getDeliveryReport(sms: any): void {
        if (sms.deliveryReportList) {
            this.vm.userInput.selectedStatus = this.vm.getStatusList(sms)[0];
            return;
        }

        sms['isLoading'] = true;

        let data = {
            requestId: sms.requestId,
        };

        this.vm.smsOldService.getMsgClubDeliveryReport(data).then(
            (value) => {
                sms['deliveryReportList'] = value;
                this.vm.userInput.selectedStatus = this.vm.getStatusList(sms)[0];
                sms.isLoading = false;
            },
            (error) => {
                sms.isLoading = false;
            }
        );
    }

    populateMessageTypeAndSMSEventList(): void {
        this.vm.populatedSMSEventList = JSON.parse(JSON.stringify(this.vm.backendData.smsEventList));
        this.vm.populatedSMSEventList.forEach(event => {
            event['selected'] = true;
        });
        this.vm.populatedMessageTypeList = JSON.parse(JSON.stringify(this.vm.backendData.messageTypeList));
        this.vm.populatedMessageTypeList.forEach(type => {
            type['selected'] = true;
        });
    }
}
