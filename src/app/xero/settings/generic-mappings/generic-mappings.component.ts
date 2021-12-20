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
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-generic-mappings',
  templateUrl: './generic-mappings.component.html',
  styleUrls: ['./generic-mappings.component.scss', '../settings.component.scss', '../../xero.component.scss']
})
export class GenericMappingsComponent implements OnInit {
  workspaceId: number;
  sourceField: string;
  isLoading: boolean;
  mappings: MatTableDataSource<Mapping> = new MatTableDataSource([]);
  generalSettings: GeneralSetting;
  setting: MappingSetting;
  count: number;
  pageNumber: number;
  rowElement: Mapping;
  columnsToDisplay = ['sourceField', 'destinationField'];
  helpDocLink: string;


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

      const data = {
        pageSize: that.storageService.get('mappings.pageSize') || 50,
        pageNumber: 0
      };

      if (onboarded) {
        that.getMappings(data);
      } else {
        that.router.navigateByUrl(`workspaces/${that.workspaceId}/dashboard`);
      }
    });
  }

  applyFilter(event: Event) {
    const that = this;
    const filterValue = (event.target as HTMLInputElement).value;
    that.mappings.filter = filterValue.trim().toLowerCase();
  }

  getTitle(name: string) {
    return name.replace(/_/g, ' ');
  }

  getMappings(data) {
    const that = this;
    that.isLoading = true;
    that.mappingsService.getMappings(that.setting.source_field, data.pageSize, null, data.pageSize * data.pageNumber).subscribe(mappings => {
      that.mappings = new MatTableDataSource(mappings.results);
      that.count = mappings.count;
      that.pageNumber = data.pageNumber;
      that.mappings.filterPredicate = that.searchByText;
      that.isLoading = false;
    });
  }

  goToConfigurations() {
    this.router.navigate([`/workspaces/${this.workspaceId}/settings/configurations/general/`]);
  }


  searchByText(data: Mapping, filterText: string) {
    return data.source.value.toLowerCase().includes(filterText) ||
    data.destination.value.toLowerCase().includes(filterText);
  }

  triggerAutoMapEmployees() {
    const that = this;
    that.isLoading = true;
    that.mappingsService.triggerAutoMapEmployees().subscribe(() => {
      that.isLoading = false;
      that.snackBar.open('Auto mapping of employees may take few minutes');
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

      if (that.sourceField === 'corporate_card') {
        that.helpDocLink = 'https://help.fylehq.com/en/articles/5719985-mapping-corporate-credit-cards-in-fyle-to-a-bank-account-in-xero';
      } else {
        that.helpDocLink = 'https://www.fylehq.com/help/en/articles/4601898-onboarding-process-to-set-up-fyle-xero-integration';
      }

      forkJoin(
        [
          that.settingsService.getMappingSettings(that.workspaceId),
          that.settingsService.getGeneralSettings(that.workspaceId)
        ]
      ).subscribe(responses => {
        that.setting = responses[0].results.filter(setting => setting.source_field === that.sourceField.toUpperCase())[0];
        that.generalSettings = responses[1];

        that.isLoading = false;

        const data = {
          pageSize: that.storageService.get('mappings.pageSize') || 50,
          pageNumber: 0
        };

        that.getMappings(data);
      });
    });

  }

}
