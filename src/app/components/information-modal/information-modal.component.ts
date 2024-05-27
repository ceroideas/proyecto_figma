import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-information-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './information-modal.component.html',
  styleUrl: './information-modal.component.scss',
})
export class InformationModalComponent implements OnInit {
  clickedElement: number = 0;
  @Output() sendNodes = new EventEmitter<string>();

  searchTerm: string = '';
  @Input() datas: any = [];

  @Input() tierCeroValue: any;

  constructor() {}
  ngOnInit(): void {
    console.log(this.datas);
  }

  toggleActive(node: any) {
    node.isActive = !node.isActive;
  }

  deleteAll() {
    this.datas.forEach((node: any) => {
      node.isActive = false;
    });
  }

  get filteredDatas() {
    return this.datas.filter((data: { name: string }) =>
      data.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  save() {
    const selected = this.datas.filter((node: any) => node.isActive);

    this.sendNodes.emit(selected);
  }
}
