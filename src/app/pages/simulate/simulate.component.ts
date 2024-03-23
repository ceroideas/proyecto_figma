import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-simulate',
  providers: [ProjectService],
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulate.component.html',
  styleUrl: './simulate.component.scss',
})
export class SimulateComponent implements OnInit {
  id!: any;
  nodes: any[] = [];
  isSelectedAll: boolean = false;

  constructor(
    private projectSvc: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.projectSvc.getProject(this.id).subscribe((res: any) => {
      this.nodes = res.nodes;
      console.log(this.nodes);
    });
  }

  toggleActive(node: any) {
    node.isActive = !node.isActive;
    this.getNumberOfActiveNodes();
  }

  toggleSelectAll() {
    this.isSelectedAll = !this.isSelectedAll;
    console.log(this.nodes);
    this.nodes.forEach((node) => (node.isActive = this.isSelectedAll));
  }

  getNumberOfActiveNodes(): number {
    return this.nodes.filter((node) => node.isActive).length;
  }
}
