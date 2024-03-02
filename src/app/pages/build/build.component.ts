import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';
import { EditVariableComponent } from 'src/app/components/edit-variable/edit-variable.component';

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
  @ViewChild('editModal', { static: false }) editModal!: EditVariableComponent;
  rows: any = [];
  isDisabled: boolean = false;
  nextNode!: number;
  fatherNode: number = 0;
  nodeName!: any;
  showContent = true;
  drawChart!: any;
  projectName!: string;
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
  cleanSceneries: any[] = [];
  esceneries: any[] = [];
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
  selectedScenery: any = '#';
  years: any[] = [];
  currentYearIndex: number = 0;
  pointNode: any =
    '<div style="width:10px;height:10px;background:#30c7e1;border-radius:9999px;"></div>';

  lastPosition: any = {};

  constructor(
    private route: ActivatedRoute,
    private projectSvc: ProjectService
  ) {
    this.dragEnd = this.dragEnd.bind(this);
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

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
        console.log('SELECT');
        this.hidden = false;
        this.editVariable = false;
        var selection = this.chart.getSelection();

        var cstmbtnElements = document.querySelectorAll('.btn-add');
        this.isNewTree = false;
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

        Array.prototype.forEach.call(
          cstmbtnElements,
          (cstmbtnElement: HTMLElement) => {
            cstmbtnElement.addEventListener('click', (e) => {
              this.editVariable = false;
              e.stopPropagation();
              console.log(this.nodeName, 'AUX');
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
                  var floatingElement2 =
                    document.body.querySelectorAll('.floating');

                  floatingElement2.forEach(function (element: any) {
                    element.style.display = 'none';
                  });
                  floatingElement.style.display = 'none';
                } else if (floatingElement.style.display === 'none') {
                  var floatingElement2 =
                    document.body.querySelectorAll('.floating');

                  floatingElement2.forEach(function (element: any) {
                    element.style.display = 'none';
                  });
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

    /* this.getContentToChart(); */
    this.printAll();
  }

  dragEnd(event: CdkDragEnd) {
    let transform = event.source.element.nativeElement.style.transform;

    let regex = /[-]?\d+/g;
    var matches = transform.match(regex);

    let position = {
      x: parseInt(matches ? matches[1] : '0', 10),
      y: parseInt(matches ? matches[2] : '0', 10),
    };

    this.projectSvc.savePosition(this.project.id, position).subscribe((res) => {
      console.log('oki');
    });
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

      node_id: this.isNewTree ? null : this.nodeName,
      tier: this.isNewTree === false ? +this.fatherNode + 1 : 0,
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
      if (this.esceneries.length > 0 && dataToSave.unite == undefined) {
        res.sceneries.forEach((element: any, i: any) => {
          this.projectSvc
            .updateScenery(element.id, this.esceneries[i])
            .subscribe((res) => {
              this.printAll();
            });
        });
        this.esceneries = [];
        this.printAll();
      } else {
        this.printAll();
      }
    });

    this.isNewTree = false;
  }

  editDataFromModal(data: any) {
    let position = +data.nameNode - 1;
    const dataToSave = {
      ...data,

      type: data.operation ? 2 : 1,
    };

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
    console.log('edit', dataToSave);
    this.projectSvc.updateNode(data.id, dataToSave).subscribe((res: any) => {
      console.log(res);
      this.getContentToChart();
    });
  }

  addRow() {
    this.rows = [];

    for (let i = 0; i < this.aux.length; i++) {
      const element = this.aux[i];
      if (element.hiddenNodeSon) {
        element.data[0].f = element.f_alternative;
      } else {
        element.data[0].f = element.f_original;
      }
      if (element.hidden === 0) {
        this.rows.push(element?.data);
      }
    }

    console.log(this.rows, 'ROEWS');
  }
  findAndHideFatherNode() {
    /*     var floatingElement = document.querySelector('.floating') as HTMLElement;
    floatingElement.style.display = 'block'; */
    const node = this.aux.find((item: any) =>
      item.data.some((subItem: any) => subItem.v === this.nodeName)
    );
    const fatherNode = this.aux.filter(
      (item: any) => item.data[0].v === node.data[1]
    );

    const sonNode = this.aux.filter(
      (item: any) => item.data[1] === this.nodeName
    );

    if (fatherNode.length > 0) {
      const takeSonNode = this.aux.filter(
        (item: any) => item.data[1] === fatherNode[0].data[0].v
      );
      const haveHidden = takeSonNode.some((item: any) => item.hidden === 1);
      fatherNode[0].hiddenNodeSon = haveHidden;
    }
    node.hidden = 1;
    /*   sonNode.forEach((node: any) => {
      node.hidden = 1;
      const sonNode = this.aux.filter(
        (item: any) => item.data[1] === node.data[0].v
      );

      sonNode.forEach((node: any) => {
        node.hidden = 1;
      });
    }); */
    const hideSons = (childNode: any) => {
      console.log('a');
      childNode.forEach((node: any) => {
        node.hidden = 1;

        const sonNode = this.aux.filter(
          (item: any) => item.data[1] === node.data[0].v
        );

        if (sonNode.length > 0) {
          hideSons(sonNode);
        }
      });
    };
    hideSons(sonNode);
    this.addRow();
    this.chart.draw(this.data, { allowHtml: true });
    google.charts.setOnLoadCallback(this.drawChart);
    this.countHidden = this.aux.filter((obj: any) => obj.hidden === 1).length;
  }
  modalHideAndShowBranch(tier: any, i: number) {
    tier.hidden === 0 ? (tier.hidden = 1) : (tier.hidden = 0);

    console.log(tier, 'tier');

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

    const showFathers = (fatherNode: any) => {
      fatherNode.forEach((node: any) => {
        if (tier.hidden == 0) {
          node.hidden = 0;
        }

        const fatherNode = this.aux.filter(
          (item: any) => item.data[0].v === node.data[1]
        );

        /*         fatherNode.forEach((node: any) => {
          if (tier.hidden == 0) {
            node.hidden = 0;
          }
        }); */
        if (fatherNode.length > 0) {
          showFathers(fatherNode);
        }
      });
    };

    showFathers(fatherNode);

    const hideSons = (childNode: any) => {
      childNode.forEach((node: any) => {
        node.hidden = 1;

        const sonNode = this.aux.filter(
          (item: any) => item.data[1] === node.data[0].v
        );

        if (sonNode.length > 0) {
          hideSons(sonNode);
        }
      });
    };
    hideSons(sonNode);

    this.aux[i] = tier;
    if (fatherNode.length > 0) {
      const takeSonNode = this.aux.filter(
        (item: any) => item.data[1] === fatherNode[0].data[0].v
      );
      const haveHidden = takeSonNode.some((item: any) => item.hidden === 1);

      fatherNode[0].hiddenNodeSon = haveHidden;
    } else {
      const takeSonNode = this.aux.filter(
        (item: any) => item.data[1] === tier.data[0].v
      );
      const haveHidden = takeSonNode.some((item: any) => item.hidden === 1);
      tier.hiddenNodeSon = haveHidden;
    }

    this.aux.forEach((element: any) => {
      const takeSonNode = this.aux.filter(
        (item: any) => item.data[1] === element.data[0].v
      );
      if (takeSonNode.length > 0) {
        const haveHidden = takeSonNode.some((item: any) => item.hidden === 1);

        element.hiddenNodeSon = haveHidden;
      } else {
        console.log('mo es padre');
      }
    });
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
    localStorage.removeItem('uniteVal');
    this.isNewTree = true;
    this.editVariable = false;
    this.editModal.deleteShapeData();
  }

  getContentToChart() {
    this.projectSvc.getProject(this.id).subscribe((res: any) => {
      this.projectName = res.name;
      this.cleanSceneries = res.clean_sceneries;
      this.years = res.years;
      this.project = res;
      this.lastPosition = this.project.position
        ? JSON.parse(this.project.position)
        : { x: 0, y: 0 };

      console.log(this.lastPosition);

      const currentYear = new Date().getFullYear();
      const position = this.years.indexOf(currentYear);

      this.aux = [];
      this.currentYearIndex = position !== -1 ? position : 0;

      this.sceneries = res.sceneries;
      if (this.selectedScenery === '#') this.selectedScenery = '0';

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
                  <label class="ovf">${element.name}</label>
                   
            </span>
    
     </div>`,
              },
              `${element.node_id ? element.node_id : ''}`,
              `${
                element.description ? element.description : 'Sin descripción'
              }`,
            ],
            hidden: 0,
            hiddenNodeSon: false,
            name: element.name,
            tier: element.tier,
            f_original: `<div  class="rotate" >
            
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
                  <label class="ovf">${element.name}</label>
                   
            </span>
    
     </div>`,
            f_alternative: `<div  class="rotate" >
            
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
                 ${this.pointNode}<label class="ovf">${element.name}</label>
                   
            </span>
    
     </div>`,
          };
          this.aux.push(data);

          this.sceneriesNodes.push(
            element.type === 2 ? element.calculated : element.sceneries
          );
        });
        this.addRow();
        this.chart.draw(this.data, { allowHtml: true });
        google.charts.setOnLoadCallback(this.drawChart);
        this.getSceneries(this.selectedScenery);
      } else {
        this.addRow();
        this.chart.draw(this.data, { allowHtml: true });
        google.charts.setOnLoadCallback(this.drawChart);
      }

      this.getSceneries(this.selectedScenery);
    });
  }

  /*   getContentToChart() {
    return new Promise<void>((resolve, reject) => {
      this.projectSvc
        .getProject(this.id)
        .pipe(
          switchMap((res: any) => {
            this.cleanSceneries = res.clean_sceneries;
            console.log(
              this.cleanSceneries,
              'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE'
            );
            this.years = res.years;
            const currentYear = new Date().getFullYear();
            const position = this.years.indexOf(currentYear);

            this.aux = [];
            this.currentYearIndex = position !== -1 ? position : 0;

            this.sceneries = res.sceneries;
            if (this.selectedScenery === '#') this.selectedScenery = '0';

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
                      <label class="ovf">${element.name}</label>
                       
                </span>
        
         </div>`,
                    },
                    `${element.node_id ? element.node_id : ''}`,
                    `${element.description ? element.description : 'Sin descripción'}`,
                  ],
                  hidden: 0,
                  hiddenNodeSon: false,
                  name: element.name,
                  tier: element.tier,
                  f_original: `<div  class="rotate" >
                
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
                       
                      <label class="ovf">${element.name}</label>
                       
                </span>
        
         </div>`,
                  f_alternative: `<div  class="rotate" >
                
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
                <div style="width:10px;height:10px;background:#30c7e1;border-radius:9999px;"></div>
               <label class="ovf">${element.name}</label>
                
         </span>
  
  </div>`,
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
            this.getSceneries(this.selectedScenery);
            return of(res);
          })
        )
        .subscribe({
          next: () => {
            console.log('termino');
            this.getSceneries(this.selectedScenery);
            resolve();
          },
          error: (error) => {
            console.error('Error en la suscripción:', error);
            reject(error);
          },
          complete: () => {
            console.log('Suscripción completada');
          },
        });
    });
  } */

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
      const desiredYear = this.years[this.currentYearIndex]; // Puedes cambiar el año que deseas filtrar
      const filteredObject: any = {};
      filteredObject[desiredYear] = element[id].years[desiredYear];
      this.showSceneries.push(filteredObject);
    });
    console.log(this.showSceneries, 'SHOW ESCENARIES');
  }
  getSceneries2(esceneries: any) {
    /*     this.esceneries.push(esceneries);
    console.log(this.esceneries, 'es'); */
    this.esceneries = esceneries;
    console.log(this.esceneries, 'esenarios en event');
  }
  printAll() {
    this.getContentToChart();

    setTimeout(() => {
      this.getSceneries(this.selectedScenery);
    }, 3000);
  }

  /*   printAll() {
    this.getContentToChart()
      .then(() => {
        console.log('Todo ha sido procesado correctamente');
        this.getSceneries(this.selectedScenery);
      })
      .catch((error) => {
        console.error('Error en la operación:', error);
        // Puedes manejar el error según tus necesidades
      });
  } */

  nextYear() {
    if (this.currentYearIndex < this.years.length - 1) {
      this.currentYearIndex++;
      this.getSceneries(this.selectedScenery);
    }
  }

  prevYear() {
    if (this.currentYearIndex > 0) {
      this.currentYearIndex--;
      this.getSceneries(this.selectedScenery);
    }
  }
}
