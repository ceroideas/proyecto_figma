import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { some } from 'highcharts';
import { SetPriceComponent } from 'src/app/components/set-price/set-price.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ProjectService } from 'src/app/services/project.service';

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
  barData = [
    38, 43, 47, 52, 55, 59, 62, 66, 71, 76, 82, 87, 92, 96, 101, 108, 112, 116,
    119, 123, 129, 135, 141, 151, 160, 176, 52, 55, 59, 62, 66, 71, 76, 82, 119,
    123, 129, 135, 141, 151, 160, 119, 123, 129, 135, 141, 151, 1000,
  ];
  datas: any[] = [];
  maxBarHeight: number = 160;
  minBarWidth: number = 7;
  showTooltip: boolean = false;
  hoveredValue: number | null = null;
  tierCero: any = {};
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectSvc: ProjectService
  ) {}
  ngOnInit(): void {
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.id = this.route.snapshot.params['id'];

    this.projectSvc.getProject(this.id).subscribe((res: any) => {
      const nodes = res.nodes.map((node: any) => {
        return {
          tier: 'L' + node.tier,
          value: '15.325.896',
          description: node.name,
        };
      });

      this.datas = nodes.reverse();
      this.tierCero = res.nodes
        .find((node: any) => node.tier == 0)
        .sceneries.map((obj: any, i: number) => {
          obj.newName = abc.charAt(i);

          return obj;
        });
      let array: any[] = [];
      const keys = Object.keys(this.tierCero[0].years);
      for (let i = 0; i < keys.length; i++) {
        const yearKey = keys[i];
        for (let i = 0; i < this.tierCero.length; i++) {
          const scenerie = this.tierCero[i];
          let findYear = array.find((year) => year.hasOwnProperty(yearKey));
          if (findYear) {
            findYear[yearKey] = {
              ...findYear[yearKey],
              [scenerie.newName]: scenerie.years[yearKey],
            };
          } else {
            const newObj = {
              [yearKey]: { [scenerie.newName]: scenerie.years[yearKey] },
            };

            array.push(newObj);
          }
        }
      }
      console.log(array);
    });
  }

  calculateHeight(value: number): string {
    const maxData = Math.max(...this.barData);
    let normalizedHeight = (value / maxData) * this.maxBarHeight;
    normalizedHeight = Math.max(normalizedHeight, this.minBarWidth);
    return `${normalizedHeight}px`;
  }

  showBarValue(value: number) {
    this.showTooltip = true;
    this.hoveredValue = value;
  }

  hideBarValue() {
    this.showTooltip = false;
    this.hoveredValue = null;
  }

  goWaterfall() {
    this.router.navigate(['/home/waterfall']);
  }

  setClickedElement(index: number) {
    this.clickedElement = index;
  }
}
