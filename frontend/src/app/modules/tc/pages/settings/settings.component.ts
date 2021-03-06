import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { SettingsServiceAdapter } from './settings.service.adapter';
import { TCService } from './../../../../services/modules/tc/tc.service';
import { TransferCertificateSettings } from './../../../../services/modules/tc/models/transfer-certificate-settings'
import { FeeService } from './../../../../services/modules/fees/fee.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [TCService, FeeService]
})
export class SettingsComponent implements OnInit {

  user: any;

  tcSettings: TransferCertificateSettings;
  feeTypeList: { id: number, [key:string]:any }[];

  settingsServiceAdapter: SettingsServiceAdapter;
  isLoading = false;

  constructor(public tcService: TCService, public feeServie: FeeService) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.settingsServiceAdapter = new SettingsServiceAdapter()
    this.settingsServiceAdapter.initializeAdapter(this);
    this.settingsServiceAdapter.initializeData();
  }

  sanityCheck(): [boolean, string]{
    if (this.tcSettings.tcFee < 0)
      return [false, 'TC Fee Cannot be Negative']
    if (this.tcSettings.tcFee > 0) {
      if (this.tcSettings.parentFeeType == null)
        return [false, 'Fee Type is required'];
    }
    return [true, '']
  }

  updateSettings(): void{
    const [sanityCheck, errorMessage] = this.sanityCheck();
    if (sanityCheck) {
      this.settingsServiceAdapter.updateTcSettings(this.tcSettings);
    }
    else {
      alert(errorMessage);
    }
  }

}
