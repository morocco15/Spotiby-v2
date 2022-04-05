import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {PlaylistService} from '../../services/playlist.service';
import {AuthenticationService} from '../../services/authentication.service';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {ModalController, NavParams} from '@ionic/angular';
import {Playlist} from '../../models/playlist';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-share-playlist',
  templateUrl: './share-playlist.component.html',
  styleUrls: ['./share-playlist.component.scss'],
})
export class SharePlaylistComponent implements OnInit {

  id: string;
  newPlaylistShared = {
    role: '',
    email: ''
  };
  emails: string;
  sharePlaylistForm: FormGroup;
  isModified: boolean;
  private store: AngularFirestore;
  private subscription: Subscription;

  constructor(private fb: FormBuilder,
              private playlistService: PlaylistService,
              private modalController: ModalController,
              private auth: AuthenticationService,
              private navParams: NavParams,
              store: AngularFirestore) {
    this.store = store;
  }

  ngOnInit() {
    this.sharePlaylistForm = new FormGroup({
      email: new FormControl(),
      role: new FormControl()
    });
    this.id = this.navParams.get('id');
    this.isModified=false;
  }

  sharePlaylist() {
    if(this.newPlaylistShared.role==='Lecture'){
      this.store.collection('playlist/').doc(this.id).valueChanges()
        .subscribe((singleDoc: Playlist) =>{
          if(this.isModified===false) {
            if(singleDoc.user_r===''){
              this.emails = this.newPlaylistShared.email;
            }
            else{
              this.emails = singleDoc.user_r;
              this.emails += ',' + this.newPlaylistShared.email;
            }
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.store.collection('playlist/').doc(this.id).update({user_r: this.emails});
            this.isModified = true;
          }
        });
    }
    else if(this.newPlaylistShared.role==='Lecture et écriture'){
      this.subscription = this.store.collection('playlist/').doc(this.id).valueChanges()
        .subscribe((singleDoc: Playlist) =>{
          if(this.isModified===false) {
            console.log(singleDoc.user_rw==='');
            if(singleDoc.user_rw===''){
              this.emails = this.newPlaylistShared.email;
            }
            else{
              this.emails = singleDoc.user_rw;
              this.emails += ',' + this.newPlaylistShared.email;
            }
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.store.collection('playlist/').doc(this.id).update({user_rw: this.emails});
            this.isModified = true;
          }
        });
    }
    console.log('isModified 5', this.isModified);
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
