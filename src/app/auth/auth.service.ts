import { Injectable } from '@angular/core';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material';
import { UIService } from '../shared/ui.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated: boolean = false;
  authChange = new Subject<boolean>();

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private snackBar: MatSnackBar,
    private uiService: UIService
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubs();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  async registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(
        authData.email,
        authData.password
      );
      this.uiService.loadingStateChanged.next(false);
    } catch (error) {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar(error.message, null, 3000);
    }
  }

  async login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(
        authData.email,
        authData.password
      );
      this.uiService.loadingStateChanged.next(false);
    } catch (error) {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar(error.message, null, 3000);
    }
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
