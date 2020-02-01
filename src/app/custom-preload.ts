
import { of as observableOf, Observable } from 'rxjs';
import { Route } from '@angular/router';
import { PreloadingStrategy } from '@angular/router';
import {DataStorage} from './classes/data-storage';

export class CustomPreload implements PreloadingStrategy {
    preload(route: Route, load: Function): Observable<any> {
        console.log(route.path+' - '+route.data);
        if (route.path === 'user-settings' || route.path === 'notification') {
            console.log(true);
            return load();
        }
        let user = DataStorage.getInstance().getUser();
        let result = false;
        if (route.data && route.data.moduleName) {
            if(user.schoolList.find(school => {
                    return school.moduleList.find(module => {
                        return module.path == route.data.moduleName && module.taskList.find(task => {
                            return task.path == route.path;
                        });
                    }) || (school.studentList.length > 0 && route.data.moduleName === 'parent');
                })) {
                result = true;
            }
        } else {
            if(user.schoolList.find(school => {
                    return school.moduleList.find(module => {
                        return module.path == route.path;
                    }) || (school.studentList.length > 0 && route.path === 'parent');
                })) {
                result = true;
            }
        }
        // return result ? timer(10000).pipe(flatMap( _ => load())) : observableOf(null);
        console.log(result);
        return result ? load() : observableOf(null);
    }
}