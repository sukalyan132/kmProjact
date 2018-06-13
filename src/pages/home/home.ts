import { Component } from '@angular/core';
import { NavController ,NavParams ,LoadingController,Events} from 'ionic-angular';
import { DomSanitizer} from '@angular/platform-browser';
import { RestapiServiceProvider } from '../../providers/restapi-service/restapi-service';
import { Device } from '@ionic-native/device';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';


interface deviceInterface {
  id?: string,
  model?: string,
  cordova?: string,
  platform?: string,
  version?: string,
  manufacturer?: string,
  serial?: string,
  isVirtual?: boolean,

};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  url         : any;
  home        : any;
  loading     : any;
  devicedata  : any;
  token       : any;
  login       : any;
  uid         : any;
  mail        : any;
  session_name: any;
  sessid      : any;
  cookie      : any;
  dynUrl      : any;
  deviceToken : any; 
//var url="www.google.com";
  public deviceInfo: deviceInterface = {};
  constructor(public navCtrl: NavController , private sanitizer: DomSanitizer, public navParams: NavParams,public loadingCtrl: LoadingController, public restapiService: RestapiServiceProvider, private device: Device, public backgroundMode : BackgroundMode,public events : Events,public storage: Storage) {
    
  }
  //////////// for loder ///////////////////
  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Wait...'
    });

    this.loading.present();
  }
  ngOnInit() {
        this.dynUrl="http://app.kmplus.in/uatupdated";
        this.showLoader();
        if(this.navParams.get("one_time_login"))
        {
            this.home                     = this.navParams.get("one_time_login");
            this.token                    = this.navParams.get("token_value");
            this.login                    = this.navParams.get("login");
            this.uid                      = this.navParams.get("uid");
            this.mail                     = this.navParams.get("mail");
            this.session_name             = this.navParams.get("session_name");
            this.sessid                   = this.navParams.get("sessid");
            this.cookie                   = this.navParams.get("session_name")+'='+this.navParams.get("sessid")
            
            this.deviceInfo.id            = this.device.uuid;
            this.deviceInfo.model         = this.device.model;
            this.deviceInfo.cordova       = this.device.cordova;
            this.deviceInfo.platform      = this.device.platform;
            this.deviceInfo.version       = this.device.version;
            this.deviceInfo.manufacturer  = this.device.manufacturer;
            this.deviceInfo.serial        = this.device.serial;
            this.deviceInfo.isVirtual     = this.device.isVirtual;
            this.storage.get('deviceId').then((val) => {
              this.deviceToken=val;
              //alert(this.deviceToken);
              this.devicedata              ={'id':'null','login':this.login,'uid':this.uid,'email':this.mail,'device_id':this.deviceInfo.id,'gcm_id':this.deviceToken,'os':'android','reg_status':true,'req_date':'2112312323'};
              setTimeout(() => {
                  //alert("heat");
                  /////// call rest service ////////////////
                  this.restapiService.saveDeviceData(this.devicedata,this.token,this.cookie).then((result) => {
                    

                    //alert("here");
                    
                  }, (err) => {
                    //this.loading.dismiss();
                    //this.presentToast(err);
                  });
                  this.loading.dismiss();
              }, 10000);
            });

        }
        else
        {
          this.home = this.dynUrl+this.navParams.get("newUrl");
          this.loading.dismiss();
        }
       
        console.log(this.home);
       this.url    = this.sanitizer.bypassSecurityTrustResourceUrl(this.home);
       /* this.backgroundMode.enable(); 
          this.backgroundMode.on("activate").subscribe(()=>{
              setTimeout(() => {
                  this.navCtrl.setRoot(LoginPage);
                 // this.backgroundMode.disable();
              }, 60000);
          });
          */
       
             
    }
  
  changeUrlOfIframe(){

  //console.log(this.data);
  }
  
  profilePage(){
  	this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://app.kmplus.in/uatupdated/my-profile");
  }
  publicBlog(){
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl("http://app.kmplus.in/uatupdated/public-blogs");
  }


}
