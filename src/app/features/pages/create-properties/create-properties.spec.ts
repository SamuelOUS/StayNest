import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ModalService } from '../../../services/modal.service';
import Swal from 'sweetalert2';
import { CreatePropertiesComponent } from './create-properties.component';
import { PropertyService } from '../../services/property.service';
import { SupabaseBucketService } from '../../../services/supabase.service';

describe('CreatePropertiesComponent', () => {
  let component: CreatePropertiesComponent;
  let fixture: ComponentFixture<CreatePropertiesComponent>;
  let supabaseService: jasmine.SpyObj<SupabaseBucketService>;
  let propertyService: jasmine.SpyObj<PropertyService>;

  beforeEach(async () => {
    propertyService = jasmine.createSpyObj('PropertyService', [
      'createProperty',
    ]);
    supabaseService = jasmine.createSpyObj('SupabaseBucketService', [
      'upload',
      'deletePhoto',
    ]);

    await TestBed.configureTestingModule({
      imports: [CreatePropertiesComponent],
      providers: [
        PropertyService,
        ModalService,
        { provide: PropertyService, useValue: propertyService },
        { provide: SupabaseBucketService, useValue: supabaseService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and build the form', () => {
    expect(component).toBeTruthy();
    expect(component.createPropertyForm).toBeDefined();
    const controls = component.createPropertyForm.controls;
    expect(controls['title']).toBeDefined();
    expect(controls['address']).toBeDefined();
    expect(controls['bedrooms']).toBeDefined();
    expect(controls['capacity']).toBeDefined();
    expect(controls['bathrooms']).toBeDefined();
    expect(controls['description']).toBeDefined();
    expect(controls['price']).toBeDefined();
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.uploadedUrls = [
        { url: 'url1' },
        { url: 'url2' },
        { url: 'url4' },
        { url: 'url5' },
        { url: 'url6' },
      ];
      component.createPropertyForm.setValue({
        title: 'Test Name',
        address: 'test street',
        bedrooms: 2,
        capacity: 4,
        bathrooms: 1,
        description: 'Test description',
        price: 300,
      });
    });

    it('should show error if form is invalid', () => {
      spyOn(Swal, 'fire');
      component.createPropertyForm.get('title')?.setValue('');
      component.onSubmit();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
        })
      );
    });

    it('should show error if the fields are empty', () => {
      spyOn(Swal, 'fire');
      component.createPropertyForm.get('title')?.setValue('');
      component.createPropertyForm.get('address')?.setValue('');
      component.createPropertyForm.get('capacity')?.setValue('');
      component.createPropertyForm.get('description')?.setValue('');
      component.onSubmit();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
        })
      );
    });

    it('should show error if less than 4 photos are uploaded', () => {
      spyOn(Swal, 'fire');
      // Aseguramos que el formulario es válido pero tenemos menos de 4 fotos
      component.uploadedUrls = [
        { url: 'url1' },
        { url: 'url2' },
        { url: 'url3' },
      ];
      component.onSubmit();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
          text: 'Agrega al menos 4 fotos',
        })
      );
    });

    it('should show error if fields are negative numbers', () => {
      spyOn(Swal, 'fire');
      component.uploadedUrls = [
        { url: 'url1' },
        { url: 'url2' },
        { url: 'url4' },
        { url: 'url5' },
      ];
      component.createPropertyForm.setValue({
        title: -2,
        address: -2,
        bedrooms: -2,
        capacity: -2,
        bathrooms: -2,
        description: -3,
        price: -8,
      });
      component.onSubmit();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
        })
      );
    });

    it('should show error if more than 10 photos are uploaded', () => {
      spyOn(Swal, 'fire');
      component.uploadedUrls = [
        { url: 'url1' },
        { url: 'url2' },
        { url: 'url4' },
        { url: 'url5' },
        { url: 'url6' },
        { url: 'url7' },
        { url: 'url8' },
        { url: 'url9' },
        { url: 'url10' },
        { url: 'url11' },
      ];
      component.onSubmit();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'error',
        })
      );
    });

    it('should create property successfully and show success message', fakeAsync(() => {
      spyOn(Swal, 'fire');

      component.uploadedUrls = [
        { url: 'url1' },
        { url: 'url2' },
        { url: 'url3' },
        { url: 'url4' },
      ];

      propertyService.createProperty.and.stub();
      component.onSubmit();
      tick();
      expect(propertyService.createProperty).toHaveBeenCalledWith({
        photos: component.uploadedUrls,
        title: 'Test Name',
        address: 'test street',
        bedrooms: 2,
        capacity: 4,
        bathrooms: 1,
        description: 'Test description',
        pricePerNight: 300,
      });
      expect(component.savedProperty).toBeTrue();
      expect(Swal.fire).toHaveBeenCalledWith(
        jasmine.objectContaining({
          text: 'Propiedad guardada',
          icon: 'success',
        })
      );
    }));
  });

  describe('If user dindt create the property', () => {
    it('should call Service and delete every uploaded photo if property was not saved', () => {
      component.uploadedUrls = [{ url: 'url1' }, { url: 'url2' }];
      component.savedProperty = false;
      component.ngOnDestroy();
      expect(supabaseService.deletePhoto).toHaveBeenCalledTimes(2);
      expect(supabaseService.deletePhoto).toHaveBeenCalledWith(
        'url1',
        'staynest',
        ''
      );
      expect(supabaseService.deletePhoto).toHaveBeenCalledWith(
        'url2',
        'staynest',
        ''
      );
    });
  });
});
