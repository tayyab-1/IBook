import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService, GeneralService } from 'src/app/core/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  isConfirmLoading: boolean = false;
  passwordVisible: boolean = false;
  clickedOnSubmit: boolean = false;
  signupForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private generalService: GeneralService
  ) {
    this.signupForm = new FormGroup({
      first_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      last_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      username: new FormControl('', [Validators.required, Validators.minLength(2)]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    })
  }

  submitHandler(): void {
    this.isConfirmLoading = this.clickedOnSubmit = true;
    if (this.signupForm.invalid) {
      this.generalService.createMessage('error', 'Please fill out the correct data.')
      this.isConfirmLoading = false;
      return
    }

    this.authService.register(this.signupForm.value).subscribe({
      next: _ => {
        this.generalService.createMessage('success', 'Registration Successful!')
        this.isConfirmLoading = false;
        this.router.navigate(['/documents'])
      },
      error: () => {
        this.generalService.createMessage('error', 'Registration Unsuccessful!')
        this.isConfirmLoading = false;
      }
    })
  }
}
