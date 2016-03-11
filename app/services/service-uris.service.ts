import {Injectable} from 'angular2/core';

@Injectable()
export class ServiceUris {
    private baseUrl: string;
    public roleTypesUrl: string;
    public organisationsUrl: string;
    
    constructor() {
        this.baseUrl = "http://test.openods.co.uk/api";
        this.roleTypesUrl = `${this.baseUrl}/role-types`;
        this.organisationsUrl = `${this.baseUrl}/organisations`;
    }
}