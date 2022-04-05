import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AlertController, isPlatform} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import firebase from 'firebase/compat/app';
import {doc, setDoc} from '@angular/fire/firestore';
import {filter, map} from 'rxjs/operators';
import {Storage} from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user = null;

  constructor(public auth: AngularFireAuth,
              public afs: AngularFirestore,
              public alertController: AlertController,
              public router: RouterModule,
              public storage: Storage) {
    if (!isPlatform('capacitor')){
      GoogleAuth.initialize();
    }
  }

  async login(formLogin: any) {
    const userCred = await this.auth.signInWithEmailAndPassword(formLogin.email, formLogin.password);
    this.user={
      email: ""+userCred.user.email
    };
    this.storage.set('user', this.user);
    if (!userCred.user.emailVerified) {
      await this.auth.signOut();
      // eslint-disable-next-line max-len
      this.presentAlert('conection error', 'please verify your email').catch((error) => console.error(error));
    }
  }

  static errorMessage(errorCode : string) : string {
    switch (errorCode) {
      case "auth/missing-email" :
        return "Please enter an email";
      case "auth/invalid-email" :
        return "Please enter a valid email";
      case "auth/internal-error" :
        return "Internal error"
      case "auth/user-not-found" :
        return "Please <a href='/register'>register</a>";
      case "auth/wrong-password" :
        return "please check your password";
      case "auth/account-exists-with-different-credential" :
        return "account already exists but with a different connexion method"
       case "auth/popup-closed-by-user" :
        return "You have closed the google login pop up"
      default:
        return errorCode;
    }
  }

  async  signIn(){
    await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(async userCred => {
      this.user={
        email: userCred.user.email,
        fName: userCred.additionalUserInfo.profile['given_name'],
        lName: userCred.additionalUserInfo.profile['family_name'],
        profilPicture: userCred.additionalUserInfo.profile['picture']
      };
      await this.storage.set('user', this.user);
      console.log(this.user);
      if(userCred.additionalUserInfo.isNewUser){
        setDoc(doc(this.afs.firestore, 'users', userCred.user.uid), this.user)
          .catch(error => console.log('error while creating the user ! '+error));
      }
    }).catch((error) => {
      this.presentAlert('connection error', AuthenticationService.errorMessage(error.code)).catch((error) => console.log(error));
    });
    console.log('user : ', this.user);
    console.log('getUser : ', this.getUser());
  }

  async refresh(){
    const authCode = await GoogleAuth.refresh();
    console.log('refresh: ', authCode);
  }

  public logout() {
    this.storage.set('user', null);
    return this.auth.signOut();
  }

  async signOut(){
    await GoogleAuth.signOut();
    this.storage.set('user', null);
    console.log('getUser : ', this.getUser());
  }



  async register(formRegister: any) {
    const userCred = await this.auth.createUserWithEmailAndPassword(formRegister.email, formRegister.password);
    await userCred.user.sendEmailVerification();
    setDoc(doc(this.afs.firestore, 'users', userCred.user.uid), {
      email: userCred.user.email,
      firstname: '',
      lastname: '',
      phone: '',
      notifications: []
    })
      .catch(error => console.log('Error while creating the user ! '+error))
      .then(() => {
        this.auth.signOut().catch(error => console.log('Error while login out. '+error));
      });

  }
  async presentAlert(alertHeader: string, alertMessage: string) {
    const alert = await this.alertController.create({
      header: alertHeader,
      message: alertMessage,
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentAlertWithHandler(alertHeader: string, alertMessage: string, buttons: any) {
    const alert = await this.alertController.create({
      header: alertHeader,
      message: alertMessage,
      buttons: buttons
    });

    await alert.present();
  }

  public getUser() {
    if(this.auth.user != null) {
      return this.auth.user.pipe(filter(user => !!user), map(user => user));
    }
  }
}
