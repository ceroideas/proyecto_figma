import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CreateProjectComponent } from 'src/app/components/create-project/create-project.component';
import { MessageComponent } from 'src/app/components/message/message.component';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';
import { TuiAvatar } from '@taiga-ui/kit';
import {
  TuiAutoColorPipe,

  TuiInitialsPipe,

} from '@taiga-ui/core';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [MessageComponent, CreateProjectComponent, CommonModule, TuiAvatar,  TuiAutoColorPipe, TuiInitialsPipe,],

  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  @ViewChild(CreateProjectComponent)
  createProjectComponent!: CreateProjectComponent;
  projects: any[] = [];
  userData!: any;
  project_edit!: any;
  selectedProjectIndex: number = -1;
  constructor(
    private projectSvc: ProjectService,
    private router: Router,
    private authSvc: AuthService
  ) {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      const user = JSON.parse(userFromStorage);
      this.userData = user;
    }
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
    /*     if (route !== 'build') {
      this.router.navigate([`home/${route}`]);
      localStorage.setItem('project', id);
    } else {
      this.router.navigate([`home/${route}/${id}`]);
      localStorage.setItem('project', id);
    } */
    localStorage.setItem('project', id);
    this.router.navigate([`home/${route}/${id}`]);
  }

  setProject(project: any) {
    if (this.createProjectComponent) {
      this.createProjectComponent.project_edit = project;
    }
    console.log(this.project_edit);
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

  async getProjects() {
   const projects = await firstValueFrom(this.projectSvc.getProjects())
   console.log(projects)
    this.projectSvc.getProjects().subscribe((res: any) => {
      console.log(res, 'RESPROYECT');
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
