import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {Router, RouteReuseStrategy} from '@angular/router';

import {AlertController, IonicModule, IonicRouteStrategy} from '@ionic/angular';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFirestore, AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { IonicStorageModule } from '@ionic/storage-angular';
import { CreatePlaylistComponent } from 'src/app/modals/create-playlist/create-playlist.component';
import { CreateMusiqueComponent } from 'src/app/modals/create-musique/create-musique.component';
import { ListeMusiqueComponent } from 'src/app/pages/liste-musique/liste-musique.component';
import { PlaylistComponent } from 'src/app/pages/playlist/playlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {Firestore, FirestoreModule, getFirestore, provideFirestore} from '@angular/fire/firestore';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {SharePlaylistComponent} from './modals/share-playlist/share-playlist.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaylistComponent,
    CreatePlaylistComponent,
    ListeMusiqueComponent,
    CreateMusiqueComponent,
    SharePlaylistComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    FirestoreModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAnalyticsModule,
    IonicStorageModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
