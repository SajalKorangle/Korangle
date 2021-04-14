import { Component, OnInit, Input } from '@angular/core';
import { Layer} from '../../../class/constants'

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

  getYCoordinate(): number {
    return Math.round(this.layer.y*this.getPixelTommFactor() * 100) / 100;
  }

  getXCoordinate(): number {
    return Math.round(this.layer.x*this.getPixelTommFactor() * 100) / 100;
  }

  lockToggle(event): any{
    this.layer.isLocked = event.source.checked? true : false;
  }
}
