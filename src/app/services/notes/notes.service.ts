import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { INote } from './../../models/note';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  notes: Observable<INote[]>;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.notes = this.auth.user.pipe(
      switchMap(user =>
        !user
          ? null
          : this.db
              .collection<INote>('Notes', x =>
                x.where('Author', '==', user.uid)
              )
              .valueChanges()
      )
    );
  }

  addNote(note: INote) {
    note.Id = this.db.createId();
    note.CreatedOn = Date.now();

    return this.db
      .collection('Notes')
      .doc(note.Id)
      .set(note);
  }

  getNote(id: string) {
    return this.db
      .collection('Notes')
      .doc<INote>(id)
      .valueChanges();
  }

  updateNote(note: INote) {
    return this.db
      .collection('Notes')
      .doc(note.Id)
      .set(note, { merge: true });
  }

  deleteNote(id: string) {
    return this.db
      .collection('Notes')
      .doc(id)
      .delete();
  }
}
