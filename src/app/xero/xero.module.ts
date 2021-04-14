import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XeroRoutingModule } from './xero-routing.module';
import { XeroComponent } from './xero.component';

import { ExpenseGroupsComponent } from './expense-groups/expense-groups.component';
import { ViewExpenseGroupComponent } from './expense-groups/view-expense-group/view-expense-group.component';
import { SettingsComponent } from './settings/settings.component';
import { FyleCallbackComponent } from './settings/fyle-callback/fyle-callback.component';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InfoComponent } from './expense-groups/view-expense-group/info/info.component';
import { GroupMappingErrorComponent } from './expense-groups/view-expense-group/group-mapping-error/group-mapping-error.component';
import { SyncExportComponent } from './sync-export/sync-export.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SyncComponent } from './sync-export/sync/sync.component';
import { ExportComponent } from './sync-export/export/export.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { GeneralMappingsComponent } from './settings/general-mappings/general-mappings.component';
import { ScheduleComponent } from './settings/schedule/schedule.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { XeroConfigurationsComponent } from './settings/xero-configurations/xero-configurations.component';
import { TenantComponent } from './settings/xero-configurations/tenant/tenant.component';
import { ConfigurationComponent } from './settings/xero-configurations/configuration/configuration.component';
import { ExpenseFieldConfigurationComponent } from './settings/xero-configurations/expense-field-configuration/expense-field-configuration.component';
import { ExpenseGroupSettingsDialogComponent } from './sync-export/sync/expense-group-settings-dialog/expense-group-settings-dialog.component';
import { GenericMappingsComponent } from './settings/generic-mappings/generic-mappings.component';
import { GenericMappingsDialogComponent } from './settings/generic-mappings/generic-mappings-dialog/generic-mappings-dialog.component';
import { XeroCallbackComponent } from './settings/xero-callback/xero-callback.component';
import { GroupXeroErrorComponent } from './expense-groups/view-expense-group/group-xero-error/group-xero-error.component';
import { MatTooltipModule } from '@angular/material';
import { PaginatorComponent } from './settings/paginator/paginator.component';

@NgModule({
  declarations: [
    XeroComponent,
    ExpenseGroupsComponent,
    ViewExpenseGroupComponent,
    SettingsComponent,
    FyleCallbackComponent,
    InfoComponent,
    GroupMappingErrorComponent,
    GroupXeroErrorComponent,
    SyncExportComponent,
    DashboardComponent,
    SyncComponent,
    ExportComponent,
    ConfigurationComponent,
    GeneralMappingsComponent,
    ScheduleComponent,
    XeroConfigurationsComponent,
    TenantComponent,
    ExpenseFieldConfigurationComponent,
    ExpenseGroupSettingsDialogComponent,
    GenericMappingsComponent,
    GenericMappingsDialogComponent,
    XeroCallbackComponent,
    PaginatorComponent
  ],
  entryComponents: [
    ExpenseGroupSettingsDialogComponent,
    GenericMappingsDialogComponent
  ],
  imports: [
    CommonModule,
    XeroRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    Ng2FlatpickrModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: true }
    }
  ]
})
export class XeroModule { }
