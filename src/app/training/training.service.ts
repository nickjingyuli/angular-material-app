import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject, Subscription, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { error } from 'protractor';
import { UIService } from '../shared/ui.service';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  exercisesChanged = new Subject<Exercise[]>();
  exerciseStart = new Subject<Exercise>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService) {}

  fetchAvailableExercises() {
    this.fbSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.data()['name'],
                duration: doc.payload.doc.data()['duration'],
                calories: doc.payload.doc.data()['calories']
              };
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
          },
          error => {
            this.exercisesChanged.next(null);
            this.uiService.showSnackbar(
              'Fetching exercises failed, please try again',
              null,
              3000
            );
          }
        )
    );
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    this.exerciseStart.next(this.runningExercise);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  completeExercise() {
    this.addDataToDB({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseStart.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDB({
      ...this.runningExercise,
      duration: (this.runningExercise.duration * progress) / 100,
      calories: (this.runningExercise.calories * progress) / 100,
      date: new Date(),
      state: 'canceled'
    });
    this.runningExercise = null;
    this.exerciseStart.next(null);
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.finishedExercisesChanged.next(exercises);
        })
    );
  }

  cancelSubs() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDB(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
