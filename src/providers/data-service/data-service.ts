import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataServiceProvider {

  constructor(public http: Http) {
    console.log('Hello DataServiceProvider Provider');
  }
  getMenus(){
	  return this.http.get('assets/data/menus.json')
	   .map((response:Response)=>response.json());
	}
}
