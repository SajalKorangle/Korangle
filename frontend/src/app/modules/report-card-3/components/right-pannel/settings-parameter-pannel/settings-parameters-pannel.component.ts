import { Component, OnInit, Input } from '@angular/core';
import { Layer} from '../../../class/constants_3';

@Component({
  selector: 'app-settings-parameters-pannel',
  templateUrl: './settings-parameters-pannel.component.html',
  styleUrls: ['./settings-parameters-pannel.component.css']
})
export class SettingsParametersPannelComponent implements OnInit {

  @Input() layer: Layer;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
  }


}
