import { IUser } from './../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Errors } from './errors';
import Swal from 'sweetalert2';

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
      this.router.navigate(['/dashboard']);
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
        this.router.navigate(['/dashboard']);
      })
      .catch(e => console.log(e));
    })
    .catch(e => this.showError(e));
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
