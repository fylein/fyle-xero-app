import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ZeroStateComponent } from './zero-state/zero-state.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    LoaderComponent,
    ZeroStateComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    MatButtonModule
  ],
  exports: [
    LoaderComponent,
    ZeroStateComponent
  ]
})
export class SharedModule { }
