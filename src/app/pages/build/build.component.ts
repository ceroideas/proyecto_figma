import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Renderer2,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MessageComponent } from 'src/app/components/message/message.component';
import { AdDirective } from './ad.directive';

declare var google: any;
declare var bootstrap: any;
@Component({
  selector: 'app-build',

  templateUrl: './build.component.html',
  styleUrl: './build.component.scss',
})
export class BuildComponent {
  @ViewChild(AdDirective, { static: true }) adHost!: AdDirective;
  rows = [
    [
      {
        v: '1',
        f: `<div  class="rotate" >
        
               <span>
                      <div class="floating">   
                             <div class="flex-box">   
                             <button id="1" class="cstmbtn btn btn-xs btn-info">A</button>
                             <button class="cstmbtn btn btn-xs btn-success">B</button>
                             <button class="cstmbtn btn btn-xs btn-danger">C</button>
                             </div>
                             <div class="full-box">
                                    
                             </div>
                      </div>
                      Número de plazas
               </span>

        </div>`,
      },
      '',
      'The President',
    ],
  ];
  isDisabled: boolean = false;
  nextNode!: number;
  fatherNode!: number;
  nodeName!: any;
  showContent = true;
  drawChart!: any;
  chart!: any;
  data!: any;
  interval!: any;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    google.charts.load('current', { packages: ['orgchart'] });

    this.drawChart = () => {
      this.data = new google.visualization.DataTable();
      this.data.addColumn('string', 'Name');
      this.data.addColumn('string', 'Manager');
      this.data.addColumn('string', 'ToolTip');

      // For each orgchart box, provide the name, manager, and tooltip to show.
      this.data.addRows(this.rows);

      // Create the chart.
      this.chart = new google.visualization.OrgChart(
        document.getElementById('chart_div')
      );

      google.visualization.events.addListener(this.chart, 'select', () => {
        var selection = this.chart.getSelection();
        var rotateElements = document.querySelectorAll('.rotate');
        Array.prototype.forEach.call(
          rotateElements,
          function (rotateElement: HTMLElement) {
            rotateElement.addEventListener('click', function () {
              console.log(this, 'ass');
              var floatingElement = this.querySelector(
                '.floating'
              ) as HTMLElement;
              if (
                floatingElement.style.display === 'none' ||
                floatingElement.style.display === ''
              ) {
                floatingElement.style.display = 'block';
              } else {
                floatingElement.style.display = 'none';
              }
            });
          }
        );
        var cstmbtnElements = document.querySelectorAll('.cstmbtn');
        Array.prototype.forEach.call(
          cstmbtnElements,
          (cstmbtnElement: HTMLElement) => {
            cstmbtnElement.addEventListener('click', (e) => {
              e.stopPropagation();
              this.rows.push([
                {
                  v: `${this.nextNode} `,
                  f: `<div  class="rotate" >
                  
                         <span>
                                <div class="floating">   
                                       <div class="flex-box">   
                                       <button id="1" class="cstmbtn btn btn-xs btn-info">A</button>
                                       <button class="cstmbtn btn btn-xs btn-success">B</button>
                                       <button class="cstmbtn btn btn-xs btn-danger">C</button>
                                       </div>
                                       <div class="full-box">
                                              
                                       </div>
                                </div>
                                Número de plazas 2
                         </span>
          
                  </div>`,
                },
                `${this.nodeName}`,
                '',
              ]);
              this.chart.draw(this.data, { allowHtml: true });
              google.charts.setOnLoadCallback(this.drawChart);
            });
          }
        );
        // Verifica si se ha seleccionado algún elemento
        if (selection.length > 0) {
          // Obtén el índice de la fila seleccionada
          var rowIndex = selection[0].row;

          // Obtén el valor de la columna 'Name' (v)
          this.nodeName = this.data.getValue(rowIndex, 0);

          // Obtén el valor de la columna 'Manager' (en este caso, el nodo padre)
          this.fatherNode = this.data.getValue(rowIndex, 1);

          var maxNumber = 0;
          for (var i = 0; i < this.data.getNumberOfRows(); i++) {
            var nodeValue = this.data.getValue(i, 0);

            // Verifica que el valor exista y sea un número
            if (
              nodeValue !== null &&
              nodeValue !== undefined &&
              !isNaN(nodeValue)
            ) {
              maxNumber = Math.max(maxNumber, nodeValue);
            }
          }

          // Incrementa el valor máximo en uno para obtener el próximo valor
          this.nextNode = maxNumber + 1;

          console.log('Próximo número:', this.nextNode);
          console.log('nodo name:', this.nodeName);
          console.log('Nodo padre:', this.fatherNode);
        }
      });

      this.chart.draw(this.data, { allowHtml: true });
    };
    google.charts.setOnLoadCallback(this.drawChart);
  }

  ngAfterViewInit() {}
}
