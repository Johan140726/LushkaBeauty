import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductoFormPage } from './admin-producto-form.page';

describe('AdminProductoFormPage', () => {
  let component: AdminProductoFormPage;
  let fixture: ComponentFixture<AdminProductoFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductoFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
