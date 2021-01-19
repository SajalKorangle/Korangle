import { Component, OnInit, Input } from '@angular/core';
import { CanvasTable} from './../../class/constants_3'

@Component({
  selector: 'app-table-parameter-pannel',
  templateUrl: './table-parameter-pannel.component.html',
  styleUrls: ['./table-parameter-pannel.component.css']
})
export class TableParameterPannelComponent implements OnInit {

  @Input() layer: CanvasTable;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
  }

  getPixelTommFactor(): number{
    return this.layer.ca.pixelTommFactor;
  }

}
