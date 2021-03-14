import { AddTransactionComponent } from './add-transaction.component';

export class AddTransactionHtmlRenderer {

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

    addNewTransaction(): void{
        for(let i=0;i<this.moreTransaction; i++){
            let transaction = {
                debitAccountList: [],
                creditAccountList: [],
                remark: null,
                billImages: [],
                quotationImages: [],
                approvalId: null,
                approvalDbId: null,    
            };
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
  
      isAddButtonDisabled(): boolean{
        for(let i=0;i<this.vm.transactionList.length; i++){
            if(this.vm.isApprovalRequired(this.vm.transactionList[i]) || this.vm.isAmountUnEqual(this.vm.transactionList[i]) || 
                this.vm.isAccountNotMentioned(this.vm.transactionList[i]) || this.vm.isAccountRepeated(this.vm.transactionList[i]) || 
                this.vm.isAmountMoreThanApproval(this.vm.transactionList[i]) || this.vm.isAmountLessThanMinimum(this.vm.transactionList[i])) {
                return true;
            }
        }
        return false;
      }
  
}
