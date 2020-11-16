import { IUser } from './../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Errors } from './errors';
import Swal from 'sweetalert2';
import * as firebase from '@firebase/app';
import '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth, private db: AngularFirestore, private router: Router) { }


  private showError(e: any) {
    console.log(e);
    const index = Errors.findIndex(x => x.code === e.code);

    if (index !== -1) {
      const err = Errors[index];
      Swal.fire(err.title, err.message, 'error');
    } else {
      Swal.fire(
        'Oops, something went wrong!',
        `We couldn's complete your request at this time. Please try again later`,
        'error'
      );
    }
  }

  signIn(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      this.router.navigate(['/admin/dashboard']);
    }).catch(e => this.showError(e));
  }

  signUp(user: IUser, password: string) {
    return this.auth.createUserWithEmailAndPassword(user.Email, password)
    .then(userCredential => {
      user.CreatedOn = Date.now();
      user.Id = userCredential.user.uid;
      return this.db
      .collection('Users')
      .doc(userCredential.user.uid)
      .set(user).then(() => {
        this.router.navigate(['/admin/dashboard']);
      })
      .catch(e => console.log(e));
    })
    .catch(e => this.showError(e));
  }

  GoogleAuth() {
    return this.AuthLogin(new firebase.firebase.auth.GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider) {
    const user = {} as IUser;

    return this.auth.signInWithPopup(provider)
    .then((res) => {
      console.log(res);
      this.db.collection('Users').doc(res.user.uid).ref.get().then(doc => {
        if (!doc.exists) {
          user.CreatedOn = Date.now();
          user.Id = res.user.uid;
          const displayName = res.user.displayName.split(' ');
          user.FirstName = displayName[0];
          user.LastName = displayName[1];
          user.Email = res.user.email;
          user.EmailVerified = res.user.emailVerified;
          user.FCMToken = res.user.refreshToken;
          user.ProfilePhoto = res.user.photoURL;
          user.NumNotes = 0;
          user.Disabled = false;
          this.db
          .collection('Users')
          .doc(res.user.uid)
          .set(user).then(() => {
            this.router.navigate(['/admin/dashboard']);
          });
        } else {
          this.router.navigate(['/admin/dashboard']);
        }
      });
    }).catch((error) => {
        console.log(error);
    });
  }

  signOut() {
    return this.auth.signOut()
    .then(() => {
      this.router.navigate(['/login']);
    })
    .catch(e => this.showError(e));
  }

  changePassword(email: string) {
    this.auth
      .sendPasswordResetEmail(email)
      .then(() => {
        Swal.fire(
          'Check your email',
          'For youur security, we have sent you an email with a password reset link',
          'success'
        );
      })
      .catch(e => this.showError(e));
  }

}
