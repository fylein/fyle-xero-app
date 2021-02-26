import { Component, OnInit } from '@angular/core';
import { MappingsService } from '../../../core/services/mappings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/core/services/storage.service';
import { GenericMappingsDialogComponent } from './generic-mappings-dialog/generic-mappings-dialog.component';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MatSnackBar } from '@angular/material';
import { forkJoin } from 'rxjs';
import { Mapping } from 'src/app/core/models/mappings.model';
import { GeneralSetting } from 'src/app/core/models/general-setting.model';
import { MappingSetting } from 'src/app/core/models/mapping-setting.model';
import { MappingRow } from 'src/app/core/models/mapping-row.model';

@Component({
  selector: 'app-generic-mappings',
  templateUrl: './generic-mappings.component.html',
  styleUrls: ['./generic-mappings.component.scss', '../settings.component.scss', '../../xero.component.scss']
})
export class GenericMappingsComponent implements OnInit {
  workspaceId: number;
  sourceField: string;
  isLoading: boolean;
  mappings: Mapping[];
  generalSettings: GeneralSetting;
  setting: MappingSetting;
  rowElement: Mapping;
  columnsToDisplay = ['sourceField', 'destinationField'];

  constructor(private mappingsService: MappingsService, private router: Router, private route: ActivatedRoute, public dialog: MatDialog, private snackBar: MatSnackBar, private storageService: StorageService, private settingsService: SettingsService) { }

  open(selectedItem: MappingRow = null) {
    const that = this;
    const dialogRef = that.dialog.open(GenericMappingsDialogComponent, {
      width: '450px',
      data: {
        workspaceId: that.workspaceId,
        setting: that.setting,
        rowElement: selectedItem
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      const onboarded = that.storageService.get('onboarded');

      if (onboarded === true) {
        that.getMappings();
      } else {
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      }
    });
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  getMappings() {
    const that = this;
    that.mappingsService.getAllMappings(that.setting.source_field).subscribe(mappings => {
      that.mappings = mappings;
      that.isLoading = false;
    });
  }

  goToConfigurations() {
    this.router.navigate([`/workspaces/${this.workspaceId}/settings/configurations/general/`]);
  }

  triggerAutoMapEmployees() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.triggerAutoMapEmployees().subscribe(() => {
      that.isLoading = false;
      that.snackBar.open('Auto mapping of employees may take up to 10 minutes');
    }, error => {
      that.isLoading = false;
      that.snackBar.open(error.error.message);
    });
  }

  ngOnInit() {
    const that = this;
    that.route.params.subscribe(val => {
      that.isLoading = true;
      that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
      that.sourceField = that.route.snapshot.params.source_field;
      forkJoin(
        [
          that.settingsService.getMappingSettings(that.workspaceId),
          that.settingsService.getGeneralSettings(that.workspaceId)
        ]
      ).subscribe(responses => {
        that.setting = responses[0].results.filter(setting => setting.source_field === that.sourceField.toUpperCase())[0];
        that.generalSettings = responses[1];
        that.getMappings();
      });
    });

  }

}
