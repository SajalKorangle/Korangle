import { Component, OnInit, Input } from '@angular/core';
import { Layer} from './../../class/constants_3';

@Component({
  selector: 'app-date-parameters-pannel',
  templateUrl: './date-parameters-pannel.component.html',
  styleUrls: ['./date-parameters-pannel.component.css']
})
export class DateParametersPannelComponent implements OnInit {

  @Input() layer: Layer;
  @Input() canvasRefresh: any;

  dayFormat: any;
  monthFormat: any;
  yearFormat: any;
  constructor() { }

  ngOnInit() {
  }

  getDayFormat(): any{
    let str = this.layer.dateFormat;
    let tempStr = '<'
    for(let i=0;i<str.length; i++){
      if(str[i]=='d'){
        tempStr += 'd';
      }
    }
    tempStr += '>';
    this.dayFormat = tempStr;
    return this.dayFormat;
  }

  
  getMonthFormat(): any{
    let str = this.layer.dateFormat;
    let tempStr = '<'
    for(let i=0;i<str.length; i++){
      if(str[i]=='m'){
        tempStr += 'm';
      }
    }
    tempStr += '>';
    this.monthFormat = tempStr;
    return this.monthFormat;
  }

  
  getYearFormat(): any{
    let str = this.layer.dateFormat;
    let tempStr = '<'
    for(let i=0;i<str.length; i++){
      if(str[i]=='y'){
        tempStr += 'y';
      }
    }
    tempStr += '>';
    this.yearFormat = tempStr;
    return this.yearFormat;
  }

  changeDateFormat():any{
    let currentDateFormat = '';
    currentDateFormat = this.dayFormat + '/' + this.monthFormat + '/' + this.yearFormat;
    this.layer.dateFormat = currentDateFormat;
    this.layer.dateFormatting();
  }

  onDateSelected(event){
    this.layer.date = new Date(event);
    this.layer.dateFormatting();
  }

  getCurrentDate():any{
    return this.layer.date.toISOString().substr(0,10);
  }

}
