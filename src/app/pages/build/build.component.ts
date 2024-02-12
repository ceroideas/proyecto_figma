import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

declare var google: any;
declare var bootstrap: any;
@Component({
  selector: 'app-build',
  providers: [ProjectService],
  templateUrl: './build.component.html',
  styleUrl: './build.component.scss',
})
export class BuildComponent implements OnInit {
  @ViewChild('hideShow') hideShowModal!: ElementRef;
  rows: any = [];
  isDisabled: boolean = false;
  nextNode!: number;
  fatherNode: number = 0;
  nodeName!: any;
  showContent = true;
  drawChart!: any;
  project: any;
  chart!: any;
  data!: any;
  countHidden!: number;
  interval!: any;
  a = undefined;
  editVariable: boolean = false;
  hidden: boolean = false;
  isNewTree: boolean = false;
  id!: any;
  aux: any = [
    /*   {
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

      name: 'Número de variable',
      tier: 0,
    }, */
  ];
  sceneriesNodes: any[] = [];
  showSceneries: any[] = [];
  sceneries: any[] = [];
  selectedScenery = '#';
  constructor(
    private route: ActivatedRoute,
    private projectSvc: ProjectService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    /*     this.projectSvc.getProject(this.id).subscribe((res: any) => {
   
      if (res.nodes?.length > 0) {
        res.nodes.forEach((element: any) => {
          const data = {
            data: [
              {
                v: `${element.id}`,
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
                 ${element.name}
          </span>
  
   </div>`,
              },
              `${element.node_id ? element.node_id : ''}`,
              `${element.description}`,
            ],
            hidden: 0,

            name: element.name,
            tier: element.tier,
          };
          this.aux.push(data);
        });
      }
    });
 */
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
        this.editVariable = false;
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
              console.log(this.nodeName, 'V');
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
              this.findAndHideFatherNode();
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
        }
      });

      this.chart.draw(this.data, { allowHtml: true });
      const interval = setInterval(() => {
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
    this.getContentToChart();
  }

  getDataFromModal(data: any) {
    if ((this.fatherNode as unknown as string) === 'undefined') {
    }

    if (typeof this.fatherNode === 'string' && this.fatherNode !== '') {
      this.fatherNode = 1;
    }
    const dataToSave = {
      ...data,
      project_id: this.id,
      type: data.operation ? 2 : 1,
      distribution_shape: 1,
      node_id: this.isNewTree ? null : this.nodeName,
      tier: this.fatherNode !== 0 ? +this.fatherNode + 1 : 0,
    };

    /*     if (!this.isNewTree) {
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

        name: data.name,
        tier: this.fatherNode !== 0 ? +this.fatherNode + 1 : 0,
      });
      this.addRow();
      this.chart.draw(this.data, { allowHtml: true });
      google.charts.setOnLoadCallback(this.drawChart);
    } else {
      this.aux.push({
        data: [
          {
            v: `${this.generarCadenaAleatoria()}`,
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
          ``,
          `${data.description}`,
        ],
        hidden: 0,

        name: data.name,
        tier: 0,
      });
      this.addRow();
      this.chart.draw(this.data, { allowHtml: true });
      google.charts.setOnLoadCallback(this.drawChart);

      this.isNewTree = false;
    } */

    this.projectSvc.saveNode(dataToSave).subscribe((res: any) => {
      console.log(res, 'res');
      this.getContentToChart();
    });
    this.isNewTree = false;
  }

  editDataFromModal(data: any) {
    let position = +data.nameNode - 1;

    /*   this.aux[position] = {
      ...this.aux[position],
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

      name: data.name,
    };
 */

    this.projectSvc.updateNode(data.id, data).subscribe((res: any) => {
      console.log(res);
      this.getContentToChart();
    });
  }

  addRow() {
    this.rows = [];

    for (let i = 0; i < this.aux.length; i++) {
      const element = this.aux[i];

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
      const sonNode = this.aux.filter(
        (item: any) => item.data[1] === node.data[0].v
      );

      sonNode.forEach((node: any) => {
        node.hidden = 1;
      });
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
    const fatherNode = this.aux.filter(
      (item: any) => item.data[0].v === tier.data[1]
    );

    fatherNode.forEach((node: any) => {
      if (tier.hidden == 0) {
        node.hidden = 0;
      }

      const fatherNode = this.aux.filter(
        (item: any) => item.data[0].v === node.data[1]
      );

      fatherNode.forEach((node: any) => {
        if (tier.hidden == 0) {
          node.hidden = 0;
        }
      });
    });

    sonNode.forEach((node: any) => {
      node.hidden = 1;

      const sonNode = this.aux.filter(
        (item: any) => item.data[1] === node.data[0].v
      );

      sonNode.forEach((node: any) => {
        node.hidden = 1;
      });
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
  }

  newTree() {
    this.isNewTree = true;
    this.editVariable = false;
  }

  generarCadenaAleatoria() {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let cadenaAleatoria = '';

    for (let i = 0; i < 5; i++) {
      const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
      cadenaAleatoria += caracteres.charAt(indiceAleatorio);
    }

    return cadenaAleatoria;
  }
  getContentToChart() {
    this.projectSvc.getProject(this.id).subscribe((res: any) => {
      this.aux = [];
      this.sceneries = res.sceneries;

      this.sceneriesNodes = [];
      if (res.nodes?.length > 0) {
        res.nodes.forEach((element: any) => {
          const data = {
            data: [
              {
                v: `${element.id}`,
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
                 ${element.name}
          </span>
  
   </div>`,
              },
              `${element.node_id ? element.node_id : ''}`,
              `${element.description}`,
            ],
            hidden: 0,

            name: element.name,
            tier: element.tier,
          };
          this.aux.push(data);

          this.sceneriesNodes.push(
            element.type === 2 ? element.calculated : element.sceneries
          );
        });
        this.addRow();
        this.chart.draw(this.data, { allowHtml: true });
        google.charts.setOnLoadCallback(this.drawChart);
      }
    });
  }

  deleteNode() {
    this.getContentToChart();
  }

  onSceneryChange() {
    if (this.selectedScenery !== undefined) {
      this.getSceneries(this.selectedScenery);
    }
  }

  getSceneries(id: any) {
    this.showSceneries = [];
    this.sceneriesNodes.forEach((element: any) => {
      this.showSceneries.push(element[id].years);
    });
    console.log(id);
  }
}
