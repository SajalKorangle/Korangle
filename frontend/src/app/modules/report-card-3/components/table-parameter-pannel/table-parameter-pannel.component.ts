import { Component, OnInit, Input } from '@angular/core';
import { CanvasTable, TableRow, TableColumn} from './../../class/constants_3'

@Component({
  selector: 'app-table-parameter-pannel',
  templateUrl: './table-parameter-pannel.component.html',
  styleUrls: ['./table-parameter-pannel.component.css']
})
export class TableParameterPannelComponent implements OnInit {

  @Input() layer: CanvasTable;
  @Input() canvasRefresh: any;

  selectedRow: TableRow;
  selectedColumn: TableColumn;

  constructor() { }

  ngOnInit() {
    this.selectedRow = this.layer.rowsList[0];
    this.selectedColumn = this.layer.columnsList[0];
  }

  getPixelTommFactor(): number{
    return this.layer.ca.pixelTommFactor;
  }

}
