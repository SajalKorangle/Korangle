import { AddTransactionComponent } from './add-transaction.component';

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

    getAccountFromAccountSession(accountSession: any): any {
        return this.vm.backendData.accountList.find(account => {
            return account.id === accountSession.parentAccount;
        });
    }

    getFreshTransactionObject(): any {
        return {
            debitAccountList: [],
            creditAccountList: [],
            remark: null,
            billImages: [],
            quotationImages: [],
            approval: null,
        }
    }

    addNewTransaction(): void{
        for(let i=0;i<this.moreTransaction; i++){
            let transaction = this.getFreshTransactionObject();
            this.vm.transactionList.push(transaction);
            this.addNewDebitAccount(this.vm.transactionList.length - 1);
            this.addNewCreditAccount(this.vm.transactionList.length - 1);
        }
    }


    addNewDebitAccount(index: any): void{
        this.vm.transactionList[index].debitAccountList.push({
            debitAccount: null,
            debitAmount: null,
        });
    }

    addNewCreditAccount(index: any): void{
        this.vm.transactionList[index].creditAccountList.push({
            creditAccount: null,
            creditAmount: null,
        })
    }
  
    assignApproval(approval, transaction){
        if (approval == this.NULL_VALUE) {
            const transactionIndex = this.vm.transactionList.findIndex(t => t == transaction);
            this.vm.transactionList[transactionIndex] = this.getFreshTransactionObject();
            this.addNewCreditAccount(transactionIndex);
            this.addNewDebitAccount(transactionIndex);
        } else {
            console.log('Real value');
            // transaction.approvalId = approval.approvalId;
            transaction.approval = approval;
            transaction.remark = approval.remark;

            // Debit Account
            transaction.debitAccountList = this.vm.backendData.approvalAccountDetailsList.filter(approvalAccountDetails => {
              return approvalAccountDetails.parentApproval == approval.id && approvalAccountDetails.transactionType == 'DEBIT';
            }).map(approvalAccountDetails => {
                return {
                    'debitAccount': this.vm.backendData.accountSessionList.find(accountSession => accountSession.parentAccount == approvalAccountDetails.parentAccount),
                    'debitAmount': approvalAccountDetails.amount,
                };
            });

            // Credit Account
            transaction.creditAccountList = this.vm.backendData.approvalAccountDetailsList.filter(approvalAccountDetails => {
              return approvalAccountDetails.parentApproval == approval.id && approvalAccountDetails.transactionType == 'CREDIT';
            }).map(approvalAccountDetails => {
                return {
                    'creditAccount': this.vm.backendData.accountSessionList.find(accountSession => accountSession.parentAccount == approvalAccountDetails.parentAccount),
                    'creditAmount': approvalAccountDetails.amount,
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

    isAddButtonDisabled(): boolean{
        for(let i=0;i<this.vm.transactionList.length; i++){
            if(this.vm.isApprovalRequired(this.vm.transactionList[i]) || this.vm.isAmountUnEqual(this.vm.transactionList[i]) || 
                this.vm.isAccountNotMentioned(this.vm.transactionList[i]) || this.vm.isAccountRepeated(this.vm.transactionList[i]) || 
                this.vm.isAmountMoreThanApproval(this.vm.transactionList[i]) || this.vm.isAmountLessThanMinimum(this.vm.transactionList[i]) || 
                this.isApprovalUsedTwice(this.vm.transactionList[i])) {
                return true;
            }
        }
        return false;
    }
  
}
