import { Component } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams,LoadingController,ToastController,Events } from 'ionic-angular';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { ShareService } from '../../service/share/share';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
 	private authForm : FormGroup;
   	loading: any;
  constructor(public navCtrl: NavController, public navParams: NavParams ,private formBuilder: FormBuilder,public loadingCtrl: LoadingController , private toastCtrl: ToastController, public restapiService: RestapiServiceProvider, private storage: Storage,public shareService: ShareService ,public events : Events) { 
  	this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      
    });
  }
 //////////// for loder ///////////////////
	showLoader(){
		this.loading = this.loadingCtrl.create({
			content: 'Authenticating...'
		});

		this.loading.present();
	}
//////////////////////// for toster message ///////////
    presentToast(msg) {
    let toast = this.toastCtrl.create({
      message 				: msg,
      duration 				: 3000,
      position 				: 'bottom',
      dismissOnPageChange 	: true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
//////////////// login function //////////////////////////
  doLogin() {
  	this.showLoader();
    //console.log(this.authForm.value);
	   // this.navCtrl.setRoot('HomePage');
	    //this.navCtrl.push(HomePage);
	    this.restapiService.login(this.authForm.value).then((result) => {
	      this.loading.dismiss();
	     console.log(result);
	     if(result.status==401)
	     {
	     	this.presentToast("Please check User name and Password1.");
	     }
	      //this.data = result;
	      if(!result.sessid)
	      {
	         this.presentToast("Please check User name and Password2.");
	      }
	      else
	      {
	      	let dummy = {
			    name    	:  result.user.field_first_name.und[0].value+' '+result.user.field_last_name.und[0].value,
			    profileimg 	: result.profile_image_url,
			    job 	 	: result.user.field_job.und[0].value,
			    dep 	 	: result.departmet_name,
			    location 	: result.location,
			    points  	: result.gamification_point,
			    notification: result.notification_counts,
			    pointImg 	: result.badge_url
			}
 
			this.events.publish("shareObject", dummy, 8);
	      	 this.presentToast("Login success");
	         this.storage.set('loginDetails',this.authForm.value);
	          this.navCtrl.setRoot(HomePage,{one_time_login :result.one_time_login,token_value : result.token,uid:result.user.uid,mail:result.user.mail,login:result.user.login,session_name:result.session_name,sessid:result.sessid});
	      }
	      
	    }, (err) => {
	      this.loading.dismiss();
	      this.presentToast(err);
	    });
  }
 
}