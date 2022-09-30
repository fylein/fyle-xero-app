import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
    selector: 'app-shared-login',
    templateUrl: './shared-login.component.html',
    styleUrls: ['./shared-login.component.scss']
})
export class SharedLoginComponent implements OnInit {

    constructor(
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private storageService: StorageService
    ) { }

    ngOnInit() {
        const that = this;
        if (that.authService.isLoggedIn()) {
            that.authService.logout();
        }

        this.route.queryParams.subscribe(params => {
            const localStorageDump = JSON.parse(params.local_storage_dump);
            Object.keys(localStorageDump).forEach(key => {
                this.storageService.set(key, localStorageDump[key]);
            });
        });

        this.router.navigate(['/workspaces']);
    }

}
