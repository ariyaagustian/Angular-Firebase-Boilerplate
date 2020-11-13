import { AuthService } from './../../services/auth/auth.service';
import { UserService } from './../../services/user/user.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IUser } from './../../models/user';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnDestroy {

  user: Observable<IUser>;
  profileForm: FormGroup;

  subscription = new Subscription();

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private auth: AuthService) {
      this.user = this.userService.user;

      this.profileForm = this.fb.group({
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required])
      });

      this.profileForm.disable();

      this.subscription.add(
        this.userService.user.subscribe(u => {
          this.profileForm.get('firstName').setValue(u.FirstName);
          this.profileForm.get('lastName').setValue(u.LastName);
        })
      );

    }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  updateName(id: string) {
    this.userService.update({
      Id: id,
      FirstName: this.profileForm.get('firstName').value,
      LastName: this.profileForm.get('lastName').value
    });

    this.profileForm.disable();
  }

  uploadProfilePhoto(files: FileList, userId: string) {
    if (files.length > 1) {
      Swal.fire(
        'Too many files',
        'You can only upload a single file',
        'warning'
      );
    } else {
      const file = files.item(0);

      if (!file.type.includes('image')) {
        return Swal.fire(
          'Unsupported File Format',
          'We only support image files for profile photos.',
          'warning'
        );
      }

      this.userService.uploadProfilePhoto(userId, files.item(0));
    }
  }

  changePassword(email: string) {
    this.auth.changePassword(email);
  }


  deleteAccount(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure to delete the menu? It cannot be undone.',
      icon: 'warning',
      dangerMode: true,
      buttons: {
        cancel: 'Cancel',
        ok: 'OK'
      }
    } as any).then(result => {
      if (result.value) {
        this.userService.delete(id);
      }
    });
  }

}
