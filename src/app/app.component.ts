import { Component, inject } from '@angular/core';
import { FormField } from './models/form-field.model';
import { FormConfigService } from './services/form-config.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'member-registraion-form';

    service=inject(FormConfigService);

    constructor(private router:Router,private toastr:ToastrService){}

    Logout(){
        this.service.Logout();
        this.router.navigateByUrl('/register');
    } 

      ShowMsg(){
        if(!this.service.isLoggedIn())
        this.toastr.info('403 Forbidden','Only Admin can access')
      }
}
