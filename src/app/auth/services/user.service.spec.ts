import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from '../components/register/register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule], // Importamos ReactiveFormsModule para usar formularios reactivos
      declarations: [RegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if username is required', () => {
    const usernameControl = component.registerForm.get('username');
    usernameControl?.setValue('');
    usernameControl?.markAsTouched(); // Simula que el campo fue tocado

    fixture.detectChanges(); // Reflejar los cambios en el template

    const errorMessage = component.usernameErrors;
    expect(errorMessage).toBe('El nombre de usuario es obligatorio');
  });

  it('should show error if username is too short', () => {
    const usernameControl = component.registerForm.get('username');
    usernameControl?.setValue('abc'); // Menos de 8 caracteres
    usernameControl?.markAsTouched();

    fixture.detectChanges();

    const errorMessage = component.usernameErrors;
    expect(errorMessage).toBe('El nombre de usuario debe tener al menos 8 caracteres');
  });

  it('should show error if username is too long', () => {
    const usernameControl = component.registerForm.get('username');
    usernameControl?.setValue('a'.repeat(18)); // Más de 17 caracteres
    usernameControl?.markAsTouched();

    fixture.detectChanges();

    const errorMessage = component.usernameErrors;
    expect(errorMessage).toBe('El nombre de usuario no puede tener más de 17 caracteres');
  });

  it('should show error if username does not match pattern', () => {
    const usernameControl = component.registerForm.get('username');
    usernameControl?.setValue('123username'); // Empieza con un número, lo cual es inválido
    usernameControl?.markAsTouched();

    fixture.detectChanges();

    const errorMessage = component.usernameErrors;
    expect(errorMessage).toBe('El nombre de usuario debe comenzar con una letra y solo puede contener letras y números');
  });

  it('should not show any error if username is valid', () => {
    const usernameControl = component.registerForm.get('username');
    usernameControl?.setValue('validUser123'); // Nombre de usuario válido
    usernameControl?.markAsTouched();

    fixture.detectChanges();

    const errorMessage = component.usernameErrors;
    expect(errorMessage).toBe(''); // No debería haber errores
  });
});
