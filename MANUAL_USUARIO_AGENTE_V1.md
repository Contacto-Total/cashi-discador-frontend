# Manual de Usuario - Rol de Agente (v1)

## Sistema CASHI - Plataforma de Cobranza

---

## Tabla de Contenidos

1. [Introduccion](#1-introduccion)
2. [Acceso al Sistema](#2-acceso-al-sistema)
3. [Navegacion General](#3-navegacion-general)
4. [Modulo de Cobranza](#4-modulo-de-cobranza)
5. [Modulo de Gestion Manual](#5-modulo-de-gestion-manual)
6. [Modulo de Ranking Equipo](#6-modulo-de-ranking-equipo)
7. [Configuracion Personal](#7-configuracion-personal)
8. [Preguntas Frecuentes](#8-preguntas-frecuentes)

---

## 1. Introduccion

### 1.1 Proposito del Sistema

CASHI es una plataforma integral de gestion de cobranza que permite a los agentes realizar llamadas telefonicas, registrar gestiones con clientes, y dar seguimiento a promesas de pago. El sistema esta disenado para optimizar el proceso de recuperacion de cartera.

### 1.2 Requisitos del Sistema

- Navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge)
- Conexion a internet estable
- Auriculares con microfono (para llamadas VoIP)
- Resolucion de pantalla minima recomendada: 1366x768

### 1.3 Opciones Disponibles para el Rol de Agente

Como agente, tendras acceso a las siguientes opciones del menu:

| Opcion | Descripcion |
|--------|-------------|
| **Cobranza** | Pantalla principal de gestion de llamadas y tipificacion |
| **Gestion Manual** | Busqueda de clientes por documento para tipificacion sin llamada |
| **Ranking Equipo** | Visualizacion del ranking de desempeno del equipo |

---

## 2. Acceso al Sistema

**URL de acceso**: [https://cobranza.contactototal.com.pe/login](https://cobranza.contactototal.com.pe/login)

### 2.1 Pantalla de Inicio de Sesion

Al abrir el sistema, se mostrara la pantalla de inicio de sesion con un robot animado que te guiara durante el proceso.

![alt text](user_manual_images/login_view.png)

### 2.2 Pasos para Iniciar Sesion

1. **Ingresa tu usuario**: Escribe tu nombre de usuario asignado en el campo "Usuario"

   ![alt text](user_manual_images/username_login.png)

2. **Ingresa tu contrasena**: Escribe tu contraseña en el campo "Contraseña"
   - Puedes hacer clic en el icono del ojo para mostrar/ocultar la contrasena

   ![alt text](user_manual_images/contra_login.png)

3. **Haz clic en "Iniciar Sesion"**: Una vez completados ambos campos correctamente, el boton se habilitara

   ![alt text](user_manual_images/iniciar_sesion_button.png)

### 2.3 Mensajes del Robot Guia

El robot animado te proporcionara retroalimentacion visual durante el login:

| Estado | Mensaje del Robot |
|--------|-------------------|
| Inicio | "Hola! Bienvenido" |
| Sin datos | "Ingresa tus credenciales" |
| Falta usuario | "Falta tu usuario" |
| Usuario muy corto | "Usuario muy corto" |
| Falta contrasena | "Falta tu contrasena" |
| Contrasena corta | "Contrasena muy corta" |
| Todo correcto | "Perfecto! Todo listo" |

### 2.4 Conexion Automatica al Sistema de Telefonia

Una vez que inicies sesion exitosamente:

1. El sistema te conectara automaticamente al servidor de telefonia (FreeSWITCH)
2. Tu extension SIP quedara registrada para recibir y realizar llamadas
3. El sistema habilitara la respuesta automatica de llamadas del marcador predictivo

**Nota importante**: Asegurate de tener tus auriculares conectados antes de iniciar sesion.

---

## 3. Navegacion General

### 3.1 Estructura de la Interfaz

La interfaz del sistema esta compuesta por:

![alt text](user_manual_images/main_view.png)

#### 3.1.1 Barra Lateral (Sidebar)

Ubicada en el lado izquierdo de la pantalla, contiene:

- **Logo CASHI**: En la parte superior
- **Menu de navegacion**: Con las opciones disponibles segun tu rol
- **Informacion de usuario**: Tu nombre de usuario
- **Boton de configuracion**: Acceso a ajustes personales
- **Boton de tema**: Cambiar entre modo claro y oscuro
- **Boton de cerrar sesion**: Para salir del sistema de forma segura

![Sidebar expandido](user_manual_images/sidebar_expanded.png)

#### 3.1.2 Colapsar/Expandir Sidebar

- Haz clic en el boton de flecha en el borde del sidebar para colapsarlo
- Cuando esta colapsado, solo se muestran los iconos
- Pasa el cursor sobre un icono para ver el nombre de la opcion

![alt text](user_manual_images/collapsed_side_bar.png)

### 3.2 Cambio de Tema (Modo Claro/Oscuro)

El sistema permite cambiar entre modo claro y modo oscuro:

1. Ubica el boton de tema en la parte inferior del sidebar
2. Haz clic para alternar entre:
   - **Modo Claro**: Fondo blanco con texto oscuro (icono de luna)
   - **Modo Oscuro**: Fondo oscuro con texto claro (icono de sol)

![alt text](user_manual_images/ligth_mode.png)

![alt text](user_manual_images/dark_mode.png)

### 3.3 Cerrar Sesion

Para cerrar sesion de forma segura:

1. Haz clic en el boton "Cerrar Sesion" en la parte inferior del sidebar
2. El sistema:
   - Desconectara tu extension telefonica
   - Cerrara las conexiones activas
   - Te redirigira a la pantalla de login

**Importante**: Siempre cierra sesion al terminar tu turno para liberar recursos del sistema.

![alt text](user_manual_images/log_out_button.png)

---

## 4. Modulo de Cobranza

### 4.1 Descripcion General

El modulo de Cobranza es la pantalla principal de trabajo del agente. Aqui podras:

- Visualizar informacion del cliente durante la llamada
- Registrar el resultado de la gestion
- Crear promesas de pago
- Consultar el historial de gestiones previas

![alt text](user_manual_images/ligth_mode/cobranza_module_main_view.png)

### 4.2 Estructura de la Pantalla

La pantalla de Cobranza esta dividida en las siguientes secciones:

#### 4.2.1 Encabezado Superior

![alt text](user_manual_images/ligth_mode/header_main_view.png)

Contiene:

| Elemento | Descripcion |
|----------|-------------|
| Titulo "Gestion de Cobranza" | Identificacion del modulo |
| Estado del agente | Muestra si estas EN LLAMADA, TIPIFICANDO o DISPONIBLE |
| Indicador de tiempo | Reloj de alarma que cambia de color segun umbrales de tiempo |
| Cronometro | Tiempo transcurrido de la llamada actual |

**Colores del indicador de tiempo**:
- Verde: Dentro del tiempo optimo
- Amarillo: Aproximandose al limite
- Rojo: Tiempo excedido

#### 4.2.2 Panel Izquierdo - Informacion del Cliente

![alt text](user_manual_images/ligth_mode/clientes_and_pautas.png)

Este panel muestra dos pestanas:

**Pestana "Cliente"**:
- Datos personales del cliente (nombre, documento, etc.)
- Informacion de contacto:
  - Telefono principal (resaltado en verde)
  - Telefono alternativo
  - Telefono de trabajo
  - Email
  - Direccion

**Pestana "Pautas"** (En desarrollo):
- Mostrara pautas de gestion en futuras versiones

#### 4.2.3 Panel Central - Formulario de Gestion

![alt text](user_manual_images/ligth_mode/formulario_gestion.png)

Este es el area principal de trabajo que incluye:

**Control de Llamada**:

![Control de llamada](user_manual_images/ligth_mode/control_llamada.png)

| Boton | Funcion |
|-------|---------|
| Silenciar/Activar | Silencia o activa tu microfono durante la llamada |
| Finalizar | Termina la llamada actual |

**Formulario de Tipificacion**:

![Clasificacion jerarquica](user_manual_images/ligth_mode/clasificacion_jerarquica.png)

El formulario de tipificacion permite clasificar el resultado de la gestion:

1. **Resultado de Contacto**: Selecciona si hubo contacto directo, indirecto, o no contactado
2. **Clasificacion Jerarquica**: Selecciona en cascada:
   - Nivel 1 (obligatorio)
   - Nivel 2 (segun configuracion)
   - Nivel 3 (segun configuracion)

**Campos Dinamicos**:

Dependiendo de la clasificacion seleccionada, apareceran campos adicionales como:

- Metodo de pago
- Monto de promesa
- Fecha de compromiso
- Observaciones

![Campos dinamicos](user_manual_images/ligth_mode/campos_dinamicos.png)

#### 4.2.4 Alertas de Promesa de Pago Activa

![Banner promesa activa](user_manual_images/ligth_mode/banner_promesa_activa.png)

Cuando un cliente tiene una promesa de pago vigente, aparecera un banner que muestra:

- Total de la promesa
- Detalle de cada cuota:
  - Numero de cuota
  - Monto
  - Fecha de vencimiento
  - Estado (Pendiente, Pagada, Parcial, Vencida)
- Boton "Voucher" para validar comprobantes de pago

**Estados de las cuotas**:

| Estado | Color | Significado |
|--------|-------|-------------|
| Pendiente | Azul | Cuota por vencer |
| Pagada | Verde | Cuota completamente pagada |
| Parcial | Naranja | Cuota con pago parcial |
| Vencida | Rojo | Cuota con fecha pasada |

#### 4.2.5 Selector de Cuota para Cancelacion

![Selector de cuota](user_manual_images/ligth_mode/selector_cuota.png)

Cuando la tipificacion corresponde a una cancelacion de cuota:

1. Selecciona la cuota que el cliente esta pagando
2. Puedes modificar:
   - **Monto pagado**: Por defecto es el total de la cuota
   - **Fecha del pago**: Por defecto es la fecha actual

**Notas sobre pagos**:
- Si el monto es menor al total: Se registra como pago parcial
- Si el monto es mayor: El excedente se aplica a cuotas siguientes
- Las cuotas vencidas no pueden cancelarse (aparecen en rojo)

#### 4.2.6 Carga de Comprobante (Opcional)

![Carga de comprobante](user_manual_images/ligth_mode/carga_comprobante.png)

Para tipificaciones de pago, puedes:

1. Hacer clic en "Subir Comprobante"
2. Seleccionar una imagen del voucher de pago
3. El sistema procesara el comprobante con OCR para:
   - Detectar el monto
   - Identificar el banco

![Dialogo comprobante OCR](user_manual_images/ligth_mode/dialogo_comprobante_ocr.png)

#### 4.2.7 Panel Derecho - Resumen de Deuda

![Panel montos deuda](user_manual_images/ligth_mode/panel_montos_deuda.png)

Muestra:

- **Monto principal de deuda**: Resaltado en rojo
- **Dias de mora**: Cantidad de dias en atraso
- **Detalle de montos**: Desglose de la deuda

#### 4.2.8 Historial de Gestiones

![Historial gestiones](user_manual_images/ligth_mode/historial_gestiones.png)

Ubicado en la parte inferior, muestra todas las gestiones previas del cliente:

**Pestanas disponibles**:
- **Actual**: Gestiones del periodo actual
- **Historico**: Gestiones de periodos anteriores (paginado)

**Filtros rapidos**:
- Todos: Muestra todas las gestiones
- [CD]: Solo contactos directos
- [CI]: Solo contactos indirectos

**Columnas de la tabla**:

| Columna | Descripcion |
|---------|-------------|
| Fecha | Fecha y hora de la gestion |
| Agente | Nombre del agente que gestiono |
| Tipificacion | Clasificacion completa |
| Telefono | Numero contactado |
| Observacion | Notas del agente |
| Canal | LLAMADA SALIENTE, ENTRANTE, WHATSAPP, SMS |
| Metodo | GESTION_MANUAL, PROGRESIVO, PREDICTIVO |
| Monto Promesa | Monto de la promesa (si aplica) |
| Estado Pago | Estado de la promesa |

**Expandir/Contraer historial**:
- Haz clic en el icono de flecha para expandir o contraer la seccion

![Historial expandido](user_manual_images/ligth_mode/historial_expandido.png)

### 4.3 Flujo de Trabajo Tipico

#### 4.3.1 Recibir una Llamada del Marcador Predictivo

1. El sistema conectara automaticamente la llamada
2. La pantalla cambiara automaticamente al modulo de Cobranza
3. Se cargaran los datos del cliente
4. El cronometro comenzara a contar

![Llamada activa](user_manual_images/ligth_mode/llamada_activa.png)

#### 4.3.2 Durante la Llamada

1. Revisa la informacion del cliente en el panel izquierdo
2. Consulta los montos de deuda en el panel derecho
3. Verifica si hay promesas activas (banner amarillo)
4. Consulta el historial de gestiones previas si es necesario

#### 4.3.3 Finalizar la Llamada

1. Haz clic en el boton "Finalizar" para colgar
2. El estado cambiara a "TIPIFICANDO"
3. El indicador de tiempo seguira contando

![Estado tipificando](user_manual_images/ligth_mode/estado_tipificando.png)

#### 4.3.4 Registrar la Gestion

1. Selecciona el resultado de contacto apropiado
2. Completa la clasificacion jerarquica
3. Llena los campos dinamicos segun corresponda
4. Si es una promesa de pago:
   - Selecciona el metodo de pago
   - Ingresa el monto acordado
   - Establece la fecha de compromiso

![Formulario completo](user_manual_images/ligth_mode/formulario_completo.png)

5. Haz clic en "Guardar Gestion"

#### 4.3.5 Confirmacion de Guardado

Al guardar exitosamente, aparecera una notificacion verde:

![Notificacion exito](user_manual_images/ligth_mode/notificacion_exito.png)

### 4.4 Casos Especiales

#### 4.4.1 Continuidad de Promesa

Cuando un cliente tiene una promesa caida con pagos parciales:

![Continuidad promesa](user_manual_images/ligth_mode/continuidad_promesa.png)

El sistema mostrara:
- Monto original de la promesa
- Monto ya pagado
- Saldo restante (resaltado)
- Fecha de vencimiento original

La nueva promesa debe ser por el saldo restante.

#### 4.4.2 Cronograma Activo Detectado

![Cronograma activo](user_manual_images/ligth_mode/cronograma_activo.png)

Cuando el cliente tiene un cronograma de pago activo:

- Se muestran las cuotas pendientes
- Botones de accion rapida:
  - **Usar Proxima Cuota**: Aplica el monto de la siguiente cuota
  - **Pagar Todo**: Aplica el total pendiente

---

## 5. Modulo de Gestion Manual

### 5.1 Descripcion General

El modulo de Gestion Manual permite buscar clientes por documento para registrar tipificaciones sin necesidad de realizar una llamada telefonica.

![Gestion Manual](user_manual_images/gestion_manual_main_view.png)

### 5.2 Estructura de la Pantalla

#### 5.2.1 Seccion de Seleccion de Contexto

![Selectores contexto](user_manual_images/selectores_contexto.png)

Antes de buscar un cliente, debes seleccionar:

1. **Inquilino**: Empresa o cliente para la cual trabajas
2. **Cartera**: Portafolio de cuentas
3. **Subcartera**: Subdivision de la cartera

**Importante**: Los tres campos son obligatorios para habilitar la busqueda.

![Mensaje advertencia](user_manual_images/mensaje_advertencia.png)

#### 5.2.2 Seccion de Busqueda

![Campo busqueda](user_manual_images/campo_busqueda.png)

Una vez seleccionado el contexto:

1. Ingresa el documento del cliente (DNI/Cedula)
2. El documento debe tener al menos 3 caracteres
3. Haz clic en "Buscar" o presiona Enter

**Autocompletado**:

Al escribir, el sistema mostrara sugerencias de clientes que coinciden:

![Autocompletado](user_manual_images/autocompletado_resultados.png)

Cada sugerencia muestra:
- Numero de documento (azul)
- Nombre del cliente
- Telefono

### 5.3 Flujo de Trabajo

#### 5.3.1 Buscar un Cliente

1. Selecciona Inquilino, Cartera y Subcartera
2. Ingresa el documento en el campo de busqueda
3. Selecciona el cliente de las sugerencias O haz clic en Buscar

![Seleccion cliente](user_manual_images/seleccion_cliente.png)

#### 5.3.2 Registrar Gestion

Al seleccionar un cliente:

1. El sistema te redirigira automaticamente al modulo de Cobranza
2. Se cargaran los datos del cliente
3. Podras registrar la gestion normalmente

**Diferencias con gestion por llamada**:
- El canal se registra como "GESTION MANUAL"
- No hay control de llamada (botones deshabilitados)
- El metodo se registra como "GESTION_MANUAL"

### 5.4 Mensajes de Error

| Error | Causa | Solucion |
|-------|-------|----------|
| "Selecciona inquilino, cartera y subcartera primero" | Contexto incompleto | Completa los tres selectores |
| "Cliente no encontrado con ese documento" | Documento no existe | Verifica el numero ingresado |
| "Error al buscar el cliente" | Error de conexion | Reintenta la busqueda |

![Mensaje error](user_manual_images/mensaje_error.png)

---

## 6. Modulo de Ranking Equipo

### 6.1 Descripcion General

El modulo de Ranking Equipo te permite visualizar tu desempeno y compararlo con el de tus companeros de equipo en tiempo real.

![Ranking Equipo](user_manual_images/ranking_equipo_main_view.png)

### 6.2 Estructura de la Pantalla

#### 6.2.1 Encabezado

![Ranking header](user_manual_images/ranking_header.png)

- **Titulo**: "Ranking del Equipo"
- **Indicador de actualizacion**: "Actualiza cada 1 min"
- **Boton de recarga**: Para actualizar manualmente

#### 6.2.2 Resumen del Equipo

![Resumen equipo](user_manual_images/resumen_equipo.png)

Muestra las metricas totales del equipo:

| Metrica | Descripcion |
|---------|-------------|
| Agentes | Numero total de agentes activos |
| Gestiones | Total de gestiones realizadas por el equipo |
| Proyeccion Equipo | Monto total proyectado |
| Recaudo Equipo | Monto total recaudado |
| Efectividad Proyeccion | Porcentaje de efectividad (Recaudo/Proyeccion) |

**Colores de efectividad**:
- Verde (>= 80%): Excelente
- Amarillo (>= 50%): Aceptable
- Rojo (< 50%): Requiere mejora

#### 6.2.3 Tu Posicion

![Tu posicion](user_manual_images/tu_posicion.png)

Muestra tus metricas individuales:

- **Posicion**: Tu lugar en el ranking (ej: #3 de 10)
- **Gestiones**: Numero de gestiones realizadas
- **Promesas**: Cantidad de promesas de pago registradas
- **Proyeccion**: Monto proyectado personal
- **Recaudo**: Monto recaudado personal
- **% Efectividad Proyeccion**: Tu porcentaje de efectividad

#### 6.2.4 Mis Metas del Dia

![Metas del dia](user_manual_images/metas_del_dia.png)

Si tienes metas configuradas, veras:

- **Meta de Gestiones**: Progreso hacia tu meta diaria de gestiones
- **Meta de Promesas**: Progreso hacia tu meta diaria de promesas
- **Meta de Monto**: Progreso hacia tu meta diaria de monto

Cada meta muestra:
- Valor actual / Meta
- Barra de progreso visual
- Porcentaje de avance

**Colores de progreso**:
- Verde (>= 100%): Meta cumplida
- Azul (>= 70%): Buen progreso
- Amarillo (>= 40%): Progreso medio
- Rojo (< 40%): Bajo progreso

#### 6.2.5 Tabla de Ranking

![Tabla ranking](user_manual_images/tabla_ranking.png)

La tabla muestra el ranking completo del equipo:

| Columna | Descripcion |
|---------|-------------|
| # | Posicion en el ranking |
| Agente | Nombre del agente (tu fila resaltada con "TU") |
| Gestiones | Total de gestiones |
| Promesas | Total de promesas |
| Proyeccion | Monto proyectado |
| Recaudo | Monto recaudado |
| % Efectividad Proyeccion | (Recaudo / Proyeccion) x 100 |
| % Efectividad General | (Promesas / Gestiones) x 100 |
| Tendencia | Flecha indicando si subiste o bajaste |

**Iconos de posicion**:
- Posicion 1: Trofeo dorado
- Posicion 2: Medalla plateada
- Posicion 3: Premio bronce
- Otras posiciones: Icono de usuario

**Indicadores de tendencia**:
- Flecha verde hacia arriba: Subiste en el ranking
- Flecha roja hacia abajo: Bajaste en el ranking
- Linea gris: Sin cambios

![Top 3 posiciones](user_manual_images/top_3_posiciones.png)

### 6.3 Actualizacion de Datos

El ranking se actualiza automaticamente cada 60 segundos. Para forzar una actualizacion:

1. Haz clic en el boton de recarga (icono de flechas circulares)
2. Espera a que se carguen los datos actualizados

![Boton recarga](user_manual_images/boton_recarga.png)

---

## 7. Configuracion Personal

### 7.1 Acceso a Configuracion

![Boton configuracion](user_manual_images/boton_configuracion.png)

Haz clic en "Configuracion" en la parte inferior del sidebar para acceder a los ajustes personales.

### 7.2 Opciones Disponibles

#### 7.2.1 Cambio de Tema

- **Modo Claro**: Interfaz con fondo blanco
- **Modo Oscuro**: Interfaz con fondo oscuro (reduce fatiga visual)

![Interruptor tema](user_manual_images/interruptor_tema.png)

### 7.3 Persistencia de Preferencias

Tus preferencias de tema se guardan automaticamente y se mantienen entre sesiones.

---

## 8. Preguntas Frecuentes

### 8.1 Problemas de Conexion

**P: No puedo escuchar al cliente durante la llamada**

R: Verifica lo siguiente:
1. Asegurate de que tus auriculares esten conectados
2. Revisa que el navegador tenga permisos de microfono y audio
3. Intenta cerrar sesion y volver a iniciar

**P: Las llamadas se conectan pero no hay audio**

R: El sistema necesita permisos de microfono:
1. Haz clic en el icono de candado junto a la URL
2. Asegurate de que el microfono este permitido
3. Recarga la pagina

![Permisos navegador](user_manual_images/permisos_navegador.png)

### 8.2 Tipificacion

**P: No puedo guardar la gestion**

R: Verifica que:
1. Hayas seleccionado un resultado de contacto
2. La clasificacion jerarquica este completa
3. Los campos obligatorios esten llenos

**P: No aparecen los campos de promesa de pago**

R: Los campos dinamicos dependen de la tipificacion seleccionada. Asegurate de seleccionar una clasificacion que corresponda a promesa de pago.

### 8.3 Ranking

**P: Mi posicion no se actualiza**

R: El ranking se actualiza cada minuto. Puedes forzar la actualizacion haciendo clic en el boton de recarga.

**P: No veo mis metas del dia**

R: Las metas deben ser configuradas por un administrador. Contacta a tu supervisor si crees que deberias tener metas asignadas.

### 8.4 Sesion

**P: Mi sesion expiro mientras trabajaba**

R: El sistema cierra sesiones inactivas automaticamente. Si no realizas ninguna accion durante un periodo prolongado:
1. Recibiras una advertencia antes del cierre
2. Haz clic en "Continuar" para mantener la sesion activa

![Modal inactividad](user_manual_images/modal_inactividad.png)

---

## Glosario de Terminos

| Termino | Definicion |
|---------|------------|
| **Tipificacion** | Clasificacion del resultado de una gestion |
| **Promesa de pago** | Compromiso del cliente de pagar en una fecha especifica |
| **Cuota** | Pago parcial dentro de un cronograma |
| **Contacto directo (CD)** | Comunicacion con el titular de la cuenta |
| **Contacto indirecto (CI)** | Comunicacion con terceros |
| **Mora** | Dias de atraso en el pago |
| **Cartera** | Conjunto de cuentas asignadas para gestion |
| **Subcartera** | Subdivision de una cartera |
| **Marcador predictivo** | Sistema automatico de marcacion |
| **VoIP** | Voz sobre Protocolo de Internet (llamadas por internet) |
| **OCR** | Reconocimiento Optico de Caracteres (lectura de vouchers) |

---

## Contacto de Soporte

Para reportar problemas tecnicos o solicitar asistencia:

- Contacta a tu supervisor directo
- Reporta incidencias al area de sistemas

---

*Manual de Usuario - Rol de Agente v1.0*

*Sistema CASHI - Plataforma de Cobranza*

*Ultima actualizacion: Enero 2026*
