// @ts-nocheck

import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { User } from './user';
import { RegisterService } from './register.service';

import { NumberValidators } from '../shared/number.validator';
import { GenericValidator } from '../shared/generic-validator';

@Component({
  templateUrl: './register-edit.component.html'
})
export class RegisterEditComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];
  pageTitle = 'User Edit';
  errorMessage: string;
  userForm: FormGroup;
  user: User;
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  get tags(): FormArray {
    return this.userForm.get('tags') as FormArray;
  }

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private userService: RegisterService) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      name: {
        required: 'User name is required.',
        minlength: 'User name must be at least three characters.',
        maxlength: 'User name cannot exceed 50 characters.'
      },
      email: {
        required: 'User email is required.',
        minlength: 'User email must be @dmainname',
        maxlength: 'User email cannot exceed 20.'
      }       
         
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required,
                         Validators.minLength(3),
                         Validators.maxLength(50)]],
      email: ['', [Validators.required]],
        description: ['', []],
        address: ['', []],
        mobile: ['', []],
        postCode: ['', []],
    });

    // Read the user Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const id = + params.get('id');
        this.getUser(id);
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.userForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.userForm);
    });
  }

  addTag(): void {
    this.tags.push(new FormControl());
  }

  deleteTag(index: number): void {
    this.tags.removeAt(index);
    this.tags.markAsDirty();
  }

  getUser(id: number): void {
    this.userService.getUser(id)
      .subscribe({
        next: (user: User) => this.displayUser(user),
        error: err => this.errorMessage = err
      });
  }

  displayUser(user: User): void {
    if (this.userForm) {
      this.userForm.reset();
    }
    this.user = user;

    if (this.user.id === 0) {
      this.pageTitle = 'Add User';
    } else {
      this.pageTitle = `Edit User: ${this.user.name}`;
    }

    // Update the data on the form
    this.userForm.patchValue({
      name: this.user.name,
      description: this.user.description,
      email: this.user.email,
      address: this.user.address,
      mobile: this.user.mobile,
      postCode: this.user.postCode,

    });
    
  }

  deleteUser(): void {
    if (this.user.id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the user: ${this.user.name}?`)) {
        this.userService.deleteUser(Number(this.user.id))
          .subscribe({
            next: () => this.onSaveComplete(),
            error: err => this.errorMessage = err
          });
      }
    }
  }

  saveUser(): void {

    console.log("I am save");
    if (this.userForm.valid) {
      if (this.userForm.dirty) {
        const u = { ...this.user, ...this.userForm.value };

        if (u.id === 0) {
          this.userService.createUser(u)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        } else {
          this.userService.updateUser(u)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: err => this.errorMessage = err
            });
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.userForm.reset();
    this.router.navigate(['/users']);
  }
}
