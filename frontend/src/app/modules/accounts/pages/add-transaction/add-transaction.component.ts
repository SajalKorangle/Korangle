import {Component, Input, OnInit} from '@angular/core';
import {DataStorage} from "../../../../classes/data-storage";
import { AddTransactionServiceAdapter } from './add-transaction.service.adapter'
import { AccountsService } from './../../../../services/modules/accounts/accounts.service'
import { CommonFunctions } from './../../../../classes/common-functions'


@Component({
  selector: 'add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
  providers: [
    AccountsService,
  ]
    
})

export class AddTransactionComponent implements OnInit {

    // @Input() user;
    user: any;
    isLoading: any;
    accountsList: any;

    selectedDate: any;

    transactions: any[];


    debitAccount: any;
    debitAmount: any;
    creditAccount: any;
    creditAmount: any;
    serviceAdapter: any;
    autoAdd: any;

    approvalIdList: any;
    moreTransaction: any;
    maximumPermittedAmount: any;

    constructor( 
      public accountsService: AccountsService,
    ){ }
    // Server Handling - Initial
    ngOnInit(): void {
      this.user = DataStorage.getInstance().getUser();
      this.transactions = [];
      this.selectedDate = CommonFunctions.formatDate(new Date(), '');
      this.serviceAdapter = new AddTransactionServiceAdapter;
      this.serviceAdapter.initializeAdapter(this);
      this.serviceAdapter.initializeData();
      this.moreTransaction = 1;
      this.addNewTransaction();
      this.autoAdd = false;
    }

    func(){
      console.log(this.selectedDate);
    }
    
    addNewTransaction(): void{
      for(let i=0;i<this.moreTransaction; i++){
        let transaction = {
          debitAccounts: [],
          creditAccounts: [],
          remark: null,
          billImages: [],
          quotationImages: [],
          approvalId: null,
          totalAmount: null,
          warningMessages: {
            approvalRequired: false,
          },
          errorMessages: {
            unequalAmount: false,
            noAccountAdded: false,
            noAmountAdded: false,
          },
          
        }
        this.transactions.push(transaction);
        this.addNewDebitAccount(this.transactions.length - 1);
        this.addNewCreditAccount(this.transactions.length - 1);
      }
    }

    addNewDebitAccount(index: any): void{
      this.transactions[index].debitAccounts.push({
        debitAccount: null,
        debitAmount: null,
      })
    }

    addNewCreditAccount(index: any): void{
      this.transactions[index].creditAccounts.push({
        creditAccount: null,
        creditAmount: null,
      })
    }

    removeTransaction(index: any){
      this.transactions.splice(index, 1);
    }

    removeDebitAccount(tIndex: any, aIndex: any){
      this.transactions[tIndex].debitAccounts.splice(aIndex, 1);
    }
    
    removeCreditAccount(tIndex: any, aIndex: any){
      this.transactions[tIndex].creditAccounts.splice(aIndex, 1);
    }

    handleAmountChange(transaction: any){
      let totalCreditAmount = 0;
      transaction.creditAccounts.forEach(account =>{
        totalCreditAmount += account.creditAmount;
      })
      let totalDebitAmount = 0;
      transaction.debitAccounts.forEach(account =>{
        totalDebitAmount += account.debitAmount;
      })
      if(transaction.debitAccounts.length>1 && transaction.creditAccounts.length>1){
        if(totalCreditAmount == totalDebitAmount){
          transaction.errorMessages.unequalAmount = false;
        }
        else{
          transaction.errorMessages.unequalAmount = true;
        }
      }
      else if(transaction.debitAccounts.length == 1){
        if(transaction.debitAccounts[0].debitAmount < totalCreditAmount){
          transaction.debitAccounts[0].debitAmount = totalCreditAmount;
        }
        transaction.errorMessages.unequalAmount = false;
      }
      else{                                                      
        if(transaction.creditAccounts[0].creditAmount < totalDebitAmount){
          transaction.creditAccounts[0].creditAmount = totalDebitAmount;
        }
        transaction.errorMessages.unequalAmount = false;
      }
    }

    isAmountUnEqual(transaction):boolean{
      let totalCreditAmount = 0;
      transaction.creditAccounts.forEach(account =>{
        totalCreditAmount += account.creditAmount;
      })
      let totalDebitAmount = 0;
      transaction.debitAccounts.forEach(account =>{
        totalDebitAmount += account.debitAmount;
      })
      if(totalCreditAmount == totalDebitAmount){
        return false;
      }
      else{
        return true;
      }
    }

    isApprovalRequired(transaction): boolean{
      let totalCreditAmount = 0;
      transaction.creditAccounts.forEach(account =>{
        totalCreditAmount += account.creditAmount;
      })
      let totalDebitAmount = 0;
      transaction.debitAccounts.forEach(account =>{
        totalDebitAmount += account.debitAmount;
      })
      if(totalCreditAmount > this.maximumPermittedAmount || totalDebitAmount > this.maximumPermittedAmount){
        return true;
      }
      else{
        return false;
      }
    }

    isAccountNotMentioned(transaction): boolean{
      // console.log(transaction);
      let temp = false;
      transaction.debitAccounts.forEach(account =>{
        if(account.debitAccount == null){
          temp = true;
        }
      })
      
      transaction.creditAccounts.forEach(account =>{
        if(account.creditAccount == null){
          temp = true;
        }
      })
      return temp;
    }

    isAddButtonDisabled(): boolean{
      for(let i=0;i<this.transactions.length; i++){
        if(this.isApprovalRequired(this.transactions[i]) || this.isAmountUnEqual(this.transactions[i]) || this.isAccountNotMentioned(this.transactions[i])){
          return true;
        }
      }
      return false;
    }

    isApprovalButtonDisabled(): boolean{
      for(let i=0;i<this.transactions.length; i++){
        if(this.isAmountUnEqual(this.transactions[i]) || this.isAccountNotMentioned(this.transactions[i])){
          return true;
        }
      }
      return false;
    }

    readURL(event, transaction, str): void {
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
                transaction.billImages.push(tempImageData);
              }
              else{
                transaction.quotationImages.push(tempImageData);
              }
          };
          reader.readAsDataURL(image);
      }
      console.log(transaction.billImages);
      console.log(transaction.quotationImages);
  }


}