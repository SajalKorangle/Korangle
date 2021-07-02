import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order, STATUS_CHOICES } from '@services/modules/payment/models/order';
import { PaymentService } from '@services/modules/payment/payment.service';

@Component({
  selector: 'app-payment-response-dialog',
  templateUrl: './payment-response-dialog.component.html',
  styleUrls: ['./payment-response-dialog.component.css'],
  providers: [PaymentService]
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

  constructor(
    public paymentService: PaymentService,
    public dialogRef: MatDialogRef<PaymentResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      vm: any;
    }) { }

  ngOnInit() {
    this.orderId = parseInt(new URLSearchParams(location.search).get('orderId'));
    this.initilizeData();
  }

  ngOnDestroy() {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('orderId');
    const url = location.pathname + '?' + searchParams.toString();
    window.history.pushState({}, document.title, url);
  }

  async initilizeData() {
    const order_request = {
      orderId: this.orderId,
    };
    this.backendData.order = await this.paymentService.getObject(this.paymentService.order_school, order_request);
    this.isLoading = false;
  }


  isTranactionSuccessfull() {
    return this.backendData.order.status == STATUS_CHOICES[1];
  }

}
