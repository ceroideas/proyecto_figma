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
  numEmployees: number = 0;
  salaryPerEmployee: number = 100000;
  sales: number = 150000;
  id!: any;
  tierCero!: any;
  nodes: any[] = [];
  defaultYear!: any;
  actualTarget!: any;
  scenarioYears: any = {};
  nodeIndex: any[] = [];
  selectedNodes: any[] = [];
  showNodes: any = [];
  percentageGrow: any = 0;
  allNodes: any = [];
  calculation: any[] = [];
  showPreview: boolean = false;
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
      this.allNodes = [...res.nodes];
      this.defaultYear = res.default_year;
      this.scenarioYears = res.clean_sceneries[0].years;
      console.log(this.scenarioYears);
      const constants = res.nodes.filter((node: any) => node.type === 1);
      console.log(res);
      this.nodes = constants.map((node: any, i: number) => {
        return {
          id: node.id,
          name: node.name,
          value: node.sceneries[0].years[this.defaultYear],
          staticValue: node.sceneries[0].years[this.defaultYear],
          maxValue: Math.round(
            +node.sceneries[0].years[this.defaultYear] +
              +node.sceneries[0].years[this.defaultYear]
          ),

          valuePercentage: node.sceneries[0].years[this.defaultYear],
        };
      });
      this.tierCero = res.nodes.find((node: any) => node.tier == 0);
      console.log(this.tierCero, 'CERO');
    });
  }

  trackByNodeId(index: number, node: any): any {
    return node.id; // o cualquier otra propiedad única del nodo
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
    this.showPreview = this.showPreview ? false : this.showPreview;
    this.calculatedNode();
    this.showPreview = true;
  }

  createScenario() {
    const newScenarios: any[] = [];
    for (let i = 0; i < this.nodes.length; i++) {
      const element = this.nodes[i];

      // Crear una copia del objeto scenarioYears
      const scenarioYearsCopy = { ...this.scenarioYears };

      for (const year in scenarioYearsCopy) {
        if (scenarioYearsCopy.hasOwnProperty(year)) {
          scenarioYearsCopy[year] = element.value;
        }
      }

      const newScenario = {
        node_id: element.id,
        name: this.scenarioName,
        years: scenarioYearsCopy, // Usar la copia aquí
        status: 1,
      };

      newScenarios.push(newScenario);
    }
    console.log(newScenarios);
    this.projectSvc
      .saveSceneryNoPropagation({ data: newScenarios })
      .subscribe((res: any) => {
        this.router.navigate([`home/build/${this.id}`]);
      });
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

      this.nodes[i].value = +newValue;

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

  changePercentage(event: Event) {
    const target = event.target as HTMLElement;
    this.percentageGrow = target.innerText;
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
    // Permitir solo números (teclas 0-9), retroceso (backspace), suprimir (delete), teclas de navegación y punto decimal
    if (
      (event.key < '0' || event.key > '9') &&
      event.key !== 'Backspace' &&
      event.key !== 'Delete' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'Tab' &&
      event.key !== '.'
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
  }

  onBlur(event: Event, i: number): void {
    const target = event.target as HTMLElement;
    target.innerText = this.formatMonto(this.nodes[i].value);
    const nodes = [...this.nodes];

    this.nodes = [];
    setTimeout(() => {
      this.nodes = nodes;
    }, 0);
  }

  toggleActive(node: any, i: any) {
    let nodeCount = 0;

    for (let i = 0; i < this.nodes.length; i++) {
      const element = this.nodes[i];

      if (element?.isSelect) {
        nodeCount++;

        if (nodeCount === 2) {
          this.nodes[this.nodeIndex[0]].isSelect = false;
          this.nodeIndex.shift();
          break;
        }
      }
    }

    if (!node.isSelect) {
      this.nodeIndex.push(i);
      node.isSelect = !node.isSelect;
    }
  }

  calculatedNode() {
    if (this.nodeIndex.length === 2) {
      this.showNodes = [
        this.nodes[this.nodeIndex[0]],
        this.nodes[this.nodeIndex[1]],
      ];

      for (let i = 0; i < this.showNodes.length; i++) {
        const element = this.showNodes[i];
        let decimalPercentage =
          parseFloat(this.percentageGrow ? this.percentageGrow : 0) / 100;

        let years: any = { ...this.scenarioYears };
        const keys = Object.keys(this.scenarioYears);
        const index = keys.indexOf(`${this.defaultYear}`);
        let indexNegative = -index;

        let defaultValue = +element.value;

        for (let year in years) {
          years[year] =
            defaultValue + defaultValue * (decimalPercentage * indexNegative);

          ++indexNegative;
        }

        const values = Object.values(years);
        this.showNodes[i].newValues = values;
      }

      var formula = this.tierCero.formula;
      const newOperation: any[] = [];

      console.log(this.showNodes, 'NODES');
      this.test();
    }
  }

  applyGrowth() {
    let decimalPercentage = parseFloat('10') / 100;

    let years: any = [...this.scenarioYears];

    let defaultValue = parseFloat(years[this.defaultYear]);

    for (let year in years) {
      if (parseInt(year) > this.defaultYear) {
        years[year] = defaultValue * (1 + decimalPercentage);
        defaultValue = parseFloat(years[year]);
      }
    }
    const values = Object.values(years);
  }

  async recursiveCalculateNodeNewValue(
    _node: any,
    nodes: any,
    selectId: number
  ) {
    let formula: any = [];
    let aux;
    let csvData: any = {};

    for (let i = 0; i < _node.formula.length; i++) {
      var nodeId = _node.formula[i];

      if (typeof nodeId === 'number') {
        var node = nodes.find((node: any) => node.id == nodeId);

        if (node.type == 1) {
          const value = node.newValue;
          formula.push(value);
        } else {
          // Utiliza await para esperar la resolución de la función recursiva
          const form = await this.recursiveCalculateNodeNewValue(
            node,
            nodes,
            selectId
          );
          formula.push('(' + form + ')');
        }
      } else {
        formula.push(nodeId);
      }
    }

    return formula;
  }
  async recursiveCalculateNode(_node: any, nodes: any, selectId: number) {
    let formula: any = [];
    let aux;
    let csvData: any = {};

    for (let i = 0; i < _node.formula.length; i++) {
      var nodeId = _node.formula[i];

      if (typeof nodeId === 'number' && nodeId != selectId) {
        var node = nodes.find((node: any) => node.id == nodeId);

        if (node.type == 1) {
          const value = node.oldValue;
          formula.push(value);
        } else {
          // Utiliza await para esperar la resolución de la función recursiva
          const form = await this.recursiveCalculateNode(node, nodes, selectId);
          /*formula.push(await this.recursiveCalculate(node))*/ formula.push(
            '(' + form + ')'
          );
        }
      } else if (typeof nodeId === 'number' && nodeId == selectId) {
        var node = nodes.find((node: any) => node.id == nodeId);

        if (node.type == 1) {
          const value = node.newValue;

          formula.push(value);
        } else {
          let formula2 = await this.recursiveCalculateNodeNewValue(
            node,
            nodes,
            selectId
          );
          formula.push('(' + formula2 + ')');
        }
      } else {
        formula.push(nodeId);
      }
    }

    return formula;
  }
  async calculateNode(nodos: any, selectId: number, tierCeroValue: any) {
    const formulaCero = this.tierCero.formula;

    let formula: any = [];

    for (let i = 0; i < formulaCero.formula.length; i++) {
      var nodeId = formulaCero.formula[i];

      if (typeof nodeId === 'number' && nodeId != selectId) {
        var node = nodos.find((node: any) => node.id == nodeId);

        if (node.type == 1) {
          const value = node.oldValue;

          formula.push(value);
        } else {
          let formula2 = await this.recursiveCalculateNode(
            node,
            nodos,
            selectId
          );
          formula.push('(' + formula2 + ')');
        }
      } else if (typeof nodeId === 'number' && nodeId == selectId) {
        var node = nodos.find((node: any) => node.id == nodeId);

        if (node.type == 1) {
          const value = node.newValue;

          formula.push(value);
        } else {
          let formula2 = await this.recursiveCalculateNodeNewValue(
            node,
            nodos,
            selectId
          );
          formula.push('(' + formula2 + ')');
        }
      } else {
        formula.push(nodeId);
      }
    }

    const operation =
      eval(formula.flat(5).join('').replaceAll(',', '')) - tierCeroValue;

    return operation;
  }

  test() {
    this.calculation = [];
    for (let i = 0; i < this.showNodes[0].newValues.length; i++) {
      const value1 = this.showNodes[1].newValues[i];
      const nodeId1 = this.showNodes[1].id;
      let valueCalculated = [];

      for (let i = 0; i < this.showNodes[1].newValues.length; i++) {
        const value0 = this.showNodes[0].newValues[i];
        const nodeId0 = this.showNodes[0].id;
        let formula: any = [];
        for (let i = 0; i < this.tierCero.formula.length; i++) {
          const nodeId = this.tierCero.formula[i];
          if (typeof nodeId === 'number') {
            if (nodeId == nodeId0) {
              formula.push(value0);
            } else if (nodeId == nodeId1) {
              formula.push(value1);
            } else {
              var node = this.allNodes.find((node: any) => node.id == nodeId);
              if (node.type == 1) {
                const value = node.sceneries[0].years[this.defaultYear];

                formula.push(+value);
              }
            }
          } else {
            formula.push(nodeId);
          }
        }
        valueCalculated.push(
          eval(formula.flat(5).join('').replaceAll(',', '')) -
            this.tierCero.calculated[0].years[this.defaultYear]
        );
      }
      this.calculation.push(valueCalculated);
    }
    console.log(this.calculation);
  }
}
