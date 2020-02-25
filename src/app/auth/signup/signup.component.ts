import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: Date;
  isLoading = false;
  private sub: Subscription;
  constructor(private authService: AuthService, private uiService: UIService) {}

  ngOnInit() {
    this.sub = this.uiService.loadingStateChanged.subscribe(status => {
      this.isLoading = status;
    });
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  onSubmit(f: NgForm) {
    this.authService.registerUser({
      email: f.value.email,
      password: f.value.password
    });
  }
}
