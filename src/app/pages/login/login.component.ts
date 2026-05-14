import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private navCtrl = inject(NavController);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  async onLogin() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    try {
      await this.authService.signIn(email, password);
      this.navCtrl.navigateRoot('/favorites');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  }

  goToRegister() {
    this.navCtrl.navigateForward('/registration');
  }
}