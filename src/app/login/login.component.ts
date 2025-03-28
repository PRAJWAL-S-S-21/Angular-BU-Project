import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChildrenOutletContexts, Router } from '@angular/router';
import { FormConfigService } from '../services/form-config.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent {

  form: FormGroup;
  isSubmitted: boolean = false;

  constructor(private formbuilder: FormBuilder,
    private context: ChildrenOutletContexts,
    private service: FormConfigService,
    private router: Router,
    private toaster: ToastrService
  ) {
    this.form = this.formbuilder.group({
      Username: ['', [Validators.required]],
      password: ['', [Validators.required]]


    })

  }


  hasDislayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
  }

  login() {
    this.isSubmitted = true;
    console.log(this.form.value)
    if (this.service.Login(this.form.get('Username')?.value, this.form.get('password')?.value)) {
      this.toaster.success('Login Successfull');
      this.router.navigateByUrl('/configure');
    }
    else {
      this.toaster.error("Login Unsuccessfull", 'Invalid login credentials')
    }
  }



}


