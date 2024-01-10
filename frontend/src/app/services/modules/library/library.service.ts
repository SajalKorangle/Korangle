import { Injectable } from '@angular/core';

import { ServiceObject } from '../../common/service-object';

@Injectable()
export class LibraryService extends ServiceObject {

    public module_url = '/library';

    public bookRemoveImage = '/book-remove-image';
}
