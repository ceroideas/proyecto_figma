import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSubject = new BehaviorSubject<boolean>(false);
  public data$ = this.dataSubject.asObservable();
  dataNodes: any[] = [];
  tierCero: any;
  tierCeroData: any[] = [];

  constructor() {}

  deleteEsceneries(data: boolean) {
    this.dataSubject.next(data);
  }
}
