import {Http, Response} from 'angular2/http';
import {Injectable} from 'angular2/core';
import { ServiceUris } from "./service-uris.service";

@Injectable()
export class RoleTypesService {
    private http;    
    
    constructor(
        http: Http,
        private serviceUris: ServiceUris
    ) {
        this.http = http;
    }   
    
    getRoles () {
        return this.http
            .get(this.serviceUris.roleTypesUrl)
            .map(res => res.json())
            .map(function(res) {
                return res["role-types"].map(function(role) {
                    return {
                        name: role.name,
                        code: role.code
                    };
                });
            });       
    }
}