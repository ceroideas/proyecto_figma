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
@Component({
  selector: 'app-build',

  templateUrl: './build.component.html',
  styleUrl: './build.component.scss',
})
export class BuildComponent {
  @ViewChild(AdDirective, { static: true }) adHost!: AdDirective;
  @ViewChild('arrow', { static: true }) arrow!: ElementRef;
  @ViewChild('arrow2', { static: true }) arrow2!: ElementRef;

  isDisabled: boolean = false;
  private isDragging = false;
  private initialMouseX!: number;
  private initialMouseY!: number;
  private initialArrowRotation!: number;
  private initialArrowX!: number;
  private initialArrowY!: number;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  public createComponent(): void {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(MessageComponent);
    const componentRef =
      this.adHost.viewContainerRef.createComponent(componentFactory);

    // Puedes realizar acciones adicionales en el componente recién creado si es necesario.
    // Por ejemplo, puedes acceder a las propiedades o métodos del componente.
    // componentRef.instance.someProperty = 'some value';
    // componentRef.instance.someMethod();

    // También puedes escuchar eventos del componente si es necesario.
    // componentRef.instance.someEvent.subscribe((data) => {
    //   // Manejar el evento
    // });

    // Asegúrate de destruir la instancia del componente después de su uso si no lo necesitas más.
    componentRef.onDestroy(() => {
      // Puedes realizar acciones adicionales cuando se destruye la instancia del componente.
    });
    this.cdr.detectChanges();
  }

  onMouseDown(event: MouseEvent) {
    this.obtenerValorTransform();
    this.isDisabled = true;
    this.isDragging = true;
    this.initialMouseX = event.clientX;
    this.initialMouseY = event.clientY;
    console.log(this.initialMouseX);
    this.initialArrowRotation = this.getCurrentArrowRotation();
    this.renderer.setStyle(this.arrow.nativeElement, 'cursor', 'grabbing');
    this.renderer.listen('document', 'mousemove', (e: MouseEvent) =>
      this.onMouseMove(e)
    );
    this.renderer.listen('document', 'mouseup', () => this.onMouseUp());
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.initialMouseX;
      const deltaY = event.clientY - this.initialMouseY;
      const sensitivity = 0.5; // Ajusta este valor para cambiar la sensibilidad de la rotación

      const newRotation = this.initialArrowRotation - deltaX * sensitivity;
      this.rotateArrow(newRotation);
    }
  }

  onMouseUp() {
    this.isDragging = false;
    this.renderer.setStyle(this.arrow.nativeElement, 'cursor', 'grab');
    this.isDisabled = false;
  }

  getCurrentArrowRotation(): number {
    const transform = window
      .getComputedStyle(this.arrow.nativeElement)
      .getPropertyValue('transform');
    const matrix = new DOMMatrix(transform);
    return Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
  }

  rotateArrow(rotation: number) {
    console.log(this.initialArrowX, 'estoe s la inicial?');
    this.renderer.setStyle(
      this.arrow.nativeElement,
      'transform',
      ` rotate(${rotation}deg) translate(${this.initialArrowX}px, ${this.initialArrowY}px) `
    );
  }

  obtenerValorTransform() {
    const transformValue = window
      .getComputedStyle(this.arrow.nativeElement)
      .getPropertyValue('transform');
    console.log('Valor de transform:', transformValue);

    // Puedes analizar el valor de transform para obtener las partes específicas que necesitas
    const matrix = new DOMMatrix(transformValue);
    this.initialArrowX = matrix.m41;
    this.initialArrowY = matrix.m42;
  }
}
