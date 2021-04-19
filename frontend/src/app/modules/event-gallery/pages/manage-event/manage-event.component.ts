import { Component, OnInit } from '@angular/core';
import { DataStorage } from '@classes/data-storage';
import { CommonFunctions } from '@classes/common-functions';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { EventGalleryService } from '@services/modules/event-gallery/event-gallery.service';
import { map } from 'rxjs/operators';
import { ManageEventServiceAdapter } from '@modules/event-gallery/pages/manage-event/manage-event.service.adapter';
import { ViewImageModalComponent } from '@components/view-image-modal/view-image-modal.component';
import { ManageEventHtmlAdapter } from '@modules/event-gallery/pages/manage-event/manage-event.html.adapter';

@Component({
    selector: 'app-manage-event',
    templateUrl: './manage-event.component.html',
    styleUrls: ['./manage-event.component.css'],
    providers: [EventGalleryService],
})
export class ManageEventComponent implements OnInit {
    user: any;

    serviceAdapter: ManageEventServiceAdapter;
    htmlAdapter: ManageEventHtmlAdapter;

    eventTagList: any;
    eventImageTagList: any;
    eventImageList: any;
    eventList: any;
    notifyToList: any;
    filteredEventList: any;

    searchString: any;
    selectedImagesCount = 0;
    eventFormControl = new FormControl();
    selectedEvent: any;
    imageCount = 0;
    totalImagesUploaded = 0;

    isLoading: boolean;
    isImageUploading = false;
    isTagCreating: boolean;
    isEventLoading: boolean;
    isDeletingImages: boolean;
    isAssigning: boolean;

    constructor(public dialog: MatDialog, public eventGalleryService: EventGalleryService) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ManageEventServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlAdapter = new ManageEventHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);

        this.filteredEventList = this.eventFormControl.valueChanges.pipe(
            map((value) => (typeof value === 'string' ? value : (value as any).title)),
            map((name) => this.filterEventList(name.toString()))
        );
    }

    filterEventList(value: string): any {
        if (value === null || value === '') {
            return [];
        }
        return this.eventList.filter((event) => {
            return event.title.toLowerCase().indexOf(value.toLowerCase()) === 0;
        });
    }

    openImagePreviewDialog(eventImages: any, index: any, editable: any): void {
        eventImages.forEach((img) => {
            img.imageUrl = img.eventImage;
        });
        const dialogRef = this.dialog.open(ViewImageModalComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: { imageList: eventImages, index: index, type: 1, fileType: 'img', isMobile: this.isMobile() },
        });
        dialogRef.afterClosed();
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }
}
