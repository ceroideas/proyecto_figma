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
  userData: any = {};
  emailDataObject!: any;
  isLoading: boolean = false;
  nodes: any[] = [];

  constructor() {}

  deleteEsceneries(data: boolean) {
    this.dataSubject.next(data);
  }

  setNodes(nodes: any[]) {
    this.nodes = nodes;
  }

  getNodes(): any[] {
    return this.nodes;
  }

  emailData(emailData: any) {
    this.emailDataObject = emailData;
  }

  getEmailData(): any {
    return this.emailDataObject;
  }
}
