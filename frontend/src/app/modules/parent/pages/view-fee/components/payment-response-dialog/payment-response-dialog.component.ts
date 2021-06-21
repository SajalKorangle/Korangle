import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewFeeComponent } from './../../view-fee.component';
import { Order, STATUS_CHOICES } from '@services/modules/fees/models/order';

@Component({
  selector: 'app-payment-response-dialog',
  templateUrl: './payment-response-dialog.component.html',
  styleUrls: ['./payment-response-dialog.component.css']
})
export class PaymentResponseDialogComponent implements OnInit, OnDestroy {

  orderId: number;

  statusChoices = STATUS_CHOICES;

  backendData: {
    order: Order,
  } = {
      order: null,
    };

  isLoading: boolean = true;

  constructor(public dialogRef: MatDialogRef<PaymentResponseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    vm: ViewFeeComponent;
  }) { }

  ngOnInit() {
    this.orderId = parseInt(new URLSearchParams(location.search).get('orderId'));
    this.initilizeData();
  }

  ngOnDestroy() {
    const searchParams = new URLSearchParams(location.search);
    const url = location.pathname + '?' + searchParams.toString();
    window.history.pushState({}, document.title, url);
  }

  async initilizeData() {
    const order_request = {
      id: this.orderId,
    };
    this.backendData.order = await this.data.vm.feeService.getObject(this.data.vm.feeService.order, order_request);
    this.isLoading = false;
  }


  isTranactionSuccessfull() {
    return this.backendData.order.status == STATUS_CHOICES[1];
  }

}
