import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
<<<<<<< HEAD
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
=======
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
>>>>>>> main
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2FlatpickrModule,
<<<<<<< HEAD
    CoreModule,
    SharedModule,
=======
>>>>>>> main
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [
<<<<<<< HEAD
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
=======
>>>>>>> main
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {
        duration: 2500,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      }
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
