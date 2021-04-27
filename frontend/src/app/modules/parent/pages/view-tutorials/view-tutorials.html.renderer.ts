import {ViewTutorialsComponent} from '@modules/parent/pages/view-tutorials/view-tutorials.component';
import moment = require('moment');


export class ViewTutorialsHtmlRenderer {

    vm: ViewTutorialsComponent;

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
        this.vm.userInput.selectedSubject = event;
        this.vm.userInput.selectedChapter =  this.vm.userInput.selectedSubject.chapterList[0];
        this.vm.userInput.selectedTopic = this.vm.userInput.selectedChapter.topicList[0];
    }

    handleChapterSelection(event: any) {
        this.vm.userInput.selectedChapter = event;
        this.vm.userInput.selectedTopic = this.vm.userInput.selectedChapter.topicList[0];
    }

    handleTopicSelection(event: any) {
        this.vm.userInput.selectedTopic = event;
    }

    tutorialsExist() {
        return this.vm.backendData.tutorialList.length > 0;
    }

    getPublishedDate() {
        return moment(this.vm.userInput.selectedTopic.generationDateTime).format('Do - MMMM - YYYY');
    }

    getVideoUrlId() {
        return this.vm.userInput.selectedTopic.link.match(this.vm.youtubeIdMatcher)[1];
    }

    onReady(event: any) {
        this.vm.stateKeeper.isIFrameLoading = false;
    }
}