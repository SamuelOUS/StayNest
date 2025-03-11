import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowPropertyComponent } from './show-property.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PropertyService } from '../../services/property.service';
import { UserService } from '../../../auth/services/user.service';
import { BookingsService } from '../../services/bookings.service';
import { signal } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import Swal from 'sweetalert2';

describe('PropertyComponent', () => {
  let swalFireSpy: jasmine.Spy;
  let component: ShowPropertyComponent;
  let fixture: ComponentFixture<ShowPropertyComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let propertyService: jasmine.SpyObj<PropertyService>;
  let bookingsService: jasmine.SpyObj<BookingsService>;
  let modalService: jasmine.SpyObj<ModalService>;

  beforeEach(async () => {
    propertyService = jasmine.createSpyObj('PropertyService', [
      'getProperty',
      'addReview',
    ]);
    userService = jasmine.createSpyObj('UserService', ['getUser']);
    modalService = jasmine.createSpyObj('ModalService', ['openModal']);
    bookingsService = jasmine.createSpyObj('BookingsService', [
      'createBooking',
    ]);

    // Mock de usuario
    userService.getUser.and.returnValue(
      signal({
        username: 'testuser',
        name: 'Test User',
        bio: 'This is a test bio',
        password: 'TestPass123',
        profilePicture: 'test.jpg',
      })
    );

    // Mock de propiedad
    propertyService.getProperty.and.returnValue(
      of({
        user: {
            username: 'testuser',
            name: 'Test User',
            bio: 'This is a test bio',
            profilePicture: 'test.jpg',
        },
        title: 'Test Property',
        address: '123 Test St.',
        pricePerNight: 100,
        photos: [
          { url: 'test.jpg' },
          { url: 'test2.jpg' },
          { url: 'test3.jpg' },
          { url: 'test4.jpg' },
        ],
        capacity: 4,
        reviews: [],
      })
    );

    await TestBed.configureTestingModule({
      imports: [ShowPropertyComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '123']]) } },
        },
        { provide: PropertyService, useValue: propertyService },
        { provide: UserService, useValue: userService },
        { provide: BookingsService, useValue: bookingsService },
        { provide: ModalService, useValue: modalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch property details on init', () => {
    expect(component.property).toBeDefined();
    expect(component.property.title).toEqual('Test Property');
    expect(component.property.address).toEqual('123 Test St.');
    expect(component.property.pricePerNight).toEqual(100);
  });

  it('should open login modal if user is not logged in', () => {
    userService.getUser.and.returnValue(signal({ username: '' })); // Usuario no autenticado
    component.openModal();
    expect(modalService.openModal).toHaveBeenCalled();
  });

  it('should not submit reservation if dates are missing', () => {
    spyOn(Swal, 'fire');
    component.submitReservation();
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        text: 'Por favor selecciona las fechas de inicio y fin.',
        icon: 'error',
      })
    );
  });

  it('should not submit reservation if start date is after end date', () => {
    spyOn(Swal, 'fire');
    component.selectedStartDate = '2025-06-10';
    component.selectedEndDate = '2025-06-05';
    component.submitReservation();
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        text: 'La fecha de inicio no puede ser posterior a la fecha de fin.',
        icon: 'error',
      })
    );
  });

  it('should submit reservation successfully', () => {
    spyOn(Swal, 'fire');
    component.selectedStartDate = '2025-06-01';
    component.selectedEndDate = '2025-06-05';
    bookingsService.createBooking.and.returnValue(
      of({
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-05'),
        totalPrice: 400,
      })
    );
    component.submitReservation();
    expect(bookingsService.createBooking).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(
      jasmine.objectContaining({
        icon: 'success',
      })
    );
  });

  it('should add a review', () => {
    spyOn(Swal, 'fire');
    component.newReviewComment = 'Great!';
    component.newRating = 4;
    component.addReview();
    propertyService.addReview.and.returnValue(
      of({
        comment: 'Great!',
        rating: 4,
        createdAt: new Date(Date.now()),
      })
    );
    expect(propertyService.addReview).toHaveBeenCalled();
    expect(component.newReviewComment).toBe('Great!');
  });

  it('should not add an empty review', () => {
    spyOn(Swal, 'fire');
    component.newReviewComment = '';
    component.addReview();
    expect(propertyService.addReview).not.toHaveBeenCalled();
  });
});
