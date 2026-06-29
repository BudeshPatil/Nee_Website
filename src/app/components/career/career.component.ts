import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../providers/contact/contact.service';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrl: './career.component.scss'
})
export class CareerComponent implements OnInit {
  addCareerForm: FormGroup;
  submitted = false;
  msg_success = false;
  msg_danger = false;
  throw_msg = '';
  documentFile: File | null = null;
  uploadFileName = '';
  // File Upload
	options: UploaderOptions;
	uploadInput: EventEmitter<UploadInput>;
  selectedFile:any;
	document:any;
  imagePath:any;
  constructor(
    private formBuilder: FormBuilder,
    private contactservice: ContactService,
  ) {
    this.addCareerForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      mobile: ['', Validators.required],
      subject: ['', Validators.required],
      type: ['full-time', Validators.required],
      documents: [''],
    });
    this.uploadInput = new EventEmitter<UploadInput>();
    this.imagePath = environment.baseUrl + '/public/';
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  prefillCareerForm(data: any) {
    this.addCareerForm.patchValue({
      firstname: data?.firstname,
      lastname: data?.lastname,
      email: data?.email,
      mobile: data?.mobile,
      subject: data?.subject,
      type: data?.type ?? 'full-time',
    });
  }

  public hasError(controlName: string, errorName: string) {
    const control = this.addCareerForm.get(controlName);
    return control?.hasError(errorName) && (control.dirty || control.touched || this.submitted);
  }

  public hasEmailError(controlName: string, errorName: string) {
    const control = this.addCareerForm.get(controlName);
    if (!control?.value) {
      return 'Email is required';
    }
    if (control.status === 'INVALID') {
      return 'Invalid Email';
    }
    return control?.hasError(errorName);
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.documentFile = file;
      this.uploadFileName = file.name;
      this.addCareerForm.get('documents')?.setValue(file.name);
    }
  }

  onSubmit() {
    this.submitted = true;
    let obj = this.addCareerForm.value;
    if (this.addCareerForm.invalid){
      return;
    }
    obj['documents'] = this.document;

    this.contactservice.addCareerForm(obj).subscribe({
      next: (response: any) => {
        if (response?.code === 200) {
          this.throw_msg = response.message || 'Your application has been submitted successfully.';
          this.msg_success = true;
          this.msg_danger = false;
          setTimeout(() => {
            this.msg_success = false;
          }, 5000);
          this.resetForm();
        } else {
          this.throw_msg = response?.message || 'Unable to submit your application right now.';
          this.msg_danger = true;
          this.msg_success = false;
        }
      },
      error: () => {
        this.throw_msg = 'An error occurred while sending your application.';
        this.msg_danger = true;
        this.msg_success = false;
      },
    });
  }

  resetForm() {
    this.submitted = false;
    this.addCareerForm.reset({
      type: 'full-time',
      documents: ''
    });
    this.documentFile = null;
    this.uploadFileName = '';
  }

  onUploadFile(output: UploadOutput): void {
    this.selectedFile = output;
    if (output.type === 'allAddedToQueue') {
      const event: UploadInput = {
        type: 'uploadAll',
        url: environment.baseUrl + '/api/career/addNewDocument',
        method: 'POST',
        data: {},
      };
      this.uploadInput.emit(event);
    }
    else if (output.type === 'done' && typeof output.file !== 'undefined') {
      this.document = output.file.response.result;
      this.throw_msg = output.file.response.message;
      this.msg_success = true;
    }
  }
}
