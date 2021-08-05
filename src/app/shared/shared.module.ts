import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ZeroStateComponent } from './zero-state/zero-state.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MandatoryErrorMessageComponent } from './mandatory-error-message/mandatory-error-message.component';
import { MandatoryFieldComponent } from './mandatory-field/mandatory-field.component';



@NgModule({
  declarations: [
    LoaderComponent,
    ZeroStateComponent,
    MandatoryErrorMessageComponent,
    MandatoryFieldComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MatButtonModule
  ],
  exports: [
    LoaderComponent,
    ZeroStateComponent,
    MandatoryErrorMessageComponent,
    MandatoryFieldComponent
  ]
})
export class SharedModule { }
