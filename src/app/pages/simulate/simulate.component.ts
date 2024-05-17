import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Chart, registerables } from 'node_modules/chart.js';
import Swal from 'sweetalert2';
import { SimulationService } from 'src/app/services/simulation.service';
import { ChangeDetectorRef } from '@angular/core';

import { PipesModule } from '../../pipes/pipes.module';

Chart.register(...registerables);

@Component({
  selector: 'app-simulate',
  providers: [ProjectService, SimulationService],
  standalone: true,
  imports: [CommonModule, FormsModule, PipesModule],
  templateUrl: './simulate.component.html',
  styleUrl: './simulate.component.scss',
})
export class SimulateComponent implements OnInit {
  id!: any;
  simulationId: any;
  nodes: any[] = [];
  isSelectedAll: boolean = false;
  simulateName: string = 'simulation Name';
  simulateDescription: string = 'simulation description';
  simulationNumber: number = 0;
  editSimulation: boolean = false;
  tierCero: any;
  chart: any;
  arraySamples: any[] = [];
  percentiles: any[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  values: any[] = [];
  colorBar: any = '140, 100, 177';
  colorsOption: any[] = [
    '140, 100, 177',
    '108, 117, 125',
    '255, 193, 7',
    '0, 123, 255',
    '220, 53, 69',
    '23, 162, 184',
    '40, 167, 69 ',
  ];
  simulations: any[] = [];
  temp: any = {};
  csvData: any = [];

  constructor(
    private projectSvc: ProjectService,
    private simulationSvc: SimulationService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.projectSvc.getProject(this.id).subscribe((res: any) => {
      this.nodes = res.nodes; //.filter((node: any) => node.type == 1);
      this.tierCero = res.nodes.find((node: any) => node.tier == 0);

      this.simulationSvc.getSimulations(this.id).subscribe((res: any) => {
        this.simulations = res.reverse();
        if (this.simulations.length > 0) {
          this.selectSimulacion(this.simulations[0].id);
          console.log('SIMULATION');
        }
      });

      this.simulationChart();
    });
  }

  toggleActive(node: any) {
    node.isActive = !node.isActive;
    this.getNumberOfActiveNodes();
  }

  getSelectedSimulation(id: any) {
    this.simulationSvc.getSimulation(id).subscribe((res: any) => {
      console.log(res, 'SELECTED SIMULATION');
    });
  }

  toggleSelectAll() {
    var allNodes = this.nodes.filter((node: any) => node.type == 1);

    console.log(this.nodes);
    allNodes.forEach((node) => (node.isActive = this.isSelectedAll));
    if (!this.isSelectedAll) {
      this.nodes.forEach((node) => (node.isActive = this.isSelectedAll));
    }

    this.isSelectedAll = !this.isSelectedAll;
  }

  createSimualtion() {
    this.simulationId = null;
    this.simulationNumber = 0;
    this.simulateName = '';
    this.simulateDescription = '';
    this.arraySamples = [];
    this.editSimulation = true;
    this.nodes.forEach((node: any) => (node.isActive = false));
    if (this.chart) {
      this.chart.destroy();
    }
    this.simulationChart();
  }

  getNumberOfActiveNodes(): number {
    return this.nodes.filter((node) => node.isActive).length;
  }

  editSimulationClick() {
    if (this.disable() && this.editSimulation) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, asegúrate de ingresar un nombre y un número de simulaciones válido (mayor a 0) para continuar.',
        icon: 'error',
        iconColor: '#BC5800',
        customClass: {
          confirmButton: 'confirm',
        },
      }).then((result) => {});
    } else {
      this.editSimulation = !this.editSimulation;
    }
  }

  resetData() {
    Swal.fire({
      title: 'Estas seguro?',
      text: '¿Estás seguro de que deseas borrar los datos actuales de los campos? ',
      icon: 'question',
      iconColor: '#BC5800',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'confirm',
        cancelButton: 'cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.editSimulation = true;
        this.simulateDescription = '';
        this.simulationNumber = 0;
        this.simulateName = '';
      }
    });
  }

  async recursiveCalculate(_node: any) {
    let formula: any = [];
    let aux;
    let csvData: any = {};

    for (let i = 0; i < _node.formula.length; i++) {
      var nodeId = _node.formula[i];

      if (typeof nodeId === 'number') {
        var node = this.nodes.find((node: any) => node.id == nodeId);

        if (node.type == 1) {
          if (!node.isActive || node.isActive == false) {
            let value =
              node.unite === null || node.unite === undefined
                ? '0'
                : node.unite;
            formula.push(value);
            csvData = { ...csvData, [node.name]: value };

            aux = this.valoresPorNodo.find((x) => x.name == node.name);
            if (!aux) {
              this.valoresPorNodo.push({ name: node.name, values: [value] });
            } else {
              let values = aux.values;
              values.push(value);
              aux.values = values;
            }
          } else {
            switch (node.distribution_shape[0].name) {
              case 'Uniforme':
                const randomNumber = this.uniformOperation(
                  node.distribution_shape[0].min,
                  node.distribution_shape[0].max
                );
                aux = this.valoresPorNodo.find((x) => x.name == node.name);
                if (!aux) {
                  this.valoresPorNodo.push({
                    name: node.name,
                    values: [randomNumber],
                  });
                } else {
                  let values = aux.values;
                  values.push(randomNumber);
                  aux.values = values;
                }
                formula.push('(' + randomNumber + ')');
                csvData = { ...csvData, [node.name]: randomNumber };
                break;

              case 'Normal':
                const randomNumberNormal = this.normalOperation(
                  node.distribution_shape[0].mean,
                  node.distribution_shape[0].stDev
                );
                aux = this.valoresPorNodo.find((x) => x.name == node.name);
                if (!aux) {
                  this.valoresPorNodo.push({
                    name: node.name,
                    values: [randomNumberNormal],
                  });
                } else {
                  let values = aux.values;
                  values.push(randomNumberNormal);
                  aux.values = values;
                }
                formula.push('(' + randomNumberNormal + ')');
                csvData = { ...csvData, [node.name]: randomNumberNormal };
                break;

              case 'Exponencial':
                const randomNumberExponential = this.exponentialOperation(
                  node.distribution_shape[0].rate
                );
                aux = this.valoresPorNodo.find((x) => x.name == node.name);
                if (!aux) {
                  this.valoresPorNodo.push({
                    name: node.name,
                    values: [randomNumberExponential],
                  });
                } else {
                  let values = aux.values;
                  values.push(randomNumberExponential);
                  aux.values = values;
                }
                formula.push('(' + randomNumberExponential + ')');
                csvData = { ...csvData, [node.name]: randomNumberExponential };
                break;

              case 'Triangular':
                const triangularNumber = this.triangularOperation(
                  node.distribution_shape[0].min,
                  node.distribution_shape[0].mode,
                  node.distribution_shape[0].max
                );
                aux = this.valoresPorNodo.find((x) => x.name == node.name);
                if (!aux) {
                  this.valoresPorNodo.push({
                    name: node.name,
                    values: [triangularNumber],
                  });
                } else {
                  let values = aux.values;
                  values.push(triangularNumber);
                  aux.values = values;
                }
                formula.push('(' + triangularNumber + ')');
                csvData = { ...csvData, [node.name]: triangularNumber };
                break;

              case 'Poisson':
                const poissonNumber = this.poissonOperation(
                  node.distribution_shape[0].lambda
                );
                aux = this.valoresPorNodo.find((x) => x.name == node.name);
                if (!aux) {
                  this.valoresPorNodo.push({
                    name: node.name,
                    values: [poissonNumber],
                  });
                } else {
                  let values = aux.values;
                  values.push(poissonNumber);
                  aux.values = values;
                }
                formula.push('(' + poissonNumber + ')');
                csvData = { ...csvData, [node.name]: poissonNumber };
                break;

              case 'Binominal':
                const binomialNumber = this.binomialOperation(
                  node.distribution_shape[0].trials,
                  node.distribution_shape[0].probability
                );
                aux = this.valoresPorNodo.find((x) => x.name == node.name);
                if (!aux) {
                  this.valoresPorNodo.push({
                    name: node.name,
                    values: [binomialNumber],
                  });
                } else {
                  let values = aux.values;
                  values.push(binomialNumber);
                  aux.values = values;
                }
                formula.push('(' + binomialNumber + ')');
                csvData = { ...csvData, [node.name]: binomialNumber };
                break;

              case 'Lognormal':
                const lognormalNumber = this.lognormalOperation(
                  node.distribution_shape[0].mean,
                  node.distribution_shape[0].stDev
                );
                aux = this.valoresPorNodo.find((x) => x.name == node.name);
                if (!aux) {
                  this.valoresPorNodo.push({
                    name: node.name,
                    values: [lognormalNumber],
                  });
                } else {
                  let values = aux.values;
                  values.push(lognormalNumber);
                  aux.values = values;
                }
                formula.push('(' + lognormalNumber + ')');
                csvData = { ...csvData, [node.name]: lognormalNumber };
                break;

              case 'Geometric':
                const geometricNumber = this.lognormalOperation(
                  node.distribution_shape[0].mean,
                  node.distribution_shape[0].stDev
                );
                aux = this.valoresPorNodo.find((x) => x.name == node.name);
                if (!aux) {
                  this.valoresPorNodo.push({
                    name: node.name,
                    values: [geometricNumber],
                  });
                } else {
                  let values = aux.values;
                  values.push(geometricNumber);
                  aux.values = values;
                }
                formula.push('(' + geometricNumber + ')');
                csvData = { ...csvData, [node.name]: geometricNumber };
                break;

              case 'Weibull':
                const weibullNumber = this.weibullOperation(
                  node.distribution_shape[0].form,
                  node.distribution_shape[0].scale
                );
                aux = this.valoresPorNodo.find((x) => x.name == node.name);
                if (!aux) {
                  this.valoresPorNodo.push({
                    name: node.name,
                    values: [weibullNumber],
                  });
                } else {
                  let values = aux.values;
                  values.push(weibullNumber);
                  aux.values = values;
                }
                formula.push('(' + weibullNumber + ')');
                csvData = { ...csvData, [node.name]: weibullNumber };
                break;

              case 'Beta':
                const betaNumber = this.betaOperation(
                  node.distribution_shape[0].alpha,
                  node.distribution_shape[0].beta
                );
                aux = this.valoresPorNodo.find((x) => x.name == node.name);
                if (!aux) {
                  this.valoresPorNodo.push({
                    name: node.name,
                    values: [betaNumber],
                  });
                } else {
                  let values = aux.values;
                  values.push(betaNumber);
                  aux.values = values;
                }
                formula.push('(' + betaNumber + ')');
                csvData = { ...csvData, [node.name]: betaNumber };
                break;

              case 'Hypergeometric':
                const hypergeometricNumber = this.hypergeometricOperation(
                  node.distribution_shape[0].population,
                  node.distribution_shape[0].success,
                  node.distribution_shape[0].trials
                );
                aux = this.valoresPorNodo.find((x) => x.name == node.name);
                if (!aux) {
                  this.valoresPorNodo.push({
                    name: node.name,
                    values: [hypergeometricNumber],
                  });
                } else {
                  let values = aux.values;
                  values.push(hypergeometricNumber);
                  aux.values = values;
                }
                formula.push('(' + hypergeometricNumber + ')');
                csvData = { ...csvData, [node.name]: hypergeometricNumber };
                break;

              default:
                break;
            }
          }
        } else {
          // Utiliza await para esperar la resolución de la función recursiva
          const form = await this.recursiveCalculate(node);
          formula.push(await this.recursiveCalculate(node));
          csvData = {
            ...csvData,
            [node.name]: eval(form.flat(5).join('').replaceAll(',', '')),
          };
        }
      } else {
        formula.push(nodeId);
      }
    }

    if (Object.keys(csvData).length === 0) {
    } else {
      this.temp = { ...this.temp, ...csvData };
    }

    return formula;
  }

  valoresPorNodo: any[] = [];

  async generateSimulation() {
    this.valoresPorNodo = [];
    const nodos = this.nodes
      .filter((node) => node.isActive)
      .map((node) => node.id);

    let formula: any = [];
    let arrayToSee = [];
    let aux;

    let csvData: any = [];

    for (let i = 0; i < +this.simulationNumber; i++) {
      let j = i;
      for (let i = 0; i < this.tierCero.formula.length; i++) {
        var nodeId = this.tierCero.formula[i];

        if (typeof nodeId === 'number') {
          var node = this.nodes.find((node: any) => node.id == nodeId);
          csvData[j] = {
            ...csvData[j],
            id: this.simulationId,
          };
          if (node.type == 1) {
            if (!node.isActive || node.isActive == false) {
              let value =
                node.unite === null || node.unite === undefined
                  ? '0'
                  : node.unite;
              formula.push(value);

              aux = this.valoresPorNodo.find((x) => x.name == node.name);
              csvData[j] = {
                ...csvData[j],
                [node.name]: value,
              };
              if (!aux) {
                this.valoresPorNodo.push({ name: node.name, values: [value] });
              } else {
                let values = aux.values;
                values.push(value);
                aux.values = values;
              }
            } else {
              switch (node.distribution_shape[0].name) {
                case 'Uniforme':
                  const randomNumber = this.uniformOperation(
                    node.distribution_shape[0].min,
                    node.distribution_shape[0].max
                  );
                  aux = this.valoresPorNodo.find((x) => x.name == node.name);
                  if (!aux) {
                    this.valoresPorNodo.push({
                      name: node.name,
                      values: [randomNumber],
                    });
                  } else {
                    let values = aux.values;
                    values.push(randomNumber);
                    aux.values = values;
                  }
                  formula.push('(' + randomNumber + ')');
                  csvData[j] = {
                    ...csvData[j],
                    [node.name]: randomNumber,
                  };
                  break;

                case 'Triangular':
                  const triangularNumber = this.triangularOperation(
                    node.distribution_shape[0].min,
                    node.distribution_shape[0].mode,
                    node.distribution_shape[0].max
                  );
                  aux = this.valoresPorNodo.find((x) => x.name == node.name);
                  if (!aux) {
                    this.valoresPorNodo.push({
                      name: node.name,
                      values: [triangularNumber],
                    });
                  } else {
                    let values = aux.values;
                    values.push(triangularNumber);
                    aux.values = values;
                  }
                  formula.push('(' + triangularNumber + ')');
                  csvData[j] = {
                    ...csvData[j],
                    [node.name]: triangularNumber,
                  };
                  break;

                case 'Binominal':
                  const binomialNumber = this.binomialOperation(
                    node.distribution_shape[0].trials,
                    node.distribution_shape[0].probability
                  );
                  aux = this.valoresPorNodo.find((x) => x.name == node.name);
                  if (!aux) {
                    this.valoresPorNodo.push({
                      name: node.name,
                      values: [binomialNumber],
                    });
                  } else {
                    let values = aux.values;
                    values.push(binomialNumber);
                    aux.values = values;
                  }
                  formula.push('(' + binomialNumber + ')');
                  csvData[j] = {
                    ...csvData[j],
                    [node.name]: binomialNumber,
                  };
                  break;

                case 'Lognormal':
                  const lognormalNumber = this.lognormalOperation(
                    node.distribution_shape[0].mean,
                    node.distribution_shape[0].stDev
                  );
                  aux = this.valoresPorNodo.find((x) => x.name == node.name);
                  if (!aux) {
                    this.valoresPorNodo.push({
                      name: node.name,
                      values: [lognormalNumber],
                    });
                  } else {
                    let values = aux.values;
                    values.push(lognormalNumber);
                    aux.values = values;
                  }
                  formula.push('(' + lognormalNumber + ')');
                  csvData[j] = {
                    ...csvData[j],
                    [node.name]: lognormalNumber,
                  };
                  break;

                case 'Geometric':
                  const geometricNumber = this.geometricalOperation(
                    node.distribution_shape[0].probability
                  );
                  aux = this.valoresPorNodo.find((x) => x.name == node.name);
                  if (!aux) {
                    this.valoresPorNodo.push({
                      name: node.name,
                      values: [geometricNumber],
                    });
                  } else {
                    let values = aux.values;
                    values.push(geometricNumber);
                    aux.values = values;
                  }
                  formula.push('(' + geometricNumber + ')');
                  csvData[j] = {
                    ...csvData[j],
                    [node.name]: geometricNumber,
                  };
                  break;

                case 'Weibull':
                  const weibullNumber = this.weibullOperation(
                    node.distribution_shape[0].form,
                    node.distribution_shape[0].scale
                  );
                  aux = this.valoresPorNodo.find((x) => x.name == node.name);
                  if (!aux) {
                    this.valoresPorNodo.push({
                      name: node.name,
                      values: [weibullNumber],
                    });
                  } else {
                    let values = aux.values;
                    values.push(weibullNumber);
                    aux.values = values;
                  }
                  formula.push('(' + weibullNumber + ')');
                  csvData[j] = {
                    ...csvData[j],
                    [node.name]: weibullNumber,
                  };
                  break;

                case 'Beta':
                  const betaNumber = this.betaOperation(
                    node.distribution_shape[0].alpha,
                    node.distribution_shape[0].beta
                  );
                  aux = this.valoresPorNodo.find((x) => x.name == node.name);
                  if (!aux) {
                    this.valoresPorNodo.push({
                      name: node.name,
                      values: [betaNumber],
                    });
                  } else {
                    let values = aux.values;
                    values.push(betaNumber);
                    aux.values = values;
                  }
                  formula.push('(' + betaNumber + ')');
                  csvData[j] = {
                    ...csvData[j],
                    [node.name]: betaNumber,
                  };
                  break;

                case 'Hypergeometric':
                  const hypergeometricNumber = this.hypergeometricOperation(
                    node.distribution_shape[0].population,
                    node.distribution_shape[0].success,
                    node.distribution_shape[0].trials
                  );
                  aux = this.valoresPorNodo.find((x) => x.name == node.name);
                  if (!aux) {
                    this.valoresPorNodo.push({
                      name: node.name,
                      values: [hypergeometricNumber],
                    });
                  } else {
                    let values = aux.values;
                    values.push(hypergeometricNumber);
                    aux.values = values;
                  }
                  formula.push('(' + hypergeometricNumber + ')');
                  csvData[j] = {
                    ...csvData[j],
                    [node.name]: hypergeometricNumber,
                  };
                  break;

                case 'Poisson':
                  const poissonNumber = this.poissonOperation(
                    node.distribution_shape[0].lambda
                  );
                  aux = this.valoresPorNodo.find((x) => x.name == node.name);
                  if (!aux) {
                    this.valoresPorNodo.push({
                      name: node.name,
                      values: [poissonNumber],
                    });
                  } else {
                    let values = aux.values;
                    values.push(poissonNumber);
                    aux.values = values;
                  }
                  formula.push('(' + poissonNumber + ')');
                  csvData[j] = {
                    ...csvData[j],
                    [node.name]: poissonNumber,
                  };
                  break;

                case 'Normal':
                  const randomNumberNormal = this.normalOperation(
                    node.distribution_shape[0].mean,
                    node.distribution_shape[0].stDev
                  );
                  aux = this.valoresPorNodo.find((x) => x.name == node.name);
                  if (!aux) {
                    this.valoresPorNodo.push({
                      name: node.name,
                      values: [randomNumberNormal],
                    });
                  } else {
                    let values = aux.values;
                    values.push(randomNumberNormal);
                    aux.values = values;
                  }
                  formula.push('(' + randomNumberNormal + ')');
                  csvData[j] = {
                    ...csvData[j],
                    [node.name]: randomNumberNormal,
                  };
                  break;

                case 'Exponencial':
                  const randomNumberExponential = this.exponentialOperation(
                    node.distribution_shape[0].rate
                  );
                  aux = this.valoresPorNodo.find((x) => x.name == node.name);
                  if (!aux) {
                    this.valoresPorNodo.push({
                      name: node.name,
                      values: [randomNumberExponential],
                    });
                  } else {
                    let values = aux.values;
                    values.push(randomNumberExponential);
                    aux.values = values;
                  }
                  formula.push('(' + randomNumberExponential + ')');
                  csvData[j] = {
                    ...csvData[j],
                    [node.name]: randomNumberExponential,
                  };
                  break;

                default:
                  break;
              }
            }
          } else {
            let formula2 = await this.recursiveCalculate(node);
            formula.push('(' + formula2 + ')');

            const data = this.temp;

            csvData[j] = {
              ...csvData[j],
              [node.name]: eval(formula2.flat(5).join('').replaceAll(',', '')),
            };

            if (Object.keys(data).length !== 0) {
              csvData[j] = {
                ...csvData[j],
                ...Object.keys(data).reduce((acc: any, key) => {
                  if (!(key in csvData[j])) {
                    acc[key] = data[key];
                  }
                  return acc;
                }, {}),
              };
            }
          }
        } else {
          formula.push(nodeId);
        }
      }

      const operation = eval(formula.flat(5).join('').replaceAll(',', ''));

      // const operation = formula;
      csvData[j] = {
        ...csvData[j],
        [this.tierCero.name]: operation,
      };

      arrayToSee.push(operation.toFixed(2));

      formula = [];
    }
    /*  console.log(csvData, 'DATA'); */
    this.csvData = csvData;
    this.arraySamples = arrayToSee;
    if (this.chart) {
      this.chart.destroy();
    }
    this.simulationChart();
    this.updateSimulation();

    for (let j in this.valoresPorNodo) {
      let values = this.valoresPorNodo[j].values;
      values = values.map(Number);
      let sum = values.reduce((a: any, b: any) => a + b, 0);
      let avg = sum / values.length;
      this.valoresPorNodo[j].values = avg;
    }
  }
  chartetc() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.simulationChart();
  }

  saveSimulationData() {
    if (this.disable()) {
      Swal.fire({
        title: 'Error',
        text: 'El nombre y numero (mayor a 0) de simulaciones son necesarios',
        icon: 'error',
        iconColor: '#BC5800',
        customClass: {
          confirmButton: 'confirm',
        },
      }).then((result) => {});
    } else {
      this.editSimulation = !this.editSimulation;
      if (this.simulationId) {
        var image = this.chart.toBase64Image();
        const simulationData = {
          name: this.simulateName,
          description: this.simulateDescription,
          steps: this.simulationNumber,
          color: this.colorBar,
          simulation: image,
        };

        this.simulationSvc
          .updateSimulation(this.simulationId, simulationData)
          .subscribe((res: any) => {
            this.simulationId = res.id;
            this.simulationSvc.getSimulations(this.id).subscribe((res: any) => {
              this.simulations = res.reverse();
            });
            Swal.fire({
              title: 'Guardado!',
              text: 'La simulacion fue guardada con exito!',
              icon: 'success',
            });
          });
      } else {
        this.saveSimulation();
      }
    }
  }

  saveSimulation() {
    var image = this.chart.toBase64Image();
    const simulationData = {
      project_id: this.id,
      name: this.simulateName,
      description: this.simulateDescription,
      steps: this.simulationNumber,
      color: this.colorBar,
      nodes: [],
      samples: [],
      simulation: image,
    };

    this.simulationSvc.saveSimulation(simulationData).subscribe((res: any) => {
      this.simulationId = res.id;
      this.simulationSvc.getSimulations(this.id).subscribe((res: any) => {
        this.simulations = res.reverse();
      });
      Swal.fire({
        title: 'Guardado!',
        text: 'La simulacion fue guardada con exito!',
        icon: 'success',
      });
    });
  }

  updateImageUrls() {
    this.simulations.forEach((simulation) => {
      // Agregar un parámetro de tiempo a la URL de la imagen
      simulation.simulation += `?t=${new Date().getTime()}`;
    });
  }

  updateSimulation() {
    const nodos = this.nodes
      .filter((node) => node.isActive)
      .map((node) => node.id);

    try {
      const simulationData = {
        nodes: nodos,
        samples: this.arraySamples,
        csvData: this.csvData,
      };
      this.simulationSvc
        .updateSimulation(this.simulationId, simulationData)
        .subscribe((res: any) => {
          var image = this.chart.toBase64Image();

          this.simulationSvc
            .updateSimulation(this.simulationId, { simulation: image })
            .subscribe((res: any) => {
              this.simulationSvc
                .getSimulations(this.id)
                .subscribe((res: any) => {
                  this.simulations = res.reverse();
                  this.updateImageUrls();
                  this.cdRef.detectChanges();
                  console.log(res);
                });
            });

          Swal.fire({
            title: 'Guardado!',
            text: 'La simulacion fue guardada con exito!',
            icon: 'success',
          });
        });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar la simulacion, verifique los datos',
        icon: 'error',
        iconColor: '#BC5800',
        customClass: {
          confirmButton: 'confirm',
        },
      });
    }
  }

  disable() {
    if (this.simulateName && this.simulationNumber > 0) {
      return false;
    } else {
      return true;
    }
  }

  uniformOperation(minValue: any, maxValue: any) {
    const min = +minValue;
    const max = +maxValue;

    // Generar muestras de la distribución
    var s = [];
    for (var i = 0; i < +this.simulationNumber; i++) {
      s.push(min + Math.random() * (max - min));
    }

    // Verificar que todos los valores están dentro del intervalo dado
    // console.log(s.every((value) => value >= min && value < max));

    var binWidth = (max - min) / 15;

    const arrayOperation = Array.from(
      { length: 50 },
      (_, i) => min + i * binWidth
    );

    return arrayOperation[Math.floor(Math.random() * arrayOperation.length)];
  }

  normalOperation(meanOperation: any, stDevOperation: any) {
    // Definir la media y la desviación estándar
    var mu = +meanOperation,
      sigma = +stDevOperation,
      samples = +this.simulationNumber;

    // Generar una distribución normal
    // Generar una distribución normal
    var s = [];
    for (var i = 0; i < samples; i++) {
      s.push(
        mu +
          sigma *
            Math.sqrt(-2.0 * Math.log(Math.random())) *
            Math.cos(2.0 * Math.PI * Math.random())
      );
    }
    // Crear el histograma
    var histogram = new Array(samples).fill(0);
    for (var i = 0; i < s.length; i++) {
      histogram[Math.floor(((s[i] - mu + 5 * sigma) / (10 * sigma)) * 100)]++;
    }

    var binWidth = (10 * sigma) / 100;
    histogram = histogram.map(function (value) {
      return value / (binWidth * s.length);
    });

    // Crear la curva de la función de densidad de probabilidad
    var x = Array.from(
      { length: 100 },
      (_, i) => mu - 5 * sigma + (i * (10 * sigma)) / 100
    );

    x = x.filter(function (_, i) {
      return histogram[i] > 0;
    });

    console.log(x[Math.floor(Math.random() * x.length)], 'NORMAL');

    return x[Math.floor(Math.random() * x.length)];
  }

  exponentialOperation(rateOperation: any) {
    // Escala de la distribución exponencial
    let rate = +rateOperation; // Cambia este valor para ajustar la escala

    // Dibujar muestras de la distribución exponencial
    let s = [];
    for (let i = 0; i < +this.simulationNumber; i++) {
      s.push(-rate * Math.log(1.0 - Math.random()));
    }

    // Crear el histograma
    let histogram = new Array(50).fill(0);
    for (let i = 0; i < s.length; i++) {
      histogram[Math.min(Math.floor(s[i] / (10 / 50)), histogram.length - 1)]++;
    }

    // Normalizar el histograma
    let binWidth = 10 / 50;
    histogram = histogram.map((value) => value / (binWidth * s.length));

    // Crear bins para el histograma
    let bins = Array.from({ length: histogram.length }, (_, i) => i * binWidth);

    console.log(bins[Math.floor(Math.random() * bins.length)], 'samples');

    return bins[Math.floor(Math.random() * bins.length)];
  }

  triangularOperation(min: any, mode: any, max: any) {
    // Función para generar números aleatorios con distribución triangular
    function triangularDistribution(
      sampleSize: any,
      low: number,
      mode: number,
      high: number
    ) {
      const triangularSamples = [];
      for (let i = 0; i < sampleSize; i++) {
        const u = Math.random();
        const f = (mode - low) / (high - low);
        if (u <= f) {
          triangularSamples.push(
            low + Math.sqrt(u * (high - low) * (mode - low))
          );
        } else {
          triangularSamples.push(
            high - Math.sqrt((1 - u) * (high - low) * (high - mode))
          );
        }
      }
      return triangularSamples;
    }

    // Definir parámetros de la distribución triangular
    const sampleSize = 1000;

    // Generar números aleatorios con distribución triangular
    const triangularSamples = triangularDistribution(
      sampleSize,
      +min,
      +mode,
      +max
    );

    return triangularSamples[
      Math.floor(Math.random() * triangularSamples.length)
    ];
  }

  poissonOperation(lambda: any) {
    // Función para generar números aleatorios con distribución de Poisson
    function poissonDistribution(sampleSize: any, lambda: any) {
      const poissonSamples = [];
      for (let i = 0; i < sampleSize; i++) {
        let L = Math.exp(-lambda);
        let k = 0;
        let p = 1.0;
        do {
          k++;
          p *= Math.random();
        } while (p > L);
        poissonSamples.push(k - 1);
      }
      return poissonSamples;
    }

    // Definir parámetros de la distribución de Poisson
    const sampleSize = 1000;

    // Generar números aleatorios con distribución de Poisson
    const poissonSamples = poissonDistribution(sampleSize, +lambda);

    console.log(
      poissonSamples[Math.floor(Math.random() * poissonSamples.length)],
      'samples'
    );

    return poissonSamples[Math.floor(Math.random() * poissonSamples.length)];
  }

  binomialOperation(trials: any, probability: any) {
    // Función para generar números aleatorios con distribución binomial
    function binomialDistribution(sampleSize: any, n: any, p: any) {
      const binomialSamples = [];
      for (let i = 0; i < sampleSize; i++) {
        let successes = 0;
        for (let j = 0; j < n; j++) {
          if (Math.random() < p) {
            successes++;
          }
        }
        binomialSamples.push(successes);
      }
      return binomialSamples;
    }

    // Definir parámetros de la distribución binomial
    const sampleSize = 1000;

    // Generar números aleatorios con distribución binomial
    const binomialSamples = binomialDistribution(
      sampleSize,
      +trials,
      +probability
    );

    console.log(
      binomialSamples[Math.floor(Math.random() * binomialSamples.length)],
      'samples'
    );

    return binomialSamples[Math.floor(Math.random() * binomialSamples.length)];
  }

  lognormalOperation(mean: any, stDev: any) {
    // Parámetros de la distribución logarítmico normal
    const mu = Math.log(+mean); // Media logarítmica
    const sigma = +stDev / +mean; // Desviación estándar logarítmica

    // Función de densidad de probabilidad (PDF) de la distribución logarítmica normal
    function lognormalPDF(x: any) {
      const coefficient = 1 / (x * sigma * Math.sqrt(2 * Math.PI));
      const exponent = -((Math.log(x) - mu) ** 2) / (2 * sigma ** 2);
      return coefficient * Math.exp(exponent);
    }

    // Datos para el gráfico

    const data = [];

    // Calcular datos para el gráfico
    const step = 2; // Mostrar cada 2 puntos en el eje x
    for (let x = 1; x <= 200; x += 0.1 * step) {
      const pdf = lognormalPDF(x);

      data.push(pdf);
    }

    console.log(data[Math.floor(Math.random() * data.length)], 'Samples');

    return data[Math.floor(Math.random() * data.length)];
  }

  geometricalOperation(probability: any) {
    // Parámetros de la distribución geométrica
    const p = +probability; // Probabilidad de éxito en cada intento
    const size = 10000; // Tamaño de la muestra

    // Generar muestras de la distribución geométrica
    const samples = Array.from({ length: size }, () => {
      let attempts = 1;
      while (Math.random() >= p) {
        attempts++;
      }
      return attempts;
    });

    console.log(samples[Math.floor(Math.random() * samples.length)], 'samples');

    return samples[Math.floor(Math.random() * samples.length)];
  }

  weibullOperation(form: any, scale: any) {
    var s = Array.from({ length: 1000 }, () =>
      Math.pow(-Math.log(Math.random()), +form / +scale)
    );

    console.log(s[Math.floor(Math.random() * s.length)], 'Samples');

    return s[Math.floor(Math.random() * s.length)];
  }

  betaOperation(alpha1: any, beta1: any) {
    // Parámetros de la distribución beta
    const alpha = +alpha1; // Parámetro de forma
    const beta = +beta1; // Parámetro de forma
    const size = 1000; // Tamaño de la muestra

    // Generar muestras de la distribución beta
    const samples = Array.from({ length: size }, () => {
      return Math.random() ** alpha * (1 - Math.random()) ** beta;
    });

    console.log(samples[Math.floor(Math.random() * samples.length)], 'samples');

    return samples[Math.floor(Math.random() * samples.length)];
  }

  hypergeometricOperation(population: any, success: any, trials: any) {
    // Parámetros de la distribución hipergeométrica
    const M = +population; // Tamaño de la población
    const n = +success; // Número de éxitos en la población
    const N = +trials; // Tamaño de la muestra

    // Generar muestras de la distribución hipergeométrica
    const samples = Array.from({ length: 1000 }, () => {
      let successCount = 0;
      for (let i = 0; i < N; i++) {
        if (Math.random() < n / M) {
          successCount++;
        }
      }
      return successCount;
    });

    console.log(samples[Math.floor(Math.random() * samples.length)], 'SMAPLES');

    return samples[Math.floor(Math.random() * samples.length)];
  }

  simulationChart() {
    // Realizar una simulación de Montecarlo de 10000 muestras
    var muestras = this.arraySamples;

    // console.log(muestras, 'muestras');

    const conteos: any = {};

    muestras = muestras.sort((a, b) => a - b);

    // Decide cuántos datos quieres en tu muestra
    const numMuestra = 11;

    // Crea una nueva array para tu muestra
    const newmuestra = [];

    // Llena tu muestra con datos aleatorios de tus datos originales
    for (let i = 0; i < numMuestra; i++) {
      const index = Math.floor(Math.random() * muestras.length);
      newmuestra.push(muestras[index]);
    }

    newmuestra.forEach((muestra) => {
      if (conteos[muestra]) {
        conteos[muestra]++;
      } else {
        conteos[muestra] = 1;
      }
    });

    // Calcular los percentiles
    // const percentiles = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    this.values = this.percentiles.map((percentil) => {
      const index = Math.floor((percentil / 100) * (muestras.length - 1));
      return muestras.sort((a, b) => a - b)[index];
    });

    const etiquetas = Object.keys(conteos).sort(
      (a, b) => Number(a) - Number(b)
    );

    // const datosY = Object.values(conteos).sort((a,b) => Number(a) - Number(b));
    /*const datosY = Array.from(
      { length: Object.values(conteos).length },
      (_, i) => '-'
    );*/

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: this.percentiles.map((p) => {
          return p + '%';
        }),
        datasets: [
          {
            label: 'Simulación Montecarlo',
            data: this.values,
            backgroundColor: 'rgba(' + this.colorBar + ', .5)',
            borderColor: 'rgba(' + this.colorBar + ', 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Crear una lista HTML con los percentiles
    /*const lista: any = document.getElementById('percentiles');
    percentiles.forEach((p, i) => {
      const li = document.createElement('li');
      li.textContent = `El ${p}% de los valores son menores que ${values[i]}`;
      lista.appendChild(li);
    });*/
  }

  selectColor(color: string, event: any) {
    if (this.editSimulation) {
      this.colorBar = color;

      if (this.chart) {
        this.chart.destroy();
      }
      this.simulationChart();
    } else {
    }
  }

  selectSimulacion(id: any) {
    this.simulationId = id;
    this.nodes.forEach((node: any) => (node.isActive = false));

    const simulation = this.simulations.find(
      (simulation: any) => simulation.id == this.simulationId
    );
    this.editSimulation = false;
    this.simulateName = simulation.name;
    this.simulateDescription = simulation.description;
    this.arraySamples = simulation.samples;
    this.simulationNumber = simulation.steps;
    this.colorBar = simulation.color;

    for (let i = 0; i < simulation.nodes.length; i++) {
      const nodeId = simulation.nodes[i];
      const findNode = this.nodes.filter((node: any) => node.id == nodeId);
      if (findNode.length > 0) {
        findNode[0].isActive = true;
      }
    }

    this.csvData = JSON.parse(simulation?.csvData);

    /* console.log(simulation, 'SIMULATION ENCONTRADA'); */

    if (this.chart) {
      this.chart.destroy();
    }
    this.simulationChart();

    var allNodes = this.nodes.filter((node: any) => node.type == 1);
    var allNodesSelected = this.nodes.filter(
      (node: any) => node.type == 1 && node.isActive
    );

    if (allNodes.length == allNodesSelected.length) {
      this.isSelectedAll = false;
    } else {
      this.isSelectedAll = true;
    }
    console.log(this.isSelectedAll);
  }

  elimateSimulation() {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'No podras revertir esta accion',
      icon: 'question',
      iconColor: '#BC5800',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'confirm',
        cancelButton: 'cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.simulationSvc
          .deleteSimulation(this.simulationId)
          .subscribe((res: any) => {
            this.simulationSvc.getSimulations(this.id).subscribe((res: any) => {
              this.simulations = res.reverse();

              if (this.chart) {
                this.chart.destroy();
              }
              this.simulationChart();
            });

            Swal.fire({
              title: 'Borrado!',
              text: 'La simulacion fue borrada con exito!',
              icon: 'success',
            });
          });
      }
    });
  }

  exportToCsv() {
    let csvString = '';

    let a: any = 'Valores';

    // Encabezados
    csvString += a + '\n';

    function tieneMasDeDosDecimales(valor: any) {
      // Convertir el valor a una cadena de texto
      const strValor = valor.toString();
      // Buscar la presencia de más de dos decimales
      return /\.\d{3,}/.test(strValor);
    }

    function obtenerKeysUnicas(objetos: any[]) {
      let keysUnicas: string[] = [];
      objetos.forEach((objeto: {}) => {
        Object.keys(objeto).forEach((key) => {
          if (!keysUnicas.includes(key)) {
            keysUnicas.push(key);
          }
        });
      });
      return keysUnicas;
    }

    // Función para convertir array de objetos a CSV
    function convertirArrayA_CSV(arrayObjetos: any[]) {
      const keysUnicas = obtenerKeysUnicas(arrayObjetos);

      // Encabezados CSV
      const encabezadosCSV = keysUnicas.join(',') + '\n';

      // Valores CSV
      let valoresCSV = '';
      arrayObjetos.forEach((objeto: { [x: string]: any }) => {
        keysUnicas.forEach((key) => {
          /*           if (key === 'id') {
            valoresCSV +=
              typeof objeto[key] === 'number' ? objeto[key] : objeto[key] || '';
            valoresCSV += ',';
          } else if (!Number.isInteger(Number(objeto[key]))) {
            const value = parseFloat(objeto[key]);
            // Verificar si el valor tiene menos de dos o más de tres decimales
            if (
              value % 1 !== 0 &&
              (value.toString().split('.')[1].length < 2 ||
                value.toString().split('.')[1].length > 2)
            ) {
              valoresCSV += value.toFixed(2);
            } else {
              valoresCSV += value;
            }
            valoresCSV += ',';
          } else {
            valoresCSV +=
              typeof objeto[key] === 'number'
                ? objeto[key].toFixed(2)
                : Number(objeto[key]).toFixed(2) || '';
            valoresCSV += ',';
          } */
          valoresCSV += objeto[key];

          valoresCSV += ',';
        });
        valoresCSV += '\n';
      });

      return encabezadosCSV + valoresCSV;
    }

    // Convertir array de objetos a CSV
    const csv = convertirArrayA_CSV(this.csvData);

    const simulation = this.simulations.find(
      (simulation: any) => simulation.id == this.simulationId
    );

    // Filas de datos
    /* csvString += simulation.samples.join('\n'); */

    // Crear un Blob con el contenido CSV
    const blob = new Blob([csv], { type: 'text/csv' });

    // Crear un enlace de descarga
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'valores simulados.csv'; // Nombre del archivo
    link.click();

    // Liberar el objeto URL
    URL.revokeObjectURL(url);
  }
}
