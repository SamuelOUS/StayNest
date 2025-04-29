import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { UserService } from '../../services/user.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ModalService } from '../../../services/modal.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import Swal from 'sweetalert2';
import { of } from 'rxjs';

describe('RegisterComponent', () => {

  // * Arrange (Preparar)

  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, NoopAnimationsModule],
      providers: [
        UserService,
        ModalService,
        { provide: UserService, useValue: userService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should build the form on initialization', () => {
    component.ngOnInit();
    expect(component.registerForm).toBeDefined();
    const controls = component.registerForm.controls;
    expect(controls['name']).toBeDefined();
    expect(controls['username']).toBeDefined();
    expect(controls['email']).toBeDefined();
    expect(controls['password']).toBeDefined();
    expect(controls['rePassword']).toBeDefined();
    expect(controls['isOwner']).toBeDefined();
  });

  describe('getPasswordStrength', () => {
    it('should return "Baja" for weak password', () => {
      expect(component.getPasswordStrength('abc')).toEqual('Baja');
    });

    it('should return "Media" for medium strength password', () => {
      // password length 8 with uppercase letter (strength = 2)
      const strength = component.getPasswordStrength('abcdefgA');
      expect(strength).toEqual('Media');
    });

    it('should return "Alta" for strong password', () => {
      // password with length>=8, uppercase, number and special char (strength = 4)
      const strength = component.getPasswordStrength('Abcdef1@');
      expect(strength).toEqual('Alta');
    });
  });

  // * Act (Actuar)

  describe('onRegister', () => {
    beforeEach(() => {
      component.registerForm.setValue({
        name: 'Test Name',
        username: 'username123',
        email: 'test1@example.com',
        password:   'Abcdefgh1@',
        rePassword: 'Abcdefgh1@',
        isOwner: false
      });
      // Simular que la contraseña tiene fuerza "Alta"
      component.passwordStrength = 'Alta';
    });

    it('should show error if form is invalid', () => {
      // * Arrange (Preparar)
      spyOn(Swal, 'fire');
      // * Act (Actuar)
      // Invalida el formulario borrando el nombre
      component.registerForm.get('username')?.setValue('user');
      component.onRegister();

      // * Assert (Afirmar)

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'error'
      }));
    });
    
    it('should show error if the fields are empty', () => {
      spyOn(Swal, 'fire');
      component.registerForm.get('name')?.setValue('');
      component.registerForm.get('username')?.setValue('');
      component.registerForm.get('password')?.setValue('');
      component.onRegister();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        icon: 'error'
      }));
    });

    // * Fluent Assertions

    it('should show error if password strength is not High', () => {

      // ? Espíe el método Swal.fire
      spyOn(Swal, 'fire');

      // ? Del formulario de registro obtenga el campo de la contraseña y asígnele un valor de 'abc'
      component.registerForm.get('password')?.setValue('abc');
      component.passwordStrength = 'Baja';
      // ? Llame al método de Registrar
      component.onRegister();

      // ? Se espera que Swal.fire se haya llamado con el mensaje de error conteniendo titulo, texto e ícono
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Mal registro :(',
        text: 'Contraseña insegura',
        icon: 'error'
      }));
    });

    it('should show error if passwords do not match', () => {
      // * Test Dobles 'Spy'
      spyOn(Swal, 'fire');
      component.registerForm.get('rePassword')?.setValue('Different1@');
      component.onRegister();
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        title: 'Las contraseñas no coinciden',
        text: 'Inténtalo de nuevo',
        icon: 'error'
      }));
    });

    it('should show error if name is invalid', () => {
      spyOn(Swal, 'fire');
      component.registerForm.get('name')?.setValue('****');
      fixture.detectChanges()
      expect(component.registerForm.valid).toBeFalse();
    });

    // * Lenguaje de Gherkin
    
    it('should show error if email is invalid', () => {
      spyOn(Swal, 'fire');
      component.registerForm.get('email')?.setValue('apla@gmail');
      fixture.detectChanges()
      // * Fluent Assertions
      expect(component.registerForm.valid).toBeFalse();
    });

    it('should register successfully and show success message', fakeAsync(() => {
      spyOn(Swal, 'fire');
      userService.register.and.returnValue(of({success:true}));
      component.onRegister();
      tick();
      expect(userService.register).toHaveBeenCalledWith({
        name: 'Test Name',
        username: 'username123',
        email: 'test1@example.com',
        password:   'Abcdefgh1@',
        isOwner: false
      });
      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
        text: 'Registro exitoso',
        icon: 'success'
      }));
    }));
  });
});
