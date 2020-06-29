import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { RouterModule } from "@angular/router";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CustomInputComponent } from "./custom-input/custom-input.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatInputModule} from '@angular/material/input';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { QueryParamSyncModule } from "./query-param-sync/query-param-sync.module";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    QueryParamSyncModule
  ],
  declarations: [
    AppComponent,
    CustomInputComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
