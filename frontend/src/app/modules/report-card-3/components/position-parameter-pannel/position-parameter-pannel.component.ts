import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Layer} from './../../class/constants_3'

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40,

}

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

  onLeft(event): any{
    console.log(event);
  }

  onRight(event): any{
    console.log(event);
  }

  onUp(event): any{
    console.log(event);
  }
  onDown(event): any{
    console.log(event);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // console.log(event);
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.onRight('right');
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.onLeft('left');
    }
    if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.onUp('left');
    }
    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      this.onDown('left');
    }
    event.stopPropagation();
  }
  

}
