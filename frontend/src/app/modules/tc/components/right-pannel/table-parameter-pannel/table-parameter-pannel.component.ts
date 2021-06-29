import { Component, OnInit, Input } from '@angular/core';
import { CanvasTable, TableRow, TableColumn } from '../../../class/constants';

@Component({
    selector: 'app-table-parameter-pannel',
    templateUrl: './table-parameter-pannel.component.html',
    styleUrls: ['./table-parameter-pannel.component.css'],
})
export class TableParameterPannelComponent implements OnInit {
    @Input() layer: CanvasTable;
    @Input() canvasRefresh: any;

    selectedRowNumber: any;
    selectedColumnNumber: any;

    constructor() {}

    ngOnInit() {}

    getCellX(): string {
        // get x of the seleced cell
        if (this.layer.selectedCells.length > 0) {
            let colIndex = this.layer.selectedCells[0].column;
            let x = this.layer.x,
                i = 0;
            while (i < colIndex) {
                x += this.layer.columnsList[i].width;
                i++;
            }
            return (x * this.layer.ca.pixelTommFactor).toFixed(1);
        }
        return this.layer.x.toFixed(1); // if no cell is selected
    }

    getCellY(): string {
        // get y of the selected cell
        if (this.layer.selectedCells.length > 0) {
            let rowIndex = this.layer.selectedCells[0].row;
            let y = this.layer.y,
                i = 0;
            while (i < rowIndex) {
                y += this.layer.rowsList[i].height;
                i++;
            }
            return (y * this.layer.ca.pixelTommFactor).toFixed(1);
        }
        return this.layer.y.toFixed(1); // if no cell is selected
    }

    checkCell(i: any, j: any): any {
        let isSelected = false;
        this.layer.selectedCells.forEach((cell, index) => {
            if (cell.row == i && cell.column == j) {
                isSelected = true;
                this.layer.selectedCells.splice(index, 1);
                return;
            }
        });
        if (isSelected == false) {
            this.layer.selectedCells.push({ row: i, column: j });
        }
    }

    isCellSelected(i: any, j: any): boolean {
        if (this.layer.selectedCells.find((cell) => cell.row == i && cell.column == j) == undefined) {
            return false;
        } else {
            return true;
        }
    }

    shiftColumnCorrdinates(): any {
        this.layer.selectedCells.forEach((cell) => {
            cell.column += 1;
        });
    }

    shiftRowCorrdinates(): any {
        this.layer.selectedCells.forEach((cell) => {
            cell.row += 1;
        });
    }

    getPixelTommFactor(): number {
        return this.layer.ca.pixelTommFactor;
    }

    getBorderValue(str: string): boolean {
        this.selectedRowNumber = this.layer.selectedCells[0].row;
        this.selectedColumnNumber = this.layer.selectedCells[0].column;
        if (str == 'top') {
            return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].topBorder.visible;
        }
        if (str == 'bottom') {
            return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].bottomBorder.visible;
        }
        if (str == 'left') {
            return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].leftBorder.visible;
        }
        if (str == 'right') {
            return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].rightBorder.visible;
        }
    }

    changeBorderValue(str: string, event: any) {
        this.layer.selectedCells.forEach((cell) => {
            this.selectedRowNumber = cell.row;
            this.selectedColumnNumber = cell.column;
            if (str == 'top') {
                this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].topBorder.visible = event;
                if (this.selectedRowNumber > 0) {
                    this.layer.cells[this.selectedRowNumber - 1][this.selectedColumnNumber].bottomBorder.visible = event;
                }
            } else if (str == 'bottom') {
                this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].bottomBorder.visible = event;
                if (this.selectedRowNumber < this.layer.rowCount - 1) {
                    this.layer.cells[this.selectedRowNumber + 1][this.selectedColumnNumber].topBorder.visible = event;
                }
            } else if (str == 'left') {
                this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].leftBorder.visible = event;
                if (this.selectedColumnNumber > 0) {
                    this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber - 1].rightBorder.visible = event;
                }
            } else {
                this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].rightBorder.visible = event;
                if (this.selectedColumnNumber < this.layer.columnCount - 1) {
                    this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber + 1].leftBorder.visible = event;
                }
            }
        });
    }

    getBorderWidth(str: any): number {
        this.selectedRowNumber = this.layer.selectedCells[0].row;
        this.selectedColumnNumber = this.layer.selectedCells[0].column;
        if (str == 'top') {
            return (
                Math.round(
                    this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].topBorder.lineWidth *
                        this.getPixelTommFactor() *
                        100
                ) / 100
            );
        }
        if (str == 'bottom') {
            return (
                Math.round(
                    this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].bottomBorder.lineWidth *
                        this.getPixelTommFactor() *
                        100
                ) / 100
            );
        }
        if (str == 'left') {
            return (
                Math.round(
                    this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].leftBorder.lineWidth *
                        this.getPixelTommFactor() *
                        100
                ) / 100
            );
        }
        if (str == 'right') {
            return (
                Math.round(
                    this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].rightBorder.lineWidth *
                        this.getPixelTommFactor() *
                        100
                ) / 100
            );
        }
    }

    changeBorderWidth(str: any, width: any) {
        this.layer.selectedCells.forEach((cell) => {
            this.selectedRowNumber = cell.row;
            this.selectedColumnNumber = cell.column;
            if (str == 'top') {
                this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].topBorder.lineWidth = width;
                if (this.selectedRowNumber > 0) {
                    this.layer.cells[this.selectedRowNumber - 1][this.selectedColumnNumber].bottomBorder.lineWidth = width;
                }
            } else if (str == 'bottom') {
                this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].bottomBorder.lineWidth = width;
                if (this.selectedRowNumber < this.layer.rowCount - 1) {
                    this.layer.cells[this.selectedRowNumber + 1][this.selectedColumnNumber].topBorder.lineWidth = width;
                }
            } else if (str == 'left') {
                this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].leftBorder.lineWidth = width;
                if (this.selectedColumnNumber > 0) {
                    this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber - 1].rightBorder.lineWidth = width;
                }
            } else if (str == 'right') {
                this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].rightBorder.lineWidth = width;
                if (this.selectedColumnNumber < this.layer.columnCount - 1) {
                    this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber + 1].leftBorder.lineWidth = width;
                }
            }
        });
    }

    getBorderColor(str: any): any {
        this.selectedRowNumber = this.layer.selectedCells[0].row;
        this.selectedColumnNumber = this.layer.selectedCells[0].column;
        if (str == 'top') {
            return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].topBorder.strokeStyle;
        }
        if (str == 'bottom') {
            return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].bottomBorder.strokeStyle;
        }
        if (str == 'left') {
            return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].leftBorder.strokeStyle;
        }
        if (str == 'right') {
            return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].rightBorder.strokeStyle;
        }
    }

    changeBorderColor(str: any, color: any) {
        this.layer.selectedCells.forEach((cell) => {
            this.selectedRowNumber = cell.row;
            this.selectedColumnNumber = cell.column;
            if (str == 'top') {
                this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].topBorder.strokeStyle = color;
                if (this.selectedRowNumber > 0) {
                    this.layer.cells[this.selectedRowNumber - 1][this.selectedColumnNumber].bottomBorder.strokeStyle = color;
                }
            } else if (str == 'bottom') {
                this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].bottomBorder.strokeStyle = color;
                if (this.selectedRowNumber < this.layer.rowCount - 1) {
                    this.layer.cells[this.selectedRowNumber + 1][this.selectedColumnNumber].topBorder.strokeStyle = color;
                }
            } else if (str == 'left') {
                this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].leftBorder.strokeStyle = color;
                if (this.selectedColumnNumber > 0) {
                    this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber - 1].rightBorder.strokeStyle = color;
                }
            } else if (str == 'right') {
                this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].rightBorder.strokeStyle = color;
                if (this.selectedColumnNumber < this.layer.columnCount - 1) {
                    this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber + 1].leftBorder.strokeStyle = color;
                }
            }
        });
    }

    getCellColor(): any {
        this.selectedRowNumber = this.layer.selectedCells[0].row;
        this.selectedColumnNumber = this.layer.selectedCells[0].column;
        return this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].cellBackground;
    }

    changeCellColor(color: any) {
        this.layer.selectedCells.forEach((cell) => {
            this.selectedRowNumber = cell.row;
            this.selectedColumnNumber = cell.column;
            this.layer.cells[this.selectedRowNumber][this.selectedColumnNumber].cellBackground = color;
        });
    }

    getRowHeight(): any {
        return Math.round(this.layer.rowsList[this.layer.selectedCells[0].row].height * this.getPixelTommFactor() * 100) / 100;
    }

    getColumnWidth(): any {
        return Math.round(this.layer.columnsList[this.layer.selectedCells[0].column].width * this.getPixelTommFactor() * 100) / 100;
    }

    changeRowHeight(event): any {
        this.layer.selectedCells.forEach((cell) => {
            this.layer.rowsList[cell.row].height = event;
        });
    }

    changeColumnWidth(event): any {
        this.layer.selectedCells.forEach((cell) => {
            this.layer.columnsList[cell.column].width = event;
        });
    }

    deleteSelectedRows(): any {
        let rowsToRemove = [];
        this.layer.selectedCells.forEach((cell) => {
            if (rowsToRemove.indexOf(cell.row) == -1) {
                rowsToRemove.push(cell.row);
            }
        });
        if (rowsToRemove.length == this.layer.rowCount) {
            alert('All Rows Can Not Be Deleted');
            return;
        }
        rowsToRemove.sort(function (a, b) {
            return a.row - b.row;
        });
        for (let i = rowsToRemove.length - 1; i >= 0; i--) {
            this.layer.rowCount--;
            this.layer.cells.splice(rowsToRemove[i], 1);
            this.layer.rowsList.splice(rowsToRemove[i], 1);
        }
        this.layer.selectedCells = [];
    }

    deleteSelectedColumns(): any {
        let columnsToRemove = [];
        this.layer.selectedCells.forEach((cell) => {
            if (columnsToRemove.indexOf(cell.column) == -1) {
                columnsToRemove.push(cell.column);
            }
        });
        if (columnsToRemove.length == this.layer.columnCount) {
            alert('All Columns Can Not Be Deleted');
            return;
        }
        columnsToRemove.sort(function (a, b) {
            return a.column - b.column;
        });
        for (let i = columnsToRemove.length - 1; i >= 0; i--) {
            this.layer.columnCount--;
            this.layer.cells.forEach((cell) => {
                cell.splice(columnsToRemove[i], 1);
            });
            this.layer.columnsList.splice(columnsToRemove[i], 1);
        }
        this.layer.selectedCells = [];
    }

    addRowAfter(): any {
        this.layer.rowCount += 1;
        let newTableRow = new TableRow();
        newTableRow.height /= this.getPixelTommFactor(); // converting mm to pixels
        this.layer.rowsList.push(newTableRow);
        let newCellRow = [];
        for (let i = 0; i < this.layer.columnCount; i++) {
            let tempCell = {
                topBorder: {
                    visible: this.layer.cells[this.layer.rowCount - 2][i].bottomBorder.visible,
                    lineWidth: this.layer.cells[this.layer.rowCount - 2][i].bottomBorder.lineWidth,
                    strokeStyle: this.layer.cells[this.layer.rowCount - 2][i].bottomBorder.strokeStyle,
                },
                bottomBorder: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: 'black',
                },
                leftBorder: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: 'black',
                },
                rightBorder: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: 'black',
                },
                cellBackground: '#ffffff',
            };
            newCellRow.push(tempCell);
        }
        this.layer.cells.push(newCellRow);
    }

    addColumnAfter(): any {
        this.layer.columnCount += 1;
        let newTableRowColumn = new TableColumn();
        newTableRowColumn.width /= this.getPixelTommFactor(); // converting mm to pixels
        this.layer.columnsList.push(newTableRowColumn);
        for (let i = 0; i < this.layer.rowCount; i++) {
            let tempCell = {
                topBorder: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: 'black',
                },
                bottomBorder: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: 'black',
                },
                leftBorder: {
                    visible: this.layer.cells[i][this.layer.columnCount - 2].rightBorder.visible,
                    lineWidth: this.layer.cells[i][this.layer.columnCount - 2].rightBorder.lineWidth,
                    strokeStyle: this.layer.cells[i][this.layer.columnCount - 2].rightBorder.strokeStyle,
                },
                rightBorder: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: 'black',
                },
                cellBackground: '#ffffff',
            };
            this.layer.cells[i].push(tempCell);
        }
    }

    addRowBefore(): any {
        this.layer.rowCount += 1;
        let newTableRow = new TableRow();
        newTableRow.height /= this.getPixelTommFactor(); // converting mm to pixels
        this.layer.rowsList.unshift(newTableRow);
        let newCellRow = [];
        for (let i = 0; i < this.layer.columnCount; i++) {
            let tempCell = {
                bottomBorder: {
                    visible: this.layer.cells[1][i].topBorder.visible,
                    lineWidth: this.layer.cells[1][i].topBorder.lineWidth,
                    strokeStyle: this.layer.cells[1][i].topBorder.strokeStyle,
                },
                topBorder: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: 'black',
                },
                leftBorder: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: 'black',
                },
                rightBorder: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: 'black',
                },
                cellBackground: '#ffffff',
            };
            newCellRow.push(tempCell);
        }
        this.layer.cells.unshift(newCellRow);
    }

    addColumnBefore(): any {
        this.layer.columnCount += 1;
        let newTableRowColumn = new TableColumn();
        newTableRowColumn.width /= this.getPixelTommFactor(); // converting mm to pixels
        this.layer.columnsList.unshift(newTableRowColumn);
        for (let i = 0; i < this.layer.rowCount; i++) {
            let tempCell = {
                topBorder: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: 'black',
                },
                bottomBorder: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: 'black',
                },
                rightBorder: {
                    visible: this.layer.cells[i][1].leftBorder.visible,
                    lineWidth: this.layer.cells[i][1].leftBorder.lineWidth,
                    strokeStyle: this.layer.cells[i][1].leftBorder.strokeStyle,
                },
                leftBorder: {
                    visible: true,
                    lineWidth: 2,
                    strokeStyle: 'black',
                },
                cellBackground: '#ffffff',
            };
            this.layer.cells[i].unshift(tempCell);
        }
    }
}
