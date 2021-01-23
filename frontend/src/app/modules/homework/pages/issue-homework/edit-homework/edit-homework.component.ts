import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ImagePreviewDialogComponent } from '../../../../../components/modal/image-preview-dialog.component';
import { isMobile } from '../../../../../classes/common.js'


export interface EditHomeworkDialogData {
    id: any;
    homeworkName: any ;
    parentClassSubject: any;
    startDate: any;
    startTime: any;
    endDate: any;
    endTime: any;
    homeworkText: any ;
    homeworkImages: any;
    editRequired: any;
}


export interface ImagePreviewDialogData {
    homeworkImages: any;
    index: any;
    editable: any;
    isMobile: any;
}
//EDIT HOMEWORK DIALOG COMPONENT

@Component({
    selector: 'edit-homework-dialog',
    templateUrl: 'edit-homework-dialog.html',
    styleUrls: ['./edit-homework.component.css'],
  })
  export class EditHomeworkDialogComponent {
    
    constructor(
        public dialogRef: MatDialogRef<EditHomeworkDialogComponent>,
        @Inject(MAT_DIALOG_DATA) 
        public data: EditHomeworkDialogData,
        public dialog: MatDialog,) {
    }
  
    onNoClick(): void {
        if(!confirm("Any changes made will be lost, are you sure you want to continue?")) {
            return;
        }
        this.data.editRequired = false;
        this.dialogRef.close();
    }
    
    removeImage(index: any):any{
        this.data.homeworkImages.splice(index, 1);
    }

    readURL(event): void {
        
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0];
            if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
                alert('File type should be either jpg, jpeg, or png');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = e => {

                let tempData = {
                    orderNumber: null,
                    parentHomeworkQuestion: this.data.id,
                    questionImage: reader.result,
                }
                this.data.homeworkImages.push(tempData);
            };
            reader.readAsDataURL(image);
            
        }
    }


    openImagePreviewDialog(homeworkImages: any, index: any, editable): void {
        const dialogRef = this.dialog.open(ImagePreviewDialogComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: {'homeworkImages': homeworkImages, 'index': index, 'editable': editable, 'isMobile': this.isMobile()}
        });
    
        dialogRef.afterClosed().subscribe(result => {
            
        });
    }

    isMobile(): boolean {
        return isMobile();
    }

    isCreateButtonDisabled(str: string): boolean{
        if(str == null){
            return true;
        }
        if((str.trim()).length == 0){
            return true;
        }
        return false;
    }

}

