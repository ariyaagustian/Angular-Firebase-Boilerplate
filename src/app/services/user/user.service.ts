import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { IUser } from './../../models/user';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: Observable<IUser>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
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

  delete(id: string) {
    return this.db
      .collection('Users')
      .doc(id)
      .delete();
  }
}
