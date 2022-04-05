import { Component } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ModalController } from '@ionic/angular';
import { CreatePlaylistComponent } from '../../modals/create-playlist/create-playlist.component';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router, NavigationExtras } from '@angular/router';
import {Storage} from '@ionic/storage-angular';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent{

  isModalOpen: true;
  modal: HTMLElement;
  playlists1: Observable<any[]>;
  playlists2: Observable<any[]>;
  playlists3: Observable<any[]>;
  isPlaylist1: boolean;
  isPlaylist2: boolean;
  isPlaylist3: boolean;
  user = {
    email: ''
  };
  private store: AngularFirestore;
  constructor(private playlistService: PlaylistService,
              private auth: AuthenticationService,
              public modalController: ModalController,
              store: AngularFirestore,
              private router: Router,
              public storage: Storage) {
    this.store = store;
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  async ngOnInit() {
    await this.storage.create();
    await this.storage.get('user').then((user) => {
      if(user == null){
        this.router.navigate(['home']);
      }else{
        this.user = user;
      }

    });
    if (this.user.email !== ''){
      this.playlists1 = this.playlistService.getMyPlaylists(this.user.email);
      this.playlists1.subscribe((p)=>{
        if(p.length===0){
          this.isPlaylist1 = false;
        }
        else {
          this.isPlaylist1 = true;
        }
      });
      this.playlists2 = this.playlistService.getAllPlaylistsSharedR(this.user.email);
      this.playlists2.subscribe((p)=>{
        if(p.length===0){
          this.isPlaylist2 = false;
        }
        else {
          this.isPlaylist2 = true;
        }
      });
      this.playlists3 = this.playlistService.getAllPlaylistsSharedRW(this.user.email);
      this.playlists3.subscribe((p)=>{
        if(p.length===0){
          this.isPlaylist3 = false;
        }
        else {
          this.isPlaylist3 = true;
        }
      });
    }else{location.reload();}
  }

  deletePlaylist(id){
    this.store.collection('playlist').doc(id).delete().then(() => {
      console.log('Document successfully deleted!');
    }).catch((error) => {
      console.error('Error removing document: ', error);
    });
  }

  afficherPlaylist(id) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id
      }
    };
    this.router.navigate(['listeMusique'], navigationExtras);
  }

  logout() {
    this.auth.logout();
    location.reload();
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: CreatePlaylistComponent
    });
    return await modal.present();
  }

  closeModal(){
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
