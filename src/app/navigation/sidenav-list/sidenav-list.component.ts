import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() sidenavClose = new EventEmitter<void>();
  isAuth: boolean = false;
  authSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSub = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  onClose() {
    this.sidenavClose.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }
}
