import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from 'src/app/core/services/settings.service';
import { MappingsService } from 'src/app/core/services/mappings.service';

@Component({
  selector: 'app-xero-callback',
  templateUrl: './xero-callback.component.html',
  styleUrls: ['./xero-callback.component.scss']
})
export class XeroCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mappingsService: MappingsService,
    private settingsService: SettingsService) { }

  ngOnInit() {
    const that = this;
    const workspaceId: number = that.route.snapshot.queryParams.state;
    const xeroCode: string = that.route.snapshot.queryParams.code;
    that.settingsService.connectXero(workspaceId, {code: xeroCode}).subscribe(() => {
      this.mappingsService.postXeroTenants().subscribe(response => {
        that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`);
      });
    });
  }

}
