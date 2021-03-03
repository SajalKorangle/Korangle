import {ViewEventComponent} from '@modules/event-gallery/pages/view-event/view-event.component';
import {saveAs} from 'file-saver';
import * as JSZip from 'jszip';

export class ViewEventHtmlAdapter {
    vm: ViewEventComponent;

    constructor() {
    }

    initializeAdapter(vm: ViewEventComponent): void {
        this.vm = vm;
    }

    viewSelectedEvent(event: any) {
        this.vm.currentEventImageList = [];
        this.vm.currentTagList = [];
        this.vm.currentEvent = event;
        this.vm.currentEventImageList = this.vm.imageList.filter(image => image.parentEvent === this.vm.currentEvent.id);
        this.vm.currentTagList = this.vm.tagList.filter(tag => tag.parentEvent === this.vm.currentEvent.id);
    }

    selectTag($event: any, eventTag: any) {
        if ($event.target.innerHTML != '' && ($event.target.contentEditable == 'false' || $event.target.contentEditable == 'inherit')) {
            eventTag.selected = !eventTag.selected;
            this.vm.selectTaggedImages(eventTag);
        }
    }

    downloadSelectedImages() {
        let selectedImages = this.vm.currentEventImageList.filter(image => image.selected == true);
        this.vm.totalFailed = 0;
        this.vm.download = 'START';
        this.vm.getDownloadSize(selectedImages);
        if (this.vm.totalDownloadSize) {
            alert('Your are about to download ' + (this.vm.totalFiles) + ' files of size ' + (this.vm.totalDownloadSize / 1000000) + ' MB');
            let zip = new JSZip();
            let check1 = 0;
            this.vm.downloadedFiles = 0;
            var Folder = zip.folder(this.vm.currentEvent.title);
            selectedImages.forEach(image => {
                let document_url = image.eventImage;
                if (document_url) {
                    check1 = check1 + 1;
                    this.vm.download_each_file(document_url).then(blob => {
                        if (blob) {
                            let type = document_url.split('.');
                            type = type[type.length - 1];
                            let file = new Blob([blob], {type: type});
                            Folder.file(this.vm.currentEvent.title + '_' + this.vm.downloadedFiles + '.' + type, file);
                            this.vm.downloadedFiles = this.vm.downloadedFiles + 1;
                        }
                        if (check1 === this.vm.downloadedFiles + this.vm.totalFailed) {
                            zip.generateAsync({type: 'blob'})
                                .then(content => {
                                    saveAs(content, this.vm.currentEvent.title + '.zip');
                                    this.vm.download = 'NOT'
                                });
                            // this.isLoading=false
                            this.vm.download = 'END'
                            this.vm.downloadedFiles = 0
                            this.vm.totalFiles = 0
                            this.vm.percent_download_completed = 0
                            this.vm.totalDownloadSize = 0
                        }
                    }, error => {
                        this.vm.download = 'FAIL'
                        this.vm.downloadedFiles = 0
                        this.vm.totalFiles = 0
                        this.vm.percent_download_completed = 0
                        this.vm.totalDownloadSize = 0
                    });
                }
            });
        } else {
            alert('No documents are available for download.');
            this.vm.download = 'NOT';
        }
    }

    getSelectedImagesCount(): any {
        return this.vm.imageList.filter(img => img.selected == true).length;
    }

    selectAllMedia($event) {
        if ($event.checked) {
            this.vm.imageList.forEach(image => image.selected = true);
        } else {
            this.vm.imageList.forEach(image => image.selected = false);
        }
    }

    showPreview($event: any, image: any, i: number) {
        $event.preventDefault();
        this.vm.openImagePreviewDialog(this.vm.currentEventImageList, i, true)
    }

    getEventImageUrl(event: any, index: number): string {
        let url = this.vm.imageList.filter(img => img.parentEvent == event.id)[index];
        return url ? url.eventImage : '/assets/img/noImageAvailable.jpg';
    }


    getFilteredImageList() {
        let selectedTags = this.vm.tagList.filter(tag => tag.parentEvent === this.vm.currentEvent.id && tag.selected == true);
        if (selectedTags.length > 0) {
            if (!this.vm.commonMediaChecked) {
                return this.vm.currentEventImageList.filter(image => {
                    return image.selected = selectedTags.map(tags => tags.id).every(r => image.tagList.includes(r))
                });
            } else {
                return this.vm.currentEventImageList.filter(image => {
                    return image.selected = image.tagList.some(tag => {
                        return selectedTags.find(selectedTag => selectedTag.id == tag) != undefined;
                    });
                });
            }
        } else {
            return this.vm.currentEventImageList;
        }
    }

    getEventList(): any {
        if (this.vm.searchString && this.vm.searchString.trim() != '') {
            return this.vm.eventList.filter(event => {
                if (event.title.toLowerCase().includes(this.vm.searchString.toLowerCase())) {
                    return true;
                }
            });
        } else {
            return this.vm.eventList;
        }
    }

    getImageLength(event: any) {
        return this.vm.imageList.filter(img => img.parentEvent == event.id).length;
    }

    getSelectedTagList() {
        return this.vm.currentTagList.filter(tg => tg.parentEvent == this.vm.currentEvent.id && tg.selected == true);
    }
}