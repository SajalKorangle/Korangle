import {ViewSentComponent} from '@modules/sms/pages/view-sent/view-sent.component';

export class ViewSentHtmlRenderer {

    vm: ViewSentComponent;

    initializeAdapter(vm: ViewSentComponent): void {
        this.vm = vm;
    }

    getFilteredSMSList(): any {
        let tempList = [];
        this.vm.populatedSMSList.forEach(sms => {
            if (sms.parentMessageType && this.vm.populatedMessageTypeList.some(x => x.id == sms.parentMessageType && x.selected)) {
                tempList.push(sms);
            } else if (sms.SMSEventFrontEndId && this.vm.populatedSMSEventList.some(x => x.id == sms.SMSEventFrontEndId && x.selected)) {
                tempList.push(sms);
            }
        });
        return tempList;
    }

    getEventName(sms: any): string {
        if (sms.SMSEventFrontEndId) {
            return this.vm.backendData.smsEventList.find(x => x.id == sms.SMSEventFrontEndId).eventName;
        }
        return null;
    }

    messageTypeNeeded(): boolean {
        return this.vm.populatedSMSList.filter(x => x.parentMessageType != null).length > 0;
    }

    unselectAll(list: any) {
        list.forEach(event => event.selected = false);
    }

    selectAll(list: any) {
        list.forEach(event => event.selected = true);
    }

    getTotalSMSNotifCount() {
        let smsCount = 0;
        let notifCount = 0;

        this.getFilteredSMSList().forEach(sms => {
            smsCount += sms.count;
            notifCount += sms.notificationCount;
        });
        return smsCount + '/' + notifCount;
    }

    getMobileNumberListBySMS(sms: any): any {
        return sms.mobileNumberList.split(',').filter((item) => {
            return item != null && item != '';
        });
    }

    getMobileNumberListByStatusAndSMS(status: any, sms: any): any {
        let mobileNumberList = [];
        if (status == this.vm.STATUS_UNKNOWN) {
            let subtractMobileNumberList = sms.deliveryReportList.map((a) => a.mobileNumber.toString());
            mobileNumberList = sms.mobileNumberList.split(',').filter((item) => {
                return item != null && item != '' && !subtractMobileNumberList.includes(item);
            });
        } else {
            mobileNumberList = sms.deliveryReportList
                .filter((item) => {
                    return item.status == status;
                })
                .map((a) => a.mobileNumber);
        }
        return mobileNumberList;
    }

    getMessageType(sms: any): string {
        const messageType = this.vm.populatedMessageTypeList.find((val) => val.id == sms.parentMessageType);
        if (messageType) {
            return messageType['name'];
        } else {
            return '';
        }
    }
}