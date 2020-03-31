
import {SetClassLayoutComponent} from './set-class-layout.component';

export class SetClassLayoutServiceAdapter {

    vm: SetClassLayoutComponent;

    constructor() {}

    initializeAdapter(vm: SetClassLayoutComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

    	let request_layout_data = {
        	'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
    	};

    	let request_class_layout_data = {
        	'parentLayout__parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentLayout__parentSchool': this.vm.user.activeSchool.dbId,
    	};

    	Promise.all([
    		this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout, request_layout_data),
    		this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.class_layout, request_class_layout_data),
    		this.vm.classService.getObjectList(this.vm.classService.classs,{})
		]).then(
			value=>{
				this.vm.layoutList = value[0];
				this.vm.classLayoutList = value[1];
				this.vm.classList = value[2];
				this.vm.isLoading = false;
			},
			error=>{
				this.vm.isLoading = false;
			}
		);
    }

    updateClassLayout(classs, event, index){
    	
    	let service_list = [];
    	let layout = event.value;
    	

    	let classLayout = this.vm.classLayoutList.find(item=>{
    		return item.parentClass == classs.id;
    	});

        if(layout == 0 && classLayout == undefined){
            return;
        }

        let element = document.getElementById('updating-class-'+index);
        element.classList.add('fieldChanged');
    	event.source.disabled = 'true';
        
    	if(classLayout != undefined){
            if(layout == 0){
                service_list.push(this.vm.customReportCardService.deleteObject(this.vm.customReportCardService.class_layout, classLayout));
            }else{
        		classLayout.parentLayout = layout.id;
        		service_list.push(this.vm.customReportCardService.updateObject(this.vm.customReportCardService.class_layout, classLayout));
            }
    	}
    	else{

    		let request_class_layout_create_data = {
    			'parentLayout':layout.id,
    			'parentClass':classs.id,
    		};
    		service_list.push(this.vm.customReportCardService.createObject(this.vm.customReportCardService.class_layout, request_class_layout_create_data));
    	}

    	Promise.all(service_list).then(
    		value=>{

    			if(classLayout == undefined){
    				this.vm.classLayoutList.push(value[0]);
    			}else{
                    
                    if(layout == 0){
                        this.vm.classLayoutList = this.vm.classLayoutList.filter(item=>{
                            return classLayout.id != item.id;
                        });
                    }
                    else{
        				this.vm.classLayoutList.forEach(item=>{
        					if(item.id == value[0].id){
        						item.parentLayout == value[0].parentLayout;
        					}
        				});
                    }

    			}
				event.source.disabled = 'false';
                element.classList.remove('fieldChanged');
    		},
    		error=>{
    		}
		);
    }

}
