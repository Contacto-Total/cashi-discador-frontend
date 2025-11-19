# Módulo de Grabaciones (Recordings)

## Descripción
Módulo completo para búsqueda, visualización y descarga de grabaciones históricas de llamadas. Migrado desde Web-App-main con reemplazo total de PrimeNG por componentes custom HTML/CSS.

## Ubicación
`src/app/features/legacy/recordings/`

## Estructura del Módulo

```
recordings/
├── components/
│   └── recordings-tracker/          # Componente principal con tabla y búsqueda
│       ├── recordings-tracker.component.ts
│       ├── recordings-tracker.component.html
│       └── recordings-tracker.component.scss
├── models/                           # Interfaces de request
│   ├── recording-download.request.ts
│   ├── historical-recordings-by-document.request.ts
│   ├── historical-recordings-by-phone.request.ts
│   ├── historical-recordings-by-date-range.request.ts
│   ├── historical-recordings-by-tract.ts
│   ├── create-recording-evaluation-report.request.ts
│   └── index.ts
├── pages/
│   └── recordings-page/              # Página wrapper
│       ├── recordings-page.component.ts
│       ├── recordings-page.component.html
│       └── recordings-page.component.scss
└── services/                         # Servicios HTTP
    ├── historical-recordings.service.ts
    ├── recording-download.service.ts
    └── recording-evaluation-report.service.ts
```

## Funcionalidades

### 1. Tipos de Búsqueda
- **Por Fechas**: Búsqueda por rango de fechas (máximo 2 días de diferencia)
- **Por Documento**: Búsqueda por número de documento del cliente
- **Por Teléfono**: Búsqueda por número de teléfono

### 2. Filtros
- **Tramo**: Todos, Tramo 3, Tramo 5, Cartera Propia
- **Filtros de Tabla**:
  - DNI (filtro de texto)
  - Teléfono (filtro de texto)
  - Cartera (dropdown)
  - Resultado (dropdown con 16 opciones)

### 3. Tabla de Resultados
- Ordenamiento clickeable por cualquier columna (ciclo: asc → desc → none)
- Paginación con controles de navegación
- Selector de filas por página (5, 10, 20)
- Diseño responsive adaptado a móviles

### 4. Descargas
- **Audio Individual**: Descarga archivos .WAV de grabaciones
- **Reporte Individual**: Descarga archivos .xlsx (solo para PROMESA DE PAGO y CONTACTO CON TITULAR)
- **Descarga Masiva de Audios**: Genera archivo .zip con todos los audios filtrados
- **Descarga Masiva de Reportes**: Genera archivo .zip con todos los reportes filtrados

### 5. Validaciones
- Validación de rangos de fechas (máximo 2 días)
- Validación de campos requeridos
- Mensajes de error mediante ToastService
- Loading spinner durante búsquedas y descargas masivas

## Tecnologías Utilizadas

### ✅ Custom Components
- **CustomSelectComponent**: Reemplazo de p-dropdown
- **ToastService**: Reemplazo de p-toast y SweetAlert2
- **Lucide Icons**: Reemplazo de PrimeIcons
- **HTML Table**: Reemplazo de p-table
- **Input type="date"**: Reemplazo de p-calendar

### ❌ Eliminado
- ❌ Angular Material (PROHIBIDO)
- ❌ PrimeNG (p-table, p-dropdown, p-calendar, p-toast, p-button, p-tag, p-progressSpinner)
- ❌ SweetAlert2
- ❌ PrimeIcons

## Configuración de API

### Environment
Los servicios usan `environment.legacyApiUrl` para las llamadas HTTP:

```typescript
// historical-recordings.service.ts
baseUrl = environment.legacyApiUrl + '/gestion/historica/audios';

// recording-download.service.ts
baseUrl = environment.legacyApiUrl + '/recording';

// recording-evaluation-report.service.ts
baseUrl = environment.legacyApiUrl + '/audio/evaluation';
```

### Endpoints
- `POST /gestion/historica/audios/tramo` - Búsqueda por tramo
- `POST /gestion/historica/audios/date/range` - Búsqueda por fechas
- `POST /gestion/historica/audios/documento` - Búsqueda por documento
- `POST /gestion/historica/audios/telefono` - Búsqueda por teléfono
- `POST /recording/download/historico/audio` - Descarga audio individual
- `POST /recording/download/historico/audio/zip` - Descarga audios masiva
- `POST /audio/evaluation/create` - Descarga reporte individual
- `POST /audio/evaluation/create/zip` - Descarga reportes masiva

## Temas (Dark/Light)

El módulo soporta temas claro y oscuro usando `:host-context(body.light-theme)`:

### Dark Theme (Default)
- Background: `#0f172a`, `#1e293b`
- Text: `#f1f5f9`, `#e2e8f0`
- Borders: `#334155`

### Light Theme
- Background: `white`, `#f8fafc`
- Text: `#1e293b`
- Borders: `#e2e8f0`

## Rutas

```typescript
{
  path: 'recordings',
  loadComponent: () => import('./features/legacy/recordings/pages/recordings-page/recordings-page.component')
    .then(m => m.RecordingsPageComponent),
  canActivate: [authGuard]
}
```

## Uso del Componente

```typescript
import { RecordingsPageComponent } from './features/legacy/recordings/pages/recordings-page/recordings-page.component';
```

## Dependencias

```json
{
  "@angular/common": "^19.0.0",
  "@angular/forms": "^19.0.0",
  "lucide-angular": "^0.469.0"
}
```

## Responsive Design

El módulo es completamente responsive:
- **Desktop**: Layout horizontal con filtros en fila
- **Mobile (< 768px)**:
  - Layout vertical
  - Filtros apilados
  - Tabla con scroll horizontal
  - Botones de ancho completo

## Características de Accesibilidad

- Labels descriptivos en todos los inputs
- Títulos en botones de acción
- Estados disabled visibles
- Mensajes de error claros
- Navegación por teclado funcional

## Testing

Para probar el módulo:

```bash
# Compilar
npm run build

# Modo desarrollo
ng serve

# Navegar a
http://localhost:4200/recordings
```

## Notas de Migración

1. **PrimeNG → Custom HTML/CSS**: Toda la funcionalidad de PrimeNG fue reemplazada con componentes custom
2. **SweetAlert2 → ToastService**: Los modales de SweetAlert2 fueron reemplazados con notificaciones toast
3. **PrimeIcons → Lucide**: Todos los iconos fueron migrados a Lucide Angular
4. **environment.baseUrl → environment.legacyApiUrl**: Cambio de URL base para servicios legacy
5. **MessageService → ToastService**: Sistema de notificaciones unificado

## Mantenimiento

### Agregar Nuevo Resultado
Editar el array `resultados` en `recordings-tracker.component.ts`:

```typescript
this.resultados = [
  { label: 'Nuevo Resultado', value: 'NUEVO_RESULTADO' },
  // ...
];
```

### Cambiar Opciones de Paginación
Editar el array `pageSizeOptions` en `recordings-tracker.component.ts`:

```typescript
pageSizeOptions: SelectOption[] = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 } // Nueva opción
];
```

## Créditos

**Migrado por**: Claude Code Assistant
**Fecha**: 18 de Noviembre, 2025
**Fuente**: `Web-App-main/src/app/recordings/`
**Destino**: `cashi-discador-frontend/src/app/features/legacy/recordings/`
