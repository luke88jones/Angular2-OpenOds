import {Component} from "angular2/core";
import {NgFor, NgIf} from 'angular2/common';
import {Response} from 'angular2/http';
import {SearchService} from '../search.service'
import { RouterLink } from 'angular2/router';

@Component({
    selector: "search-field",
    template:   `
                <input type="text" [(ngModel)]="searchString" />
                <button (click)="search()">Search</button>
                <div *ngIf="searchResults"> 
                    <ul>
                        <li *ngFor="#org of searchResults.organisations" [routerLink]="['OrgDetails', { odsCode: org.odsCode}]">
                            {{org.name}}
                        </li>
                    </ul>
                </div>                
                `,
    directives: [NgFor, NgIf, RouterLink]
})

export /**
 * SearchFieldComponent
 */
class SearchFieldComponent {
    private searchString: string;
    private searchResults: any;
    private offset: number = 0;
    private limit: number = 10;
    
    constructor(
        private searchService: SearchService
    ) {
    }   
    
    
    
    search() {
        var that = this;
        
        that.searchService.search(that.searchString)            
            .subscribe(function(res: Response) {                
                that.searchResults = res.json();
            });
    }
    
    // onKey(value) {
    //     console.log(value);
                    
    // }    
}