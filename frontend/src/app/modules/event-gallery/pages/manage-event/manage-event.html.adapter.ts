import { ManageEventComponent } from '@modules/event-gallery/pages/manage-event/manage-event.component';

export class ManageEventHtmlAdapter {
    vm: ManageEventComponent;

    constructor() {}

    initializeAdapter(vm: ManageEventComponent): void {
        this.vm = vm;
    }

    handleEventSelection(event: any) {
        this.vm.serviceAdapter.getEventData(event);
        this.vm.selectedEvent = event;
    }

    displayEventTitle(event?: any): any {
        if (event) {
            if (typeof event == 'string') {
                return event;
            } else {
                return event.title;
            }
        }
        return '';
    }

    generateNewTag(): void {
        let newTag = document.getElementById('new-tag');
        newTag.style.display = 'inline-block';
        newTag.focus();
    }

    createTag($event: any) {
        $event.target.innerHTML = $event.target.innerHTML.replaceAll('&nbsp;', ' ');
        if ($event.target.innerHTML != '' && $event.target.innerHTML.trim() != '') {
            this.vm.serviceAdapter.createTag($event.target.innerHTML);
            $event.target.innerHTML = '';
            $event.target.style.display = 'none';
        } else {
            let newTag = document.getElementById('new-tag');
            newTag.style.display = 'none';
        }
    }

    onKeyDown($event: any) {
        if ($event.key === 'Enter') {
            $event.preventDefault();
        }
    }

    selectTag($event: any, eventTag: any) {
        if (
            $event.target.innerHTML != '' &&
            ($event.target.contentEditable == 'false' || $event.target.contentEditable == 'inherit') &&
            !this.vm.isImageUploading &&
            !this.vm.isDeletingImages
        ) {
            eventTag.selected = !eventTag.selected;
            this.selectTaggedImages(eventTag);
        }
    }

    saveTag($event: any, eventTag: any) {
        $event.target.innerHTML = $event.target.innerHTML.replaceAll('&nbsp;', ' ');
        if ($event.target.innerHTML != eventTag.tagName) {
            if ($event.target.innerHTML == '' || $event.target.innerHTML.trim() == '') {
                $event.target.innerHTML = eventTag.tagName;
            } else {
                this.vm.serviceAdapter.updateTag(eventTag, $event.target.innerHTML);
            }
        }
        $event.target.contentEditable = 'false';
    }

    checkTagSelected(): string {
        let selectedTagsLength = this.vm.eventTagList.filter((tag) => tag.selected == true).length;
        if (selectedTagsLength > 0) {
            return 'active';
        } else {
            return 'inactive';
        }
    }

    checkMediaSelected(): any {
        if (this.vm.eventImageList.filter((img) => img.selected == true).length > 0) {
            return 'active';
        } else {
            return 'inactive';
        }
    }

    deleteSelectedMedia() {
        if (this.checkMediaSelected() == 'active' && !this.vm.isDeletingImages) {
            let images = this.vm.eventImageList.filter((image) => image.selected == true);
            images.forEach((image) => {
                this.vm.serviceAdapter.deleteSelectedImage(image);
            });
        }
    }

    assignSelectedTags() {
        if (this.getAssignStatus()) {
            this.vm.serviceAdapter.assignImageTags();
        } else {
            this.vm.serviceAdapter.unAssignImageTags();
        }
    }

    editSelectedTag(): void {
        if (this.checkTagEditable() == 'active') {
            let selectedTag = document.getElementsByClassName('selectedTag')[0];
            // @ts-ignore
            selectedTag.contentEditable = 'true';
            // @ts-ignore
            selectedTag.focus();
        }
    }

    checkTagEditable(): string {
        let selectedTagsLength = this.vm.eventTagList.filter((tag) => tag.selected == true).length;
        let selectedTag = this.vm.eventTagList.find((tag) => tag.selected == true);
        if (selectedTag != undefined && selectedTagsLength == 1 && !this.vm.isDeletingImages && !this.vm.isAssigning) {
            return 'active';
        } else {
            return 'inactive';
        }
    }

    deleteSelectedTag(): void {
        if (this.checkTagSelected() == 'active') {
            this.vm.serviceAdapter.deleteSelectedTagList();
        }
    }

    readURL(event): void {
        if (event.target.files && event.target.files[0] && !this.vm.isImageUploading) {
            this.vm.isImageUploading = true;
            let files = [];
            for (let i = 0; i < event.target.files.length; i++) {
                if (event.target.files[i].type !== 'image/jpeg' && event.target.files[i].type !== 'image/png') {
                    alert('File type should be either jpg, jpeg, or png');
                    this.vm.isImageUploading = false;
                } else {
                    files.push(event.target.files[i]);
                }
            }
            this.vm.totalImagesUploaded = files.length;

            files.forEach((image) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    let tempImageData = {
                        parentEvent: this.vm.selectedEvent.id,
                        eventImage: reader.result,
                        imageSize: image.size,
                    };
                    this.vm.serviceAdapter.uploadImage(tempImageData, image.type.split('/')[1]);
                };
                reader.readAsDataURL(image);
            });
        }
    }

    selectAllMedia($event) {
        if ($event.checked) {
            this.vm.eventImageList.forEach((image) => (image.selected = true));
        } else {
            this.vm.eventImageList.forEach((image) => (image.selected = false));
        }
    }

    getSelectedImagesCount(): any {
        return this.vm.eventImageList.filter((img) => img.selected == true).length;
    }

    showPreview($event: any, image: any, i: number) {
        $event.preventDefault();
        this.vm.openImagePreviewDialog(this.vm.eventImageList, i, true);
    }

    selectTaggedImages(eventTag: any) {
        this.vm.eventImageList.forEach((img) => {
            img.tagList.some((tag) => {
                if (tag === eventTag.id) {
                    img.selected = eventTag.selected;
                }
            });
        });
    }

    onPaste(e: any) {
        e.preventDefault();
        let text = (e.originalEvent || e).clipboardData.getData('text/plain');
        document.execCommand('insertHTML', false, text);
    }

    getAssignStatus() {
        let assign = false;
        if (this.vm.eventImageList.filter((img) => img.selected).length >= 1) {
            let selectedImageList = this.vm.eventImageList.filter((img) => img.selected);
            let selectedTag = this.vm.eventTagList.find((tag) => tag.selected);
            selectedImageList.forEach((selectedImage) => {
                if (selectedTag && !selectedImage.tagList.find((t) => t == selectedTag.id)) {
                    assign = true;
                }
            });
        } else {
            assign = true;
        }
        return assign;
    }
}
