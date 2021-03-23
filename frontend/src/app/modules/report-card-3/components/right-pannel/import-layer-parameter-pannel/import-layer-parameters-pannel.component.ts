import { Component, OnInit, Input } from '@angular/core';
import { Layer} from '../../../class/constants_3';

@Component({
  selector: 'app-import-layer-parameters-pannel',
  templateUrl: './import-layer-parameters-pannel.component.html',
  styleUrls: ['./import-layer-parameters-pannel.component.css']
})
export class ImportLayerParametersPannelComponent implements OnInit {

  @Input() layer: Layer;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
    console.log('this: ', this.layer);
  }


}
