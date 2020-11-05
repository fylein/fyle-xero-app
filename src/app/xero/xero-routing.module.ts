import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { XeroComponent } from './xero.component';
import { AuthGuard } from '../core/guard/auth.guard';
import { WorkspacesGuard } from '../core/guard/workspaces.guard';
import { ExpenseGroupsComponent } from './expense-groups/expense-groups.component';
import { ViewExpenseGroupComponent } from './expense-groups/view-expense-group/view-expense-group.component';
import { SettingsComponent } from './settings/settings.component';
import { FyleCallbackComponent } from './settings/fyle-callback/fyle-callback.component';
import { InfoComponent } from './expense-groups/view-expense-group/info/info.component';
import { GroupMappingErrorComponent } from './expense-groups/view-expense-group/group-mapping-error/group-mapping-error.component';
import { SyncExportComponent } from './sync-export/sync-export.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SyncComponent } from './sync-export/sync/sync.component';
import { ExportComponent } from './sync-export/export/export.component';
import { GeneralMappingsComponent } from './settings/general-mappings/general-mappings.component';
import { ScheduleComponent } from './settings/schedule/schedule.component';
import { ConfigurationComponent } from './settings/xero-configurations/configuration/configuration.component';
import { TenantComponent } from './settings/xero-configurations/tenant/tenant.component';
import { XeroConfigurationsComponent } from './settings/xero-configurations/xero-configurations.component';
import { ExpenseFieldConfigurationComponent } from './settings/xero-configurations/expense-field-configuration/expense-field-configuration.component';
import { GenericMappingsComponent } from './settings/generic-mappings/generic-mappings.component';
import { XeroCallbackComponent } from './settings/xero-callback/xero-callback.component';
import { GroupXeroErrorComponent } from './expense-groups/view-expense-group/group-xero-error/group-xero-error.component';

const routes: Routes = [{
  path: '',
  component: XeroComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: 'xero/callback',
      component: XeroCallbackComponent
    },
    {
      path: ':workspace_id/expense_groups',
      component: ExpenseGroupsComponent,
      canActivate: [WorkspacesGuard]
    },
    {
      path: ':workspace_id/dashboard',
      component: DashboardComponent
    },
    {
      path: ':workspace_id/sync_export',
      component: SyncExportComponent,
      canActivate: [WorkspacesGuard],
      children: [
        {
          path: 'sync',
          component: SyncComponent
        },
        {
          path: 'export',
          component: ExportComponent
        }
      ]
    },
    {
      path: ':workspace_id/expense_groups/:expense_group_id/view',
      component: ViewExpenseGroupComponent,
      canActivate: [WorkspacesGuard],
      children: [
        {
          path: 'info',
          component: InfoComponent
        },
        {
          path: 'mapping_errors',
          component: GroupMappingErrorComponent
        },
        {
          path: 'xero_errors',
          component: GroupXeroErrorComponent
        },
        {
          path: '**',
          redirectTo: 'info'
        }
      ]
    },
    {
      path: ':workspace_id/settings',
      component: SettingsComponent,
      children: [
        {
          path: 'configurations',
          component: XeroConfigurationsComponent,
          children: [
            {
              path: 'general',
              component: ConfigurationComponent
            },
            {
              path: 'tenant',
              component: TenantComponent
            },
            {
              path: 'expense_fields',
              component: ExpenseFieldConfigurationComponent
            }
          ]
        },
        {
          path: 'general/mappings',
          component: GeneralMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: ':source_field/mappings',
          component: GenericMappingsComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'schedule',
          component: ScheduleComponent,
          canActivate: [WorkspacesGuard]
        },
        {
          path: 'fyle/callback',
          component: FyleCallbackComponent
        }
      ]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XeroRoutingModule { }
