import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { async } from 'rxjs';

import { MessageComponent } from 'src/app/components/message/message.component';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';

import { PipesModule } from 'src/app/pipes/pipes.module';
import { DataService } from 'src/app/services/data-service.service';
import { ProjectService } from 'src/app/services/project.service';
declare var bootstrap: any;
@Component({
  selector: 'app-inspect',
  providers: [ProjectService],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    MessageComponent,
    SpinnerComponent,
  ],
  templateUrl: './inspect.component.html',
  styleUrl: './inspect.component.scss',
})
export class InspectComponent implements OnInit {
  id!: any;
  nodes: any[] = [];
  selectedIndex: number | null = null;
  clickedElement: number = 0;
  barData: any = [];
  datas: any[] = [];
  maxBarHeight: number = 160;
  minBarWidth: number = 7;
  isLoading: boolean = false;
  tierCero: any = {};
  years: any[] = [];
  yearIndex: any[] = [];

  valueToShow: any[] = [];
  tierCeroValue: any = 0;
  variableData = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectSvc: ProjectService,
    private dataSvc: DataService
  ) {}
  ngOnInit(): void {
    this.valueToShow = [];
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.id = this.route.snapshot.params['id'];
    this.isLoading = true;
    this.projectSvc.getProject(this.id).subscribe((res: any) => {
      if (res.nodes.length > 0) {
        this.nodes = res.nodes.map((node: any) => {
          if (node.type === 2) {
            node.calculated = node.calculated.map((obj: any, i: number) => {
              obj.newName = abc.charAt(i);
              return obj;
            });
          } else {
            node.sceneries = node.sceneries.map((obj: any, i: number) => {
              obj.newName = abc.charAt(i);
              return obj;
            });
          }
          return node; // Importante: devolver el nodo modificado
        });

        const nodes = res.nodes.map((node: any) => {
          return {
            tier: 'L' + node.tier,
            value: '0',
            description: node.name,
          };
        });

        this.datas = nodes.reverse();

        const node = res.nodes?.find((node: any) => node.tier == 0);

        if (node?.type === 2) {
          this.tierCero = res.nodes
            .find((node: any) => node.tier == 0)
            .calculated.map((obj: any, i: number) => {
              obj.newName = abc.charAt(i);

              return obj;
            });
        } else {
          this.tierCero = res.nodes
            .find((node: any) => node.tier == 0)
            .sceneries.map((obj: any, i: number) => {
              obj.newName = abc.charAt(i);

              return obj;
            });
        }

        let array: any[] = [];
        const keys = Object.keys(this.tierCero[0].years);
        for (let i = 0; i < keys.length; i++) {
          const yearKey = keys[i];
          for (let i = 0; i < this.tierCero.length; i++) {
            const scenerie = this.tierCero[i];

            const newObj = {
              name: scenerie.newName,
              year: yearKey,
              value: scenerie.years[yearKey],
              originalNAme: scenerie.name,
            };
            array.push(newObj);
          }
        }

        const valoresAños: any[] = [];

        array.forEach((obj: any) => {
          this.valueToShow.push(obj.value);

          const valueWithoutDecimals = obj.value
            .toString()
            .replace(/\.\d{2}$/, '');

          // Eliminar tanto los puntos como las comas del valor
          const cleanValue = valueWithoutDecimals
            .toString()
            .replace(/[,.]/g, '');

          // Convertir el valor a un número
          const numericValue = parseFloat(cleanValue);

          // Verificar si el valor es un número válido
          if (!isNaN(numericValue)) {
            valoresAños.push(numericValue);
          } else {
            console.log('Valor no válido:', obj.value);
          }
        });
        this.years = array;

        this.barData = valoresAños;
        this.isLoading = false;
      }

      this.isLoading = false;
    });
  }

  calculateHeight(value: number): string {
    const maxData = Math.max(...this.barData);
    let normalizedHeight = (value / maxData) * this.maxBarHeight;
    normalizedHeight = Math.max(normalizedHeight, this.minBarWidth);
    return `${normalizedHeight}px`;
  }

  toggleActive(year: any, i: any) {
    let yearCount = 0;

    for (let i = 0; i < this.years.length; i++) {
      const element = this.years[i];

      if (element?.isSelect) {
        yearCount++;

        if (yearCount === 2) {
          this.years[this.yearIndex[0]].isSelect = false;
          this.yearIndex.shift();
          break;
        }
      }
    }

    if (!year.isSelect) {
      this.yearIndex.push(i);
      year.isSelect = !year.isSelect;
    }

    this.calculatedNode();
  }

  showValue(i: any): void {
    const valueDiv = document.getElementById(`${i}`);

    if (valueDiv?.style.display === 'none') {
      valueDiv.style.display = 'block';
    }
  }

  hideValue(i: any): void {
    const valueDiv = document.getElementById(`${i}`);

    if (valueDiv?.style.display === 'block') {
      valueDiv.style.display = 'none';
    }
  }

  async calculatedNode() {
    if (this.yearIndex.length === 2) {
      this.isLoading = true;
      const years = [
        this.years[this.yearIndex[0]],
        this.years[this.yearIndex[1]],
      ];
      this.dataSvc.tierCeroData = years;

      let nodos: any = [];
      for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];

        let yearValues: any = {};
        for (let i = 0; i < years.length; i++) {
          const year = years[i];
          if (node.type === 2) {
            const scenerie: any = node.calculated.find(
              (node: any) => node.newName == year.name
            );
            const yearValue = scenerie.years[`${year.year}`];

            if (yearValues.oldValue || yearValues.oldValue == 0) {
              yearValues = { ...yearValues, newValue: yearValue };
            } else {
              yearValues = { ...yearValues, oldValue: yearValue };
            }
          } else {
            const scenerie = node.sceneries.find(
              (node: any) => node.newName == year.name
            );
            const yearValue = scenerie.years[`${year.year}`];

            if (yearValues.oldValue || yearValues.oldValue == 0) {
              yearValues = { ...yearValues, newValue: yearValue };
            } else {
              yearValues = { ...yearValues, oldValue: yearValue };
            }
          }
        }

        yearValues = { ...yearValues, tier: 'L' + node.tier };
        yearValues = { ...yearValues, name: node.name };
        yearValues = { ...yearValues, id: node.id };
        yearValues = { ...yearValues, type: node.type };
        yearValues = { ...yearValues, formula: node.formula };

        nodos.push(yearValues);
      }

      var nodosNoEdit = [...nodos];
      const otherValues: any[] = [];

      var formula = nodos.find((nodo: any) => nodo.tier == 'L0').formula;
      var tierCeroValue = nodos.find((nodo: any) => nodo.tier == 'L0').oldValue;
      const newOperation: any[] = [];

      for (let i = 0; i < formula.length; i++) {
        const element = formula[i];

        if (Number.isInteger(element)) {
          const year = nodos.find((nodo: any) => nodo.id == element).oldValue;
          newOperation.push(+year);
        } else {
          newOperation.push(element);
        }
      }

      const formulasArray: any[] = [];

      function findNodes(nodo: any) {
        const formula: any[] = [];

        for (let i = 0; i < nodo.formula.length; i++) {
          const element = nodo.formula[i];
          if (Number.isInteger(element)) {
            const year = nodos.find(
              (nodo2: any) => nodo2.id == element
            ).oldValue;
            formula.push(+year);
          } else {
            formula.push(element);
          }
        }

        for (let i = 0; i < formula.length; i++) {
          const element = nodo.formula[i];

          if (Number.isInteger(element)) {
            const formula2 = [...formula];
            const index = nodo.formula.indexOf(element);

            const node = nodos.find((nodo: any) => nodo.id == element);

            formula2[index] = node.newValue;

            otherValues.push({
              id: node.id,
              tier: node.tier,
              name: node.name,
              value: eval(formula2.join(' ')) - nodo.oldValue,
            });
          }
        }
      }

      /*      const diferencias = await nodos
        .map(  (par: any) => {
          const formulaCopy = [...newOperation];

          const i = formula.indexOf(par.id);

          formulaCopy[i] = +par.newValue;

          formulasArray.push(formulaCopy.join(''));

          if (par.type == 2) {
            findNodes(par);
            var result = this.verificarOperadores(par.formula, nodos);

            const sumaTotal = result?.interactions?.reduce(
              (acumulador: any, objeto: any) => {
                return acumulador + objeto.value;
              },
              0
            );

            if (result.directImpacts?.length > 0) {
              for (let i = 0; i < result.directImpacts.length; i++) {
                const element = result.directImpacts[i];

                const other = {
                  tier: par.tier,
                  name: element.variableName + ' (Direct impact)',
                  value: element.impact,
                };

                
              }
            }

            if (sumaTotal !== undefined && sumaTotal >= 1) {
              var other = {
                tier: par.tier,
                name: 'Otros valores',
                value: sumaTotal,
              };

              
            }
          }
    
          var monto1 = parseFloat(par.oldValue.toString().replace(/,/g, ''));
          var monto2 = parseFloat(par.newValue.toString().replace(/,/g, ''));

            const value =  this.calculateNode(nodosNoEdit,par.id,tierCeroValue)

           
          return {
            id: par.id,
            tier: par.tier,
            name: par.name,
            value: value,
            combination: result == 'combinacion' ? true : false,
          };
        })
        .reverse();*/
      const diferencias = await Promise.all(
        nodos.map(async (par: any) => {
          const value = await this.calculateNode(
            nodosNoEdit,
            par.id,
            tierCeroValue
          );

          return {
            id: par.id,
            tier: par.tier,
            name: par.name,
            value: value,
            /*combination: result == 'combinacion' ? true : false,*/
          };
        })
      ).then((results) => results.reverse());

      formulasArray.reverse().shift();

      this.dataSvc.dataNodes = diferencias;

      const tierCero = diferencias.shift();

      const cero = nodos.find((nodo: any) => nodo.tier == 'L0');

      this.tierCeroValue = (+cero.newValue - +cero.oldValue).toLocaleString(
        'es-ES'
      );

      this.dataSvc.tierCero = this.tierCeroValue;

      /*      otherValues.forEach((node: any) => {
        const nodo = diferencias.find((node2: any) => node2.id == node.id);

        if (nodo) {
          nodo.value = node.value;
        }
      });*/

      function ordenarPorTier(a: any, b: any) {
        // Comparar los valores de "tier" y devolver el resultado
        if (a.tier < b.tier) {
          return -1;
        }
        if (a.tier > b.tier) {
          return 1;
        }
        return 0;
      }

      this.projectSvc
        .getNodeData({ expressions: formulasArray })
        .subscribe((res: any) => {
          this.datas = diferencias.map((value: any, i: number) => {
            return {
              id: value.id,
              tier: value.tier,
              value: Number(value.value).toLocaleString('de-DE', {
                minimumFractionDigits: 0,
              }),
              description: value.name,
              combination: value.combination,
            };
          });

          if (tierCero?.combination) {
            tierCero.description = tierCero.name;
            this.datas.push(tierCero);
          }

          const l0 = this.datas.findIndex((obj) => obj.tier === 'L0');
          if (l0 !== -1) {
            this.datas.splice(l0, 1);
          }
          this.datas.sort(ordenarPorTier);
          this.isLoading = false;
        });
    }
  }

  goWaterfall() {
    const selected = this.datas.filter((node: any) => node.isActive);
    this.dataSvc.setNodes(selected);
    this.router.navigate(['/home/waterfall']);
  }

  setClickedElement(node: any) {
    /* this.clickedElement = index; */
    node.isActive = !node.isActive;
  }

  calculateImpactsMultiplie(variableData: any[]): any {
    const oldValues = variableData.map((variable) => {
      if (
        typeof variable.oldValue === 'string' &&
        variable.oldValue.endsWith('.00')
      ) {
        variable.oldValue.toString().replace(',', '.');
        var numeroSinDecimales = variable.oldValue
          .toString()
          .slice(0, -3)
          .replace(',', ''); // Elimina los últimos tres caracteres

        return +numeroSinDecimales;
      } else {
        return variable.oldValue;
      }
    });
    const newValues = variableData.map((variable) => {
      if (
        typeof variable.newValue === 'string' &&
        variable.newValue.endsWith('.00')
      ) {
        variable.newValue.replace(',', '.');
        var numeroSinDecimales = variable.newValue
          .toString()
          .slice(0, -3)
          .replace(',', ''); // Elimina los últimos tres caracteres

        return +numeroSinDecimales;
      } else {
        return variable.newValue;
      }
    });

    const directImpacts = [];
    const interactions: any = [];
    let totalImpact = 0;

    for (let i = 0; i < variableData.length; i++) {
      const multiplier = oldValues.reduce(
        (acc, val, idx) => (idx === i ? acc : acc * val),
        1
      );
      const name = variableData[i]?.name;

      const directImpact = (newValues[i] - oldValues[i]) * multiplier;
      directImpacts.push({
        impact: directImpact,
        variables: [i + 1],
        variableName: name,
      });
      totalImpact += directImpact;
    }

    calculateInteractions([]);

    function calculateInteractions(indices: number[] = []) {
      if (indices.length > 1) {
        let interactionImpact = indices.reduce(
          (acc, idx) => acc * (newValues[idx] - oldValues[idx]),
          1
        );
        const remainingMultiplier = oldValues
          .filter((value, idx) => !indices.includes(idx))
          .reduce((acc, val) => acc * val, 1);

        interactionImpact *= remainingMultiplier;
        interactions.push({
          level: indices.length,
          value: interactionImpact,
          variables: indices.map((idx) => idx + 1),
        });
        totalImpact += interactionImpact;
      }
      for (
        let i = indices.length > 0 ? indices[indices.length - 1] + 1 : 0;
        i < variableData.length;
        i++
      ) {
        calculateInteractions([...indices, i]);
      }
    }

    return { directImpacts, interactions, totalImpact };
  }

  calculateImpactsDivide(variableData: any[]): any {
    const oldValues = variableData.map((variable) => {
      if (
        typeof variable.oldValue === 'string' &&
        variable.oldValue.endsWith('.00')
      ) {
        variable.oldValue.toString().replace(',', '.');
        var numeroSinDecimales = variable.oldValue
          .toString()
          .slice(0, -3)
          .replace(',', ''); // Elimina los últimos tres caracteres

        return +numeroSinDecimales;
      } else {
        return variable.oldValue;
      }
    });
    const newValues = variableData.map((variable) => {
      if (
        typeof variable.newValue === 'string' &&
        variable.newValue.endsWith('.00')
      ) {
        variable.newValue.toString().replace(',', '.');
        var numeroSinDecimales = variable.newValue
          .toString()
          .slice(0, -3)
          .replace(',', ''); // Elimina los últimos tres caracteres

        return +numeroSinDecimales;
      } else {
        return variable.newValue;
      }
    });

    const directImpacts = [];
    const interactions: any = [];
    let totalImpact = 0;

    for (let i = 0; i < variableData.length; i++) {
      const multiplier = oldValues.reduce(
        (acc, val, idx) =>
          idx === i ? acc : acc === undefined ? val : acc / val,
        undefined
      );
      const name = variableData[i]?.name;
      const directImpact = (newValues[i] - oldValues[i]) / multiplier;
      directImpacts.push({
        impact: directImpact,
        variables: [i + 1],
        variableName: name,
      });
      totalImpact += directImpact;
    }

    calculateInteractions([]);

    function calculateInteractions(indices: number[] = []) {
      if (indices.length > 1) {
        let interactionImpact = indices.reduce(
          (acc, idx) => acc / (newValues[idx] - oldValues[idx]),
          1
        );
        const remainingMultiplier = oldValues
          .filter((value, idx) => !indices.includes(idx))
          .reduce((acc, val) => acc / val, 1);

        interactionImpact /= remainingMultiplier;
        interactions.push({
          level: indices.length,
          value: interactionImpact,
          variables: indices.map((idx) => idx + 1),
        });
        totalImpact += interactionImpact;
      }
      for (
        let i = indices.length > 0 ? indices[indices.length - 1] + 1 : 0;
        i < variableData.length;
        i++
      ) {
        calculateInteractions([...indices, i]);
      }
    }

    return { directImpacts, interactions, totalImpact };
  }

  verificarOperadores(array: (number | string)[], nodes: any) {
    // Define un conjunto de operadores válidos
    const operadoresValidos = new Set(['+', '-', '*', '/']);

    // Contadores para cada tipo de operador
    let suma = 0,
      resta = 0,
      multiplicacion = 0,
      division = 0;

    for (let i = 0; i < array.length; i++) {
      // Convertir el elemento a cadena si es un número
      const elemento =
        typeof array[i] === 'number' ? array[i].toString() : array[i];

      // Verifica si el elemento actual es un operador válido
      if (typeof elemento === 'string' && operadoresValidos.has(elemento)) {
        // Incrementa el contador correspondiente
        switch (elemento) {
          case '+':
            suma++;
            break;
          case '-':
            resta++;
            break;
          case '*':
            multiplicacion++;
            break;
          case '/':
            division++;
            break;
        }
      } else if (typeof array[i] === 'number') {
        // Si es un número, sigue al siguiente elemento
        continue;
      } else {
        // Si encuentra un elemento que no es ni un número ni un operador, retorna 'Combinación'
        return 'combinacion';
      }
    }

    // Verifica qué tipo de operadores están presentes
    if (suma > 0 && resta === 0 && multiplicacion === 0 && division === 0) {
      return 'Solo suma';
    } else if (
      suma === 0 &&
      resta > 0 &&
      multiplicacion === 0 &&
      division === 0
    ) {
      return 'Solo resta';
    } else if (
      suma === 0 &&
      resta === 0 &&
      multiplicacion > 0 &&
      division === 0
    ) {
      const ids: any = array;
      const arrayToSend = [];

      for (let i = 0; i < ids.length; i++) {
        const element = ids[i];
        if (isNaN(element)) {
          continue;
        } else {
          arrayToSend.push(nodes?.find((node: any) => node.id == element));
        }
      }

      const result = this.calculateImpactsMultiplie(arrayToSend);

      return result;
    } else if (
      suma === 0 &&
      resta === 0 &&
      multiplicacion === 0 &&
      division > 0
    ) {
      const ids: any = array;
      const arrayToSend = [];

      for (let i = 0; i < ids.length; i++) {
        const element = ids[i];
        if (isNaN(element)) {
          continue;
        } else {
          arrayToSend.push(nodes?.find((node: any) => node.id == element));
        }
      }
      const result = this.calculateImpactsDivide(arrayToSend);

      return result;
    } else {
      return 'combinacion';
    }
  }

  async calculateNode(nodos: any, selectId: number, tierCeroValue: any) {
    const formulaCero = this.nodes.find((node: any) => node.tier == 0);

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
          /*formula.push(await this.recursiveCalculate(node))*/ formula.push(
            '(' + form + ')'
          );
        }
      } else {
        formula.push(nodeId);
      }
    }

    return formula;
  }

  getRoundedPercentage(value: number, total: number): number {
    console.log(value, total, 'TOAL VALUE');
    const result = Math.round((value / total) * 100);

    return Number.isNaN(result) ? 0 : result;
  }
}
