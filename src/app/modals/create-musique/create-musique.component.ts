import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ModalController, NavParams} from '@ionic/angular';
import { PlaylistService } from 'src/app/services/playlist.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-create-musique',
  templateUrl: './create-musique.component.html',
  styleUrls: ['./create-musique.component.scss'],
})
export class CreateMusiqueComponent implements OnInit {

  id: string;
  newMusique = {
    title: ''
  };
  musiqueForm: FormGroup;
  private store: AngularFirestore;

  constructor(private fb: FormBuilder,
              private playlistService: PlaylistService,
              private modalController: ModalController,
              private navParams: NavParams,
              store: AngularFirestore) {
    this.store = store;
  }


  ngOnInit() {
    this.musiqueForm = new FormGroup({
      title: new FormControl()
    });
    this.id = this.navParams.get('id');
  }

  addMusique() {
    console.log('this.newMusique');
    console.log(this.newMusique);
    this.store.collection('playlist').doc(this.id).collection('listemusique').add(this.newMusique);
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
