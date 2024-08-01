import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';

import { ProjectService } from 'src/app/services/project.service';
import { EditVariableComponent } from 'src/app/components/edit-variable/edit-variable.component';

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
  isFullScreen: boolean = false;
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
  @Output() saveCompleteEvent = new EventEmitter<void>();
  selected: number[] = [];
  selectedHidden: number[] = [];
  defaultYear!: number;
  constantColor!: string;
  defaultGrowth!: any;
  defaultGrowthPercentage!: number;

  loadedCallBack = false;

  constructor(
    private route: ActivatedRoute,
    private projectSvc: ProjectService,
    private router: Router,

    private el: ElementRef
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

        var showElements = document.querySelectorAll('.btn-show');
        Array.prototype.forEach.call(
          showElements,
          (showElements: HTMLElement) => {
            showElements.addEventListener('click', (e) => {
              e.stopPropagation();
              /*this.hidden = true;*/
              this.findAndShowFatherNode();
            });
          }
        );
      });

      this.chart.draw(this.data, { allowHtml: true });
      const lines = document.querySelectorAll(
        '.google-visualization-orgchart-lineleft, .google-visualization-orgchart-lineright, .google-visualization-orgchart-linebottom'
      );
      lines.forEach((line: any) => {
        line.style.borderColor = '#8c64b1';
      });

      function lightenColor(rgb: any) {
        let [r, g, b] = rgb.split(',').map(Number);

        r = Math.min(Math.floor(r + (255 - r) * 0.8), 255);
        g = Math.min(Math.floor(g + (255 - g) * 0.8), 255);
        b = Math.min(Math.floor(b + (255 - b) * 0.8), 255);

        //
        return `${r},${g},${b}`;
      }

      const tds = document.querySelectorAll('td');

      tds.forEach((td) => {
        const div = td.querySelector('div');

        if (div && div.id === '1') {
          const lightenedColor = lightenColor(this.constantColor);
          td.style.setProperty(
            'background-color',
            `rgb(${lightenedColor})`,
            'important'
          );
          td.style.setProperty(
            'box-shadow',
            `0 0 0 1px rgb(${this.constantColor}) inset`,
            'important'
          );
        }

        if (div && div.id === '2') {
          td.classList.add('box-shadow-2');
        }
      });
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
    this.capture();
    this.projectSvc.saveNode(dataToSave).subscribe((res: any) => {
      this.capture();
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
        element.data[0].f = element.f_alternative(element.branches);
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

    const initialCount = this.aux.filter(
      (item: any) =>
        item.data[1] === fatherNode[0].data[0].v && item.hidden == 1
    ).length;

    let count = initialCount;

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
        count++;

        const sonNode = this.aux.filter(
          (item: any) => item.data[1] === node.data[0].v
        );

        if (sonNode.length > 0) {
          hideSons(sonNode);
        }
      });
    };

    hideSons(sonNode);

    if (fatherNode[0]) fatherNode[0].branches = count;

    this.addRow();
    this.chart.draw(this.data, { allowHtml: true });
    google.charts.setOnLoadCallback(this.drawChart);
    this.countHidden = this.aux.filter((obj: any) => obj.hidden === 1).length;
  }

  findAndShowFatherNode() {
    const node = this.aux.find((item: any) =>
      item.data.some((subItem: any) => subItem.v === this.nodeName)
    );

    const fatherNode = this.aux.filter(
      (item: any) => item.data[0].v === node.data[1]
    );

    const sonNode = this.aux.filter(
      (item: any) => item.data[1] === this.nodeName && item.hidden == 1
    );

    if (fatherNode.length > 0) {
      const takeSonNode = this.aux.filter(
        (item: any) => item.data[1] === fatherNode[0].data[0].v
      );
      const haveHidden = takeSonNode.some((item: any) => item.hidden === 1);
      fatherNode[0].hiddenNodeSon = haveHidden;
    }
    node.hidden = 0;
    node.hiddenNodeSon = false;

    const hideSons = (childNode: any) => {
      childNode.forEach((node: any) => {
        if (!node.hiddenNodeSon) {
          node.hidden = 0;
          node.hiddenNodeSon = false;
          const sonNode = this.aux.filter(
            (item: any) => item.data[1] === node.data[0].v
          );

          if (sonNode.length > 0) {
            hideSons(sonNode);
          }
        } else {
          let count = 0;

          const countHiddenNodes = (nodes: any) => {
            nodes.forEach((node: any) => {
              const hiddenNodes = this.aux.filter(
                (item: any) =>
                  item.data[1] === node.data[0].v && item.hidden == 1
              );

              count += hiddenNodes.length;

              if (hiddenNodes.length > 0) {
                countHiddenNodes(hiddenNodes);
              }
            });
          };

          const nodoPass = [node];
          countHiddenNodes(nodoPass);

          node.hidden = 0;
          node.branches = count;
        }
      });
    };

    hideSons(sonNode);
    node.branches = 0;

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
      fatherNode[0].branches = this.aux.filter(
        (item: any) =>
          item.data[1] === fatherNode[0].data[0].v && item.hidden == 1
      ).length;
    } else {
      const takeSonNode = this.aux.filter(
        (item: any) => item.data[1] === tier.data[0].v
      );
      const haveHidden = takeSonNode.some((item: any) => item.hidden === 1);
      tier.hiddenNodeSon = haveHidden;
      tier.branches = this.aux.filter(
        (item: any) => item.data[1] === tier.data[0].v && item.hidden == 1
      ).length;
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
      console.log(res, 'nodos');
      this.projectName = res.name;
      this.cleanSceneries = res.clean_sceneries;
      this.years = res.years;
      this.defaultYear = res.default_year;
      this.project = res;
      this.constantColor = res.line_color;
      this.defaultGrowthPercentage = res.default_growth_percentage;
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
          console.log(
            element.sceneries[this.selectedScenery].years[this.defaultYear],
            element.calculated[this.selectedScenery].years[this.defaultYear],
            'ELE'
          );
          const defaultYearValue =
            element.type == 1
              ? element.sceneries[this.selectedScenery].years[this.defaultYear]
              : element.calculated[this.selectedScenery].years[
                  this.defaultYear
                ];

          const data = {
            data: [
              {
                v: `${element.id}`,
                f: `<div id="${element.type}"  class="rotate" >
            
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
                      <div style="top: -10px" class="custom-div">
                        <label class="ovf" style="margin-bottom: -10px;">
                          ${element.name}
                        </label>
                        <label class="ovf-amount" style="margin-bottom: -25px;">
                          ${this.formatMonto(defaultYearValue)}
                        </label>
                      </div>
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
            f_original: `<div id="${element.type}"  class="rotate" >
            
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
                      <div style="top: -10px" class="custom-div">
                        <label class="ovf" style="margin-bottom: -10px;">
                          ${element.name}
                        </label>
                        <label class="ovf-amount" style="margin-bottom: -25px;">
                          ${this.formatMonto(+defaultYearValue)}
                        </label>
                      </div>
                   
            </span>
    
     </div>`,
            f_alternative: (branches: any) => {
              return `<div id="${element.type}"  class="rotate" >
            
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
                        <button class="cstmbtn btn btn-xs btn-show ">

                       <p style="color:white;">  ${branches ? branches : 0} </p>
                        <img
                          class="tier-icon " 
                         src="../../../assets/icons/u_eye-slash-icon.svg"
                         alt=""
                       /> </button>
                          </div>
                          <div class="full-box">
                                 
                          </div> 
                   </div>


                    <div style="top: -10px" class="custom-div">
                        <label class="ovf" style="margin-bottom: -10px; align-items: center; display:flex;">
                         ${this.pointNode}
                          ${element.name}
                        </label>
                        <label class="ovf-amount" style="margin-bottom: -25px;">
                          ${this.formatMonto(+defaultYearValue)}
                        </label>
                      </div>

                 
                   
            </span>
    
     </div>`;
            },
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

  formatMonto(monto: any): string {
    return Number(monto).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  deleteNode() {
    this.getContentToChart();
    this.capture();
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
  }

  onSceneryChange() {
    if (this.selectedScenery !== undefined) {
      this.getSceneries(this.selectedScenery);
      this.getContentToChart();
    }
  }

  hideTierAll() {
    this.loadedCallBack = false;

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

  zoom(delta: number) {
    this.zoomLevel += delta;
    if (this.zoomLevel < 0.5) {
      this.zoomLevel = 0.5;
    }
    if (this.zoomLevel > 3) {
      this.zoomLevel = 3;
    }
    this.zoomElement.nativeElement.style.transform = `scale(${this.zoomLevel})`;
  }

  zoomIn() {
    this.zoom(0.1);
  }

  zoomOut() {
    this.zoom(-0.1);
  }

  toggleFullScreen() {
    const elem = this.captureElement.nativeElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err: any) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
        });
      }
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(
          `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
        );
      });
    }
  }

  selectTr(node: any) {
    let id = node.data[0].v;

    let el = this.selected.findIndex((x) => x == id);

    if (el != -1) {
      this.selected.splice(el, 1);
    } else {
      this.selected.push(id);
    }
  }

  hideSelected() {
    for (let i of this.selected) {
      let node = this.aux.find((item: any) =>
        item.data.some((subItem: any) => subItem.v === i)
      );

      this.selectedHidden.push(i);
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

    // console.log(header,datos);
  }

  capture() {
    const id: any = document.querySelector('#capture');

    domtoimage.toPng(id).then((blob: any) => {
      this.projectSvc.updateProject(this.id, { thumb: blob }).subscribe();
    });
  }

  countHiddenNodes(node: any, aux: any) {
    // Contador de nodos ocultos
    let hiddenCount = 0;

    // Función recursiva para contar nodos ocultos
    function countHiddenRecursive(currentNode: any) {
      // Filtra los nodos hijos ocultos del nodo actual

      currentNode.forEach((node: any) => {
        const hiddenChildren = aux.filter(
          (item: any) =>
            item.data[1] === currentNode[0].data[0].v && item.hidden == 1
        );

        // Incrementa el contador por los nodos hijos ocultos encontrados
        hiddenCount += hiddenChildren.length;

        // Llama recursivamente a la función para cada nodo hijo oculto
        hiddenChildren.forEach((child: any) => {
          countHiddenRecursive(child);
        });
      });
    }

    // Inicia el conteo recursivo desde el nodo padre proporcionado
    countHiddenRecursive(node);

    // Devuelve el conteo total de nodos ocultos
    return hiddenCount;
  }

  goBack(): void {
    this.router.navigate(['home/projects']);
  }

  downloadProjectById(): void {
    this.projectSvc.getProject(this.id).subscribe((project: any) => {
      const projectJson = JSON.stringify(project);
      const blob = new Blob([projectJson], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    console.log(file, 'FILE');
    if (file) {
      this.projectSvc.uploadProject(file, this.id).subscribe(
        (response) => {
          this.printAll();
        },
        (error) => {
          console.error('Upload error:', error);
        }
      );
    }
  }

  getContentToChart2() {
    this.projectSvc.getProject(this.id).subscribe((res: any) => {
      console.log(res, 'nodos');
      this.projectName = res.name;
      this.cleanSceneries = res.clean_sceneries;
      this.years = res.years;
      this.defaultYear = res.default_year;
      this.project = res;
      this.constantColor = res.line_color;
      this.defaultGrowthPercentage = res.default_growth_percentage;
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
          console.log(
            element.sceneries[this.selectedScenery].years[this.defaultYear],
            element.calculated[this.selectedScenery].years[this.defaultYear],
            'ELE'
          );
          const defaultYearValue =
            element.type == 1
              ? element.sceneries[this.selectedScenery].years[this.defaultYear]
              : element.calculated[this.selectedScenery].years[
                  this.defaultYear
                ];

          const data = {
            data: [
              {
                v: `${element.id}`,
                f: `<div id="${element.type}"  class="rotate" >
            
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
                      <div style="top: -10px" class="custom-div">
                        <label class="ovf" style="margin-bottom: -10px;">
                          ${element.name}
                        </label>
                        <label class="ovf-amount" style="margin-bottom: -25px;">
                          ${this.formatMonto(defaultYearValue)}
                        </label>
                      </div>
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
            f_original: `<div id="${element.type}"  class="rotate" >
            
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
                      <div style="top: -10px" class="custom-div">
                        <label class="ovf" style="margin-bottom: -10px;">
                          ${element.name}
                        </label>
                        <label class="ovf-amount" style="margin-bottom: -25px;">
                          ${this.formatMonto(+defaultYearValue)}
                        </label>
                      </div>
                   
            </span>
    
     </div>`,
            f_alternative: (branches: any) => {
              return `<div id="${element.type}"  class="rotate" >
            
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
                        <button class="cstmbtn btn btn-xs btn-show ">

                       <p style="color:white;">  ${branches ? branches : 0} </p>
                        <img
                          class="tier-icon " 
                         src="../../../assets/icons/u_eye-slash-icon.svg"
                         alt=""
                       /> </button>
                          </div>
                          <div class="full-box">
                                 
                          </div> 
                   </div>


                    <div style="top: -10px" class="custom-div">
                        <label class="ovf" style="margin-bottom: -10px; align-items: center; display:flex;">
                         ${this.pointNode}
                          ${element.name}
                        </label>
                        <label class="ovf-amount" style="margin-bottom: -25px;">
                          ${this.formatMonto(+defaultYearValue)}
                        </label>
                      </div>

                 
                   
            </span>
    
     </div>`;
            },
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
      /* this.editModal.onSaveComplete(); */
    });
  }
}
