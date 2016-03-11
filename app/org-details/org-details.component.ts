import { Component, OnInit } from 'angular2/core';
import { NgClass, NgFor } from 'angular2/common';
import { SearchService } from '../services/search.service';
import { RouteParams, RouterLink} from 'angular2/router';
import { Organisation, Address, Successor } from "../models/organisation";
import { Observable } from "rxjs/Observable";

// Placeholder for Google maps api
declare var google: any;

@Component({
    selector: "org-details",
    template: `
        <div class="container">
            <div>
                <button class="btn btn-default" [routerLink]="['Search']">
                    <i class="glyphicon glyphicon-chevron-left"></i>
                    Back
                </button>
            </div>
            <div *ngIf="org" class="col-md-12">
                <h2>
                    {{ org.name }}
                    <small [ngClass]="{ 'text-danger': org.status === 'Inactive', 'text-success': org.status === 'Active' }">
                        {{ org.status }}
                    </small>
                </h2>                 
            </div>
            <div class="col-md-12">
                <div id="map" class="col-md-6"></div>
                <div *ngIf="org" class="col-md-6">
                    <table class="table table-striped">
                        <tbody>
                            <tr>
                                <td>Last updated</td>
                                <td>{{org.last_changed | date : "EEE dd-MMM-y"}}</td>
                            </tr>
                            <tr>
                                <td>ODS code</td>
                                <td>{{org.odsCode}}</td>
                            </tr>
                            <tr>
                                <td>Operational start date</td>
                                <td>{{org.operationalStartDate | date : "EEE dd-MMM-y"}}</td>
                            </tr>
                            <tr>
                                <td>Operational end date</td>
                                <td>{{org.operationalEndDate | date : "EEE dd-MMM-y"}}</td>
                            </tr>
                            <tr>
                                <td>Legal start date</td>
                                <td>{{org.legalStartDate | date : "EEE dd-MMM-y"}}</td>
                            </tr>
                            <tr>
                                <td>Legal end date</td>
                                <td>{{org.legalEndDate | date : "EEE dd-MMM-y"}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-md-12" style="margin-top: 20px">
                <h3>Roles</h3>
                <p *ngIf="org && org.roles.length === 0">No known roles</p>
                <table *ngIf="org && org.roles.length > 0" class="table table-stripped">
                    <thead>
                        <th></th>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Operational start date</th>
                        <th>Operational end date</th>
                        <th>Legal start date</th>
                        <th>Legal end date</th>
                        <th>Status</th>
                    </thead>
                    <tbody>
                        <tr *ngFor="#role of org.roles">
                            <td>
                                <i style="color: #337ab7;" *ngIf="role.primaryRole" class="glyphicon glyphicon-ok-circle" title="Primary role"></i>
                            </td>
                            <td>{{role.code}}</td>
                            <td>{{role.description}}</td>
                            <td>{{role.operationalStartDate | date : "EEE dd-MMM-y"}}</td>
                            <td>{{role.operationalEndDate | date : "EEE dd-MMM-y"}}</td>
                            <td>{{role.legalStartDate | date : "EEE dd-MMM-y"}}</td>
                            <td>{{role.legalEndDate | date : "EEE dd-MMM-y"}}</td>
                            <td [ngClass]="{ 'text-danger': role.status === 'Inactive', 'text-success': role.status === 'Active' }">{{role.status}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>                     
            <div class="col-md-12" style="margin-top: 20px">
                <h3>Successors</h3>
                <div *ngIf="!resolvingSuccessors">
                    <p *ngIf="org && org.successors.length === 0">No known successors</p>
                    <table *ngIf="org && org.successors.length > 0" class="table table-stripped">
                        <thead>
                            <th>Ods Code</th>
                            <th>Type</th>
                            <th>Name</th>
                        </thead>
                        <tbody>
                            <tr *ngFor="#successor of org.successors" class="link" [routerLink]="['OrgDetails', { odsCode: successor.targetOdsCode}]" >
                                <td>{{successor.targetOdsCode}}</td>
                                <td>{{successor.type}}</td>
                                <td>{{successor.targetName}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-md-12" style="margin-top: 20px">
                <h3>Relationships</h3>
                <p *ngIf="org && org.relationships.length === 0">No known roles</p>
                <table *ngIf="org && org.relationships.length > 0" class="table table-stripped">
                    <thead>
                        <th>ODS Code</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Operational start date</th>
                        <th>Operational end date</th>
                        <th>Legal start date</th>
                        <th>Legal end date</th>
                        <th>Status</th>
                    </thead>
                    <tbody>
                        <tr *ngFor="#relationship of org.relationships" class="link" [routerLink]="['OrgDetails', { odsCode: relationship.relatedOdsCode}]" >                            
                            <td>{{relationship.relatedOdsCode}}</td>
                            <td>{{relationship.relatedOrganisationName}}</td>
                            <td>{{relationship.description}}</td>
                            <td>{{relationship.operationalStartDate | date : "EEE dd-MMM-y"}}</td>
                            <td>{{relationship.operationalEndDate | date : "EEE dd-MMM-y"}}</td>
                            <td>{{relationship.legalStartDate | date : "EEE dd-MMM-y"}}</td>
                            <td>{{relationship.legalEndDate | date : "EEE dd-MMM-y"}}</td>
                            <td [ngClass]="{ 'text-danger': relationship.status === 'Inactive', 'text-success': relationship.status === 'Active' }">{{relationship.status}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>                      
        </div>
    `,
    directives: [RouterLink, NgClass, NgFor],
    styleUrls: ["./app/org-details/org-details.style.css"]
})



export class OrgDetailsComponent implements OnInit {
    private org: Organisation;
    private addressString: string;
    private resolvingSuccessors: boolean;
    
    constructor(
        private searchService: SearchService,
        private routeParams: RouteParams
    ) {}
    
    ngOnInit() {
        var that = this;

        that.searchService.getOrg(that.routeParams.get("odsCode"))
            .subscribe(function(response) {
                let orgData: Organisation = response;
                orgData = that.stringsToDates(orgData);
                
                orgData.roles.forEach(function(role) {
                    role = that.stringsToDates(role);
                });
                
                orgData.relationships.forEach(function(relationship) {
                    relationship = that.stringsToDates(relationship);
                });
                
                that.org = orgData;
                that.addressString = that.mapAddressSingleLine(that.org.addresses[0]);
                that.loadMap();
            },
            err => console.log(err));
    }
    
    private stringsToDates(value) {
        if (value.hasOwnProperty("last_changed")) {
            value["last_changed"] = new Date(value["last_changed"]);
        }
        if (value.hasOwnProperty("operationalStartDate")) {
            value["operationalStartDate"] = new Date(value["operationalStartDate"]);
        }
        if (value.hasOwnProperty("operationalEndDate")) {
            value["operationalEndDate"] = new Date(value["operationalEndDate"]);
        }
        if (value.hasOwnProperty("legalStartDate")) {
            value["legalStartDate"] = new Date(value["legalStartDate"]);
        }
        if (value.hasOwnProperty("legalEndDate")) {
            value["legalEndDate"] = new Date(value["legalEndDate"]);
        }
        
        return value;
    }
    
    private mapAddressSingleLine(address: Address) {
        let addressLines = address.addressLines.join(", ");
        return ''.concat(addressLines, ", ", address.postalCode);
    }
        
    private generateInfoWindow (address: Address) {        
        let that = this;
        let addressLines = address.addressLines;
        if (address.town) {
            addressLines.push(address.town);
        }
        if (address.county) {
            addressLines.push(address.county);
        }
        if (address.postalCode) {
            addressLines.push(address.postalCode);
        }
        if (address.country) {
            addressLines.push(address.country);
        }
        
        let addressHtml = "";
        addressLines.forEach(function(line) {
            addressHtml += `<li>${line}</li>`;
        });
        
        return `
            <div class="info-window">
                <strong>${that.org.name}</strong>
                <ul>
                    ${addressHtml}
                </ul>
            </div>
        `;
    }

    private loadMap() {
        var that = this;
        var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 53.6712816, lng: -2.4449743 },
            zoom: 17
        });

        var geocoder = new google.maps.Geocoder();
        
        that.geocodeAddress(geocoder, map);
    }

    private geocodeAddress(geocoder, resultsMap) {
        let that = this;
        let address = this.addressString;
        geocoder.geocode({ 'address': address }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                resultsMap.setCenter(results[0].geometry.location);
                
                var infowindow = new google.maps.InfoWindow({
                    content: that.generateInfoWindow(that.org.addresses[0])
                });
                
                var marker = new google.maps.Marker({
                    map: resultsMap,
                    position: results[0].geometry.location,
                    animation: google.maps.Animation.DROP,
                    title: that.org.name
                });
                
                // Add listener for future clicks 
                marker.addListener("click", function() {
                    infowindow.open(resultsMap, marker);    
                });
                // Open window immediately 
                infowindow.open(resultsMap, marker);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}