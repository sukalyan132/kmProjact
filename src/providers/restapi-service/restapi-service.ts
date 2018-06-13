import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the RestapiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestapiServiceProvider {
	data  	: any;
	data2 	: any;
	data3 	: any;
	options : any;
  constructor(public http: Http) {
    console.log('Hello RestapiServiceProvider Provider');
  }


  ////////////////////////// login function ////////////
		login(data){
			//console.log(data);
			this.data='';
			if (this.data) {
			  //console.log(this.data);
			 // this.data='';
			    return Promise.resolve(this.data);
			  }
			let  headers = new Headers();
		    headers.append("Accept", 'application/json');
		    headers.append("Content-Type", 'application/json' );
		    this.options = { headers: headers };
		    let postParams = data;
			  return new Promise(resolve => {
			    this.http.post("http://app.kmplus.in/uatupdated/api/services/user/login.json", postParams, this.options)
			      .map(res => res.json())
			      .subscribe(data => {
			      //console.log(data);
					this.data = data;
			        resolve(this.data);
			      },
			       err => {err=err
			           console.log(err);
			           resolve(err);
			           }
			      )
			  });
		}
	///////////////////////////// save device data ///////////////////
	saveDeviceData(data2,token,cookie){
			console.log(cookie);
			if (this.data3) {
			  //console.log(this.data);
			    return Promise.resolve(this.data3);
			  }
			let  headers = new Headers();
			
		    headers.append("Accept", 'application/json');
		    headers.append("Content-Type", 'application/json' );
		    //headers.append("Cookie" ,cookie);
		   //headers.append("X-CSRF-Token" , token);
		   
		    this.options = { headers: headers ,withCredentials : false};
		    let postParams = data2;
			  return new Promise(resolve => {
			    this.http.post("http://app.kmplus.in/uatupdated/api/mobile/create_device_entry.json", postParams, this.options)
			      .map(res => res.json())
			      .subscribe(data => {
			      //console.log(data)
			        this.data2 = data;
			        resolve(this.data2);
			      },
			       err => {err=err
			           console.log(err);
			           resolve(err);
			           });
			  });
		}		
}
