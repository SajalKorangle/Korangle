import {Component, HostListener, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ViewEventServiceAdapter} from '@modules/event-gallery/pages/view-event/view-event.service.adapter';
import {DataStorage} from '@classes/data-storage';
import {ViewEventHtmlAdapter} from '@modules/event-gallery/pages/view-event/view-event.html.adapter';
import {EventGalleryService} from '@services/modules/event-gallery/event-gallery.service';
import {saveAs} from 'file-saver';
import * as JSZip from 'jszip';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {toInteger} from 'lodash';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {EventImageModalComponent} from '@modules/event-gallery/components/event-image-modal/event-image-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {CommonFunctions} from '@classes/common-functions';


@Component({
    selector: 'app-view-event',
    templateUrl: './view-event.component.html',
    styleUrls: ['./view-event.component.css'],
    providers: [EventGalleryService]
})
export class ViewEventComponent implements OnInit {

    serviceAdapter: ViewEventServiceAdapter;
    htmlAdapter: ViewEventHtmlAdapter;
    user: any;

    imageList: any;
    notifySelectionList: any;
    selectionList = new FormControl();
    editing = false;
    editingEvent: any;
    newEvent: any;
    currentEventImageList:any;
    isLoading = false;
    imageResponseData: any;
    currentEvent: any;
    searchString: any;
    tagList: any;
    imageTagList: any;
    notifyPersonData: any;
    editingNotificationList: any;
    eventList: any;
    eventNotifyList: any;
    eventCount = 0;
    loadingCount = 10;
    loadMoreEvents = false;
    isEventListLoading = false;
    isImageDownloading: boolean;
   
    percent_download_completed=0;
    totalDownloadSize=0;
    download:any;
    totalFiles=0;
    downloadedFiles=0;
    totalFailed:any;
    currentTagList: any;


    constructor(public eventGalleryService: EventGalleryService,
                private _http: HttpClient,
                private dialog:MatDialog) {
    }

    ngOnInit() {

        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new ViewEventServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.htmlAdapter = new ViewEventHtmlAdapter();
        this.htmlAdapter.initializeAdapter(this);
    }


    viewSelectedEvent(event: any) {
        this.currentEventImageList=[];
        this.currentTagList=[];
        this.currentEvent = event;
        this.currentEventImageList= this.imageList.filter(image => image.parentEvent === this.currentEvent.id);
        this.currentTagList= this.tagList.filter(tag => tag.parentEvent === this.currentEvent.id);
    }

    selectTag($event: any, eventTag: any) {
        console.log($event);
        if ($event.target.innerHTML != '' && ($event.target.contentEditable == 'false' || $event.target.contentEditable == 'inherit')) {
            eventTag.selected = !eventTag.selected;
            this.selectTaggedImages(eventTag);
        }
    }

    selectTaggedImages(eventTag: any) {
        this.currentEventImageList.forEach(img => {
            img.tagList.some(tag => {
                if (tag === eventTag.id) {
                    img.selected = eventTag.selected;
                }
            });
        });
    }

    @HostListener('window:scroll', ['$event']) onScrollEvent(event) {
        if ((document.documentElement.clientHeight + document.documentElement.scrollTop) > (0.7 * document.documentElement.scrollHeight) && this.loadMoreEvents && !this.isEventListLoading) {
            this.serviceAdapter.fetchLoadingCount();
        }
    }

    downloadSelectedImages() {
        let selectedImageUrls = [];
        this.imageResponseData=[];
        let selectedImages = this.currentEventImageList.filter(image => image.selected == true);
        // this.imageList.filter(image => image.parentEvent === this.currentEvent.id && image.selected == true).forEach(image => {
        //   // FileSaver.saveAs(image.eventImage, "image.jpg");
        //   selectedImageUrls.push(image.eventImage);
        // });
        // this.createGetRequests(selectedImageUrls);
        //
        // forkJoin(...this.imageResponseData)
        //     .subscribe((res) => {
        //       const zip = new JSZip();
        //
        //       res.forEach((f, i) => {
        //         zip.file(`image${i}.png`, f);
        //       });
        //
        //       zip
        //           .generateAsync({type: 'blob'})
        //           .then(blob => saveAs(blob, this.currentEvent.title+'.zip'));
        //     });
        this.totalFailed = 0;
        this.download = 'START';
        this.getDownloadSize(selectedImages);
        if (this.totalDownloadSize) {
            alert('Your are about to download ' + (this.totalFiles) + ' files of size ' + (this.totalDownloadSize / 1000000) + ' MB');
            let zip = new JSZip();
            let check1 = 0;
            this.downloadedFiles = 0;
            let flag = 1;
            selectedImages.forEach(image => {
                var Folder = zip.folder(this.currentEvent.title);
                let document_url = image.eventImage;
                if (document_url) {
                    check1 = check1 + 1;
                    this.download_each_file(document_url).then(blob => {
                        if (blob) {
                            let type = document_url.split('.');
                            type = type[type.length - 1];
                            let file = new Blob([blob], {type: type});
                            Folder.file(this.currentEvent.title + '_' + check1 + '.' + type, file);
                            this.downloadedFiles = this.downloadedFiles + 1;
                            console.log(check1, this.downloadedFiles)
                        }
                        if (check1 === this.downloadedFiles + this.totalFailed) {
                            zip.generateAsync({type: 'blob'})
                                .then(content => {
                                    saveAs(content, this.currentEvent.title + '.zip');
                                    this.download = 'NOT'
                                });
                            // this.isLoading=false
                            this.download = 'END'
                            this.downloadedFiles = 0
                            this.totalFiles = 0
                            this.percent_download_completed = 0
                            this.totalDownloadSize = 0
                        }
                    }, error => {
                        this.download = 'FAIL'
                        //this.isLoading = false;
                        this.downloadedFiles = 0
                        this.totalFiles = 0
                        this.percent_download_completed = 0
                        this.totalDownloadSize = 0
                    });
                }
            });
        } else {
            alert('No documents are available for download.');
            this.download = 'NOT';
        }
    }


  //   private createGetRequests(data: string[]) {
  //       const headers= new HttpHeaders()
  // .set('content-type', 'application/json')
  // .set('Access-Control-Allow-Origin', '*');
  //       headers.append('Access-Control-Allow-Origin','*')
  //       data.forEach(url => this.imageResponseData.push(this._http.get(url, {headers:headers,responseType: 'blob'})));
  //   }


    getSelectedImagesCount(): any {
        return this.imageList.filter(img => img.selected == true).length;
    }

    selectAllMedia($event) {
        if ($event.checked) {
            this.imageList.forEach(image => image.selected = true);
        } else {
            this.imageList.forEach(image => image.selected = false);
        }
    }

     showPreview($event: any, image: any, i: number) {
        $event.preventDefault();
        this.openImagePreviewDialog(this.currentEventImageList,i,true)
    }
    
    

    getFilteredImageList() {
            let selectedTags = this.tagList.filter(tag => tag.parentEvent === this.currentEvent.id && tag.selected == true);
            if (selectedTags.length > 0) {
                return this.currentEventImageList.filter(image => {
                    return image.selected = image.tagList.some(tag => {
                        return selectedTags.find(selectedTag => selectedTag.id == tag) != undefined;
                    });
                });
            } else {
                return this.currentEventImageList;
            }
    }

    getDownloadSize(selectedImages: any) {
        this.totalDownloadSize = 0
        selectedImages.forEach(image => {
            this.totalFiles += 1
            if (image.imageSize) {
                this.totalDownloadSize += toInteger(image.imageSize)
            }
        });
    }

   async download_each_file(document_url) {
         // let headers = new Headers();
         //   headers.append('Access-Control-Allow-Origin', '*');
        const response = await fetch(document_url);
        if (response.status ==403){
            ++this.totalFailed;
        }
        else{
		    const reader = response.body.getReader();
		    const contentLength = response.headers.get('Content-Length');
		    let receivedLength = 0;
		    let chunks = [];
		    while(true) {
		        const {done, value} = await reader.read();
		         if (done) {
		             break;
		        }
		        chunks.push(value);
		        receivedLength += value.length;
		        this.percent_download_completed+=(value.length)/(this.totalDownloadSize)*100;
		        console.log(`Received ${receivedLength} of ${contentLength}`)
		        console.log(`now total received is ${this.percent_download_completed} %`)
		    }
            return new Blob(chunks);
    	}
    }

    private openImagePreviewDialog(eventImageList: any, i: number, b: boolean) {
         const dialogRef = this.dialog.open(EventImageModalComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            data: {'eventImages': eventImageList, 'index': i, 'tagList': this.tagList,'viewEventPage':true, 'isMobile': this.isMobile()}
        });
        dialogRef.afterClosed();
    }
    
    isMobile(): boolean {
        return CommonFunctions.getInstance().isMobileMenu();
    }
}
