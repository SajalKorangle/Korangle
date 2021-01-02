import {Component, Inject, OnInit} from '@angular/core';
import {DataStorage} from '@classes/data-storage';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-modal-video',
    templateUrl: './modal-video.component.html',
    styleUrls: ['./modal-video.component.css'],
})
export class ModalVideoComponent implements OnInit {

    user: any;
    videoUrl:string;

    constructor(
        public dialogRef: MatDialogRef<ModalVideoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.videoUrl=this.data.videoUrl;
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
