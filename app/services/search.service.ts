import {Http, Response} from 'angular2/http';
import {Injectable} from 'angular2/core';
import { ServiceUris } from "./service-uris.service";

@Injectable()
export class SearchService {
    private http;
    
    constructor(
        http: Http,
        private serviceUris: ServiceUris
    ) {
        this.http = http;
    }   
    
    search(searchString: string, start: number, count: number, roleCode?: string) {
        if (roleCode) {
            return this.http
                .get(`${this.serviceUris.organisationsUrl}?q=${searchString}&offset=${start}&limit=${count}&roleCode=${roleCode}`);                                    
        } else {
            return this.http
                .get(`${this.serviceUris.organisationsUrl}?q=${searchString}&offset=${start}&limit=${count}`);                        
        }
    }
    
    getOrg(odsCode: string) {
        return this.http
            .get(`${this.serviceUris.organisationsUrl}/${odsCode}`)
            .map(res => res.json());;
    }

}