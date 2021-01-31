import { OnInit,Component, Inject } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PARAMETER_LIST } from 'app/modules/id-card/class/constants';
import {DataStorage} from '../../../classes/data-storage';


  
@Component({ 
  selector: 'app-multiple-file-dialog', 
  templateUrl: './multiple-file-dialog.component.html', 
  styleUrls:['./multiple-file-dialog.component.css'],
}) 
export class MultipleFileDialogComponent { 
  
  constructor( 
    public dialogRef: MatDialogRef<MultipleFileDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any) {}
  changeList(value,index){
    let parameter = this.data.options.find(x=>(x.id==value))
    let parameter2 = this.data.choiceList.find(x=>(x.id==value))
    parameter2.id = this.data.choiceList[index].id
    parameter2.name = this.data.choiceList[index].name
    this.data.choiceList[index].id = parameter.id
    this.data.choiceList[index].name=parameter.name
  }
  removeFile(index){
    this.data.files.splice(index,1)
    if (this.data.files.length ==0){
      this.onCancel();
    }
  }
  onCancel(): void { 
    this.dialogRef.close();
  }  
}