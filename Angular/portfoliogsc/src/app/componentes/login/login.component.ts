import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginUsuario } from 'src/app/models/login-usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { TokenService } from 'src/app/servicios/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLogged = false;
  isLoggedFail = false;
  loginUsuario!: LoginUsuario;
  nombreUsuario!: string;
  password!: string;
  roles: string[] = [];
  errMsj!: string;
  formPersona: FormGroup;

  constructor(private tokenService: TokenService, private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {

    this.formPersona = this.formBuilder.group(
      {
        nombreUsuario: ['', [Validators.required, Validators.maxLength(45)]],
        password: ['', [Validators.required, Validators.minLength(4)]]
      }
    )
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoggedFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

  get NombreUsuario() {
    return this.formPersona.get('nombreUsuario');
  }
  get Password() {
    return this.formPersona.get('password');
  }

  onLogin(): void {
    this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);
    this.authService.login(this.loginUsuario).subscribe(
      data => {
        this.isLogged = true;
        this.isLoggedFail = false;
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        this.roles = data.authorities;
        this.router.navigate([''])
      }, err => {
        this.isLogged = false;
        this.isLoggedFail = true;
        this.errMsj = err.error.mensaje;
        console.log(this.errMsj);
      })
  }
}
