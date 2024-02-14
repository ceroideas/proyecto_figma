import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataSubject = new BehaviorSubject<boolean>(false);
  public data$ = this.dataSubject.asObservable();

  deleteEsceneries(data: boolean) {
    this.dataSubject.next(data);
  }
}
