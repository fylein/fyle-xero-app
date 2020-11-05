import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SettingsService } from 'src/app/core/services/settings.service';

@Component({
  selector: 'app-fyle-callback',
  templateUrl: './fyle-callback.component.html',
  styleUrls: ['./fyle-callback.component.scss']
})
export class FyleCallbackComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private settingsService: SettingsService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const workspaceId: number = params.state;
      const code: string = params.code;
      const that = this;
      that.settingsService.connectFyle(workspaceId, code).subscribe(response => {
        if (response) {
          that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`);
        }
      }, error => {
        that.router.navigateByUrl(`workspaces/${workspaceId}/dashboard`);
      });
    });
  }
}
