import { Component, OnInit, Input } from '@angular/core';
import { Layer} from './../../class/constants_3'

@Component({
  selector: 'app-position-parameter-pannel',
  templateUrl: './position-parameter-pannel.component.html',
  styleUrls: ['./position-parameter-pannel.component.css']
})
export class PositionParameterPannelComponent implements OnInit {

  @Input() layer: Layer;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
  }
  getPixelTommFactor(): number{
    return this.layer.ca.pixelTommFactor;
  }

}
