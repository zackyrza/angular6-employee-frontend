import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ConfigService} from '../config.service';
import {Router} from '@angular/router';
import {Employees} from '../home/home.component';
import {ErrorStateMatcher, MatSnackBar} from '@angular/material';

export interface Position {
  id: number;
  level: number;
  name: string;
}

export interface Division {
  id: number;
  name: string;
}

export interface Employees {
  createdDate: string;
  divisionId: number;
  id: number;
  lastPosition: string;
  name: string;
  nik: string;
  positionId: number;
  type: string;
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  isEdit: boolean;

  formControlNIK = new FormControl('', [
    Validators.required,
  ]);
  formControlName = new FormControl('', [
    Validators.required,
  ]);
  matcher = new MyErrorStateMatcher();

  selectedDivision = 0;
  selectedPosition = 0;
  lastPosition = null;
  type = 'DEMOTION';
  name = '';
  nik = '';
  id = 0;
  createdDate = new Date().toISOString();

  divisionList = [];
  positionList = [];

  constructor(private router: Router, private service: ConfigService, private _snackBar: MatSnackBar) {
  }

  onChangeEvent(event: any) {

    console.log(event.target.value);
    this.name = event.target.value;

  }

  onChangePosition(id: number): void {
    if (this.positionList.filter((t: Position) => t.id === this.selectedPosition).length > 0) {
      this.lastPosition = this.positionList.filter((t: Position) => t.id === this.selectedPosition)[0].name;
      if (this.positionList.filter((t: Position) => t.id === id)[0].level > this.positionList.filter((t: Position) => t.id === this.selectedPosition)[0].level) {
        this.type = 'PROMOTION';
      } else {
        this.type = 'DEMOTION';
      }
    }
    this.selectedPosition = id;
  }

  async ngOnInit(): Promise<any> {
    this.isEdit = this.router.url.split('/')[this.router.url.split('/').length - 1] !== 'input';
    await this.service.getDivisions().then((res: any) => {
      this.divisionList = res;
    });
    await this.service.getPositions().then((res: any) => {
      this.positionList = res;
    });

    if (this.isEdit) {
      this.service.getDataDetail(this.router.url.split('/')[this.router.url.split('/').length - 1]).then((res: Employees) => {
        this.id = res.id;
        this.name = res.name;
        this.nik = res.nik;
        this.selectedDivision = this.divisionList.filter(a => a.id === res.divisionId)[0].id;
        this.selectedPosition = this.positionList.filter(a => a.id === res.positionId)[0].id;
        this.lastPosition = res.lastPosition;
        this.createdDate = res.createdDate;
      });
    }
  }

  async save(): Promise<any> {
    let body: Employees;
    // ini kalo update data
    if (this.isEdit) {
      body = {
        name: this.name,
        divisionId: this.selectedDivision,
        positionId: this.selectedPosition,
        type: this.type,
        lastPosition: this.lastPosition,
        createdDate: this.createdDate,
        id: this.id,
        nik: this.nik,
      };

      await this.service.createOrUpdateData(body);
      this._snackBar.open('Berhasil mengubah data!', 'OK', {
        duration: 3500,
      });
      await this.router.navigate(['/']);

      return;
    }

    // ini kalo create data
    // @ts-ignore
    body = {
      name: this.name,
      divisionId: this.selectedDivision,
      positionId: this.selectedPosition,
      type: this.type
    };

    await this.service.createOrUpdateData(body);
    this._snackBar.open('Berhasil menginput data!', 'OK', {
      duration: 3500,
    });
    await this.router.navigate(['/']);
  }

}
