import {Http, Response} from 'angular2/http';
import {Injectable} from 'angular2/core'

@Injectable()
export class SearchService {
    private http;
    
    constructor(
        http: Http
    ) {
        this.http = http;
    }   
    
    search(searchString: string, start: number, count: number) {
        return this.http.get(`http://test.openods.co.uk/api/organisations?q=${searchString}&offset=${start}&limit=${count}`);            
    }
    
    getOrg(odsCode: string) {
        return this.http.get(`http://test.openods.co.uk/api/organisations/${odsCode}`);
    }

}