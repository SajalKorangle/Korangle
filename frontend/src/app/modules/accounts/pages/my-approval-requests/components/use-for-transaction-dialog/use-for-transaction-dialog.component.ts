import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonFunctions } from '../../../../../../classes/common-functions';
import { DataStorage } from '@classes/data-storage';

@Component({
  selector: 'app-use-for-transaction-dialog',
  templateUrl: './use-for-transaction-dialog.component.html',
  styleUrls: ['./use-for-transaction-dialog.component.css']
})
export class UseFortransactionDialogComponent implements OnInit {

  user;

  constructor(
    public dialogRef: MatDialogRef<UseFortransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      [key: string]: any,
    }) { }

  ngOnInit() {
    // console.log(this.data);
    this.user = DataStorage.getInstance().getUser();
  }

  readURL(event, str): void {
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
        };
        if (str == 'bill') {
          this.data.approval.billImages.push(tempImageData);
        }
        else {
          this.data.approval.quotationImages.push(tempImageData);
        }
      };
      reader.readAsDataURL(image);
    }
  }

  isAmountMoreThanApproved(): boolean {
    let flag = false;
    this.data.approval.creditAccounts.forEach(account => {
      const approvalAccountDeatils = this.data.originalApproval.creditAccounts.find(el => el.accountDbId == account.accountDbId);
      if (!approvalAccountDeatils || account.amount > approvalAccountDeatils.amount) {
        flag = true;
      }
    });

    this.data.approval.debitAccounts.forEach(account => {
      const approvalAccountDeatils = this.data.originalApproval.debitAccounts.find(el => el.accountDbId == account.accountDbId);
      if (!approvalAccountDeatils || account.amount > approvalAccountDeatils.amount) {
        flag = true;
      }
    });

    return flag;
  }

  isAmountUnequal(): boolean {
    let totalCreditAmount = 0;
    this.data.approval.creditAccounts.forEach(account => {
      totalCreditAmount += account.amount;
    });
    let totalDebitAmount = 0;
    this.data.approval.debitAccounts.forEach(account => {
      totalDebitAmount += account.amount;
    });
    if (totalCreditAmount != totalDebitAmount) {
      return true;
    }
    return false;
  }

  isAmountLessThanMinimum(): boolean {
    let flag = false;

    this.data.approval.creditAccounts.forEach(account => {
      if (account.amount < 0.01 || account.amount == null) {
        flag = true;
      }
    });

    this.data.approval.debitAccounts.forEach(account => {
      if (account.amount < 0.01 || account.amount == null) {
        flag = true;
      }
    });

    return flag;
  }

  handleAmountChange(newAmount: number) {
    const transaction = this.data.approval;
    if (transaction.creditAccounts.length == 1 && transaction.debitAccounts.length == 1) {
      transaction.creditAccounts[0].amount = newAmount;
      transaction.debitAccounts[0].amount = newAmount;
    }
    else if (transaction.creditAccounts.length == 1) {
      transaction.creditAccounts[0].amount = transaction.debitAccounts.reduce((accumulator, nextAccount) => accumulator + nextAccount.amount, 0);
    }
    else if (transaction.debitAccounts.length == 1) {
      transaction.debitAccounts[0].amount = transaction.creditAccounts.reduce((accumulator, nextAccount) => accumulator + nextAccount.amount, 0);
    }
  }

  getMaximumApprovedAmount() {
    let maxAmount = 0;
    this.data.originalApproval.creditAccounts.forEach(account => {
      maxAmount += account.amount;
    });
    return maxAmount;
  }

  addTransaction(): any {
    let transaction_data = {
      parentSchool: this.data.vm.user.activeSchool.dbId,
      parentEmployee: this.data.approval.requestedBy,
      remark: this.data.approval.remark,
      transactionDate: this.data.approval.transactionDate ? this.data.approval.transactionDate : CommonFunctions.formatDate(new Date(), ''),
      approvalId: this.data.approval.approvalId,
    };
    this.data.vm.isLoading = true;
    this.dialogRef.close();
    Promise.all([
      this.data.vm.accountsService.createObject(this.data.vm.accountsService.transaction, transaction_data),
    ]).then(value1 => {
      let toCreateAccountList = [];
      const service = [];

      // value[0].forEach((element,index) =>{
      this.data.approval.debitAccounts.forEach(account => {
        let tempData = {
          parentTransaction: value1[0].id,
          parentAccount: account.accountDbId,
          amount: account.amount,
          transactionType: 'DEBIT',
        };
        toCreateAccountList.push(tempData);
      });
      this.data.approval.creditAccounts.forEach(account => {
        let tempData = {
          parentTransaction: value1[0].id,
          parentAccount: account.accountDbId,
          amount: account.amount,
          transactionType: 'CREDIT',
        };
        toCreateAccountList.push(tempData);
      });


      let i = 1;
      this.data.approval.billImages.forEach(image => {
        let tempData = {
          parentTransaction: value1[0].id,
          imageURL: image.imageURL,
          orderNumber: i,
          imageType: 'BILL',
        };
        let temp_form_data = new FormData();
        const layout_data = { ...tempData, };
        Object.keys(layout_data).forEach(key => {
          if (key === 'imageURL') {
            temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i + '.jpeg'));
          } else {
            temp_form_data.append(key, layout_data[key]);
          }
        });
        i = i + 1;
        service.push(this.data.vm.accountsService.createObject(this.data.vm.accountsService.transaction_images, temp_form_data));

      });

      i = 1;
      this.data.approval.quotationImages.forEach(image => {
        let tempData = {
          parentTransaction: value1[0].id,
          imageURL: image.imageURL,
          orderNumber: i,
          imageType: 'QUOTATION',
        };
        let temp_form_data = new FormData();
        const layout_data = { ...tempData, };
        Object.keys(layout_data).forEach(key => {
          if (key === 'imageURL') {
            temp_form_data.append(key, CommonFunctions.dataURLtoFile(layout_data[key], 'imageURL' + i + '.jpeg'));
          } else {
            temp_form_data.append(key, layout_data[key]);
          }
        });
        i = i + 1;
        service.push(this.data.vm.accountsService.createObject(this.data.vm.accountsService.transaction_images, temp_form_data));
      });
      service.push(this.data.vm.accountsService.createObjectList(this.data.vm.accountsService.transaction_account_details, toCreateAccountList));

      let approvalUpdateData: { [key: string]: any; } = {
        id: this.data.approval.dbId,
        // parentTransaction: value1[0].id,
      };
      // if (!this.data.approval.transactionDate) {
      //   approvalUpdateData.transactionDate = CommonFunctions.formatDate(new Date(), '');
      // }
      service.push(this.data.vm.accountsService.getObject(this.data.vm.accountsService.approval, approvalUpdateData)
        .then(data => this.data.approval = { ...this.data.approval, ...data }));


      // });
      Promise.all(service).then(data => {
        this.data.originalApproval.parentTransaction = value1[0].id;
        this.populateOriginalApproval();
        alert('Transaction Recorded Successfully');
        this.data.vm.isLoading = false;
      });

    });

  }

  populateOriginalApproval() {
    this.data.originalApproval.transactionDate = CommonFunctions.formatDate(new Date(), '');
    this.data.originalApproval.remark = this.data.approval.remark;
    this.data.originalApproval.billImages = [];
    this.data.originalApproval.quotationImages = [];
    this.data.originalApproval.debitAccounts = [];
    this.data.originalApproval.creditAccounts = [];
    this.data.approval.billImages.forEach(element => {
      this.data.originalApproval.billImages.push(element);
    });
    this.data.approval.quotationImages.forEach(element => {
      this.data.originalApproval.quotationImages.push(element);
    });
    this.data.approval.debitAccounts.forEach(element => {
      this.data.originalApproval.debitAccounts.push(element);
    });
    this.data.approval.creditAccounts.forEach(element => {
      this.data.originalApproval.creditAccounts.push(element);
    });
  }

}
