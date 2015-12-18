import {Component} from 'angular2/core';
import { SearchService } from '../search.service';
import {RouteParams, RouterLink} from 'angular2/router';

@Component({
    selector: "org-details",
    template: `
        <div>
            <button [routerLink]="['Search']">Back</button>
        </div>
        <div>
            <p>{{org | json}}
        </div>
    `,
    directives: [RouterLink]    
})

export class OrgDetailsComponent {
    private org: any;
    constructor (
        searchService: SearchService,
        routeParams: RouteParams
    ) {
        var that = this;
        searchService.getOrg(routeParams.get("odsCode"))
            .subscribe(res => that.org = res.json());
    }
}