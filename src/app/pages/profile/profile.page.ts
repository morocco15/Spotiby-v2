import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Storage} from "@ionic/storage-angular";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(public authService: AuthenticationService,
              public storage: Storage) { }

  ngOnInit() {
    console.log('user', this.authService.getUser());
    this.storage.get('name').then((val) => {
      console.log('Your age is', val);
    });
  }

}
