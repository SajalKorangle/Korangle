import {Component, OnInit} from '@angular/core';
import {isMobile} from 'app/classes/common.js';
import {SettingsServiceAdapter} from './settings.service.adapter';
import {TutorialsService} from '../../../../services/modules/tutorials/tutorials.service';
import {DataStorage} from '../../../../classes/data-storage';
import {ChoiceWithIndices} from '@flxng/mentions';

interface User {
  id: number;
  name: string;
}


@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    providers: [TutorialsService],
})
export class SettingsComponent implements OnInit {
    serviceAdapter: SettingsServiceAdapter;
    user: any;
    isLoading: any;

    text = ``;
    loading = false;
    choices: User[] = [];
    mentions: ChoiceWithIndices[] = [];

    sentUpdateList = ['NULL', 'SMS', 'NOTIFICATION', 'NOTIF./SMS'];

    sentUpdateType: any;
    sendCreateUpdate: any;
    sendEditUpdate: any;
    sendDeleteUpdate: any;

    previousSettings: any;

    items = ['hello', 'hi', 'bye'];

    constructor(public tutorialService: TutorialsService) {
    }

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new SettingsServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    getSentUpdateTypeIndex(sentType: any) {
        if (sentType == 'NULL') {
            return 0;
        }
        if (sentType == 'SMS') {
            return 1;
        }
        if (sentType == 'NOTIFICATION') {
            return 2;
        }
        if (sentType == 'NOTIF./SMS') {
            return 3;
        }
    }

    isSettingsChanged(): boolean {
        return !(
            this.previousSettings.sentUpdateType == this.getSentUpdateTypeIndex(this.sentUpdateType) + 1 &&
            this.previousSettings.sendCreateUpdate == this.sendCreateUpdate &&
            this.previousSettings.sendEditUpdate == this.sendEditUpdate &&
            this.previousSettings.sendDeleteUpdate == this.sendDeleteUpdate
        );
    }


    isMobile(): boolean {
        return isMobile();
    }

    async loadChoices(searchTerm: string): Promise<User[]> {
    const users = await this.getUsers();

    this.choices = users.filter((user) => {
      const alreadyExists = this.mentions.some((m) => m.choice.name === user.name);
      return !alreadyExists && user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

    return this.choices;
  }

  getChoiceLabel = (user: User): string => {
    return `@${user.name}`;
  }

  onSelectedChoicesChange(choices: ChoiceWithIndices[]): void {
    this.mentions = choices;
    console.log('mentions:', this.mentions);
  }

  onMenuShow(): void {
    console.log('Menu show!');
  }

  onMenuHide(): void {
    console.log('Menu hide!');
    this.choices = [];
  }

  async getUsers(): Promise<User[]> {
    this.loading = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.loading = false;
        resolve([
          {
            id: 1,
            name: 'Amelia',
          },
          {
            id: 2,
            name: 'Doe',
          },
          {
            id: 3,
            name: 'John Doe',
          },
          {
            id: 4,
            name: 'John J. Doe',
          },
          {
            id: 5,
            name: 'John & Doe',
          },
          {
            id: 6,
            name: 'Fredericka Wilkie',
          },
          {
            id: 7,
            name: 'Collin Warden',
          },
          {
            id: 8,
            name: 'Hyacinth Hurla',
          },
          {
            id: 9,
            name: 'Paul Bud Mazzei',
          },
          {
            id: 10,
            name: 'Mamie Xander Blais',
          },
          {
            id: 11,
            name: 'Sacha Murawski',
          },
          {
            id: 12,
            name: 'Marcellus Van Cheney',
          },
          {
            id: 12,
            name: 'Lamar Kowalski',
          },
          {
            id: 13,
            name: 'Queena Gauss',
          },
        ]);
      }, 600);
    });
  }
}
