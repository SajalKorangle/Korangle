import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'localDate' })
export class LocalDatePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}
    transform(dateString: string) {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    }
}
