import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AuthService, Usuario } from '../services/auth';
import { CarritoService, ProductoCarrito } from '../services/carrito';
import { PedidosService } from '../services/pedidos';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: false,
})
export class CheckoutPage {

  usuarioActual: Usuario | null = null;

  productos: ProductoCarrito[] = [];

  nombreCliente = '';
  cedula = '';
  correoCliente = '';
  telefonoCliente = '';

  ciudad = '';
  direccion = '';
  barrio = '';
  observaciones = '';

  subtotal = 0;
  envio = 0;
  total = 0;

  procesandoPedido = false;

  constructor(
    private authService: AuthService,
    private carritoService: CarritoService,
    private pedidosService: PedidosService,
    private router: Router,
    private toastController: ToastController
  ) {}


  ionViewWillEnter() {

    this.usuarioActual =
      this.authService.obtenerUsuarioActual();

    // Si no hay sesión iniciada
    if (!this.usuarioActual) {

      this.router.navigate(['/login']);
      return;

    }

    // Precargamos los datos de la cuenta
    this.nombreCliente =
      this.usuarioActual.nombre;

    this.correoCliente =
      this.usuarioActual.correo;

    this.telefonoCliente =
      this.usuarioActual.telefono;

    // Obtenemos los productos actuales del carrito
    this.productos =
      this.carritoService.obtenerCarrito();

    // Si el carrito está vacío
    if (this.productos.length === 0) {

      this.router.navigate(['/carrito']);
      return;

    }

    this.calcularTotales();

  }


  calcularTotales() {

    this.subtotal =
      this.carritoService.obtenerTotal();

    this.calcularEnvio();

    this.total =
      this.subtotal + this.envio;

  }


  calcularEnvio() {

    const ciudadNormalizada =
      this.normalizarTexto(this.ciudad);

    if (
      ciudadNormalizada === 'bogota' ||
      ciudadNormalizada === 'soacha'
    ) {

      this.envio = 8500;

    } else {

      // Para otras ciudades el envío se define
      // posteriormente según destino y peso.
      this.envio = 0;

    }

  }


  cambiarCiudad() {
    this.calcularTotales();
  }


  get envioPorConfirmar(): boolean {

    const ciudadNormalizada =
      this.normalizarTexto(this.ciudad);

    return (
      ciudadNormalizada !== '' &&
      ciudadNormalizada !== 'bogota' &&
      ciudadNormalizada !== 'soacha'
    );

  }


  async confirmarPedido() {

    if (this.procesandoPedido) {
      return;
    }

    if (!this.usuarioActual) {

      await this.mostrarMensaje(
        'Debes iniciar sesión para realizar el pedido.'
      );

      this.router.navigate(['/login']);
      return;

    }


    if (!this.nombreCliente.trim()) {

      await this.mostrarMensaje(
        'Ingresa el nombre completo.'
      );

      return;

    }


    if (!this.cedula.trim()) {

      await this.mostrarMensaje(
        'Ingresa el número de cédula.'
      );

      return;

    }


    if (!this.ciudad.trim()) {

      await this.mostrarMensaje(
        'Ingresa la ciudad o municipio.'
      );

      return;

    }


    if (!this.direccion.trim()) {

      await this.mostrarMensaje(
        'Ingresa la dirección de entrega.'
      );

      return;

    }


    if (!this.barrio.trim()) {

      await this.mostrarMensaje(
        'Ingresa el barrio.'
      );

      return;

    }


    if (this.productos.length === 0) {

      await this.mostrarMensaje(
        'El carrito está vacío.'
      );

      return;

    }


    this.procesandoPedido = true;

    this.calcularTotales();


    this.pedidosService.crearPedido({

      usuarioId:
        this.usuarioActual.id,

      nombreCliente:
        this.nombreCliente.trim(),

      cedula:
        this.cedula.trim(),

      correoCliente:
        this.correoCliente,

      telefonoCliente:
        this.telefonoCliente,

      productos:
        this.productos.map(
          producto => ({ ...producto })
        ),

      ciudad:
        this.ciudad.trim(),

      direccion:
        this.direccion.trim(),

      barrio:
        this.barrio.trim(),

      observaciones:
        this.observaciones.trim(),

      subtotal:
        this.subtotal,

      envio:
        this.envio,

      total:
        this.total

    });


    // Limpiamos el carrito después de guardar
    // correctamente el pedido.
    this.carritoService.vaciarCarrito();


    await this.mostrarMensaje(
      'Pedido realizado correctamente.',
      'success'
    );


    this.procesandoPedido = false;


    this.router.navigate([
      '/mis-pedidos'
    ]);

  }


  volverAlCarrito() {

    this.router.navigate([
      '/carrito'
    ]);

  }


  private normalizarTexto(texto: string): string {

    return texto
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  }


  private async mostrarMensaje(
    mensaje: string,
    tipo: 'success' | 'error' = 'error'
  ) {

    const toast =
      await this.toastController.create({

        message: mensaje,

        duration: 2200,

        position: 'bottom',

        icon:
          tipo === 'success'
            ? 'checkmark-circle-outline'
            : 'alert-circle-outline',

        cssClass: [
          'lushka-toast',
          tipo === 'success'
            ? 'toast-success'
            : 'toast-error'
        ],

        buttons: [
          {
            icon: 'close-outline',
            role: 'cancel'
          }
        ]

      });

    await toast.present();

  }

}