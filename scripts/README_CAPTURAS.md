# Script de Capturas Automaticas para Manual de Usuario

Este script usa Playwright para tomar capturas de pantalla automaticas de todas las secciones del sistema CASHI para el Manual de Usuario del Agente.

## Requisitos

- Node.js instalado
- Credenciales de un usuario con rol AGENTE

## Instalacion

```bash
# Instalar Playwright
npm install playwright

# Instalar el navegador Chromium
npx playwright install chromium
```

## Configuracion

Edita el archivo `capture-manual-screenshots.js` y cambia las credenciales:

```javascript
const USERNAME = 'TU_USUARIO_AGENTE';  // <-- Cambia esto
const PASSWORD = 'TU_CONTRASENA';       // <-- Cambia esto
```

## Ejecucion

```bash
# Opcion 1: Usando npm script
npm run capture:screenshots

# Opcion 2: Directamente con node
node scripts/capture-manual-screenshots.js
```

## Capturas Generadas

El script genera las siguientes imagenes en `user_manual_images/`:

### Raiz (`user_manual_images/`)
| Archivo | Descripcion |
|---------|-------------|
| `login_view.png` | Pantalla completa de login |
| `username_login.png` | Campo de usuario |
| `contra_login.png` | Campo de contrasena |
| `iniciar_sesion_button.png` | Boton de iniciar sesion |
| `main_view.png` | Vista principal con sidebar |
| `sidebar_expanded.png` | Sidebar expandido |
| `collapsed_side_bar.png` | Sidebar colapsado |
| `log_out_button.png` | Boton cerrar sesion |
| `ligth_mode.png` | Tema claro |
| `dark_mode.png` | Tema oscuro |
| `gestion_manual_main_view.png` | Modulo Gestion Manual |
| `selectores_contexto.png` | Selectores de inquilino/cartera |
| `campo_busqueda.png` | Campo de busqueda |
| `mensaje_advertencia.png` | Mensaje de advertencia |
| `ranking_equipo_main_view.png` | Modulo Ranking Equipo |
| `ranking_header.png` | Encabezado del ranking |
| `resumen_equipo.png` | Tarjetas de resumen |
| `tu_posicion.png` | Tarjeta "Tu Posicion" |
| `metas_del_dia.png` | Seccion de metas |
| `tabla_ranking.png` | Tabla de ranking |
| `boton_configuracion.png` | Boton configuracion |

### Modo Claro (`user_manual_images/ligth_mode/`)
| Archivo | Descripcion |
|---------|-------------|
| `cobranza_module_main_view.png` | Vista completa de Cobranza |
| `header_main_view.png` | Encabezado del modulo |
| `clientes_and_pautas.png` | Panel de cliente/pautas |
| `panel_central_formulario.png` | Formulario de tipificacion |
| `panel_montos_deuda.png` | Panel de montos/deuda |
| `historial_gestiones.png` | Historial de gestiones |

### Modo Oscuro (`user_manual_images/dark_mode/`)
| Archivo | Descripcion |
|---------|-------------|
| `cobranza_module_dark.png` | Cobranza en modo oscuro |

## Opciones del Script

En el archivo `capture-manual-screenshots.js` puedes modificar:

```javascript
// Ejecutar sin ventana visible (mas rapido)
headless: true,  // Cambiar a true

// Velocidad de ejecucion (ms entre acciones)
slowMo: 500      // Reducir para mas rapido
```

## Solucion de Problemas

### El script no encuentra elementos
Algunos selectores pueden variar. Revisa la consola para ver cual elemento fallo y ajusta el selector en el script.

### Las capturas salen cortadas
Ajusta el viewport en el script:
```javascript
viewport: { width: 1920, height: 1080 }
```

### Error de autenticacion
Verifica que las credenciales sean correctas y que el usuario tenga rol AGENTE.

## Capturas Manuales Adicionales

Algunas capturas requieren estados especificos que no se pueden automatizar facilmente:

1. **Llamada activa** - Requiere una llamada real entrante
2. **Promesa de pago activa** - Requiere un cliente con promesa
3. **Modal de inactividad** - Requiere esperar timeout
4. **Notificaciones toast** - Requieren acciones especificas
5. **OCR de comprobante** - Requiere subir un voucher real

Para estas, toma capturas manualmente cuando el sistema este en ese estado.
