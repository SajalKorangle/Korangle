import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ViewEventServiceAdapter } from '@modules/event-gallery/pages/view-event/view-event.service.adapter';
import { DataStorage } from '@classes/data-storage';
import { ViewEventHtmlAdapter } from '@modules/event-gallery/pages/view-event/view-event.html.adapter';
import { EventGalleryService } from '@services/modules/event-gallery/event-gallery.service';
import { HttpClient } from '@angular/common/http';
import { toInteger } from 'lodash';
import { ViewImageModalComponent } from '@components/view-image-modal/view-image-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonFunctions } from '@classes/common-functions';
import { StudentService } from '@services/modules/student/student.service';

@Component({
    selector: 'app-view-event',
    templateUrl: './view-event.component.html',
    styleUrls: ['./view-event.component.css'],
    providers: [EventGalleryService, StudentService],
})
export class ViewEventComponent implements OnInit {
    user: any;

    serviceAdapter: ViewEventServiceAdapter;
    htmlAdapter: ViewEventHtmlAdapter;

    imageList: any;
    selectionList = new FormControl();
    editingEvent: any;
    tagList: any;
    imageTagList: any;
    eventList: any;
    eventNotifyList: any;
    currentEventImageList: any;

    newEvent: any;
    studentsClass: any;
    imageResponseData: any;
    currentEvent: any;
    searchString: any;
    commonMediaChecked: any;
    eventCount = 0;
    loadingCount = 10;
    loadMoreEvents = false;
    currentTagList: any;

    isEventListLoading = false;
    isImageDownloading: boolean;
    isLoading = false;

    percent_download_completed = 80;
    totalDownloadSize = 0;
    download: any;
    totalFiles = 0;
    downloadedFiles = 0;
    totalFailed = 0;

    constructor(
        public eventGalleryService: EventGalleryService,
        public studentService: StudentService,
        private _http: HttpClient,
        private dialog: MatDialog
    ) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ViewEventServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlAdapter = new ViewEventHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);
    }

    selectTaggedImages(eventTag: any) {
        this.currentEventImageList.forEach((img) => {
            img.tagList.some((tag) => {
                if (tag === eventTag.id) {
                    img.selected = eventTag.selected;
                }
            });
        });
    }

    @HostListener('window:scroll', ['$event']) onScrollEvent(event) {
        if (
            document.documentElement.clientHeight + document.documentElement.scrollTop > 0.7 * document.documentElement.scrollHeight &&
            this.loadMoreEvents &&
            !this.isEventListLoading
        ) {
            this.serviceAdapter.fetchLoadingCount();
        }
    }

    getDownloadSize(selectedImages: any) {
        this.totalDownloadSize = 0;
        selectedImages.forEach((image) => {
            this.totalFiles += 1;
            if (image.imageSize) {
                this.totalDownloadSize += toInteger(image.imageSize);
            }
        });
    }

    async download_each_file(document_url) {
        const response = await fetch(document_url + '?javascript=');
        if (response.status == 403) {
            ++this.totalFailed;
        } else {
            const reader = response.body.getReader();
            const contentLength = response.headers.get('Content-Length');
            let receivedLength = 0;
            let chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                chunks.push(value);
                receivedLength += value.length;
                this.percent_download_completed += (value.length / this.totalDownloadSize) * 10;
            }
            return new Blob(chunks);
        }
    }

    openImagePreviewDialog(eventImageList: any, i: number, b: boolean) {
        eventImageList.forEach((img) => {
            img.imageUrl = img.eventImage;
        });
        const dialogRef = this.dialog.open(ViewImageModalComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: { imageList: eventImageList, index: i, extraList: this.tagList, type: 2, fileType: 'img', isMobile: this.isMobile() },
        });
        dialogRef.afterClosed();
    }

    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }
}
