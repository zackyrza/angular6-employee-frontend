import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ConfigService} from '../config.service';
import {MatSnackBar} from '@angular/material';

export interface PeriodicElement {
  id: string;
  nik: string;
  name: string;
  division: string;
  divisionId: number;
  position: string;
  positionId: number;
  type: string;
  last_position: string;
  created_date: string;
  button: any;
}

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

interface Country {
  name: string;
  flag: string;
  area: number;
  population: number;
}

const COUNTRIES: Country[] = [
  {
    name: 'Russia',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'United States',
    flag: 'a/a4/Flag_of_the_United_States.svg',
    area: 9629091,
    population: 324459463
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  }
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  dataEmployees: object[];
  dataList: object[];
  page = 1;
  pageSize = 4;
  collectionSize = 0;

  divisionList = [];
  positionList = [];

  constructor(private service: ConfigService, private _snackBar: MatSnackBar) {
  }

  refreshCountries() {
    this.dataEmployees = this.dataList.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  async ngOnInit(): Promise<any> {
    await this.service.getDivisions().then((res: any) => {
      this.divisionList = res;
    });
    await this.service.getPositions().then((res: any) => {
      this.positionList = res;
    });
    return this.service.getData().then((res: any) => {
      const data = res.map((t: Employees) => {
        return {
          ...t,
          position: this.positionList.filter(a => a.id === t.positionId)[0].name,
          division: this.divisionList.filter(a => a.id === t.divisionId)[0].name,
        };
      });
      this.dataEmployees = data;
      this.dataList = data;
      this.collectionSize = data.length;
      this.refreshCountries();
      return data;
    });
  }

  ngAfterViewInit(): void {
  }

  async delete(d: Employees) {
    if (confirm(`Anda yakin ingin menghapus ${d.name}?`)) {
      await this.service.deleteData(d.id);
      this._snackBar.open(`Berhasil menghapus ${d.name}`, 'OK', {
        duration: 3500,
      });
      await this.service.getData().then((res: any) => {
        const data = res.map((t: Employees) => {
          return {
            ...t,
            position: this.positionList.filter(a => a.id === t.positionId)[0].name,
            division: this.divisionList.filter(a => a.id === t.divisionId)[0].name,
          };
        });
        this.dataEmployees = data;
        return data;
      });
    }
  }

}
