import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CreateProjectComponent } from 'src/app/components/create-project/create-project.component';
import { MessageComponent } from 'src/app/components/message/message.component';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MessageComponent, CreateProjectComponent, CommonModule],
  providers: [ProjectService],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  projects: any[] = [];
  selectedProjectIndex: number = -1;
  constructor(private projectSvc: ProjectService, private router: Router) {
    this.getProjects();
  }

  alert() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'question',
      iconColor: '#BC5800',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        confirmButton: 'confirm',
        cancelButton: 'cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        });
      }
    });
  }

  redirect(event: Event, route: string, id: any) {
    event.stopPropagation();
    if (route !== 'build') {
      this.router.navigate([`home/${route}`]);
      localStorage.setItem('project', id);
    } else {
      this.router.navigate([`home/${route}/${id}`]);
      localStorage.setItem('project', id);
    }
  }

  convertDateFormat(originalDate: string): string {
    const date = new Date(originalDate);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    // Ensure that day and month have two digits
    const formattedDay = day < 10 ? `0${day}` : day.toString();
    const formattedMonth = month < 10 ? `0${month}` : month.toString();

    return `${formattedDay}/${formattedMonth}/${year}`;
  }

  getProjects() {
    this.projectSvc.getProjects().subscribe((res: any) => {
      this.projects = res;
    });
  }

  onDivClick(index: number): void {
    this.selectedProjectIndex =
      this.selectedProjectIndex === index ? -1 : index;
  }
  deleteProject(id: any) {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'No podras revertir esta accion',
      icon: 'question',
      iconColor: '#BC5800',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'confirm',
        cancelButton: 'cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectSvc.deleteProject(id).subscribe((res: any) => {
          Swal.fire({
            title: 'Borrado!',
            text: 'El proyecto fue borrado con exito!',
            icon: 'success',
          });
          this.getProjects();
        });
      }
    });
  }
}
