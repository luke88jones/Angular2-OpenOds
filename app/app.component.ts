import {Component} from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';

import { DashboardComponent } from "./dashboard/dashboard.component";
import { SearchFieldComponent } from './search-field/search-field.component';
import { OrgDetailsComponent } from './org-details/org-details.component';

@Component ({
    selector: 'open-ods',
    template: `
        <h1>Hello World</h1>
        <router-outlet></router-outlet>
    `,
    directives: [SearchFieldComponent, RouterOutlet]  
})
@RouteConfig([
    { path: "/", name: "Dashboard", component: DashboardComponent},
    { path: "/search", name: "Search", component: SearchFieldComponent},
    { path: "/details/:odsCode", name: "OrgDetails", component: OrgDetailsComponent }    
])

export class AppComponent {
    
}