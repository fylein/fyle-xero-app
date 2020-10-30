import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const baseModuleRoutes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(
      baseModuleRoutes
    )
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
