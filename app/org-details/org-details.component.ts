import { Component } from 'angular2/core';
import { NgClass, NgFor } from 'angular2/common';
import { SearchService } from '../services/search.service';
import {RouteParams, RouterLink} from 'angular2/router';
import { Organisation, Address } from "../models/organisation";

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
                                <td>{{org.last_changed}}</td>
                            </tr>
                            <tr>
                                <td>ODS code</td>
                                <td>{{org.odsCode}}</td>
                            </tr>
                            <tr>
                                <td>Operational start date</td>
                                <td>{{org.operationalStartDate}}</td>
                            </tr>
                            <tr>
                                <td>Operational end date</td>
                                <td>{{org.operationalEndDate}}</td>
                            </tr>
                            <tr>
                                <td>Legal start date</td>
                                <td>{{org.legalStartDate}}</td>
                            </tr>
                            <tr>
                                <td>Legal end date</td>
                                <td>{{org.legalEndDate}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-md-12" style="margin-top: 20px">
                <h3>Roles</h3>
                <table *ngIf="org" class="table table-stripped">
                    <thead>
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
                            <td>{{role.code}}</td>
                            <td>{{role.description}}</td>
                            <td>{{role.operationalStartDate}}</td>
                            <td>{{role.operationalEndDate}}</td>
                            <td>{{role.legalStartDate}}</td>
                            <td>{{role.legalEndDate}}</td>
                            <td [ngClass]="{ 'text-danger': org.status === 'Inactive', 'text-success': org.status === 'Active' }">{{role.status}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>                     
        </div>
    `,
    directives: [RouterLink, NgClass, NgFor],
    styleUrls: ["./app/org-details/org-details.style.css"]
})



export class OrgDetailsComponent {
    private org: Organisation;
    private addressString: string;
    
    constructor(
        searchService: SearchService,
        routeParams: RouteParams
    ) {
        var that = this;

        searchService.getOrg(routeParams.get("odsCode"))
            .subscribe(function(res) {
                that.org = res.json();
                that.addressString = that.mapAddressSingleLine(that.org.addresses[0]);
                that.loadMap();
            });
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