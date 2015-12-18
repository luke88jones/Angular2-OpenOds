import {Http, Response} from 'angular2/http';
import {Injectable} from 'angular2/core'

@Injectable()
export class SearchService {
    private http;
    private offset: number = 0;
    private limit: number = 10;
    
    constructor(
        http: Http
    ) {
        this.http = http;
    }   
    
    search(searchString: string) {
        return this.http.get(`http://www.openods.co.uk/api/organisations/search/${searchString}`);            
    }
    
    getOrg(odsCode: string) {
        return this.http.get(`http://www.openods.co.uk/api/organisations/${odsCode}`);
    }

}