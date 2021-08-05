import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/core/services/settings.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { pairwise } from 'rxjs/internal/operators/pairwise';
import { ScheduleSettings } from 'src/app/core/models/schedule-settings.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss', '../../xero.component.scss']
})
export class ScheduleComponent implements OnInit {
  form: FormGroup;
  workspaceId: number;
  isLoading = false;
  hours = [...Array(24).keys()].map(day => day + 1);
  settings: ScheduleSettings;
  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  getSettings() {
    const that = this;
    that.isLoading = true;
    that.settingsService.getSettings(that.workspaceId).subscribe((settings: ScheduleSettings) => {
      that.settings = settings;
      that.form.setValue({
        hours: settings.interval_hours,
        scheduleEnabled: settings.enabled
      });
      that.isLoading = false;
    }, (error) => {
      that.isLoading = false;
    });
  }

  submit() {
    const that = this;

    const hours = this.form.value.hours;
    const scheduleEnabled = this.form.value.scheduleEnabled;

    that.isLoading = true;
    that.settingsService.postSettings(that.workspaceId, hours, scheduleEnabled).subscribe(response => {
      that.isLoading = false;
      that.snackBar.open('Scheduling saved');
      that.getSettings();
    });
  }


  ngOnInit() {
    const that = this;
    that.workspaceId = +that.route.parent.snapshot.params.workspace_id;
    that.form = that.formBuilder.group({
      hours: ['', Validators.required],
      scheduleEnabled: [false]
    });

    that.form.controls.scheduleEnabled.valueChanges.pipe(
      distinctUntilChanged(),
      pairwise()
    ).subscribe(([oldValue, newValue]) => {
      if (!newValue && oldValue !== newValue) {
        if (that.settings) {
          that.isLoading = true;
          that.settingsService.postSettings(that.workspaceId, 0, false).subscribe(() => {
            that.isLoading = false;
            that.snackBar.open('Scheduling turned off');
            that.getSettings();
          });
        }
      }
    }, () => {
      that.snackBar.open('Something went wrong');
    });

    that.getSettings();
  }

}
