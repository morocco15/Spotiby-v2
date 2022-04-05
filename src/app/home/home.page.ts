import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';
import {Storage} from '@ionic/storage-angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public ionicForm: FormGroup;
  user = null;

  constructor(public authService: AuthenticationService,
              public router: Router,
              public storage: Storage){

    // set a key/value

    // Or to get a key/value pair its key value can get from any page after settting key value
    // storage.get('name').then((val) => {
    //   console.log('Your age is', val);
    // });

  }

  async ngOnInit() {
    this.ionicForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
    await this.storage.get('user').then((user) => {
      console.log(user);
      if(user){
        this.router.navigate(['playlist']);
      }

    });
  }

  async signIn() {
    await this.authService.signIn();
    await this.storage.get('user').then((user) => {
      console.log('Your user is', user);
      this.user = user;
    });
    if(this.user!=null){
      this.router.navigate(['playlist']);
    }
  }

  login() {
    this.authService.login(this.ionicForm.value).then(() =>{
        this.router.navigate(['playlist']);
      }
    ).catch((error) => {
      // eslint-disable-next-line max-len
      this.authService.presentAlert('connection error', AuthenticationService.errorMessage(error.code)).catch((error) => console.log(error));
    });
  }
  /*hello() {
    // this.storage.set('name', 'Max');
    this.storage.get('name').then((val) => {
      console.log('Your age is', val);
    });
    this.storage.get('user').then((val) => {
      console.log('Your user is', val);
    });
  }*/
}
