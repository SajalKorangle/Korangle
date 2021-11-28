import {AddTutorialComponent} from '@modules/tutorials/pages/add-tutorial/add-tutorial.component';
import {ModalVideoComponent} from '@basic-components/modal-video/modal-video.component';

export class AddTutorialHtmlRenderer {

    vm: AddTutorialComponent;
    orderNoRegex = /^(([0-9]{1,5})(\.[0-9]{1})?)$/;

    constructor() {
    }


    initializeAdapter(vm: AddTutorialComponent): void {
        this.vm = vm;
    }

    getVideoUrlId() {
        return this.vm.userInput.newTutorial.link.match(this.vm.youtubeIdMatcher)[1];
    }

    onReady(event: any) {
        this.vm.stateKeeper.isIFrameLoading = false;
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

    showPreviewVideo(tutorial: any): void {
        this.vm.dialog.open(ModalVideoComponent, {
            height: '80vh',
            width: '80vw',
            data: {
                videoUrl: 'https://youtube.com/embed/' + tutorial.link.match(this.vm.youtubeIdMatcher)[1],
            },
        });
    }

    topicAlreadyPresent(tutorial): boolean {
        let ownIdx = -1;
        if (tutorial != undefined && tutorial.chapter != null && tutorial.topic != null) {
            ownIdx = this.vm.tutorialList.findIndex((tempTutorial) => tutorial.id === tempTutorial.id);
            for (let i = 0; i < this.vm.tutorialList.length; i++) {
                let temp = this.vm.tutorialList[i];
                if (temp.chapter === tutorial.chapter && temp.topic === tutorial.topic.trim() && i != ownIdx) return true;
            }
        }
        return false;
    }

    youTubeLinkValid(): boolean {
        const tutorial = this.vm.userInput.newTutorial;

        if (!tutorial.link || tutorial.link.trim() == '') {
            this.vm.stateKeeper.isIFrameLoading = true;
            return false;
        }

        if (this.vm.youtubeRegex.test(tutorial.link.trim())) {
            if (tutorial.link.startsWith('www.')) {
                tutorial.link = 'https://' + tutorial.link;
            }
            return tutorial.link.match(this.vm.youtubeIdMatcher) !== null;
        } else {
            this.vm.stateKeeper.isIFrameLoading = true;
            return false;
        }
    }

    checkEnableAddButton(): boolean {
        const tutorial = this.vm.userInput.newTutorial;

        return !(!tutorial.chapter ||
            tutorial.chapter.trim() == '' ||
            !tutorial.topic ||
            tutorial.topic.trim() == '' ||
            this.topicAlreadyPresent(tutorial) ||
            !this.youTubeLinkValid() || !this.orderNoRegex.test(tutorial.orderNumber));
    }

    subjectsExist() {
        return  this.vm.classSectionSubjectList.length > 0;
    }


}