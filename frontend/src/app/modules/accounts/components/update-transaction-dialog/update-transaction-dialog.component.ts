import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonFunctions } from './../../../../classes/common-functions'

@Component({
  selector: 'app-update-transaction-dialog',
  templateUrl: './update-transaction-dialog.html',
  styleUrls: ['./update-transaction-dialog.css']
})
export class UpdateTransactionDialogComponent implements OnInit {


  transaction: any;
  originalTransaction: any;
  vm: any;
  accountsList: any;
  maximumPermittedAmount: any;
  constructor(@Inject(MAT_DIALOG_DATA) 
    public data: {
        [key: string]: any,
     }) 
  { }

  ngOnInit() {
    this.transaction = this.data.transaction;
    this.vm = this.data.vm;
    this.accountsList = this.data.vm.accountsList;
    this.maximumPermittedAmount = this.data.vm.maximumPermittedAmount;
    this.originalTransaction = this.data.originalTransaction;
  }

  addNewDebitAccount(): void{
    this.transaction.debitAccounts.push({});
  }

  addNewCreditAccount(): void{
    this.transaction.creditAccounts.push({});
  }

  

  removeDebitAccount(aIndex: any){
    this.transaction.debitAccounts.splice(aIndex, 1);
  }
  
  removeCreditAccount(aIndex: any){
    this.transaction.creditAccounts.splice(aIndex, 1);
  }

  handleAmountChange(){
    let totalCreditAmount = 0;
    this.transaction.creditAccounts.forEach(account =>{
      totalCreditAmount += account.amount;
    })
    let totalDebitAmount = 0;
    this.transaction.debitAccounts.forEach(account =>{
      totalDebitAmount += account.amount;
    })
    if(this.transaction.debitAccounts.length>1 && this.transaction.creditAccounts.length>1){
      
    }
    else if(this.transaction.creditAccounts.length == 1){                                                      
      if(this.transaction.creditAccounts[0].amount < totalDebitAmount){
        this.transaction.creditAccounts[0].amount = totalDebitAmount;
      }
    }
    else{
      if(this.transaction.debitAccounts[0].amount < totalCreditAmount){
        this.transaction.debitAccounts[0].amount = totalCreditAmount;
      }
    }
  }

  isAmountUnEqual():boolean{
    let totalCreditAmount = 0;
    this.transaction.creditAccounts.forEach(account =>{
      if(account.amount!= null)
      totalCreditAmount += account.amount;
    })
    let totalDebitAmount = 0;
    this.transaction.debitAccounts.forEach(account =>{
      if(account.amount!= null)
      totalDebitAmount += account.amount;
    })
    if(totalCreditAmount == totalDebitAmount){
      return false;
    }
    else{
      return true;
    }
  }

  isApprovalRequired(): boolean{
    
    let totalCreditAmount = 0;
    this.transaction.creditAccounts.forEach(account =>{
      if(account.amount!= null)
      totalCreditAmount += account.amount;
    })
    let totalDebitAmount = 0;
    this.transaction.debitAccounts.forEach(account =>{
      if(account.amount!= null)
      totalDebitAmount += account.amount;
    })
    
    if(totalCreditAmount > this.maximumPermittedAmount || totalDebitAmount > this.maximumPermittedAmount){
      return true;
    }
    else{
      return false;
    }
  }


  isAccountNotMentioned(): boolean{
    // console.log(transaction);
    let temp = false;
    this.transaction.debitAccounts.forEach(account =>{
      if(account.dbId == null){
        temp = true;
      }
    })
    
    this.transaction.creditAccounts.forEach(account =>{
      if(account.dbId == null){
        temp = true;
      }
    })
    return temp;
  }

  isAccountRepeated(): boolean{
    let temp = false;
    
    for(let i=0;i<this.transaction.debitAccounts.length ;i++){
      if(this.transaction.debitAccounts[i].dbId != null){
        for(let j=i+1;j<this.transaction.debitAccounts.length; j++){
          if(this.transaction.debitAccounts[j].dbId == this.transaction.debitAccounts[i].dbId){
            temp = true;
          }
        }
        for(let j=0;j<this.transaction.creditAccounts.length; j++){
          if(this.transaction.creditAccounts[j].dbId == this.transaction.debitAccounts[i].dbId){
            temp = true;
          }
        }
      }
    }

    for(let i=0;i<this.transaction.creditAccounts.length ;i++){
      if(this.transaction.creditAccounts[i].dbId != null){
        for(let j=i+1;j<this.transaction.creditAccounts.length; j++){
          if(this.transaction.creditAccounts[j].dbId == this.transaction.creditAccounts[i].dbId){
            temp = true;
          }
        }
        for(let j=0;j<this.transaction.debitAccounts.length; j++){
          if(this.transaction.debitAccounts[j].dbId == this.transaction.creditAccounts[i].dbId){
            temp = true;
          }
        }
      }
    }

    return temp;
  }

  isAddButtonDisabled(): boolean{
    
    if(this.isApprovalRequired() || this.isAmountUnEqual() || 
    this.isAccountNotMentioned() || this.isAccountRepeated()){
      return true;
    }
    return false;
  }

  
  readURL(event, str): void {
    console.log(str);
    if (event.target.files && event.target.files[0]) {
        let image = event.target.files[0];
        if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
            alert('File type should be either jpg, jpeg, or png');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = e => {
            let tempImageData = {
                orderNumber: null,
                imageURL: reader.result,
            }
            if(str == 'bill'){
              this.transaction.billImages.push(tempImageData);
            }
            else{
              this.transaction.quotationImages.push(tempImageData);
            }
        };
        reader.readAsDataURL(image);
    }
  }

  getAccount(account){
    return this.accountsList.find(accc => accc.id == account.dbId);
  }

  assignAccount(account, index, str){
    console.log(account);
    if(str == 'debit'){
      this.transaction.debitAccounts[index] = {
        account: account.title,
        accountDbId: account.parentAccount,
        amount: this.transaction.debitAccounts[index].amount,
        dbId: account.id,
        balance: account.balance,
      }
    }
    else{
      this.transaction.creditAccounts[index] = {
        account: account.title,
        accountDbId: account.parentAccount,
        amount: this.transaction.creditAccounts[index].amount,
        dbId: account.id,
        balance: account.balance,
      }
    }

    console.log(this.transaction);
  }




  addTransaction(){
    
    console.log(this.accountsList);
    console.log(this.transaction);
    // console.log(this.)
    let transaction_data = {
        id: this.transaction.dbId,
        remark: this.transaction.remark,
        transactionDate: CommonFunctions.formatDate(new Date(), ''),

    }
    Promise.all([
        this.vm.accountsService.partiallyUpdateObject(this.vm.accountsService.transaction, transaction_data),
    ]).then(value1 =>{
        console.log(value1);
        let toCreateAccountList = [];
        let toUpdateAccountList = [];
        let toDeleteAccountList = [];
        let toUpdateAccountBalanceList = [];
        const service = [];

        this.transaction.debitAccounts.forEach(account =>{
          let index =  this.originalTransaction.debitAccounts.map(function(e) { return e.dbId; }).indexOf(account.dbId);
          console.log(index);
          if(index == -1){
            let tempData = {
              parentTransaction: this.transaction.dbId,
              parentAccount: account.accountDbId,
              amount: account.amount,
              transactionType: 'DEBIT',
            }
            toCreateAccountList.push(tempData);
            let tempdata = {
              id: account.dbId,
              balance: account.balance + account.amount,
            }
            toUpdateAccountBalanceList.push(tempdata);
          }
          else{
            let amountDiff = account.amount -  this.originalTransaction.debitAccounts[index].amount;
            if(amountDiff != 0){
              let tempData = {
                id: account.transactionAccountDbId,
                amount: account.amount,
              }
              toUpdateAccountList.push(tempData);
              let tempdata = {
                id: account.dbId,
                balance: account.balance + amountDiff,
              }
              toUpdateAccountBalanceList.push(tempdata);
            }
            this.originalTransaction.debitAccounts.splice(index, 1);
          }
        })
        this.transaction.creditAccounts.forEach(account =>{
          let index =  this.originalTransaction.creditAccounts.map(function(e) { return e.dbId; }).indexOf(account.dbId);
          console.log(index);
          if(index == -1){
            let tempData = {
              parentTransaction: this.transaction.dbId,
              parentAccount: account.accountDbId,
              amount: account.amount,
              transactionType: 'CREDIT',
            }
            toCreateAccountList.push(tempData);
            let tempdata = {
              id: account.dbId,
              balance: account.balance - account.amount,
            }
            toUpdateAccountBalanceList.push(tempdata);
          }
          else{
            let amountDiff = account.amount -  this.originalTransaction.creditAccounts[index].amount;
            if(amountDiff != 0){
              let tempData = {
                id: account.transactionAccountDbId,
                amount: account.amount,
              }
              toUpdateAccountList.push(tempData);
              let tempdata = {
                id: account.dbId,
                balance: account.balance - amountDiff,
              }
              toUpdateAccountBalanceList.push(tempdata);

            }
            this.originalTransaction.creditAccounts.splice(index, 1);
          }
        })
        this.originalTransaction.debitAccounts.forEach(account =>{
          toDeleteAccountList.push(account.transactionAccountDbId);
          let tempAccount = toUpdateAccountBalanceList.find(acccount => acccount.id == account.dbId);
          if(tempAccount == undefined){
            let tempData1 = {
              id: account.dbId,
              balance: account.balance - account.amount,
            }
            toUpdateAccountBalanceList.push(tempData1);
          }
          else{
            tempAccount.balance -= account.amount;
          }
        })
        this.originalTransaction.creditAccounts.forEach(account =>{
          toDeleteAccountList.push(account.transactionAccountDbId);
          let tempAccount = toUpdateAccountBalanceList.find(acccount => acccount.id == account.dbId);
          if(tempAccount == undefined){
            let tempData1 = {
              id: account.dbId,
              balance: account.balance + account.amount,
            }
            toUpdateAccountBalanceList.push(tempData1);
          }
          else{
            tempAccount.balance += account.amount;
          }
        })
        console.log(toCreateAccountList);
        console.log(toUpdateAccountList);
        console.log(toDeleteAccountList);
        let delete_data = {
          'id__in': toDeleteAccountList,
        }
        console.log(toUpdateAccountBalanceList);
        service.push(this.vm.accountsService.createObjectList(this.vm.accountsService.transaction_account_details, toCreateAccountList));
        service.push(this.vm.accountsService.partiallyUpdateObjectList(this.vm.accountsService.transaction_account_details, toUpdateAccountList));
        service.push(this.vm.accountsService.deleteObjectList(this.vm.accountsService.transaction_account_details, delete_data));
        service.push(this.vm.accountsService.partiallyUpdateObjectList(this.vm.accountsService.account_session, toUpdateAccountBalanceList));
        Promise.all(service).then(data =>{
            console.log(data);
            this.originalTransaction = JSON.parse(JSON.stringify(this.transaction));
            alert('Transaction Updated Successfully');
        })

    })

   
    
  }

  
}
