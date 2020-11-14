import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { IUser } from './../../models/user';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import * as firebase from '@firebase/app';
import '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: Observable<IUser>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore,  private storage: AngularFireStorage, private router: Router) {
    this.user = this.auth.user.pipe(
      switchMap(user =>
        !user
          ? null
          : this.db
          .collection('Users')
          .doc<IUser>(user.uid)
          .valueChanges()
      )
    );
   }

   update(model: Partial<IUser>) {
    if (!model.Id) {
      throw new Error(
        'No ID was supplied with the Partial<IUser> parameter to update a user record'
      );
    }
    return this.db
      .collection('Users')
      .doc(model.Id)
      .set(model, { merge: true });
  }

  delete(id: string, password: string) {
    return this.db
      .collection('Users')
      .doc(id)
      .delete()
      .then(() => {
        const user = firebase.firebase.auth().currentUser;
        const credential = firebase.firebase.auth.EmailAuthProvider.credential(
            user.email,
            password
        );
        // Now you can use that to reauthenticate
        user.reauthenticateWithCredential(credential)
        .then(() => {
          user.delete().then(() => {
            this.router.navigate(['/login']);
          }).catch(function(e) {
            this.showError(e);
          });

        });
      });
  }

  async uploadProfilePhoto(userId: string, file: File) {
    const fileparts = file.name.split('.');

    const path = `${userId}/profilePhoto.${fileparts[fileparts.length - 1]}`;

    const upload = await this.storage.upload(path, file);

    const url = await upload.ref.getDownloadURL();

    return this.update({ Id: userId, ProfilePhoto: url });
  }
}
