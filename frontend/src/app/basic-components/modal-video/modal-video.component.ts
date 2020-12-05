import {Component, OnInit} from '@angular/core';
import {DataStorage} from '@classes/data-storage';

@Component({
    selector: 'app-modal-video',
    templateUrl: './modal-video.component.html',
    styleUrls: ['./modal-video.component.css'],
})
export class ModalVideoComponent implements OnInit {

    user: any;

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
    }

}
