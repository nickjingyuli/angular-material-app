import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  isLoading = true;
  sub: Subscription;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    this.sub = this.trainingService.exercisesChanged.subscribe(exercises => {
      this.exercises = exercises;
      this.isLoading = false;
    });
    this.fetchExercises();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  fetchExercises() {
    this.isLoading = true;
    this.trainingService.fetchAvailableExercises();
  }

  onStart(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
