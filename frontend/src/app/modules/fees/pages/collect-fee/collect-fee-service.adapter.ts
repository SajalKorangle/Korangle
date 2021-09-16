import { CollectFeeComponent } from './collect-fee.component';
import { CommonFunctions } from "../../../../classes/common-functions";

export class CollectFeeServiceAdapter {
    vm: CollectFeeComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: CollectFeeComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {

        this.vm.isLoading = true;

        let schoolId = this.vm.user.activeSchool.dbId;
        const today = new Date();
        const sessionList = await this.vm.schoolService.getObjectList(this.vm.schoolService.session, {});
        const activeSession = sessionList.find(session => { // active session according to date
            const endDate = new Date(session.endDate);
            const startDate = new Date(session.startDate);
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
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list),    // 2
            this.vm.schoolService.getObjectList(this.vm.schoolService.board, {}),    // 3
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),   // 4
            this.vm.feeService.getObjectList(this.vm.feeService.fee_settings, fee_settings_request),  // 5
            this.vm.accountsService.getObjectList(this.vm.accountsService.accounts, accounts_request), //6
            this.vm.accountsService.getObjectList(this.vm.accountsService.account_session, account_session_request), //7
        ]);
        this.vm.feeTypeList = value[0];
        this.vm.busStopList = value[1];
        this.vm.employeeList = value[2];
        this.vm.boardList = value[3];
        this.vm.sessionList = value[4];
        if (value[5].length == 1)
            this.vm.feeSettings = { ...value[5][0], accountingSettings: JSON.parse(value[5][0].accountingSettings) };
        this.vm.accountsList = value[6];
        this.vm.htmlRenderer.populateCustomAccountSessionList(this.vm.accountsList, value[7]);
        this.vm.handlePaymentAccountOnPaymentModeChange();

        this.vm.isLoading = false;

    }

    // Get Student Fee Profile
    getStudentFeeProfile(): void {
        let studentListId = this.vm.selectedStudentList.map((a) => a.id).join();

        let student_fee_list = {
            parentStudent__in: studentListId,
        };

        let fee_receipt_list = {
            parentStudent__in: studentListId,
            cancelled: 'false__boolean',
        };

        let sub_fee_receipt_list = {
            parentStudentFee__parentStudent__in: studentListId,
            parentFeeReceipt__cancelled: 'false__boolean',
        };

        let discount_list = {
            parentStudent__in: studentListId,
            cancelled: 'false__boolean',
        };

        let sub_discount_list = {
            parentStudentFee__parentStudent__in: studentListId,
            parentDiscount__cancelled: 'false__boolean',
        };

        let student_section_list = {
            parentStudent__in: studentListId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_list),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_receipts, fee_receipt_list),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_list),
            this.vm.feeService.getObjectList(this.vm.feeService.discounts, discount_list),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_list),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_fee_list),
        ]).then(
            (value) => {
                this.populateStudentFeeList(value[0]);
                this.populateFeeReceiptList(value[1]);
                this.vm.subFeeReceiptList = value[2];
                this.populateDiscountList(value[3]);
                this.vm.subDiscountList = value[4];
                this.vm.selectedStudentSectionList = value[5];
                // this.populateSelectedStudentSectionList(value[5]);

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
            return b.receiptNumber - a.receiptNumber;
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

        let fee_receipt_list = this.vm.newFeeReceiptList.map((feeReceipt) => {
            // return CommonFunctions.getInstance().copyObject(feeReceipt);
            let tempObject = CommonFunctions.getInstance().copyObject(feeReceipt);
            if (feeReceipt['remark'] == '') {
                feeReceipt['remark'] = null;
            }
            return tempObject;
        });

        let sub_fee_receipt_list = this.vm.newSubFeeReceiptList.map((subFeeReceipt) => {
            return CommonFunctions.getInstance().copyObject(subFeeReceipt);
        });

        // console.log('fee_receipt_list: ', fee_receipt_list);
        // console.log('sub_fee_receipt_list: ', sub_fee_receipt_list);

        let tempStudentFeeIdList = sub_fee_receipt_list.map(a => a.parentStudentFee);

        let student_fee_list = this.vm.studentFeeList
            .filter((studentFee) => {
                return tempStudentFeeIdList.includes(studentFee.id);
            })
            .map((studentFee) => {
                if (this.vm.getStudentFeeFeesDue(studentFee) + this.vm.getStudentFeeLateFeesDue(studentFee) == 0) {
                    studentFee.cleared = true;
                }
                return CommonFunctions.getInstance().copyObject(studentFee);
            });


        fee_receipt_list = fee_receipt_list.map(feeReceipt => {
            return {
                ...feeReceipt,
                receiptNumber: 0,
                subFeeReceiptList: sub_fee_receipt_list.filter(subFeeReceipt => subFeeReceipt.parentSession == feeReceipt.parentSession
                    && this.vm.studentFeeList.find(item => {
                        return item.id == subFeeReceipt.parentStudentFee;
                    }).parentStudent == feeReceipt.parentStudent)
            };
        });

        console.log('data to backend = ', fee_receipt_list);
        this.vm.isLoading = true;
        const value = await Promise.all([
            this.vm.genericService.createObjectList('fees_third_app', 'FeeReceipt', fee_receipt_list),
            this.vm.feeService.partiallyUpdateObjectList(this.vm.feeService.student_fees, student_fee_list),
        ]);
        console.log('data from backend = ', value);

        let transactionFromAccountId;
        let transactionToAccountId;
        const toCreateTransactionList = [];
        const toCreateTransactionAccountDetails = [];
        const toUpdateFeeReceipts = [];
        let createdTransactionList;

        const serviceList = [];
        let transactionFromAccountSession;
        if (this.vm.feeSettings && this.vm.feeSettings.accountingSettings) {
            transactionFromAccountSession = this.vm.htmlRenderer.customAccountSessionList
                .find(customAccountSession => customAccountSession.id == this.vm.feeSettings.accountingSettings.parentAccountFrom);
        }

        if (this.vm.feeSettings && this.vm.feeSettings.accountingSettings && this.vm.studentFeePaymentAccount && transactionFromAccountSession) {
            transactionFromAccountId = this.vm.studentFeePaymentAccount;
            transactionToAccountId = transactionFromAccountSession.parentAccount;
            value[0].forEach(fee_receipt => {
                if (this.vm.feeSettings) {
                    const newTransaction = {
                        parentEmployee: this.vm.user.activeSchool.employeeId,
                        parentSchool: this.vm.user.activeSchool.dbId,
                        remark: `Student Fee, receipt no.: ${fee_receipt.receiptNumber}`,
                        transactionDate: CommonFunctions.formatDate(new Date().toDateString(), ''),
                    };
                    toCreateTransactionList.push(newTransaction);
                }
            });
            createdTransactionList = await this.vm.accountsService.createObjectList(this.vm.accountsService.transaction, toCreateTransactionList);

            createdTransactionList.forEach((transaction, index) => {
                toUpdateFeeReceipts.push({ id: value[0][index].id, parentTransaction: transaction.id });
                value[0][index].parentTransaction = transaction.id;
            });
            serviceList.push(
                this.vm.feeService.partiallyUpdateObjectList(this.vm.feeService.fee_receipts, toUpdateFeeReceipts)
            );

            value[0].forEach(fee_receipt => {
                let totalAmount = 0;
                sub_fee_receipt_list.forEach(subFeeReceipt => {
                    if (subFeeReceipt.parentSession == fee_receipt.parentSession
                        && this.vm.studentFeeList.find(item => {
                            return item.id == subFeeReceipt.parentStudentFee;
                        }).parentStudent == fee_receipt.parentStudent) {
                        // subFeeReceipt['parentFeeReceipt'] = fee_receipt.id;
                        totalAmount += this.vm.installmentList.reduce((totalInstallment, installment) => {
                            return totalInstallment
                                + (subFeeReceipt[installment + 'Amount'] ? subFeeReceipt[installment + 'Amount'] : 0)
                                + (subFeeReceipt[installment + 'LateFee'] ? subFeeReceipt[installment + 'LateFee'] : 0);
                        }, 0);
                    }
                });
                const newCreditTransactionAccountDetails = {
                    parentTransaction: fee_receipt.parentTransaction,
                    parentAccount: transactionToAccountId,
                    amount: totalAmount,
                    transactionType: 'CREDIT',
                };
                toCreateTransactionAccountDetails.push(newCreditTransactionAccountDetails);
                const newDebitTransactionAccountDetails = {
                    parentTransaction: fee_receipt.parentTransaction,
                    parentAccount: transactionFromAccountId,
                    amount: totalAmount,
                    transactionType: 'DEBIT',
                };
                toCreateTransactionAccountDetails.push(newDebitTransactionAccountDetails);
            });
            serviceList.push(
                this.vm.accountsService.createObjectList(this.vm.accountsService.transaction_account_details, toCreateTransactionAccountDetails)
            );

        }

        await Promise.all(serviceList);

        const newSubFeeReceiptList = [];
        const newFeeReceiptList = value[0].map(feeReceipt => {
            feeReceipt = { ...feeReceipt };
            newSubFeeReceiptList.push(...feeReceipt.subFeeReceiptList);
            delete feeReceipt.subFeeReceiptList;
            return feeReceipt;
        });
        this.addToFeeReceiptList(newFeeReceiptList);
        this.vm.subFeeReceiptList = this.vm.subFeeReceiptList.concat(newSubFeeReceiptList);

        alert('Fees submitted successfully');
        console.log('newSubFeeReceiptList: ', newSubFeeReceiptList);
        console.log('newFeeReceiptList: ', newFeeReceiptList);

        this.vm.printFullFeeReceiptList(newFeeReceiptList, newSubFeeReceiptList);

        this.vm.handleStudentFeeProfile();

        this.vm.isLoading = false;

    }

    addToFeeReceiptList(fee_receipt_list: any): void {
        this.vm.feeReceiptList = this.vm.feeReceiptList.concat(fee_receipt_list).sort((a, b) => {
            return b.receiptNumber - a.receiptNumber;
        });
    }
}
