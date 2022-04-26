import { Component, Input  } from '@angular/core';
import * as _ from 'lodash';
import { APIErrors } from '../../../providers/models/errors.model';

@Component({
  selector: 'app-list-errors',
  templateUrl: './list-errors.component.html',
  styleUrls: ['./list-errors.component.scss']
})
export class ListErrorsComponent {

  formattedErrors: Array<string> = [];
  
    @Input()
    set errors(errorList: APIErrors) {
      this.formattedErrors = [];
      if (!_.isEmpty(errorList.nonFieldErrors)) {
        this.formattedErrors.push(errorList.nonFieldErrors.toString());
        console.log("formattedErrors", this.formattedErrors);
      }
    };
  
    get errorList() { return this.formattedErrors; }

}
