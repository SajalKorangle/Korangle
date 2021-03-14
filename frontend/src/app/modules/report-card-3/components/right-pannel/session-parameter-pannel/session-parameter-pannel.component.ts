import { Component, OnInit, Input } from '@angular/core';
import { CurrentSession } from '../../../class/constants_3';

@Component({
  selector: 'app-session-parameter-pannel',
  templateUrl: './session-parameter-pannel.component.html',
  styleUrls: ['./session-parameter-pannel.component.css']
})
export class SessionParameterPannelComponent implements OnInit {

  @Input() layer: CurrentSession;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
  }

}
