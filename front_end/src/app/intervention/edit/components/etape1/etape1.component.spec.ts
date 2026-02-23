import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Etape1Component } from './etape1.component';

describe('Etape1Component', () => {
  let component: Etape1Component;
  let fixture: ComponentFixture<Etape1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Etape1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Etape1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
