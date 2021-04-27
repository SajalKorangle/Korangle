import { Component, Inject, OnInit } from '@angular/core';
import { DataStorage } from '@classes/data-storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-modal-video',
    templateUrl: './modal-video.component.html',
    styleUrls: ['./modal-video.component.css'],
})
export class ModalVideoComponent implements OnInit {
    user: any;
    videoUrl: string;
    isIFrameLoading:boolean;
    youtubeIdMatcher = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|vi|e(?:mbed)?)\/|\S*?[?&]v=|\S*?[?&]vi=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    constructor(public dialogRef: MatDialogRef<ModalVideoComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.videoUrl = this.data.videoUrl;
        this.isIFrameLoading = true;
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

    getVideoUrlId() {
        return this.videoUrl.match(this.youtubeIdMatcher)[1];
    }

    onReady(event: any) {
        this.isIFrameLoading = false;
    }
}
