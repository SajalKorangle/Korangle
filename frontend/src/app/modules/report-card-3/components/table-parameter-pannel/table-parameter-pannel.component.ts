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
  selectedRowNumber: any;
  selectedColumnNumber: any;

  constructor() { }

  ngOnInit() {
    this.selectedRow = this.layer.rowsList[0];
    this.selectedColumn = this.layer.columnsList[0];
    this.selectedRowNumber = 0;
    this.selectedColumnNumber = 0;
  }

  getPixelTommFactor(): number{
    return this.layer.ca.pixelTommFactor;
  }

  func():any{
    console.log(this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].cellBackground);
  }

  getBorderValue(str: string): boolean{
    if(str == 'top'){
      return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].topBorder.visible;
    }
    if(str == 'bottom'){
      return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].bottomBorder.visible;
    }
    if(str == 'left'){
      return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].leftBorder.visible;
    }
    if(str == 'right'){
      return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].rightBorder.visible;
    }

  }

  changeBorderValue(str: string, event: any){
    console.log(event);
    if(str == 'top'){
      this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].topBorder.visible = event;
      if(this.selectedRowNumber > 0){
        this.layer.cells[this.selectedRowNumber-1][this.selectedColumnNumber].bottomBorder.visible = event;
      }
    }
    else if(str == 'bottom'){
      this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].bottomBorder.visible = event;
      if(this.selectedRowNumber < (this.layer.rowCount - 1)){
        this.layer.cells[this.selectedRowNumber + 1][this.selectedColumnNumber].topBorder.visible = event;
      }
    }
    else if(str == 'left'){
      this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].leftBorder.visible = event;
      if(this.selectedColumnNumber > 0){
        this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber-1].rightBorder.visible = event;
      }
    }
    else{
      this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].rightBorder.visible = event;
      if(this.selectedColumnNumber < (this.layer.columnCount - 1)){
        this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber+1].leftBorder.visible = event;
      }
    }

  }

  getBorderWidth(str: any): number{
    if(str == 'top'){
      return Math.round(this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].topBorder.lineWidth * this.getPixelTommFactor() * 100)/100;
    }
    if(str == 'bottom'){
      return Math.round(this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].bottomBorder.lineWidth * this.getPixelTommFactor() * 100)/100;
    }
    if(str == 'left'){
      return Math.round(this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].leftBorder.lineWidth * this.getPixelTommFactor() * 100)/100;
    }
    if(str == 'right'){
      return Math.round(this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].rightBorder.lineWidth * this.getPixelTommFactor() * 100)/100;
    }
  }

  changeBorderWidth(str: any, width: any){
    if(str == 'top'){
      this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].topBorder.lineWidth = width;
      if(this.selectedRowNumber > 0){
        this.layer.cells[this.selectedRowNumber-1][this.selectedColumnNumber].bottomBorder.lineWidth = width;
      }
    }
    else if(str == 'bottom'){
      this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].bottomBorder.lineWidth = width;
      if(this.selectedRowNumber < (this.layer.rowCount - 1)){
        this.layer.cells[this.selectedRowNumber + 1][this.selectedColumnNumber].topBorder.lineWidth = width;
      }
    }
    else if(str == 'left'){
      this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].leftBorder.lineWidth = width;
      if(this.selectedColumnNumber > 0){
        this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber-1].rightBorder.lineWidth = width;
      }
    }
    else if(str == 'right'){
      this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].rightBorder.lineWidth = width;
      if(this.selectedColumnNumber < (this.layer.columnCount - 1)){
        this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber+1].leftBorder.lineWidth = width;
      }
    }
  }
}
