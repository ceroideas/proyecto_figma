import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';

import { ProjectService } from 'src/app/services/project.service';
import { EditVariableComponent } from 'src/app/components/edit-variable/edit-variable.component';
import html2canvas from 'html2canvas';

import domtoimage from 'dom-to-image-improved';

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
  @ViewChild('zoomElement') zoomElement!: ElementRef;
  @ViewChild('captureElement') captureElement!: ElementRef;
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
  tier!: number;
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
  aux: any = [];
  zoomLevel: number = 0.5;
  sceneriesNodes: any[] = [];
  showSceneries: any[] = [];
  sceneries: any[] = [];
  selectedScenery: any = '#';
  selectedTierLv: any = '#';
  years: any[] = [];
  currentYearIndex: number = 0;
  query: string = '';
  pointNode: any =
    '<div style="width:10px;height:10px;background:#30c7e1;border-radius:9999px;"></div>';

  lastPosition: any = {};
  tierLv: number[] = [];

  selected: number[] = [];
  selectedHidden: number[] = [];

  loadedCallBack = false;

  // cargando = false;

  constructor(
    private route: ActivatedRoute,
    private projectSvc: ProjectService,

    private el: ElementRef
  ) {
    this.dragEnd = this.dragEnd.bind(this);
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    var _this = this;

    google.charts.load('current', { packages: ['orgchart'] });

    this.drawChart = () => {
      console.log('loaded');

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

      let setCreate = (e: any) => {
        this.projectSvc.getNode(this.nodeName).subscribe((res: any) => {
          this.tier = +res.tier;
          console.log(res);
        });
        this.editVariable = false;
        e.stopPropagation();
        const openButton = document.querySelector('#exampleModalButton');
        if (openButton) {
          (openButton as HTMLElement).click();
        }
      };

      let setEdit = (e: any) => {
        this.editModal.removeStorage();
        this.editVariable = true;

        e.stopPropagation();
        const openButton = document.querySelector('#exampleModalButton');
        if (openButton) {
          (openButton as HTMLElement).click();
        }
      };

      google.visualization.events.addListener(this.chart, 'select', () => {
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
            cstmbtnElement.removeEventListener('click', setCreate);
            cstmbtnElement.addEventListener('click', setCreate);
          }
        );

        var editElements = document.querySelectorAll('.btn-edit');

        Array.prototype.forEach.call(
          editElements,
          (editElements: HTMLElement) => {
            editElements.removeEventListener('click', setEdit);
            editElements.addEventListener('click', setEdit);
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

      /*this.cargando = true;

      function eventClick(this: any, e: any) {
        e.stopPropagation();

        console.log('event');

        _this.loadedCallBack = false;

        var floatingElement = this.querySelector('.floating') as HTMLElement;

        if (floatingElement.style.display === 'block') {
          var floatingElement2 = document.body.querySelectorAll('.floating');
          var tds = document.body.querySelectorAll(
            '.google-visualization-orgchart-node'
          );
          tds.forEach(function (element: any) {
            element.style.zIndex = '1';
          });

          floatingElement2.forEach(function (element: any) {
            element.style.display = 'none';
          });
        } else if (floatingElement.style.display === 'none') {
          var floatingElement2 = document.body.querySelectorAll('.floating');

          var tds = document.body.querySelectorAll(
            '.google-visualization-orgchart-node'
          );
          tds.forEach(function (element: any) {
            element.style.zIndex = '1';
          });

          floatingElement2.forEach(function (element: any) {
            element.style.display = 'none';
          });
          floatingElement.style.display = 'block';
          this.style.zIndex = '5';
        }
      }

      let contador = 0;

      const interval = setInterval(() => {
        var orgChartTables = document.querySelectorAll(
          '.google-visualization-orgchart-table'
        );

        console.log('loadedCallBack', this.loadedCallBack);

        contador += orgChartTables.length;

        if (orgChartTables.length > 0 && contador > 1) {
          clearInterval(interval);
          contador = -99;

          var rotateElements = document.querySelectorAll(
            '.google-visualization-orgchart-node'
          );

          if (!this.loadedCallBack) {
            console.log('loadedCallBack');

            setTimeout(() => {
              _this.cargando = false;
            }, 10);
            this.loadedCallBack = true;
            Array.prototype.forEach.call(
              rotateElements,
              function (rotateElement: HTMLElement) {
                rotateElement.removeEventListener('click', eventClick);
                rotateElement.addEventListener('click', eventClick);
              }
            );
          }
        }
      }, 1000);*/
    };

    google.charts.setOnLoadCallback(this.drawChart);

    this.countHidden = this.aux.filter((obj: any) => obj.hidden === 1).length;

    this.printAll();
  }

  setListeners(event: any): any {
    // Obtiene el elemento más cercano con la clase especificada
    if (!event.target.closest('.google-visualization-orgchart-node')) {
      return false;
    }
    const botones = event.target
      .closest('.google-visualization-orgchart-node')
      .querySelector('.floating');

    // Verifica si el elemento ya está visible
    const estaAbierto = botones.style.display === 'block';

    // Cierra todos los elementos abiertos
    document.querySelectorAll('.floating').forEach((el: any) => {
      el.style.display = 'none';
    });

    document
      .querySelectorAll('.google-visualization-orgchart-node')
      .forEach((el: any) => {
        el.style.zIndex = '1';
      });

    // Si el elemento estaba cerrado, lo abre. Si estaba abierto, permanece cerrado.
    if (!estaAbierto) {
      botones.style.display = 'block';
      event.target.closest('.google-visualization-orgchart-node').style.zIndex =
        '5';
    }
  }

  refresher() {
    let rect: any = (
      document.querySelector(
        'table.google-visualization-orgchart-table'
      ) as HTMLTableElement
    ).getBoundingClientRect();

    console.log(rect);

    this.lastPosition = { x: 300, y: rect.height / 2 - 20 };
    const element = this.zoomElement.nativeElement;
    this.zoomLevel = 1;
    element.style.transform = `scale(1)`;
    const elements = this.el.nativeElement.querySelectorAll('.ovf');
    console.log(elements, 'elemen');
    (
      document.querySelector('#chart_container') as HTMLElement
    ).classList.remove('ovf-mod');
    (
      document.querySelector('#chart_container') as HTMLElement
    ).classList.remove('fz14', 'fz13', 'fz12', 'fz11', 'fz10', 'fz9', 'fz8');
    (document.querySelector('#chart_container') as HTMLElement).classList.add(
      'fz13'
    );

    this.projectSvc
      .savePosition(this.project.id, this.lastPosition)
      .subscribe((res) => {});
  }

  dragEnd(event: CdkDragEnd) {
    let transform = event.source.element.nativeElement.style.transform;

    let regex = /[-]?\d+/g;
    var matches = transform.match(regex);

    let position = {
      x: parseInt(matches ? matches[1] : '0', 10),
      y: parseInt(matches ? matches[2] : '0', 10),
    };

    this.projectSvc
      .savePosition(this.project.id, position)
      .subscribe((res) => {});
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
      tier: this.isNewTree === false ? +this.tier + 1 : 0,
    };

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
    this.tier = 0;
  }

  editDataFromModal(data: any) {
    let position = +data.nameNode - 1;
    const dataToSave = {
      ...data,

      type: data.operation ? 2 : 1,
    };

    this.projectSvc.updateNode(data.id, dataToSave).subscribe((res: any) => {
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
  }
  findAndHideFatherNode() {
    /*     var floatingElement = document.querySelector('.floating') as HTMLElement;
    floatingElement.style.display = 'block'; */
    console.log(this.aux);
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

  findAndHideNodesModal() {
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
    this.addRow();
    this.chart.draw(this.data, { allowHtml: true });
    google.charts.setOnLoadCallback(this.drawChart);
    this.countHidden = this.aux.filter((obj: any) => obj.hidden === 1).length;
  }
  modalHideAndShowBranch(tier: any, i: number) {
    this.loadedCallBack = false;
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
    this.loadedCallBack = false;
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

      this.zoomLevel = parseFloat(this.project.zoom);

      this.updateZoom(false);

      const currentYear = new Date().getFullYear();
      const position = this.years.indexOf(currentYear);

      this.aux = [];
      this.currentYearIndex = position !== -1 ? position : 0;

      this.sceneries = res.sceneries;
      if (this.selectedScenery === '#') this.selectedScenery = '0';

      this.sceneriesNodes = [];
      if (res.nodes?.length > 0) {
        res.nodes.forEach((element: any) => {
          if (element.hidden_table) {
            this.selectedHidden.push(element.id);
          }

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
            hiddenTable: element.hidden_table,
            name: element.name,
            tier: element.tier,
            sceneries:
              element.type == 1 ? element.sceneries : element.calculated,
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
        if (this.chart) {
          this.chart.draw(this.data, { allowHtml: true });
        }

        google.charts.setOnLoadCallback(this.drawChart);
        this.getSceneries(this.selectedScenery);
      } else {
        this.addRow();
        this.chart.draw(this.data, { allowHtml: true });
        google.charts.setOnLoadCallback(this.drawChart);
      }

      this.getSceneries(this.selectedScenery);
      this.hideTier();
    });
  }

  formatMonto(monto: any) {
    return Number(monto).toFixed(2);
  }

  deleteNode() {
    this.getContentToChart();
  }

  hideTier() {
    for (let i = 0; i < this.aux.length; i++) {
      const element = this.aux[i];
      if (!this.tierLv.includes(element.tier)) {
        this.tierLv.push(element.tier);
      }
    }

    this.tierLv.sort(function (a, b) {
      return a - b;
    });

    console.log(this.tierLv);
  }

  onSceneryChange() {
    if (this.selectedScenery !== undefined) {
      this.getSceneries(this.selectedScenery);
    }
  }

  hideTierAll() {
    this.loadedCallBack = false;
    console.log('smkdsnm');

    if (this.selectedTierLv != '#') {
      const filterNodeTier = this.aux
        .map((obj: any, i: any) => {
          if (obj.tier === +this.selectedTierLv) {
            return { obj: obj, i: i };
          } else {
            return;
          }
        })
        .filter(function (element: any) {
          return element !== undefined;
        });

      for (let i = 0; i < filterNodeTier.length; i++) {
        const element = filterNodeTier[i];
        this.modalHideAndShowBranch(element.obj, element.i);
      }
    } else {
      this.printAll();
      this.countHidden = 0;
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
  }
  getSceneries2(esceneries: any) {
    /*     this.esceneries.push(esceneries);
    console.log(this.esceneries, 'es'); */
    this.esceneries = esceneries;
  }
  printAll() {
    this.getContentToChart();

    setTimeout(() => {
      this.getSceneries(this.selectedScenery);
    }, 3000);
  }

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

  onZoom(event: WheelEvent): void {
    event.preventDefault();

    const zoomDelta = 0.1;
    this.zoomLevel += event.deltaY > 0 ? -zoomDelta : zoomDelta;

    this.updateZoom();
  }

  toggleZoom(): void {
    this.zoomLevel = this.zoomLevel === 1 ? 2 : 1;
    this.updateZoom();
  }

  zoomTimeout: any = null;

  private updateZoom(save = true): void {
    const element = this.zoomElement.nativeElement;
    console.log(this.zoomLevel);
    const elements = this.el.nativeElement.querySelectorAll('.ovf');
    const container = document.querySelector('#chart_container') as HTMLElement;

    if (this.zoomLevel >= 0.8) {
      element.style.transform = `scale(${this.zoomLevel})`;
    } else {
      this.zoomLevel = 0.8;
    }

    if (save) {
      if (this.zoomTimeout) {
        clearTimeout(this.zoomTimeout);
      }
      this.zoomTimeout = setTimeout(() => {
        clearTimeout(this.zoomTimeout);

        this.projectSvc
          .saveZoom(this.project.id, this.zoomLevel)
          .subscribe((res) => {});
      }, 1000);
    }

    if (this.zoomLevel >= 0.8 && this.zoomLevel < 1) {
      container.classList.remove('ovf-mod');
      container.classList.remove(
        'fz14',
        'fz13',
        'fz12',
        'fz11',
        'fz10',
        'fz9',
        'fz8'
      );
      container.classList.add('fz14');
    }

    if (this.zoomLevel >= 1 && this.zoomLevel < 1.2) {
      container.classList.remove('ovf-mod');
      container.classList.remove(
        'fz14',
        'fz13',
        'fz12',
        'fz11',
        'fz10',
        'fz9',
        'fz8'
      );
      container.classList.add('fz13');
    }

    if (this.zoomLevel >= 1.2 && this.zoomLevel < 1.4) {
      container.classList.remove('ovf-mod');
      container.classList.remove(
        'fz14',
        'fz13',
        'fz12',
        'fz11',
        'fz10',
        'fz9',
        'fz8'
      );
      container.classList.add('fz12');
    }

    if (this.zoomLevel >= 1.4 && this.zoomLevel < 1.6) {
      container.classList.add('ovf-mod');
      container.classList.remove(
        'fz14',
        'fz13',
        'fz12',
        'fz11',
        'fz10',
        'fz9',
        'fz8'
      );
      container.classList.add('fz11');
    }

    if (this.zoomLevel >= 1.6 && this.zoomLevel < 1.8) {
      container.classList.add('ovf-mod');
      container.classList.remove(
        'fz14',
        'fz13',
        'fz12',
        'fz11',
        'fz10',
        'fz9',
        'fz8'
      );
      container.classList.add('fz10');
    }

    if (this.zoomLevel >= 1.8 && this.zoomLevel < 2) {
      container.classList.add('ovf-mod');
      container.classList.remove(
        'fz14',
        'fz13',
        'fz12',
        'fz11',
        'fz10',
        'fz9',
        'fz8'
      );
      container.classList.add('fz9');
    }

    if (this.zoomLevel >= 2 && this.zoomLevel < 2.2) {
      container.classList.add('ovf-mod');
      container.classList.remove(
        'fz14',
        'fz13',
        'fz12',
        'fz11',
        'fz10',
        'fz9',
        'fz8'
      );
      container.classList.add('fz8');
    }
  }

  selectTr(node: any) {
    let id = node.data[0].v;
    console.log('selectTr', id);
    let el = this.selected.findIndex((x) => x == id);

    if (el != -1) {
      this.selected.splice(el, 1);
    } else {
      this.selected.push(id);
    }

    console.log(this.selected);
  }

  hideSelected() {
    for (let i of this.selected) {
      let node = this.aux.find((item: any) =>
        item.data.some((subItem: any) => subItem.v === i)
      );

      this.selectedHidden.push(i);
      console.log((node.hiddenTable = 1));
    }

    this.projectSvc.setHiddenTable(this.selected).subscribe((data) => {
      this.selected = [];
    });
  }
  showHidden() {
    for (let i of this.aux) {
      i.hiddenTable = null;
    }
    this.projectSvc.setHiddenTable(this.selectedHidden).subscribe((data) => {
      this.selectedHidden = [];
    });
  }

  exportCsv() {
    let datos = [];
    let header = ['LABEL', 'NAME'];
    for (let y of this.project.years) {
      header.push(y);
    }

    // console.log(header);

    for (let i of this.project.nodes.reverse()) {
      let aux = ['L' + i.tier, i.name];
      let sceneries = null;

      if (i.type == 1) {
        sceneries = i.sceneries;
      } else {
        sceneries = i.calculated;
      }
      let y: any;
      for (y of Object.values(sceneries[this.selectedScenery]['years'])) {
        // Eliminar comas
        y.toString();

        var valorSinComas = `${y}`.replace(/,/g, '');
        // Convertir a número y redondear a dos decimales si es un número
        var resultado: any = parseFloat(valorSinComas);
        if (!isNaN(resultado)) {
          resultado = resultado.toFixed(2);
        }

        aux.push(resultado);
      }
      datos.push(aux);
    }

    let csvString = header.join(';') + '\n';
    for (let i of datos) {
      csvString += i.join(';') + '\n';
    }

    const blob = new Blob([csvString], { type: 'text/csv' });

    // Crear un enlace de descarga
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download =
      this.project.name +
      '-' +
      this.project.sceneries[this.selectedScenery] +
      '.csv'; // Nombre del archivo
    link.click();

    // Liberar el objeto URL
    URL.revokeObjectURL(url);

    console.log(csvString);
    // console.log(header,datos);
  }

  capture() {

    const id: any = document.querySelector('#capture');

    /*domtoimage.toBlob(id)
      .then((blob:any) => {
      console.log(blob);
    });*/

    domtoimage.toPng(id)
      .then((blob:any) => {
      console.log();
      const newTab = window.open();
      if (newTab) {
        newTab.document.body.innerHTML = `<img src="${blob}" />`;
      }
    });


    /*
    if (id !== null) {
      html2canvas(id)
        .then((canvas) => {
          // Verificar el contenido del canvas
          if (!canvas) {
            console.error('Error: Canvas no generado correctamente');
            return;
          }

          canvas.toBlob((blob) => {
            if (blob) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64data = reader.result as string;
                console.log(base64data);
                const newTab = window.open();
                if (newTab) {
                  newTab.document.body.innerHTML = `<img src="${base64data}" />`;
                } else {
                  alert('Permita las ventanas emergentes para esta página');
                }
              };
              reader.readAsDataURL(blob);
            } else {
              console.error('Error: Blob es null');
            }
          }, 'image/png');
        })
        .catch((error) => {
          console.error('Error capturando el canvas:', error);
        });
    }*/
  }
}
