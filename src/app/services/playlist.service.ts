import { Injectable } from '@angular/core';
import { Playlist } from '../models/playlist';
import {Observable, Subscription} from 'rxjs';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import { Firestore, collection, collectionData, docData, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { of, pipe} from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { doc, getDoc } from 'firebase/firestore';
import firebase from 'firebase/compat';
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  playlist: Observable<any[]>;
  usersTest = [];
  usersPlaylist: Observable<any[]>;
  currentPlaylist: Playlist;
  n: Playlist;
  emails: string;
  constructor(public store: AngularFirestore,
              private firestore: Firestore) {
    this.playlist = store.collection('playlist/').valueChanges({ idField: 'Id' });
    this.usersPlaylist = store.collection('playlist/').valueChanges();
  }

  getAllPlaylists() {
    return this.playlist;
  }

  getMyPlaylists(email) {
    const test = new Observable<Playlist[]>(subscriber => {
      this.playlist.subscribe((p)=>{
        const a = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for(let i=0; i<p.length;i++){
          if(p[i].owner===email){
            a.push(p[i]);
          }
        }
        subscriber.next(a);
      });
    });
    return test;
  }

  getAllPlaylistsSharedR(email){
    const test = new Observable<Playlist[]>(subscriber => {
      this.playlist.subscribe((p)=>{
        const a = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for(let i=0; i<p.length;i++){
          this.emails = p[i].user_r;
          const words = this.emails.split(',');
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for(let j=0; j<words.length;j++){
            if(words[j]===email){
              a.push(p[i]);
            }
          }
        }
        subscriber.next(a);
      });
    });
    return test;
  }

  getAllPlaylistsSharedRW(email){
    const test = new Observable<Playlist[]>(subscriber => {
      this.playlist.subscribe((p)=>{
        const a = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for(let i=0; i<p.length;i++){
          this.emails = p[i].user_rw;
          const words = this.emails.split(',');
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for(let j=0; j<words.length;j++){
            if(words[j]===email){
              a.push(p[i]);
            }
          }
        }
        subscriber.next(a);
      });
    });
    return test;
  }

  getAllPlaylistsListeMusique(id) {
    this.playlist = this.store.collection('playlist/').doc(id).collection('listemusique/').valueChanges({ idField: 'Id' });
    return this.playlist;
  }

  // getCurrentPlaylist(id){
  //   this.store.collection('playlist/').doc(id).valueChanges()
  //     .subscribe((singleDoc: Playlist) =>{
  //       console.log('singleDoc');
  //       console.log(singleDoc);
  //       this.currentPlaylist = singleDoc;
  //       console.log('this.currentPlaylist');
  //       console.log(this.currentPlaylist);
  //       return this.currentPlaylist;
  //     });
  // }

  /*const test = new Observable<Playlist[]>(subscriber => {
      this.playlist.subscribe((p)=>{
        const a = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for(let i=0; i<p.length;i++){
          this.emails = p[i].user_r;
          const words = this.emails.split(',');
          console.log(words);
          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for(let j=0; j<words.length;j++){
            if(words[j]===email){
              a.push(p[i]);
            }
          }
        }
        subscriber.next(a);
      });
    });*/
}
