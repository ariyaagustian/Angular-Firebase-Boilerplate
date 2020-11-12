import { IUser } from './../../models/user';
import { AuthService } from './../../services/auth/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  signUpForm: FormGroup;


  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.signUpForm = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      acceptTerms: [false, Validators.requiredTrue]
    });
  }


  signUp() {
    const user: IUser = {
      Id: '',
      FirstName: this.signUpForm.get('firstName').value,
      LastName: this.signUpForm.get('lastName').value,
      Email: this.signUpForm.get('email').value,
      EmailVerified: false,
      Disabled: false,
      NumNotes: 0,
      ProfilePhoto: '',
      FCMToken: '',
      CreatedOn: 0,
    };

    this.auth.signUp(user, this.signUpForm.get('password').value);
  }

  ngOnInit() {
  }

}
