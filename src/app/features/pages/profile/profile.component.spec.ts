import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, provideRouter, RouterLink } from '@angular/router';
import { UserService } from '../../../auth/services/user.service';
import { SupabaseBucketService } from '../../../services/supabase.service';
import Swal from 'sweetalert2';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let supabaseService: jasmine.SpyObj<SupabaseBucketService>;

  beforeEach(async () => {
    // Create spies for services
    userService = jasmine.createSpyObj('UserService', [
      'getUser',
      'editUser',
      'setUser',
    ]);
    supabaseService = jasmine.createSpyObj('SupabaseBucketService', [
      'upload',
      'deletePhoto',
    ]);

    // Simulate a logged-in user
    userService.getUser.and.returnValue(
      signal({
        username: 'testuser',
        name: 'Test User',
        bio: 'This is a test bio',
        password: 'TestPass123',
        profilePicture: '',
      })
    );

    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        ReactiveFormsModule,
        CommonModule,
        RouterLink,
      ],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: SupabaseBucketService, useValue: supabaseService },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the ProfileComponent and build form', () => {
    expect(component).toBeTruthy();
    expect(component.profileForm).toBeDefined();
    const controls = component.profileForm.controls;
    expect(controls['name']).toBeDefined();
    expect(controls['biography']).toBeDefined();
    expect(controls['password']).toBeDefined();
    expect(controls['confirmPassword']).toBeDefined();
  });

  describe('checkPasswords', () => {
    it('should return null if passwords match', () => {
      // Configuramos el grupo para que las contraseñas coincidan
      component.profileForm.get('password')?.setValue('mypassword');
      component.profileForm.get('confirmPassword')?.setValue('mypassword');
      const result = component['checkPasswords'](component.profileForm);
      expect(result).toBeNull();
    });

    it('should return an error if passwords do not match', () => {
      component.profileForm.get('password')?.setValue('password1');
      component.profileForm.get('confirmPassword')?.setValue('password2');
      const result = component['checkPasswords'](component.profileForm);
      expect(result).toEqual({ notSame: true });
    });

  });

  describe('onFileUpload', () => {
    let swalFireSpy: jasmine.Spy;

    beforeEach(() => {
      swalFireSpy = spyOn(Swal, 'fire').and.callThrough();
      spyOn(Swal, 'close').and.callThrough();
    });

    it('should upload profile photo successfully', fakeAsync(() => {
      const file = new File(['dummy content'], 'test.png', {
        type: 'image/png',
      });
      const event = {
        target: { files: [file], value: 'dummy' },
      } as unknown as Event;
      const uploadedUrl = 'newProfilePic.jpg';
      supabaseService.upload.and.returnValue(Promise.resolve(uploadedUrl));

      component.onFileUpload(event);
      tick();
      expect(component.uploadedPhoto).toEqual(uploadedUrl);
      expect(Swal.close).toHaveBeenCalled();
      flush();
    }));
  });

  describe('onEditProfile', () => {
    beforeEach(() => {
      // Configuramos el formulario con valores válidos
      component.profileForm.setValue({
        name: 'Updated Name',
        biography: 'Updated bio',
        password: 'Newpassword123*',
        confirmPassword: 'Newpassword123*',
      });
      component.uploadedPhoto = 'newPic.jpg';
    });
    
    it('should call service and show success message if form is valid', fakeAsync(() => {
      spyOn(Swal, 'fire');
      userService.editUser.and.returnValue(of({}));
      component.onSubmit();
      tick();
      expect(userService.editUser).toHaveBeenCalledWith({
        username: 'testuser',
        name: 'Updated Name',
        bio: 'Updated bio',
        password: 'Newpassword123*',
        profilePicture: 'newPic.jpg',
      });
      expect(component.userWasUpdated).toBeTrue();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          text: 'Cambios realizados',
          icon: 'success',
        })
      );
      flush();
    }));

    it('should show error if form is invalid', () => {
      spyOn(Swal, 'fire');
      // Hacemos el formulario inválido vaciando el nombre
      component.profileForm.get('name')?.setValue('');
      component.onSubmit();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          text: 'Debe diligenciar los campos correctamente',
          icon: 'error',
        })
      );
    });

    it('should show error if new password is insecure', () => {
      spyOn(Swal, 'fire');
      component.profileForm.get('password')?.setValue('mmmmmmmmmmmmmm');
      component.profileForm.get('confirmPassword')?.setValue('mmmmmmmmmmmmmm');
      component.onSubmit();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          text: 'Debe diligenciar los campos correctamente'
        })
      );
    });
  });
});
