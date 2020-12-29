import { Component, Input, OnInit } from '@angular/core';
import { Layer} from './../../class/constants_3'

@Component({
  selector: 'app-text-parameters-pannel',
  templateUrl: './text-parameters-pannel.component.html',
  styleUrls: ['./text-parameters-pannel.component.css']
})
export class TextParametersPannelComponent implements OnInit {

  @Input() layer: Layer;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
  }

  logMessage(toast, msg): void{
    console.log(toast,msg);
  }

}
