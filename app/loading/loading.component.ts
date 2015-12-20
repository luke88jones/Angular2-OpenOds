import { Component } from "angular2/core";
import { NgIf } from "angular2/common";

@Component({
    selector: "loading",
    templateUrl: "./app/loading/loading.template.html",
    styleUrls: ["./app/loading/loading.style.css"],
    inputs: ["loading"],
    directives: [ NgIf ] 
})

export class LoadingComponent {
     public loading: boolean = false;
          
}