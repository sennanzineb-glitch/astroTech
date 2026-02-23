import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Etape2Component } from './etape2.component';

describe('Etape2Component', () => {
  let component: Etape2Component;
  let fixture: ComponentFixture<Etape2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Etape2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Etape2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
