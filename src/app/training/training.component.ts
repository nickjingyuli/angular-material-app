import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from './training.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy {
  trainingStart: boolean = false;
  subscription: Subscription;
  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.subscription = this.trainingService.exerciseStart.subscribe(ex => {
      if (ex) {
        this.trainingStart = true;
      } else {
        this.trainingStart = false;
      }
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
