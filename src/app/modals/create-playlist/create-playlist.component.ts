import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PlaylistService } from 'src/app/services/playlist.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationService } from '../../services/authentication.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.scss'],
})
export class CreatePlaylistComponent implements OnInit {
  user = {
    email: ''
  };
  newPlaylist = {
    title: '',
    owner: this.user.email,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    user_r:'',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    user_rw:''
  };
  playlistForm: FormGroup;
  private store: AngularFirestore;

  constructor(private fb: FormBuilder,
              private playlistService: PlaylistService,
              private modalController: ModalController,
              private auth: AuthenticationService,
              store: AngularFirestore,
              private router: Router,
              public storage: Storage) {
    this.store = store;
  }

  async ngOnInit() {
    this.playlistForm = new FormGroup({
      title: new FormControl()
    });
    await this.storage.create();
    await this.storage.get('user').then((user) => {
      if(user == null){
        this.router.navigate(['home']);
      }else{
        this.user = user;
      }
    });
  }

  addPlaylist() {
    this.newPlaylist.owner=this.user.email;
    this.store.collection('playlist').add(this.newPlaylist);
    this.modalController.dismiss({
      dismissed: true
    });
  }

  closeModal(){
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
