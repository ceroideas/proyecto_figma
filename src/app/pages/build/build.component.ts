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
  @ViewChild('arrow', { static: true }) arrow!: ElementRef;

  @ViewChild('rotate', { static: true }) rotate!: ElementRef;

  isDisabled: boolean = false;

  showContent = true;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    google.charts.load('current', { packages: ['orgchart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Name');
      data.addColumn('string', 'Manager');
      data.addColumn('string', 'ToolTip');

      // For each orgchart box, provide the name, manager, and tooltip to show.
      data.addRows([
        [
          { v: '5', f: '<div class="rotate"><span>Nodo 5</span></div>' },
          '3',
          '',
        ],
        [
          { v: '4', f: '<div class="rotate"><span>Nodo 4</span></div>' },
          '3',
          '',
        ],
        [
          { v: '3', f: '<div class="rotate"><span>Nodo 3</span></div>' },
          '',
          '',
        ],
        [
          {
            v: '2',
            f: `<div (onclick)="esto()" class="rotate"><span>                           <div class="floating">   
            <div class="flex-box">   
            <button class="cstmbtn btn btn-xs btn-info">A</button>
            <button class="cstmbtn btn btn-xs btn-success">B</button>
            <button class="cstmbtn btn btn-xs btn-danger">C</button>
            </div>
            <div class="full-box">
                   
            </div>
     </div> Número de plazas ocupadas</span></div>`,
          },
          '1',
          'VP',
        ],
        [
          {
            v: '1',
            f: `<div  class="rotate" >
            
                   <span>
                          <div class="floating">   
                                 <div class="flex-box">   
                                 <button class="cstmbtn btn btn-xs btn-info">A</button>
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
      ]);

      // Create the chart.
      var chart = new google.visualization.OrgChart(
        document.getElementById('chart_div')
      );
      // Draw the chart, setting the allowHtml option to true for the tooltips.
      chart.draw(data, { allowHtml: true });
    }
  }
  esto() {
    console.log('click bb');
  }
  ngAfterViewInit() {
    var interval = setInterval(function () {
      var orgChartTables = document.querySelectorAll(
        '.google-visualization-orgchart-table'
      );

      if (orgChartTables.length > 0) {
        clearInterval(interval);

        var rotateElements = document.querySelectorAll('.rotate');
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
        );

        var cstmbtnElements = document.querySelectorAll('.cstmbtn');
        Array.prototype.forEach.call(
          cstmbtnElements,
          function (cstmbtnElement: HTMLElement) {
            cstmbtnElement.addEventListener('click', function (e) {
              e.stopPropagation();
            });
          }
        );
      }
    }, 1000);
  }
  toggleFloating() {
    let el = this.rotate.nativeElement.querySelector('.floating');
    let displayStyle = el.style.display;

    if (displayStyle === 'none' || displayStyle === '') {
      this.renderer.setStyle(el, 'display', 'block');
    } else {
      this.renderer.setStyle(el, 'display', 'none');
    }
  }

  toggleContent() {
    console.log('click');
    this.showContent = !this.showContent;
  }
}
