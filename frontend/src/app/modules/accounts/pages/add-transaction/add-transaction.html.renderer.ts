import { AddTransactionComponent } from './add-transaction.component';
import {isMobile} from 'app/classes/common.js';

export class AddTransactionHtmlRenderer {

    NULL_VALUE = null;

    minimumDate: any;
    maximumDate: any;

    moreTransaction = 1;

    vm: AddTransactionComponent;
    constructor() {}

    initializeRenderer(vm: AddTransactionComponent): void {
        this.vm = vm;
        this.addNewTransaction();
    }

    getAccountSession(id: number) {
        return this.vm.backendData.accountSessionList.find(accountSession => accountSession.parentAccount == id);
    }

    getAccountFromAccountSession(accountSession: any): any {
        return this.vm.backendData.accountList.find(account => {
            return account.id === accountSession.parentAccount;
        });
    }


    getFreshTransactionObject(): any {
        let transaction = {
            debitAccountList: [],
            creditAccountList: [],
            remark: null,
            billImages: [],
            quotationImages: [],
            approval: null,
            simple: true,
        };
        this.addCreditAccount(transaction);
        this.addDebitAccount(transaction);
        return transaction;
    }

    addCreditAccount(transaction: any): void {
        transaction.creditAccountList.push({
            parentAccount: null,
            parentAmount: null,
        });
    }

    addDebitAccount(transaction: any): void {
        transaction.debitAccountList.push({
            parentAccount: null,
            parentAmount: null,
        });
    }

    addNewTransaction(): void {
        for (let i = 0; i < this.moreTransaction; i++) {
            const transaction = this.getFreshTransactionObject();
            this.vm.transactionList.push(transaction);
        }
    }

    isTransactionSimple(transaction): boolean {
        if (transaction.simple
            && transaction.creditAccountList.length == 1
            && transaction.debitAccountList.length == 1) {
            return true;
        }
        return false;
    }

    assignApproval(approval, transaction) {
        if (approval == this.NULL_VALUE) {
            const transactionIndex = this.vm.transactionList.findIndex(t => t == transaction);
            this.vm.transactionList[transactionIndex] = this.getFreshTransactionObject();
        } else {
            // transaction.approvalId = approval.approvalId;
            transaction.approval = approval;
            transaction.remark = approval.remark;

            // Debit Account
            transaction.debitAccountList = this.vm.backendData.approvalAccountDetailsList.filter(approvalAccountDetails => {
              return approvalAccountDetails.parentApproval == approval.id && approvalAccountDetails.transactionType == 'DEBIT';
            }).map(approvalAccountDetails => {
                return {
                    parentAccount: approvalAccountDetails.parentAccount,
                    parentAmount: approvalAccountDetails.amount,
                };
            });

            // Credit Account
            transaction.creditAccountList = this.vm.backendData.approvalAccountDetailsList.filter(approvalAccountDetails => {
              return approvalAccountDetails.parentApproval == approval.id && approvalAccountDetails.transactionType == 'CREDIT';
            }).map(approvalAccountDetails => {
                return {
                    parentAccount: approvalAccountDetails.parentAccount,
                    amount: approvalAccountDetails.amount,
                };
            });

            // Bill Images
            this.vm.backendData.approvalImagesList.filter(approvalImages => {
              return approvalImages.parentApproval == approval.id && approvalImages.imageType == 'BILL';
            }).forEach(approvalImages => {
                this.vm.serviceAdapter.getBase64FromUrl(approvalImages.imageURL).then(data64URL => {
                    transaction.billImages.push({
                        'imageUrl': data64URL,
                    });
                });
            });

            // Quotation Images
            this.vm.backendData.approvalImagesList.filter(approvalImages => {
                return approvalImages.parentApproval == approval.id && approvalImages.imageType == 'QUOTATION';
            }).forEach(approvalImages => {
                this.vm.serviceAdapter.getBase64FromUrl(approvalImages.imageURL).then(data64URL => {
                    transaction.quotationImages.push({
                        'imageUrl': data64URL,
                    });
                });
            });
        }
    }

    isApprovalUsedTwice(transaction): any {
        if (!transaction.approval) { return false; }
        return this.vm.transactionList.filter(transactionTwo => {
            return transactionTwo.approval && transactionTwo.approval.id == transaction.approval.id;
        }).length > 1;
    }

    isAddButtonDisabled(): boolean {
        for (let i = 0; i < this.vm.transactionList.length; i++) {
            if (this.vm.isApprovalRequired(this.vm.transactionList[i]) || this.vm.isAmountUnEqual(this.vm.transactionList[i]) ||
                this.vm.isAccountNotMentioned(this.vm.transactionList[i]) || this.vm.isAccountRepeated(this.vm.transactionList[i]) ||
                this.vm.isAmountMoreThanApproval(this.vm.transactionList[i]) || this.vm.isAmountLessThanMinimum(this.vm.transactionList[i]) ||
                this.isApprovalUsedTwice(this.vm.transactionList[i])) {
                return true;
            }
        }
        return false;
    }

    isMobile(): boolean {
        return isMobile();
    }

}
