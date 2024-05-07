import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { some } from 'highcharts';
import { SetPriceComponent } from 'src/app/components/set-price/set-price.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { DataService } from 'src/app/services/data-service.service';
import { ProjectService } from 'src/app/services/project.service';
declare var bootstrap: any;
@Component({
  selector: 'app-inspect',
  providers: [ProjectService],
  standalone: true,
  imports: [CommonModule, FormsModule, PipesModule],
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

  tierCero: any = {};
  years: any[] = [];
  yearIndex: any[] = [];

  valueToShow: any[] = [];
  tierCeroValue: any = 0;
  variableData = [
    {
      name: 'Número empleados equipo central',
      oldValue: 6,
      newValue: 7,
    },
    {
      name: 'Coste por empleado equipo central',
      oldValue: 7500,
      newValue: 9000,
    },

    {
      name: 'Seguridad social',
      oldValue: 0.35,
      newValue: 0.4,
    },
    {
      name: 'Multiplicador mágico',
      oldValue: 1,
      newValue: 2,
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectSvc: ProjectService,
    private dataSvc: DataService
  ) {}
  ngOnInit(): void {
    const result = this.calculateImpactsForAngular(this.variableData);

    this.valueToShow = [];
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.id = this.route.snapshot.params['id'];

    this.projectSvc.getProject(this.id).subscribe((res: any) => {
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

      const node = res.nodes.find((node: any) => node.tier == 0);

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

        const valueWithoutDecimals = obj.value.replace(/\.\d{2}$/, '');

        // Eliminar tanto los puntos como las comas del valor
        const cleanValue = valueWithoutDecimals.replace(/[,.]/g, '');

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

  calculatedNode() {
    if (this.yearIndex.length === 2) {
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

            if (yearValues.oldValue) {
              yearValues = { ...yearValues, newValue: yearValue };
            } else {
              yearValues = { ...yearValues, oldValue: yearValue };
            }
          } else {
            const scenerie = node.sceneries.find(
              (node: any) => node.newName == year.name
            );
            const yearValue = scenerie.years[`${year.year}`];

            if (yearValues.oldValue) {
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

      const otherValues: any[] = [];

      const diferencias = nodos
        .map((par: any) => {
          /*  console.log(par, 'PAR'); */

          if (par.type == 2) {
            var result = this.verificarOperadores(par.formula, nodos);
            console.log(result);
            const sumaTotal = result?.interactions?.reduce(
              (acumulador: any, objeto: any) => {
                return acumulador + objeto.value;
              },
              0
            );

            if (sumaTotal !== undefined && sumaTotal > 0) {
              var other = {
                tier: par.tier,
                name: 'Otros valores',
                value: sumaTotal,
              };

              otherValues.push(other);
            }
          }

          const monto1 = parseFloat(par.oldValue.toString().replace(/,/g, ''));
          const monto2 = parseFloat(par.newValue.toString().replace(/,/g, ''));

          return {
            tier: par.tier,
            name: par.name,
            value:
              result && result.totalImpact !== undefined
                ? result.totalImpact
                : Math.abs(monto1 - monto2),
          };
        })
        .reverse();

      /*  console.log(diferencias); */

      this.dataSvc.dataNodes = diferencias;

      this.tierCeroValue = diferencias.shift().value.toLocaleString('es-ES');
      this.dataSvc.tierCero = this.tierCeroValue;
      otherValues.forEach((node: any) => {
        diferencias.push(node);
      });

      this.datas = diferencias.map((value: any) => {
        return {
          tier: value.tier,
          value: value.value.toLocaleString('es-ES'),
          description: value.name,
        };
      });

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

      this.datas.sort(ordenarPorTier);

      console.log(this.datas);
    }
  }

  goWaterfall() {
    this.router.navigate(['/home/waterfall']);
  }

  setClickedElement(index: number) {
    this.clickedElement = index;
  }

  calculateImpactsForAngular(variableData: any[]): any {
    const oldValues = variableData.map((variable) => {
      if (
        typeof variable.oldValue === 'string' &&
        variable.oldValue.endsWith('.00')
      ) {
        variable.oldValue.replace(',', '.');
        var numeroSinDecimales = variable.oldValue
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

      const directImpact = (newValues[i] - oldValues[i]) * multiplier;
      directImpacts.push({ impact: directImpact, variables: [i + 1] });
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

  /*   calculateImpactsForAngular(variableData: any[]): any {
    const oldValues = variableData.map((variable) => variable.oldValue);
    const newValues = variableData.map((variable) => variable.newValue);

    const directImpacts = [];
    const interactions: any = [];
    let totalImpact = 0;

    for (let i = 0; i < variableData.length; i++) {
      const multiplier = oldValues.reduce(
        (acc, val, idx) => (idx === i ? acc + val : acc + 0),
        0
      );
      console.log(
        multiplier,
        newValues[i],
        oldValues[i],
        newValues[i] - oldValues[i],
        'multi' + i
      );
      const directImpact = newValues[i] - oldValues[i] + multiplier;
      directImpacts.push({ impact: directImpact, variables: [i + 1] });
      totalImpact += directImpact;
    }

    calculateInteractions([]);

    function calculateInteractions(indices: number[] = []) {
      if (indices.length > 1) {
        let interactionImpact = indices.reduce(
          (acc, idx) => acc + (newValues[idx] - oldValues[idx]),
          0
        );
        const remainingMultiplier = oldValues
          .filter((value, idx) => !indices.includes(idx))
          .reduce((acc, val) => acc + val, 0);
        interactionImpact += remainingMultiplier;
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
 */

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
        return 'Combinación';
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
          arrayToSend.push(nodes.find((node: any) => node.id == element));
        }
      }
      const result = this.calculateImpactsForAngular(arrayToSend);

      return result;
    } else if (
      suma === 0 &&
      resta === 0 &&
      multiplicacion === 0 &&
      division > 0
    ) {
      return 'Solo división';
    } else {
      return 'Combinación';
    }
  }
}
