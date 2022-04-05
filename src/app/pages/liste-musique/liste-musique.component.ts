import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {async, Observable, Subscription} from 'rxjs';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { PlaylistService } from '../../services/playlist.service';
import { ModalController } from '@ionic/angular';
import { CreateMusiqueComponent } from '../../modals/create-musique/create-musique.component';
import { AuthenticationService } from '../../services/authentication.service';
import {Playlist} from '../../models/playlist';
import {SharePlaylistComponent} from '../../modals/share-playlist/share-playlist.component';
import {Storage} from '@ionic/storage-angular';


@Component({
  selector: 'app-liste-musique',
  templateUrl: './liste-musique.component.html',
  styleUrls: ['./liste-musique.component.scss'],
})
export class ListeMusiqueComponent implements OnInit {

  newMusique = {
    title: ''
  };
  user = {
    email: ''
  };
  data: any;
  isEmpty: boolean;
  emails: string;
  emails1: string;
  result= '';
  listemusique: Observable<any[]>;
  b: Playlist;
  isOwner: boolean;
  isUserR: boolean;
  isUserRW: boolean;
  isModified: boolean;
  private store: AngularFirestore;


  constructor(store: AngularFirestore,
              private playlistService: PlaylistService,
              private route: ActivatedRoute,
              public modalController: ModalController,
              private auth: AuthenticationService,
              private router: Router,
              public storage: Storage) {
    this.store = store;
    this.route.queryParams.subscribe(params => {
      if (params && params.id) {
        this.data = params.id;
      }
    });
  }

  async ngOnInit() {
    await this.storage.create();
    await this.storage.get('user').then((user) => {
      if(user == null){
        this.router.navigate(['home']);
      }else{
        this.user = user;
      }

    });
    this.isEmpty = false;
    this.listemusique = this.playlistService.getAllPlaylistsListeMusique(this.data);
    this.listemusique.subscribe((l)=>{
      if(l.length===0){
        this.isEmpty = true;
      }
    });
    this.isModified=false;
    this.determinerRoles();
  }

  determinerRoles(){
    this.store.collection('playlist/').doc(this.data).valueChanges()
      .subscribe((singleDoc: Playlist) =>{
        this.emails1 = singleDoc.owner;
        let words = this.emails1.split(',');
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for(let j=0; j<words.length;j++) {
          if (words[j] === this.user.email) {
            this.isOwner = true;
          }
        }
        if(!this.isOwner){
          this.emails1 = singleDoc.user_r;
          words = this.emails1.split(',');
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (let j = 0; j < words.length; j++) {
            if (words[j] === this.user.email) {
              this.isUserR = true;
            }
          }
          this.emails1 = singleDoc.user_rw;
          words = this.emails1.split(',');
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (let j = 0; j < words.length; j++) {
            if (words[j] === this.user.email) {
              this.isUserRW = true;
            }
          }
        }
      });
  }

  deleteMusique(id){
    this.store.collection('playlist').doc(this.data).collection('listemusique').doc(id).delete().then(() => {
      console.log('Document successfully deleted!');
    }).catch((error) => {
      console.error('Error removing document: ', error);
    });
  }

  pagePrecedente(){
    this.router.navigate(['playlist']);
  }

  async sharePlaylist(){
    const modal = await this.modalController.create({
      component: SharePlaylistComponent,
      componentProps: {
        id: this.data}
    });
    return await modal.present();
  }

  desabonnerPlaylist(){
    let words;
    if(this.isUserR) {
      this.store.collection('playlist/').doc(this.data).valueChanges()
        .subscribe((singleDoc: Playlist) =>{
          this.emails = singleDoc.user_r;
          words = this.emails.split(',');
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          if(words.length===1 && words[0]===this.user.email){
            this.result='';
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.store.collection('playlist').doc(this.data).update({user_rw: this.result});
          }
          else{
            words.forEach((element,index)=>{
              if(element===this.user.email){
                words.splice(index,1);
              }
            });
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j = 0; j < words.length; j++) {
              this.result = this.result+(j===0?  '':',')+words[j];
            }
            if(!this.isModified) {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              this.store.collection('playlist').doc(this.data).update({user_r: this.result});
              this.isModified=true;
            }
          }
        });
      console.log('this.result', this.result);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      this.store.collection('playlist').doc(this.data).update({user_r: this.result});
    }
    else if (this.isUserRW){
      this.store.collection('playlist/').doc(this.data).valueChanges()
        .subscribe((singleDoc: Playlist) =>{
          this.emails = singleDoc.user_rw;
          words = this.emails.split(',');
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          if(words.length===1 && words[0]===this.user.email){
            this.result='';
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.store.collection('playlist').doc(this.data).update({user_rw: this.result});
          }
          else{
            words.forEach((element,index)=>{
              if(element===this.user.email){
                words.splice(index,1);
              }
            });
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let j = 0; j < words.length; j++) {
              this.result = this.result+(j===0?  '':',')+words[j];
            }
            if(!this.isModified) {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              this.store.collection('playlist').doc(this.data).update({user_rw: this.result});
              this.isModified=true;
            }
          }
        });
    }
    this.pagePrecedente();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CreateMusiqueComponent,
      componentProps: {
        id: this.data}
    });
    modal.onDidDismiss().then((data) => {
      this.isEmpty = false;
    });
    return await modal.present();
  }
}
