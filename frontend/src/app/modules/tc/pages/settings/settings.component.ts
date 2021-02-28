import { Component, OnInit } from '@angular/core';
import { DataStorage } from "../../../../classes/data-storage";
import { SettingsServiceAdapter } from './settings.service.adapter';
import { TCService } from './../../../../services/modules/tc/tc.service';
import { TransferCertificateSettings } from './../../../../services/modules/tc/models/transfer-certificate-settings'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [TCService]
})
export class SettingsComponent implements OnInit {

  user: any;

  tcSettings: TransferCertificateSettings;

  settingsServiceAdapter: SettingsServiceAdapter;
  isLoading = false;

  constructor(public tcService: TCService) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.settingsServiceAdapter = new SettingsServiceAdapter()
    this.settingsServiceAdapter.initializeAdapter(this);
    this.settingsServiceAdapter.initializeData();
  }

  updateSettings(): void{
    this.settingsServiceAdapter.updateTcSettings(this.tcSettings);
  }

}
