import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Injectable({ providedIn: 'root' })
export class UIService {
  loadingStateChanged = new Subject<boolean>();
  constructor(private snackbar: MatSnackBar) {}

  showSnackbar(msg, action, duration) {
    this.snackbar.open(msg, action, { duration: duration });
  }
}
