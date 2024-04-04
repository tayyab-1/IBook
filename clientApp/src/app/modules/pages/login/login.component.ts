import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IPerson } from 'src/app/core/interfaces';
import { AuthenticationService, GeneralService } from 'src/app/core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isConfirmLoading: boolean = false;
  clickedOnSubmit: boolean = false;
  passwordVisible: boolean = false;

  user: IPerson = {
    username: "",
    first_name: "",
    last_name: ""
  };
  loginForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private generalService: GeneralService,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })
  }

  ngOnInit(): void {
    this.authService.userData$.subscribe((res: IPerson) => {
      this.user = res;
    })
  }

  submit(): void {
    this.isConfirmLoading = this.clickedOnSubmit = true;
    if (this.loginForm.invalid) {
      this.generalService.createMessage('error', 'Credentials Required!')
      this.isConfirmLoading = false;
      return
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.generalService.createMessage('success', 'Login Successful!')
        this.isConfirmLoading = false;
        this.router.navigate(['/documents'])
      },
      error: () => {
        this.generalService.createMessage('error', 'Login Unsuccessful!')
        this.isConfirmLoading = false;
      }
    })
  }
}
