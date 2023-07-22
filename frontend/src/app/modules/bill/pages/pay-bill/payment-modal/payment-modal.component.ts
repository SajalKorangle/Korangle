import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { DataStorage } from '@classes/data-storage';
import { environment } from 'environments/environment';
import { PaymentService } from '@services/modules/payment/payment.service';
import { VALIDATORS_REGX } from '@classes/regx-validators';

@Component({
    selector: 'app-payment-modal',
    templateUrl: './payment-modal.component.html',
    styleUrls: ['./payment-modal.component.css'],
    providers: [ PaymentService ]
})
export class PaymentModalComponent implements OnInit {

    user: any;

    email: any;

    validatorRegex = VALIDATORS_REGX;

    bill: any;
    modeOfPaymentList = [];
    selectedModeOfPayment;

    korangle_charge = 5.9;
    gst_charge = 0.18;

    isLoading: boolean = false;

    ngOnInit(): void {
        this.formControl.markAsTouched();
    }

    formControl = new FormControl('', [Validators.required]);

    constructor(
        public paymentService: PaymentService,
        public dialogRef: MatDialogRef<PaymentModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {

        this.user = DataStorage.getInstance().getUser();

        this.email = this.user.email;

        console.log(this.email);

        this.bill = this.data.bill;
        this.modeOfPaymentList = this.data.modeOfPaymentList;
        this.selectedModeOfPayment = this.modeOfPaymentList[0];

    }

    getPlatformCharges(): any {
        return parseFloat((this.getTotalAmount() - this.bill.amount).toFixed(2));
    }

    getTotalAmount(): number {
        let transaction_amount = 0;
        this.selectedModeOfPayment.modeofpaymentcharges.every(charge => {
            transaction_amount = 0;
            if (charge.chargeType == 'Flat') {
                transaction_amount =
                    parseFloat((
                        this.bill.amount +
                        this.korangle_charge +
                        charge.charge * (1 + this.gst_charge)
                    ).toFixed(2));
            } else if (charge.chargeType == 'Percentage') {
                transaction_amount =
                    parseFloat((
                        (this.bill.amount + this.korangle_charge) * 100
                        /
                        (100 - charge.charge * (1 + this.gst_charge))
                    ).toFixed(2));
            }
            if (transaction_amount >= charge.minimumAmount
                && (charge.maximumAmount == -1
                    || transaction_amount <= charge.maximumAmount)) {
                return false;
            }
            return true;
        });
        return transaction_amount;
    }

    async payBill() {

        alert("Under Construction");

        // Data Validation Starts
        if (!this.email) {
            alert("Email is required");
            return;
        }
        if (!VALIDATORS_REGX.email.test(this.email)) {
            alert("Invalid Email");
            return;
        }
        // Data Validation Ends

        this.isLoading = true; // Starts showing loader as user will wait for api response now.

        // Starts :- Preparing url, which will be called back from easebuzz
        const currentRedirectParams = new URLSearchParams(location.search);
        const frontendReturnUrlParams = new URLSearchParams();

        // redirect_to params decides the frontend page and state at which the user is redirected after payment
        frontendReturnUrlParams.append('redirect_to', location.origin + location.pathname + '?' + currentRedirectParams.toString());
        // Ends :- Preparing url, which will be called back from easebuzz

        const billOrder = {
            parentBill: this.bill.id
        };

        const newOrder = {
            orderAmount: this.bill.amount,
            customerName: this.user.activeSchool.name,
            customerPhone: this.user.username,
            customerEmail: this.email,
            returnData: {
                origin: environment.DJANGO_SERVER,  // backend url api which will be hit by easebuzz to verify the completion of payment on their portal
                searchParams: frontendReturnUrlParams.toString()
            },
            orderNote: `bill payment of ${this.bill.name} for school with KID ${this.user.activeSchool.dbId}`,
            paymentMode: this.selectedModeOfPayment,
            orderTotalAmount: this.getTotalAmount(),
            billOrderList: [billOrder],
        };

        const newOrderResponse: any = await this.paymentService.createObject(this.paymentService.easebuzz_order_self, newOrder);
        if (newOrderResponse.success) {
            this.isLoading = false;
            window.location.href = newOrderResponse.success;
        } else {
            this.isLoading = false;
            alert("Unable to initiate payment request.");
        }

    }

}
