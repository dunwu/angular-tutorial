import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFancyExampleComponent } from './card-fancy-example.component';

describe('CardFancyExampleComponent', () => {
  let component: CardFancyExampleComponent;
  let fixture: ComponentFixture<CardFancyExampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardFancyExampleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardFancyExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
