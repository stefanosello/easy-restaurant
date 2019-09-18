import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';

import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatSidenavModule,
  MatSelectModule, MatListModule, MatTabsModule, MatExpansionModule, MatSnackBarModule
} from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

const modules = [
  CommonModule,
  MatToolbarModule,
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatDialogModule,
  MatTableModule,
  MatMenuModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSelectModule,
  MatListModule,
  MatTabsModule,
  MatExpansionModule,
  MatSnackBarModule,
  MatAutocompleteModule
]

@NgModule({
  declarations: [],
  imports: [modules],
  exports: [modules],

})
export class MaterialModule { }

