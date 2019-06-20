import { AbstractControl } from '@angular/forms';
import { TableService } from '../_services/table.service';
import { map } from 'rxjs/operators';

export class ValidateTableNumberNotTaken {
  static createValidator(tableService: TableService) {
    return (control: AbstractControl) => {
      return tableService.isTableAlreadyPresent(control.value).pipe(
        map((res:any) => {
          return res.tableFound == false ? null : { tableNumberTaken: true };
        })
      );
    }
  }
}