import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {Storage} from "@ionic/storage-angular";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  user = null;
  public ionicForm: FormGroup;

  constructor(public authService: AuthenticationService,
              public router: Router,
              public storage: Storage){
  }
  async ngOnInit() {
    this.ionicForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      passwordConfirm: new FormControl()
    });
    await this.storage.create();
    await this.storage.get('user').then((user) => {
      console.log(user);
      if(user){
        this.router.navigate(['playlist']);
      }

    });
  }

  public register() {

    if(this.ionicForm.value.password === this.ionicForm.value.passwordConfirm) {
      this.authService.register(this.ionicForm.value).catch(error =>
        this.authService.presentAlert("registration error",error).catch((error) => console.error(error))
      );
      this.authService.presentAlertWithHandler("Verify you email",
        "Check your email inbox and click on the link to verify your email",
        [
          {
            text: 'ok',
            handler: () => {
              this.router.navigate(['home']);
            }
          }]);
    } else {
      this.authService.presentAlert("registration error","passwords are different.").catch((error) => console.error(error));
    }
  }

  pagePrecedente(){
    this.router.navigate(['home']);
  }
}
