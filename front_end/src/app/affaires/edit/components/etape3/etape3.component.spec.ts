import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Etape3Component } from './etape3.component';

describe('Etape3Component', () => {
  let component: Etape3Component;
  let fixture: ComponentFixture<Etape3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Etape3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Etape3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
