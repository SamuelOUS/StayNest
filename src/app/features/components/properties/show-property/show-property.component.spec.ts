import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPropertyComponent } from './show-property.component';

describe('ShowPropertyComponent', () => {
  let component: ShowPropertyComponent;
  let fixture: ComponentFixture<ShowPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
