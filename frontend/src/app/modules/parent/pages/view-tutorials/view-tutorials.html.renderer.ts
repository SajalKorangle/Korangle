import {ViewTutorialsComponent} from '@modules/parent/pages/view-tutorials/view-tutorials.component';
import moment = require('moment');


export class ViewTutorialsHtmlRenderer {

    vm: ViewTutorialsComponent;

    isLoading = false;
    isIFrameLoading = true;
    
   
    constructor() {
    }


    initializeAdapter(vm: ViewTutorialsComponent): void {
        this.vm = vm;
    }

    getSubjectName(subject: any): any {
        let result = '';
        this.vm.backendData.subjectList.every((subj) => {
            if (subj.id === subject.parentSubject) {
                result = subj.name;
                return false;
            }
            return true;
        });
        return result;
    }
    
    

    handleSubjectSelection(event: any) {
        this.vm.selectedSubject = event;
        this.vm.selectedChapter =  this.vm.selectedSubject.chapterList[0];
        this.vm.selectedTopic = this.vm.selectedChapter.topicList[0];
    }

    handleChapterSelection(event: any) {
        this.vm.selectedChapter = event;
        this.vm.selectedTopic = this.vm.selectedChapter.topicList[0];
    }

    handleTopicSelection(event: any) {
        this.vm.selectedTopic = event;
    }

    tutorialsExist() {
        return this.vm.backendData.tutorialList.length>0;
    }

    getPublishedDate() {
        return moment(this.vm.selectedTopic.generationDateTime).format('Do - MMMM - YYYY');
    }

    getVideoUrlId() {
        return this.vm.selectedTopic.link.match(this.vm.youtubeIdMatcher)[1];
    }
    
    onReady(event: any) {
        console.log('here')
        this.isIFrameLoading=false;
    }
}