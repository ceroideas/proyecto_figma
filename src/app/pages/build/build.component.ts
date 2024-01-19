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
  @ViewChild('hideShow') hideShowModal!: ElementRef;
  rows: any = [];
  isDisabled: boolean = false;
  nextNode!: number;
  fatherNode!: number;
  nodeName!: any;
  showContent = true;
  drawChart!: any;
  chart!: any;
  data!: any;
  countHidden!: number;
  interval!: any;
  editVariable: boolean = false;
  hidden: boolean = false;
  aux: any = [
    {
      data: [
        {
          v: '1',
          f: `<div  class="rotate" >
        
        <span>
               <div class="floating" style="display: none;">   
                      <div class="flex-box">   
                      <button id="1"  class="cstmbtn btn-add btn btn-xs "><img
                       class="tier-icon " 
                      src="../../../assets/icons/u_plus.svg"
                      alt=""
                    /></button>
                      <button class="cstmbtn  btn btn-xs btn-edit "> <img
                      class="tier-icon " 
                     src="../../../assets/icons/pencil.svg"
                     alt=""
                   /></button>
                      <button class="cstmbtn btn btn-xs btn-hidden "> <img
                      class="tier-icon " 
                     src="../../../assets/icons/u_eye-slash-icon.svg"
                     alt=""
                   /> </button>
                      </div>
                      <div class="full-box">
                             
                      </div> 
               </div>
               Número de variable
        </span>

 </div>`,
        },
        '',
        '',
      ],
      hidden: 0,
      unidad: 200,
      name: 'Número de variable',
      tier: 0,
    },
  ];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    google.charts.load('current', { packages: ['orgchart'] });

    this.drawChart = () => {
      this.data = new google.visualization.DataTable();
      this.data.addColumn('string', 'Name');
      this.data.addColumn('string', 'Manager');
      this.data.addColumn('string', 'ToolTip');

      this.addRow();
      this.data.addRows(this.rows);

      // Create the chart.
      this.chart = new google.visualization.OrgChart(
        document.getElementById('chart_div')
      );

      google.visualization.events.addListener(this.chart, 'select', () => {
        this.hidden = false;
        var selection = this.chart.getSelection();
        /*        var rotateElements = document.querySelectorAll('.rotate');
        Array.prototype.forEach.call(
          rotateElements,
          function (rotateElement: HTMLElement) {
            rotateElement.addEventListener('click', function () {
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
        ); */
        var cstmbtnElements = document.querySelectorAll('.btn-add');

        Array.prototype.forEach.call(
          cstmbtnElements,
          (cstmbtnElement: HTMLElement) => {
            cstmbtnElement.addEventListener('click', (e) => {
              this.editVariable = false;
              e.stopPropagation();
              const openButton = document.querySelector('#exampleModalButton');

              // Verifica si el botón existe antes de intentar cerrar el modal
              if (openButton) {
                // Simula un clic en el botón para cerrar el modal
                (openButton as HTMLElement).click();
              }
            });
          }
        );

        var editElements = document.querySelectorAll('.btn-edit');

        Array.prototype.forEach.call(
          editElements,
          (editElements: HTMLElement) => {
            editElements.addEventListener('click', (e) => {
              this.editVariable = true;
              e.stopPropagation();
              const openButton = document.querySelector('#exampleModalButton');

              // Verifica si el botón existe antes de intentar cerrar el modal
              if (openButton) {
                // Simula un clic en el botón para cerrar el modal
                (openButton as HTMLElement).click();
              }
            });
          }
        );

        var hiddenElements = document.querySelectorAll('.btn-hidden');
        Array.prototype.forEach.call(
          hiddenElements,
          (hiddenElements: HTMLElement) => {
            hiddenElements.addEventListener('click', (e) => {
              e.stopPropagation();
              this.hidden = true;
              /* this.findAndHideFatherNode(); */
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
          this.nextNode = this.aux.length + 1;
          console.log('ROW', this.rows);
          console.log('Próximo número:', this.nextNode);
          console.log('nodo name:', this.nodeName);
          console.log('Nodo padre:', this.fatherNode);
        }
      });

      this.chart.draw(this.data, { allowHtml: true });
      const interval = setInterval(() => {
        console.log('SET');
        var orgChartTables = document.querySelectorAll(
          '.google-visualization-orgchart-table'
        );
        if (orgChartTables.length > 0) {
          clearInterval(interval);

          var rotateElements = document.querySelectorAll(
            '.google-visualization-orgchart-node'
          );
          Array.prototype.forEach.call(
            rotateElements,
            function (rotateElement: HTMLElement) {
              rotateElement.addEventListener('click', function (e) {
                e.stopPropagation();
                var floatingElement = this.querySelector(
                  '.floating'
                ) as HTMLElement;

                if (floatingElement.style.display === 'block') {
                  floatingElement.style.display = 'none';
                } else {
                  floatingElement.style.display = 'block';
                }
              });
            }
          );
        }
      });
    };
    google.charts.setOnLoadCallback(this.drawChart);
    this.countHidden = this.aux.filter((obj: any) => obj.hidden === 1).length;
  }

  getDataFromModal(data: any) {
    this.aux.push({
      data: [
        {
          v: `${this.nextNode}`,
          f: `<div  class="rotate" >
            
                   <span>
                   <div class="floating" style="display: none;">   
                   <div class="flex-box">   
                   <button id="1"  class="cstmbtn btn-add btn btn-xs "><img
                    class="tier-icon " 
                   src="../../../assets/icons/u_plus.svg"
                   alt=""
                 /></button>
                   <button class="cstmbtn  btn btn-xs btn-edit "> <img
                   class="tier-icon " 
                  src="../../../assets/icons/pencil.svg"
                  alt=""
                /></button>
                   <button class="cstmbtn btn btn-xs btn-hidden "> <img
                   class="tier-icon " 
                  src="../../../assets/icons/u_eye-slash-icon.svg"
                  alt=""
                /> </button>
                   </div>
                   <div class="full-box">
                          
                   </div> 
            </div>
                          ${data.name} 
                   </span>
    
            </div>`,
        },
        `${this.nodeName}`,
        `${data.description}`,
      ],
      hidden: 0,
      unidad: data.unidad,
      name: data.name,
    });
    this.addRow();
    this.chart.draw(this.data, { allowHtml: true });
    google.charts.setOnLoadCallback(this.drawChart);
  }

  editDataFromModal(data: any) {
    let position = +data.nameNode - 1;

    this.aux[position] = {
      data: [
        {
          v: `${data.nameNode}`,
          f: `<div  class="rotate" >
          
                 <span>
                 <div class="floating" style="display: none;">   
                 <div class="flex-box">   
                 <button id="1"  class="cstmbtn btn-add btn btn-xs "><img
                  class="tier-icon " 
                 src="../../../assets/icons/u_plus.svg"
                 alt=""
               /></button>
                 <button class="cstmbtn  btn btn-xs btn-edit "> <img
                 class="tier-icon " 
                src="../../../assets/icons/pencil.svg"
                alt=""
              /></button>
                 <button class="cstmbtn btn btn-xs btn-hidden "> <img
                 class="tier-icon " 
                src="../../../assets/icons/u_eye-slash-icon.svg"
                alt=""
              /> </button>
                 </div>
                 <div class="full-box">
                        
                 </div> 
          </div>
                        ${data.name}
                 </span>
  
          </div>`,
        },
        `${data.fatherNode}`,
        `${data.description}`,
      ],
      hidden: 0,
      unidad: data.unidad,
      name: data.name,
    };
    this.addRow();
    console.log(this.aux, 'AUX');
    this.chart.draw(this.data, { allowHtml: true });
    google.charts.setOnLoadCallback(this.drawChart);
  }

  addRow() {
    this.rows = [];
    let tierCount = 0;
    for (let i = 0; i < this.aux.length; i++) {
      const element = this.aux[i];

      if (this.aux[i - 1] !== undefined) {
        this.aux[i - 1].data[1] !== element.data[1]
          ? (tierCount = tierCount + 1)
          : '';

        console.log('ahhh');
      }
      element.tier = tierCount;
      if (element.hidden === 0) {
        this.rows.push(element?.data);
      }
    }
  }
  findAndHideFatherNode() {
    /*     var floatingElement = document.querySelector('.floating') as HTMLElement;
    floatingElement.style.display = 'block'; */
    const node = this.aux.find((item: any) =>
      item.data.some((subItem: any) => subItem.v === this.nodeName)
    );

    const sonNode = this.aux.filter(
      (item: any) => item.data[1] === this.nodeName
    );

    node.hidden = 1;
    sonNode.forEach((node: any) => {
      node.hidden = 1;
    });
    this.addRow();
    this.chart.draw(this.data, { allowHtml: true });
    google.charts.setOnLoadCallback(this.drawChart);
    this.countHidden = this.aux.filter((obj: any) => obj.hidden === 1).length;
  }
  modalHideAndShowBranch(tier: any, i: number) {
    tier.hidden === 0 ? (tier.hidden = 1) : (tier.hidden = 0);

    const sonNode = this.aux.filter(
      (item: any) => item.data[1] === tier.data[0].v
    );
    sonNode.forEach((node: any) => {
      node.hidden = 1;
    });
    this.aux[i] = tier;
    this.addRow();
    this.chart.draw(this.data, { allowHtml: true });
    google.charts.setOnLoadCallback(this.drawChart);
    this.countHidden = this.aux.filter((obj: any) => obj.hidden === 1).length;
  }
  seeAll() {
    for (let i = 0; i < this.aux.length; i++) {
      // Verificar si el valor de 'hidden' es 1
      if (this.aux[i].hidden === 1) {
        // Cambiar el valor de 'hidden' a 0
        this.aux[i].hidden = 0;
      }
    }
    this.chart.draw(this.data, { allowHtml: true });
    google.charts.setOnLoadCallback(this.drawChart);
  }

  openModal() {
    const modal = new bootstrap.Modal(this.hideShowModal.nativeElement);
    modal.show();
    console.log('isuu');
  }
}
