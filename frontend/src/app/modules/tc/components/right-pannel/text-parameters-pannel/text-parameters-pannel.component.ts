import { Component, Input, OnInit, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { CanvasText } from '../../../class/constants';
import { FONT_FAMILY_LIST } from './../../../class/font';
import { VERTICAL_ALIGNMENT_LIST_MAP } from '../../../class/constants'

@Component({
  selector: 'app-text-parameters-pannel',
  templateUrl: './text-parameters-pannel.component.html',
  styleUrls: ['./text-parameters-pannel.component.css']
})
export class TextParametersPannelComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() layer: CanvasText;
  @Input() canvasRefresh: any;
  
  fontFamilyList = FONT_FAMILY_LIST;
  verticalAlignmentKeyMapMap = VERTICAL_ALIGNMENT_LIST_MAP;

  constructor(private _elementRef : ElementRef) { }

  ngOnInit() {
  }

  ngAfterViewInit() { // focus on textarea to type if element is selected for the first time
    setTimeout(()=>this._elementRef.nativeElement.querySelector('textarea').select()); 
  }

  ngOnChanges(changes) { // focus on textarea to type if layer is updated
    if (changes.layer.previousValue && changes.layer.currentValue.id != changes.layer.previousValue.id) {
      setTimeout(() => this._elementRef.nativeElement.querySelector('textarea').select(), 200); // delay is to wait for the value to be initilized
    }
  }

  getPixelTommFactor(): number{
    return this.layer.ca.pixelTommFactor;
  }

  updateFontSize(newSize: number): void{
    newSize = newSize / this.getPixelTommFactor();
    this.layer.fontSize = newSize;
  }

  getFontSize(): number{
    return (Math.round(this.layer.fontSize*this.getPixelTommFactor() * 100))/100;
  }

  boldToggle(): void{
    this.layer.fontWeight = this.layer.fontWeight=='bold' ? 'normal' : 'bold';
  }

  italicToggle(): void{
    this.layer.italics = this.layer.italics=='italic' ? '': 'italic';
  }

  underlineToggle(): any{
    this.layer.underline = this.layer.underline? false : true;
  }


  getVerticalAlignmentKeys(): Array<string>{
    return Object.keys(VERTICAL_ALIGNMENT_LIST_MAP);
  }

  getWidth() {
    return Math.round(this.layer.maxWidth * this.getPixelTommFactor() * 100) / 100;
  }

  updateWidth(newWidth) {
    newWidth = newWidth / this.getPixelTommFactor();
    this.layer.maxWidth = newWidth;
  }

  getHeight() {
    return Math.round(this.layer.minHeight * this.getPixelTommFactor() * 100) / 100;
  }

  updateHeight(newHeight) {
    newHeight = newHeight / this.getPixelTommFactor();
    this.layer.minHeight = newHeight;
  }

}
