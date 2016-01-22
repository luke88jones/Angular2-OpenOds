import {Component} from "angular2/core";
import {RouterLink} from 'angular2/router';

@Component({
    template: `
        <div class="container">
            <ul class="link">
                <li [routerLink]="['Search']">Search</li>
            </ul>
        </div>
    `,
    directives: [RouterLink]
})

export class DashboardComponent {}