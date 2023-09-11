import { CollectFeeComponent } from './collect-fee.component';
import { CommonFunctions } from "../../../../classes/common-functions";
import { INSTALLMENT_LIST } from '@modules/fees/classes/constants';

export class CollectFeeServiceAdapter {
    vm: CollectFeeComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: CollectFeeComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {

        // ------------------- Initial Data Fetching Starts ---------------------

        this.vm.isLoading = true;

        let schoolId = this.vm.user.activeSchool.dbId;
        const today = new Date();
        this.vm.sessionList = await this.vm.genericService.getObjectList({school_app: 'Session'}, {});
        const activeSession = this.vm.sessionList.find(session => { // active session according to date
            const endDate = new Date(session.endDate);
            endDate.setHours(23, 59, 59, 999);
            const startDate = new Date(session.startDate);
            startDate.setHours(0, 0, 0, 0);
            return today >= startDate && today <= endDate;
        });

        let fee_type_list = {
            parentSchool: schoolId,
        };

        let bus_stop_list = {
            parentSchool: schoolId,
        };

        let employee_list = {
            parentSchool: schoolId,
        };

        const accounts_request = {
            accountType: 'ACCOUNT',
        };

        const account_session_request = {
            parentAccount__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: activeSession.id,
            parentAccount__accountType: 'ACCOUNT',
        };

        const fee_settings_request = {
            parentSession: activeSession.id,
        };

        const value = await Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, fee_type_list), // 0
            this.vm.vehicleService.getBusStopList(bus_stop_list, this.vm.user.jwt), // 1
            this.vm.genericService.getObjectList({employee_app: 'Employee'}, {filter: employee_list}), // 2
            this.vm.schoolService.getObjectList(this.vm.schoolService.board, {}),    // 3
            this.vm.feeService.getObjectList(this.vm.feeService.fee_settings, fee_settings_request),  // 4
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, accounts_request), // 5
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, account_session_request), // 6
            this.vm.genericService.getObjectList({ fees_third_app: 'FeeSchoolSettings' }, {filter: {parentSchool: this.vm.user.activeSchool.dbId}}), // 7
            this.vm.genericService.getObjectList({fees_third_app: 'FeeReceiptBook'}, {filter: {parentSchool: schoolId}, order_by: ['id']}), // 8
        ]);
        this.vm.feeTypeList = value[0];
        this.vm.busStopList = value[1];
        this.vm.employeeList = value[2];
        this.vm.boardList = value[3];
        if (value[4].length == 1)
            this.vm.feeSettings = value[4][0];
        this.vm.accountsList = value[5];
        this.vm.htmlRenderer.populateCustomAccountSessionList(this.vm.accountsList, value[6]);
        if (value[7].length == 1) {
            this.vm.printSingleReceipt = value[7][0]["printSingleReceipt"];
        }
        this.vm.feeReceiptBookList = value[8];
        this.vm.selectedFeeReceiptBook = this.vm.feeReceiptBookList.find(feeReceiptBook => feeReceiptBook.active);

        this.vm.handlePaymentAccountOnPaymentModeChange();

        this.vm.isLoading = false;

        const sms_count_request_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const val = await Promise.all([
            this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 0
            this.vm.genericService.getObjectList({class_app: 'Division'}, {}), // 1
            this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt), //2
            this.vm.smsService.getObjectList(this.vm.smsService.sms_event,
                { id__in: this.vm.FEE_RECEIPT_NOTIFICATION_EVENT_DBID}), //3
        ]);

        this.vm.smsBalance = val[2].count;
        this.vm.backendData.feeReceiptSMSEventList = val[3];

        this.vm.dataForMapping['classList'] = val[0];
        this.vm.dataForMapping['divisionList'] = val[1];
        this.vm.dataForMapping['school'] = this.vm.user.activeSchool;

        let fetch_event_settings_list = {
            SMSEventId__in: this.vm.backendData.feeReceiptSMSEventList.map(a => a.id).join(),
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        if (this.vm.backendData.feeReceiptSMSEventList.length > 0) {
            this.vm.backendData.eventSettingsList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, fetch_event_settings_list);
        }

        // ------------------- Initial Data Fetching Ends ---------------------

    }

    // Get Student Fee Profile
    getStudentFeeProfile(): void {
        let studentListId = this.vm.selectedStudentList.map((a) => a.id);

        let student_fee_list = {
            parentStudent__in: studentListId,
        };

        let fee_receipt_list = {
            parentStudent__in: studentListId,
            cancelled: false,
        };

        let sub_fee_receipt_list = {
            parentStudentFee__parentStudent__in: studentListId,
            parentFeeReceipt__cancelled: false,
        };

        let discount_list = {
            parentStudent__in: studentListId,
            cancelled: false,
        };

        let sub_discount_list = {
            parentStudentFee__parentStudent__in: studentListId,
            parentDiscount__cancelled: false,
        };

        let student_section_list = {
            parentStudent__in: studentListId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.genericService.getObjectList({fees_third_app: 'StudentFee'}, {filter: student_fee_list}), // 0
            this.vm.genericService.getObjectList({fees_third_app: 'FeeReceipt'}, {filter: fee_receipt_list}), // 1
            this.vm.genericService.getObjectList({fees_third_app: 'SubFeeReceipt'}, {filter: sub_fee_receipt_list}), // 2
            this.vm.genericService.getObjectList({fees_third_app: 'Discount'}, {filter: discount_list}), // 3
            this.vm.genericService.getObjectList({fees_third_app: 'SubDiscount'}, {filter: sub_discount_list}), // 4
            this.vm.genericService.getObjectList({student_app: 'StudentSection'}, {filter: student_section_list}), // 5
        ]).then(
            (value) => {
                this.populateStudentFeeList(value[0]);
                this.populateFeeReceiptList(value[1]);
                this.vm.subFeeReceiptList = value[2];
                this.populateDiscountList(value[3]);
                this.vm.subDiscountList = value[4];
                this.vm.selectedStudentSectionList = value[5];

                this.vm.handleStudentFeeProfile();

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    populateStudentFeeList(studentFeeList: any): void {
        this.vm.studentFeeList = studentFeeList.sort((a, b) => {
            let first = this.vm.getFeeTypeByStudentFee(a);
            let second = this.vm.getFeeTypeByStudentFee(b);
            return first.orderNumber - second.orderNumber;
        });
    }

    populateFeeReceiptList(feeReceiptList: any): void {
        this.vm.feeReceiptList = feeReceiptList.sort((a, b) => {
            return (new Date(b.generationDateTime).getTime()) - (new Date(a.generationDateTime).getTime());
        });
    }

    populateDiscountList(discountList: any): void {
        this.vm.discountList = discountList.sort((a, b) => {
            return b.discountNumber - a.discountNumber;
        });
    }

    // Generate Fee Receipt/s
    async generateFeeReceipts() {

        this.vm.isLoading = true;

        let sub_fee_receipt_list = this.vm.newSubFeeReceiptList.map((subFeeReceipt) => {
            return CommonFunctions.getInstance().deepCopy(subFeeReceipt);
        });

        let fee_receipt_list = this.vm.newFeeReceiptList.map((feeReceipt) => {
            feeReceipt = CommonFunctions.getInstance().deepCopy(feeReceipt);
            if (feeReceipt['remark'] == '') {
                feeReceipt['remark'] = null;
            }
            return {
                ...feeReceipt,
                receiptNumber: 0,
                parentFeeReceiptBook: this.vm.selectedFeeReceiptBook.id,
                subFeeReceiptList: sub_fee_receipt_list.filter(subFeeReceipt => subFeeReceipt.parentSession == feeReceipt.parentSession
                    && this.vm.studentFeeList.find(item => {
                        return item.id == subFeeReceipt.parentStudentFee;
                    }).parentStudent == feeReceipt.parentStudent)
            };
        });

        this.vm.isLoading = true;
        let newFeeReceiptListResponse;

        let transactionFromAccountId;
        let transactionToAccountId;

        let transactionFromAccountSession;
        if (this.vm.feeSettings && this.vm.feeSettings.accountingSettingsJSON) {
            transactionFromAccountSession = this.vm.htmlRenderer.customAccountSessionList
                .find(customAccountSession => customAccountSession.id == this.vm.feeSettings.accountingSettingsJSON.parentAccountFrom);
        }

        if (this.vm.feeSettings && this.vm.feeSettings.accountingSettingsJSON && this.vm.studentFeePaymentAccount && transactionFromAccountSession) {
            transactionFromAccountId = this.vm.studentFeePaymentAccount;
            transactionToAccountId = transactionFromAccountSession.parentAccount;

            const toCreateTransactionList = [];

            fee_receipt_list.forEach(fee_receipt => {
                const student = this.vm.getStudentById(fee_receipt.parentStudent);
                const newTransaction = {
                    parentEmployee: this.vm.user.activeSchool.employeeId,
                    parentSchool: this.vm.user.activeSchool.dbId,
                    remark: `Student Fee Payment for ${student.name} with Scholar No. ${student.scholarNumber} of ${this.vm.getClassNameByStudentAndSessionId(student, fee_receipt.parentSession)}`,
                    transactionDate: new Date().toISOString().substring(0, 10),
                    feeReceiptList: [fee_receipt],
                    transactionAccountDetailsList: [],
                };
                const totalAmount = fee_receipt.subFeeReceiptList.reduce((acc, subFeeReceipt) => {
                    return acc + INSTALLMENT_LIST.reduce((acc, installment) => {
                        return acc + (subFeeReceipt[installment + 'Amount'] || 0) + (subFeeReceipt[installment + 'LateFee'] || 0);
                    }, 0);
                }, 0);
                const newCreditTransactionAccountDetails = {
                    parentAccount: transactionToAccountId,
                    amount: totalAmount,
                    transactionType: 'CREDIT',
                };
                const newDebitTransactionAccountDetails = {
                    parentAccount: transactionFromAccountId,
                    amount: totalAmount,
                    transactionType: 'DEBIT',
                };
                newTransaction.transactionAccountDetailsList = [newCreditTransactionAccountDetails, newDebitTransactionAccountDetails];
                toCreateTransactionList.push(newTransaction);
            });

            const newTransactionListResponse = await this.vm.genericService.createObjectList({ accounts_app: 'Transaction' }, toCreateTransactionList);
            newFeeReceiptListResponse = newTransactionListResponse.reduce((acc: Array<any>, transaction: any) => acc.concat(transaction.feeReceiptList), []);

        }
        else {
            newFeeReceiptListResponse = await this.vm.genericService.createObjectList({ fees_third_app: 'FeeReceipt' }, fee_receipt_list);
        }

        const newSubFeeReceiptList = [];
        const newFeeReceiptList = newFeeReceiptListResponse.map(feeReceipt => {
            feeReceipt = { ...feeReceipt };
            newSubFeeReceiptList.push(...feeReceipt.subFeeReceiptList);
            delete feeReceipt.subFeeReceiptList;
            return feeReceipt;
        });
        this.addToFeeReceiptList(newFeeReceiptList);
        this.vm.subFeeReceiptList = this.vm.subFeeReceiptList.concat(newSubFeeReceiptList);

        alert('Fees submitted successfully');
        this.notifyParents(newFeeReceiptList);

        this.vm.printFullFeeReceiptList(newFeeReceiptList, newSubFeeReceiptList);

        this.vm.handleStudentFeeProfile();

        this.vm.isLoading = false;

    }

    // Notify parents about Fee Receipt
    async notifyParents(fee_receipt_list) {
        let tempStudentList = this.vm.getStudentList();
        let studentList = [];

        // Calculating and storing neccessary variables for SMS/Notification template
        if (tempStudentList.length > 0) {

            tempStudentList.forEach((student) => {

                if (this.checkMobileNumber(student.mobileNumber) == false) {
                    return;
                }

                let sessionList = this.vm.getFilteredSessionListByStudent(student);

                sessionList.forEach((session) => {

                    let feeAmount = this.vm.getSessionPayment(student, session) + this.vm.getSessionLateFeePayment(student, session);
                    let dueFeeAmount = this.vm.getSessionFeesDue(student, session, false) + this.vm.getSessionLateFeesDue(student, session, false);

                    let feeReceipt = fee_receipt_list.find(x => (x.parentStudent == student.id && x.parentSession == session.id));

                    let tempStudent =  CommonFunctions.getInstance().copyObject(student);
                    if (feeAmount > 0) {
                        tempStudent['feeAmount'] = feeAmount;
                        tempStudent['dueFeeAmount'] = dueFeeAmount;
                        tempStudent['session'] = session;
                        tempStudent['feeReceipt'] = feeReceipt;
                        tempStudent['feeReceiptBook'] =
                            this.vm.feeReceiptBookList.find(feeReceiptBook => feeReceiptBook.id == feeReceipt.parentFeeReceiptBook);
                        studentList.push(tempStudent);
                    }

                });
            });
        }

        this.vm.messageService.fetchGCMDevicesNew(studentList);

        this.vm.dataForMapping['studentList'] =  studentList;
        this.vm.dataForMapping['studentSectionList'] = this.vm.selectedStudentSectionList;

        await this.vm.messageService.fetchEventDataAndSendEventSMSNotification(
            this.vm.dataForMapping,
            ['student'],
            this.vm.FEE_RECEIPT_NOTIFICATION_EVENT_DBID,
            this.vm.user.activeSchool.dbId,
            this.vm.smsBalance
        );

    }

    checkMobileNumber(mobileNumber: number): boolean {
        return mobileNumber && mobileNumber.toString().length == 10;
    }

    addToFeeReceiptList(fee_receipt_list: any): void {
        this.vm.feeReceiptList = this.vm.feeReceiptList.concat(fee_receipt_list).sort((a, b) => {
            return (new Date(b.generationDateTime).getTime()) - (new Date(a.generationDateTime).getTime());
        });
    }
}
