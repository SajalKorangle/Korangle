import { Injectable } from '@angular/core';
import { CollectFeeComponent } from '../modules/fees/pages/collect-fee/collect-fee.component';  // Adjust the path as needed
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DueAmountService {
   constructor(){}
   public overAllDueAmount : number;
   public showDueAmount : boolean;

}
