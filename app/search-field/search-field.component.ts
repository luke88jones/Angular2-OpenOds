import {Component} from "angular2/core";
import {NgFor, NgIf, FORM_DIRECTIVES, Control} from 'angular2/common';
import {Response} from 'angular2/http';
import { RouterLink } from 'angular2/router';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import {SearchService} from '../services/search.service'
import { LoadingComponent } from "../loading/loading.component";

@Component({
    selector: "search-field",
    templateUrl: "./app/search-field/search-field.template.html",
    directives: [NgFor, NgIf, RouterLink, FORM_DIRECTIVES, LoadingComponent]
})

export class SearchFieldComponent {
    private searchString: Control;
    private searchResults: any;
    private offset: number = 0;
    private limit: number = 10;
    private canPageForward: boolean;
    private viewedTotal: number = 0;
    private loading: boolean = false;

    constructor(
        private searchService: SearchService
    ) {
        var that = this;
        this.searchString = new Control('');

        this.searchString.valueChanges
            .debounceTime(300)
            .do(function () {
                that.loading = true;
            })
            .switchMap((val: string) => searchService.search(val, 0, this.limit))
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

    search() {
        var that = this;
        that.searchService.search(that.searchString.value, that.offset, that.limit)
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