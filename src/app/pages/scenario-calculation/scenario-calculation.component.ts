import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageComponent } from 'src/app/components/message/message.component';
import { ProjectService } from 'src/app/services/project.service';
import { map } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
@Component({
  selector: 'app-scenario-calculation',
  providers: [ProjectService],
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent],
  templateUrl: './scenario-calculation.component.html',
  styleUrl: './scenario-calculation.component.scss',
})
export class ScenarioCalculationComponent implements OnInit {
  scenarioName: string = '';
  numEmployees: number = 100;
  salaryPerEmployee: number = 100000;
  sales: number = 150000;
  id!: any;
  nodes: any[] = [];
  defaultYear!: any;
  actualTarget!: any;
  private cursorPosition: number = 0;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectSvc: ProjectService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.id = this.route.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.projectSvc.getProject(this.id).subscribe((res: any) => {
      this.defaultYear = res.default_year;
      const constants = res.nodes.filter((node: any) => node.type === 1);

      this.nodes = constants.map((node: any, i: number) => {
        return {
          name: node.name,
          value: node.sceneries[0].years[this.defaultYear],
          maxValue:
            +node.sceneries[0].years[this.defaultYear] +
            +node.sceneries[0].years[this.defaultYear],
          valuePercentage: node.sceneries[0].years[this.defaultYear],
        };
      });

      console.log(this.nodes);
    });
  }

  updateValues() {
    // Logic to update values if needed
  }

  getPercentageChange(currentValue: number, baseValue: number): string {
    const percentage = (currentValue / baseValue) * 100;
    return percentage > 0
      ? `+${percentage.toFixed(0)}`
      : `${percentage.toFixed(0)}`;
  }

  previewImpact() {
    // Logic to preview impact
    console.log('Preview impact');
  }

  createScenario() {
    // Logic to create scenario
    console.log('Create scenario');
  }
  goBack(): void {
    this.router.navigate(['home/projects']);
  }

  formatMonto(monto: any): string {
    return Number(monto).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  selectedTd() {
    console.log('click td');
  }
  selectedDiv() {
    console.log('click div');
  }

  changeValue(event: Event, i: number): void {
    const target = event.target as HTMLElement;
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0).cloneRange();
    target.innerText;
    if (range && selection) {
      // Almacena la posición actual del cursor
      const cursorPosition = range.endOffset;

      // Actualiza el valor internamente eliminando comas y el ".00" si está presente
      let newValue = target.innerText.split(',').join('');

      // Elimina ".00" al final del número si está presente
      if (newValue.endsWith('.00')) {
        newValue = newValue.slice(0, -3);
      }

      this.nodes[i].value = newValue;

      // Actualiza el contenido editable
      this.actualTarget = target;
      target.innerText = newValue;

      // Usar setTimeout para restaurar la posición del cursor
      setTimeout(() => {
        // Si el cursor está en la última posición o más allá, lo coloca al final del texto
        const newCursorPosition = Math.min(cursorPosition, newValue.length);

        // Asegúrate de que el cursor se coloque en la posición correcta
        range.setStart(target.childNodes[0], newCursorPosition);
        range.setEnd(target.childNodes[0], newCursorPosition);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        console.log(range, i);
      }, 0);
    }
  }

  saveCursorPosition(element: any) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      this.cursorPosition = preCaretRange.toString().length;
    }
  }

  restoreCursorPosition(element: any) {
    const selection = window.getSelection();
    if (selection && element.childNodes.length > 0) {
      const range = document.createRange();
      const textNode = element.childNodes[0];
      const position = Math.min(
        this.cursorPosition,
        textNode.textContent?.length ?? 0
      );
      range.setStart(textNode, position);
      range.setEnd(textNode, position);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  preventNonNumericInput(event: KeyboardEvent): void {
    // Permitir solo números (teclas 0-9), retroceso (backspace), suprimir (delete), y teclas de navegación
    if (
      (event.key < '0' || event.key > '9') &&
      event.key !== 'Backspace' &&
      event.key !== 'Delete' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'Tab'
    ) {
      event.preventDefault();
    }
  }

  onFocus(event: Event, i: number): void {
    const target = event.target as HTMLElement;
    target.innerText = target.innerText.split(',').join('');
    if (target.innerText.endsWith('.00')) {
      target.innerText = target.innerText.slice(0, -3);
    }
    console.log(target.innerText);
    // Aquí puedes manejar cualquier lógica cuando se haga focus en el label
  }

  onBlur(event: Event, i: number): void {
    const target = event.target as HTMLElement;
    target.innerText = this.formatMonto(this.nodes[i].value);
    this.updateNodes();
  }

  updateNodes(): void {
    this.ngZone.run(() => {
      this.nodes = [...this.nodes];
    });

    console.log(this.nodes);
  }
}
