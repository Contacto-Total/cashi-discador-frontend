import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/whatsapp/auth.service';
import { LoginRequest } from '../../../../core/models/auth.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    LucideAngularModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  hidePassword = true;
  loading = false;
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    // Obtener la URL de retorno si existe
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLogin(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.snackBar.open('Por favor ingresa usuario y contraseña', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.snackBar.open('Login exitoso', 'Cerrar', {
          duration: 2000
        });

        // Redirigir según el rol del usuario
        const user = this.authService.getCurrentUser();
        const agentRoles = ['AGENT', 'ASESOR'];
        if (user?.role && agentRoles.includes(user.role)) {
          // Agentes van a WhatsApp
          this.router.navigate(['/whatsapp']);
        } else {
          // Admins y otros van a la URL de retorno o dashboard
          this.router.navigate([this.returnUrl]);
        }
      },
      error: (error) => {
        this.loading = false;
        const errorMsg = error.error || 'Error al iniciar sesión';
        this.snackBar.open(errorMsg, 'Cerrar', {
          duration: 4000
        });
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
