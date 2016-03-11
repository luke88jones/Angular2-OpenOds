import {Component, OnInit} from "angular2/core";
import {NgFor, NgIf, FORM_DIRECTIVES, Control} from 'angular2/common';
import {Response} from 'angular2/http';
import { RouterLink } from 'angular2/router';

import {SearchService} from '../services/search.service';
import { RoleTypesService } from '../services/role-types.service';
import { LoadingComponent } from "../loading/loading.component";

@Component({
    selector: "search-field",
    templateUrl: "./app/search-field/search-field.template.html",
    directives: [NgFor, NgIf, RouterLink, FORM_DIRECTIVES, LoadingComponent],
    styleUrls: ["./app/search-field/search-field.style.css"]
})

export class SearchFieldComponent implements OnInit {
    private searchString: Control;
    private offset: number = 0;
    private limit: number = 10;
    private viewedTotal: number = 0;
    canPageForward: boolean;
    loading: boolean = false;
    searchResults: any;
    roleType: string;
    roleTypes: any[];

    constructor(
        private searchService: SearchService,
        private roleTypesService: RoleTypesService
    ) {
        var that = this;
        this.searchString = new Control('');    
        this.roleTypes = [];    

        this.searchString.valueChanges
            .debounceTime(300)
            .do(function () {
                that.loading = true;
                console.log(that.roleType);
            })
            .switchMap((val: string) => searchService.search(val, 0, this.limit, this.roleType))
            .catch(function(err, source, caught) {
                that.loading = false;
                console.log(err);
                return source;
            })
            .subscribe(
                (res:Response) => that.searchResultsHandler(res),
                err => that.searchResultsErrorHandler(err)              
            );
    }
    
    ngOnInit() {
        this.getRoleTypes();
    }
    
    private getRoleTypes() {
        var that = this;
        this.roleTypesService.getRoles()
            .subscribe(function(roles) {
                that.roleTypes = roles;
            });
    }

    private searchResultsHandler(res: Response) {
        var that = this;
        let total = Number(res.headers.get("X-Total-Count"));
        that.canPageForward = (total > that.offset + that.limit);
        that.searchResults = res.json().organisations;
        that.loading = false;
    }
    
    private searchResultsErrorHandler (err) {
        this.loading = false;
        console.log(err);
    }
    
    roleUpdated(value) {
        this.roleType = value;
        if (this.searchString.value){
            this.search();           
        }
    }

    search() {
        var that = this;
        that.searchService.search(that.searchString.value, that.offset, that.limit, that.roleType)
            .do(function() {
                that.loading = true;
            })
            .subscribe(
                (res:Response) => that.searchResultsHandler(res),
                err => that.searchResultsErrorHandler(err)
            );
    }

    nextPage() {
        this.offset = this.offset + this.limit;
        this.search();
    }

    previousPage() {
        this.offset = this.offset - this.limit;
        this.search();
    }
}