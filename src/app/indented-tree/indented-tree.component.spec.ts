import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndentedTreeComponent } from './indented-tree.component';

describe('IndentedTreeComponent', () => {
  let component: IndentedTreeComponent;
  let fixture: ComponentFixture<IndentedTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndentedTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndentedTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
