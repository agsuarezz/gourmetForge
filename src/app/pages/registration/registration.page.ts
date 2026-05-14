import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private navCtrl = inject(NavController);

  registrationForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  async onRegister() {
    if (this.registrationForm.invalid) return;

    const { email, password, firstName, lastName } = this.registrationForm.value;

    try {
      const userCredential = await this.authService.signUp(email, password);
      await this.authService.updateUserProfile(userCredential.user.uid, { firstName, lastName });
      this.navCtrl.navigateRoot('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  }
}