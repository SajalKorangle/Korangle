import { environment } from '../../../../environments/environment';
import { Constants } from '../../../classes/constants';

const ERROR_REPORTING_URL = '/errors/report-error';

export const ERROR_SOURCES = [
    'REST_API_SOURCE',
    'JAVASCRIPT_SOURCE'
]

export function reportError(errorSource: string, url: string, description: string = '', prompt: string = '', flatal:boolean=false) {
    const body = { errorSource, url, description, prompt, flatal };
    setTimeout(() => {
        fetch(environment.DJANGO_SERVER + Constants.api_version + ERROR_REPORTING_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(response => {
            console.log('Error Report Sent');
        }, error => {
            console.log('Failed To Send Error Report : ', console.error())
        });
    });
}