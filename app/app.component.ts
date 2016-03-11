import {Component} from 'angular2/core';
import {RouteConfig , RouterOutlet, RouterLink} from 'angular2/router';

import { DashboardComponent } from "./dashboard/dashboard.component";
import { SearchFieldComponent } from './search-field/search-field.component';
import { OrgDetailsComponent } from './org-details/org-details.component';
import 'rxjs/Rx';

@Component ({
    selector: 'open-ods',
    templateUrl: "./app/app.template.html",
    directives: [SearchFieldComponent, RouterOutlet, RouterLink],
    styleUrls: ["./app/app.style.css"]
})
// { path: "/", name: "Dashboard", component: DashboardComponent },
@RouteConfig([
    { path: "/", name: "Search", component: SearchFieldComponent, useAsDefault: true},
    { path: "/details/:odsCode", name: "OrgDetails", component: OrgDetailsComponent }    
])

export class AppComponent {}