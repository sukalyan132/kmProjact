import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,Events ,LoadingController,ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ShareService } from '../service/share/share';
import { DataServiceProvider } from '../providers/data-service/data-service';
import { RestapiServiceProvider } from '../providers/restapi-service/restapi-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage  : any = LoginPage;

  name        : any;
  profileimg  : any;
  job         : any;
  username    : any;
  serviceData : any;
  data        : any;
  pages: Array<{title: string, component: any}>;
  showLevel1 = null;
  showLevel2 = null;
  dep         : any;
  location    : any;
  points      : any;
  notification: any;
  pointImg    : any;
  deviceRid   : any;
  loading     : any;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen ,public storage: Storage,shareService: ShareService,public events : Events,public dataService: DataServiceProvider,public push: Push, public restapiService: RestapiServiceProvider,public loadingCtrl: LoadingController , private toastCtrl: ToastController,) {
    this.initializeApp();
    dataService.getMenus()
    .subscribe((response)=> {
        this.pages = response;
        console.log(this.pages);
    });
    events.subscribe('shareObject', (dummy, dummyNumber) => {
    console.log(dummy);
    this.username     =dummy.name;
    this.profileimg   =dummy.profileimg;
    this.job          =dummy.job;
    this.dep          =dummy.dep;
    this.location     =dummy.location;
    this.points       =dummy.points;
    this.notification =dummy.notification;
    this.pointImg     =dummy.pointImg;
}); 
    //this.serviceData = shareService.getUserName();
    //this.username = window.localStorage.getItem('name');
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];
    

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
      message         : msg,
      duration        : 3000,
      position        : 'bottom',
      dismissOnPageChange   : true
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
  ///////////////////////////////////////////////////////
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        if(this.storage.get('loginDetails')){
            this.storage.get('loginDetails').then((val) => {
                this.showLoader();
                this.restapiService.login(val).then((result) => {
                this.loading.dismiss();
                
                    let dummy = {
                      name        :  result.user.field_first_name.und[0].value+' '+result.user.field_last_name.und[0].value,
                      profileimg  : result.profile_image_url,
                      job         : result.user.field_job.und[0].value,
                      dep         : result.departmet_name,
                      location    : result.location,
                      points      : result.gamification_point,
                      notification: result.notification_counts,
                      pointImg    : result.badge_url
                    }

                    this.events.publish("shareObject", dummy, 8);
                    this.nav.setRoot(HomePage,{one_time_login :result.one_time_login,token_value : result.token,uid:result.user.uid,mail:result.user.mail,login:result.user.login,session_name:result.session_name,sessid:result.sessid});

                }, (err) => {
                  this.loading.dismiss();
                  this.presentToast(err);
                });
            });
        }
          ///////////////// push code here /////////////////////
          // to check if we have permission
        
          this.push.hasPermission()
            .then((res: any) => {

              if (res.isEnabled) {
                //alert('We have permission to send push notifications');
              } else {
                //alert('We do not have permission to send push notifications');
              }

            });

          this.push.createChannel({
           id: "testchannel1",
           description: "My first test channel",
           // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
           importance: 3
          }).then(() => console.log('Channel created'));

          // Delete a channel (Android O and above)
          this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));

          // Return a list of currently configured channels
          this.push.listChannels().then((channels) => console.log('List of channels', channels))

          // to initialize push notifications

          const options: PushOptions = {
             android: {},
             ios: {
                 alert: 'true',
                 badge: true,
                 sound: 'false'
             },
             windows: {},
             browser: {
                 pushServiceURL: 'http://push.api.phonegap.com/v1/push'
             }
          };

          const pushObject: PushObject = this.push.init(options);


          pushObject.on('notification').subscribe((notification: any) => alert(notification));
          if(this.storage.get('deviceId')){
            this.storage.get('deviceId').then((val) => {
              if(val=='' || val=='undefined')
              {
                pushObject.on('registration').subscribe((registration: any) => 
                this.storage.set('deviceId',registration.registrationId));
              }
            })
          }
          else
          {
            pushObject.on('registration').subscribe((registration: any) => 
            this.storage.set('deviceId',registration.registrationId));
          }
          

          pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
        
    });
  }
  toggleLevel1(idx) {
  if (this.isLevel1Shown(idx)) {
    this.showLevel1 = null;
  } else {
    this.showLevel1 = idx;
  }
};

toggleLevel2(idx) {
  if (this.isLevel2Shown(idx)) {
    this.showLevel1 = null;
    this.showLevel2 = null;
  } else {
    this.showLevel1 = idx;
    this.showLevel2 = idx;
  }
};

isLevel1Shown(idx) {
  return this.showLevel1 === idx;
};

isLevel2Shown(idx) {
  return this.showLevel2 === idx;
};
  openPage(page) {
  console.log(page);
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(HomePage,{newUrl:page});
  }
  //Log out function
  logOut(){
    this.storage.set('name', '');
    this.storage.set('profileimg', '');
    this.nav.setRoot(LoginPage);
  }

}
