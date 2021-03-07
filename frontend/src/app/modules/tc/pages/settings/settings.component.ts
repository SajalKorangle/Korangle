import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { SettingsServiceAdapter } from './settings.service.adapter';
import { TCService } from './../../../../services/modules/tc/tc.service';
import { TransferCertificateSettings } from './../../../../services/modules/tc/models/transfer-certificate-settings'
import { FeeService } from './../../../../services/modules/fees/fee.service';
import { SchoolFeeRule } from './../../../../services/modules/fees/models/school-fee-rule';
import { TC_SCHOOL_FEE_RULE_NAME } from './../../class/constants';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [TCService, FeeService]
})
export class SettingsComponent implements OnInit {

  user: any;

  tcSettings: TransferCertificateSettings;
  feeTypeList: { id: number, [key: string]: any }[];
  
  tcSchoolFeeRuleName: string = TC_SCHOOL_FEE_RULE_NAME;
  tcSchoolFeeRuleInitilized: boolean = false;
  tcSchoolFeeRule: any;

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
      if (this.tcSettings.parentFeeType) {
        if (!this.tcSchoolFeeRuleInitilized) {
          this.tcSchoolFeeRule = {
            name: this.tcSchoolFeeRuleName,
            parentSession: this.user.activeSchool.currentSessionDbId,
            isAnnually: true,
          }
        }
        this.tcSchoolFeeRule.parentFeeType = this.tcSettings.parentFeeType;
      }
      this.settingsServiceAdapter.updateTcSettings();
    }
    else {
      alert(errorMessage);
    }
  }

}
