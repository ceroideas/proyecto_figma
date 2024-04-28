import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { some } from 'highcharts';
import { SetPriceComponent } from 'src/app/components/set-price/set-price.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectSvc: ProjectService
  ) {}
  ngOnInit(): void {
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

      console.log(array);

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
          console.log(numericValue);
          valoresAños.push(numericValue);
        } else {
          console.log('Valor no válido:', obj.value);
        }
      });
      this.years = array;

      this.barData = valoresAños;
      console.log(this.barData);
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
          console.log(this.yearIndex);
          this.years[this.yearIndex[0]].isSelect = false;
          this.yearIndex.shift();
          break;
        }
      }
    }
    this.yearIndex.push(i);
    year.isSelect = !year.isSelect;
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

      let nodos: any = [];
      for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];
        let yearValues: any = [];
        for (let i = 0; i < years.length; i++) {
          const year = years[i];
          if (node.type === 2) {
            const scenerie: any = node.calculated.find(
              (node: any) => node.newName == year.name
            );
            const yearValue = scenerie.years[`${year.year}`];
            yearValues.push(yearValue);
          } else {
            const scenerie = node.sceneries.find(
              (node: any) => node.newName == year.name
            );
            const yearValue = scenerie.years[`${year.year}`];
            yearValues.push(yearValue);
          }
        }
        yearValues.push('L' + node.tier);
        yearValues.push(node.name);
        nodos.push(yearValues);
      }

      const diferencias = nodos
        .map((par: any) => {
          console.log(par);
          const monto1 = parseFloat(par[0].replace(/,/g, ''));
          const monto2 = parseFloat(par[1].replace(/,/g, ''));
          return {
            tier: par[2],
            name: par[3],
            value: Math.abs(monto1 - monto2),
          };
        })
        .reverse();

      this.tierCeroValue = diferencias.shift().value.toLocaleString('es-ES');

      this.datas = diferencias.map((value: any) => {
        return {
          tier: value.tier,
          value: value.value.toLocaleString('es-ES'),
          description: value.name,
        };
      });

      console.log(diferencias, 'nodos');
    }
  }

  goWaterfall() {
    this.router.navigate(['/home/waterfall']);
  }

  setClickedElement(index: number) {
    this.clickedElement = index;
  }
}
