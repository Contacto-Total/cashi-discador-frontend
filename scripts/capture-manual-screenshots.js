/**
 * Script de Playwright para capturar imágenes del Manual de Usuario - Rol Agente
 * Version 4.0 - Cobertura completa de todos los flujos
 *
 * INSTALACION:
 *   npm install playwright
 *   npx playwright install chromium
 *
 * USO:
 *   node scripts/capture-manual-screenshots.js
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// ============ CONFIGURACION ============
const BASE_URL = 'https://cobranza.contactototal.com.pe';
const WEB_SERVICE_URL = `${BASE_URL}/web-service`;
const TIPIFICACION_URL = `${BASE_URL}/api/tipificacion/v1`;

// ⚠️ CAMBIA ESTAS CREDENCIALES
const USERNAME = 'agente2';
const PASSWORD = 'Agent2@2024Pass';

const OUTPUT_DIR = path.join(__dirname, '..', 'user_manual_images');
const LIGHT_MODE_DIR = path.join(OUTPUT_DIR, 'ligth_mode');
const DARK_MODE_DIR = path.join(OUTPUT_DIR, 'dark_mode');

const VIEWPORT = { width: 1920, height: 1080 };
const SLOW_MO = 100;
// ========================================

// Contadores de capturas
let capturedCount = 0;
let failedCount = 0;

// Crear directorios
function ensureDirectories() {
  [OUTPUT_DIR, LIGHT_MODE_DIR, DARK_MODE_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  [DIR] Creado: ${dir}`);
    }
  });
}

// Utilidad: Esperar con timeout
async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Captura de pantalla completa
async function screenshot(page, name, subdir = '') {
  try {
    const dir = subdir ? path.join(OUTPUT_DIR, subdir) : OUTPUT_DIR;
    const filepath = path.join(dir, `${name}.png`);
    await page.screenshot({ path: filepath, fullPage: false });
    console.log(`  ✓ ${subdir ? subdir + '/' : ''}${name}.png`);
    capturedCount++;
    return true;
  } catch (error) {
    console.log(`  ✗ Error ${name}: ${error.message}`);
    failedCount++;
    return false;
  }
}

// Captura de elemento con contexto (padding)
async function screenshotElement(page, selector, name, subdir = '', padding = 20) {
  try {
    const dir = subdir ? path.join(OUTPUT_DIR, subdir) : OUTPUT_DIR;
    const filepath = path.join(dir, `${name}.png`);

    // Intentar múltiples selectores si es un array
    const selectors = Array.isArray(selector) ? selector : [selector];
    let element = null;

    for (const sel of selectors) {
      try {
        element = await page.$(sel);
        if (element) break;
      } catch {}
    }

    if (!element) {
      console.log(`  - ${name}: elemento no encontrado`);
      return false;
    }

    const box = await element.boundingBox();
    if (!box) {
      console.log(`  - ${name}: sin bounding box`);
      return false;
    }

    const viewport = page.viewportSize();
    const clip = {
      x: Math.max(0, box.x - padding),
      y: Math.max(0, box.y - padding),
      width: Math.min(box.width + padding * 2, viewport.width - Math.max(0, box.x - padding)),
      height: Math.min(box.height + padding * 2, viewport.height - Math.max(0, box.y - padding))
    };

    await page.screenshot({ path: filepath, clip });
    console.log(`  ✓ ${subdir ? subdir + '/' : ''}${name}.png`);
    capturedCount++;
    return true;
  } catch (error) {
    console.log(`  ✗ Error ${name}: ${error.message}`);
    failedCount++;
    return false;
  }
}

// Navegar por texto en sidebar
async function navigateToModule(page, textOptions, fallbackUrl = null) {
  const texts = Array.isArray(textOptions) ? textOptions : [textOptions];

  for (const text of texts) {
    try {
      const item = page.locator('.sidebar-item, .sidebar-subitem').filter({ hasText: new RegExp(`^${text}$|${text}`, 'i') }).first();
      if (await item.isVisible({ timeout: 3000 })) {
        await item.click();
        await page.waitForLoadState('networkidle');
        await wait(1500);
        console.log(`  → Navegado a: ${text}`);
        return true;
      }
    } catch {}
  }

  if (fallbackUrl) {
    await page.goto(`${BASE_URL}${fallbackUrl}`);
    await page.waitForLoadState('networkidle');
    await wait(2000);
    console.log(`  → Navegado por URL: ${fallbackUrl}`);
    return true;
  }

  return false;
}

// Verificar si elemento existe y es visible
async function isVisible(page, selector, timeout = 2000) {
  try {
    const element = page.locator(selector).first();
    return await element.isVisible({ timeout });
  } catch {
    return false;
  }
}

// Hacer click seguro
async function safeClick(page, selector, timeout = 5000) {
  try {
    const element = page.locator(selector).first();
    await element.waitFor({ state: 'visible', timeout });
    await element.click();
    await wait(300);
    return true;
  } catch {
    return false;
  }
}

// Llenar input de forma segura
async function safeFill(page, selector, value, timeout = 5000) {
  try {
    const element = page.locator(selector).first();
    await element.waitFor({ state: 'visible', timeout });
    await element.fill(value);
    await wait(300);
    return true;
  } catch {
    return false;
  }
}

// Seleccionar opción en dropdown
async function safeSelect(page, selector, index = 1, timeout = 5000) {
  try {
    const element = page.locator(selector).first();
    await element.waitFor({ state: 'visible', timeout });
    await element.selectOption({ index });
    await wait(500);
    return true;
  } catch {
    return false;
  }
}

// ==================== CAPTURAS POR MÓDULO ====================

async function captureLoginModule(page) {
  console.log('\n═══════════════════════════════════════════');
  console.log('  MÓDULO: LOGIN');
  console.log('═══════════════════════════════════════════\n');

  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  await wait(3000);

  // Vista completa del login
  await screenshot(page, 'login_view');

  // Mascota con burbuja de texto
  await screenshotElement(page, '.mascot-container', 'login_mascota', '', 10);

  // Campo usuario
  const usernameInput = page.locator('#username').first();
  if (await usernameInput.isVisible()) {
    await usernameInput.focus();
    await wait(500);
    await screenshot(page, 'username_login');
    await usernameInput.fill(USERNAME);
  }

  // Campo contraseña
  const passwordInput = page.locator('#password').first();
  if (await passwordInput.isVisible()) {
    await passwordInput.focus();
    await wait(500);
    await screenshot(page, 'contra_login');

    // Mascota cubriendo ojos
    await screenshotElement(page, '.mascot-container', 'mascota_cubriendo_ojos', '', 10);

    await passwordInput.fill(PASSWORD);
  }

  // Formulario completo con botón
  await screenshot(page, 'iniciar_sesion_button');

  // Tarjeta de login completa
  await screenshotElement(page, '.login-card', 'login_card_completa', '', 20);

  // Toggle de mostrar/ocultar contraseña
  await screenshotElement(page, '.toggle-password', 'toggle_password', '', 40);

  // Verificar temas estacionales
  const hasChristmas = await isVisible(page, '.christmas-hat, .christmas-tree-container', 1000);
  const hasNewYear = await isVisible(page, '.newyear-countdown, .year-background', 1000);
  const hasSummer = await isVisible(page, '.summer-sky, .beach-scene', 1000);

  if (hasChristmas) {
    console.log('  [INFO] Tema navideño detectado');
    await screenshot(page, 'login_christmas_theme');
    await screenshotElement(page, '.christmas-tree-container', 'arbol_navidad', '', 10);
  }

  if (hasNewYear) {
    console.log('  [INFO] Tema año nuevo detectado');
    await screenshot(page, 'login_newyear_theme');
    await screenshotElement(page, '.newyear-countdown', 'countdown_anio_nuevo', '', 10);
  }

  if (hasSummer) {
    console.log('  [INFO] Tema verano detectado');
    await screenshot(page, 'login_summer_theme');
    await screenshotElement(page, '.beach-scene', 'escena_playa', '', 10);
  }

  // Hacer login
  console.log('  Iniciando sesión...');
  await safeClick(page, 'button[type="submit"]');

  // Capturar estado de carga
  await wait(500);
  if (await isVisible(page, '.animate-spin', 1000)) {
    await screenshot(page, 'login_loading');
  }

  await page.waitForURL('**/collection-management**', { timeout: 30000 }).catch(() => {});
  await page.waitForLoadState('networkidle');
  await wait(3000);

  // Verificar login exitoso
  if (await isVisible(page, '.cashi-sidebar')) {
    console.log('  ✓ Login exitoso');
    return true;
  }

  console.log('  ✗ Login fallido');
  return false;
}

async function captureNavigationModule(page) {
  console.log('\n═══════════════════════════════════════════');
  console.log('  MÓDULO: NAVEGACIÓN');
  console.log('═══════════════════════════════════════════\n');

  // Vista principal completa
  await screenshot(page, 'main_view');

  // Sidebar expandido
  await screenshotElement(page, '.cashi-sidebar', 'sidebar_expanded', '', 0);

  // Logo CASHI
  await screenshotElement(page, '.sidebar-logo', 'sidebar_logo', '', 10);

  // Menú de navegación
  await screenshotElement(page, '.sidebar-nav', 'sidebar_menu', '', 5);

  // Footer del sidebar (usuario, tema, logout)
  await screenshotElement(page, '.sidebar-footer', 'sidebar_footer', '', 5);

  // Botón de logout
  await screenshotElement(page, '.logout-btn', 'log_out_button', '', 30);

  // Perfil de usuario
  await screenshotElement(page, '.user-profile', 'perfil_usuario', '', 20);

  // Colapsar sidebar
  const toggleBtn = page.locator('.sidebar-toggle').first();
  if (await toggleBtn.isVisible()) {
    await toggleBtn.click();
    await wait(600);
    await screenshot(page, 'collapsed_side_bar');
    await screenshotElement(page, '.cashi-sidebar', 'sidebar_colapsado', '', 0);

    // Expandir de nuevo
    await toggleBtn.click();
    await wait(600);
  }
}

async function captureThemeToggle(page) {
  console.log('\n═══════════════════════════════════════════');
  console.log('  MÓDULO: TEMAS (CLARO/OSCURO)');
  console.log('═══════════════════════════════════════════\n');

  // Captura en modo claro (actual)
  await screenshot(page, 'ligth_mode');

  // Buscar botón de tema
  const themeSelectors = [
    '.sidebar-footer button:has(lucide-angular[name="moon"])',
    '.sidebar-footer button:has(lucide-angular[name="sun"])',
    '.sidebar-item:has-text("Modo")',
    '.sidebar-footer .sidebar-item >> nth=1'
  ];

  let themeToggled = false;
  for (const sel of themeSelectors) {
    if (await safeClick(page, sel, 2000)) {
      themeToggled = true;
      break;
    }
  }

  if (themeToggled) {
    await wait(1000);
    await screenshot(page, 'dark_mode');

    // Volver a modo claro
    for (const sel of themeSelectors) {
      if (await safeClick(page, sel, 2000)) break;
    }
    await wait(500);
  }
}

async function captureCollectionManagement(page) {
  console.log('\n═══════════════════════════════════════════');
  console.log('  MÓDULO: GESTIÓN DE COBRANZA');
  console.log('═══════════════════════════════════════════\n');

  // Asegurar que estamos en collection-management
  if (!page.url().includes('collection-management')) {
    await navigateToModule(page, ['Cobranza', 'Gestión de Cobranza', 'Collection'], '/collection-management');
  }
  await wait(2000);

  // Vista completa (modo claro)
  await screenshot(page, 'cobranza_module_main_view', 'ligth_mode');

  // Header con estado y cronómetro
  await screenshotElement(page, [
    '.collection-management-container > div:first-child',
    '.bg-gradient-to-r.from-gray-700',
    'div:has(> div > h1:has-text("Gestión de Cobranza"))'
  ], 'header_main_view', 'ligth_mode', 5);

  // Indicador de estado (DISPONIBLE/EN LLAMADA/TIPIFICANDO)
  await screenshotElement(page, [
    'div:has-text("Estado"):has(div:has-text("DISPONIBLE"))',
    'div:has-text("Estado"):has(div:has-text("EN LLAMADA"))',
    'div:has-text("Estado"):has(div:has-text("TIPIFICANDO"))'
  ], 'indicador_estado', 'ligth_mode', 30);

  // Reloj de alarma (indicador de tiempo)
  await screenshotElement(page, 'app-status-alarm-clock', 'reloj_alarma', 'ligth_mode', 20);

  // Cronómetro de llamada
  await screenshotElement(page, '.font-mono.text-lg', 'cronometro_llamada', 'ligth_mode', 30);

  // Panel izquierdo completo
  await screenshotElement(page, '.w-72.bg-white', 'panel_izquierdo', 'ligth_mode', 5);

  // Tabs (Cliente / Pautas)
  await screenshotElement(page, '.flex.border-b.border-slate-200', 'tabs_cliente_pautas', 'ligth_mode', 10);

  // Contenido tab Cliente
  await screenshotElement(page, '.flex-1.overflow-y-auto.p-2', 'tab_cliente_contenido', 'ligth_mode', 5);

  // Información de contacto (teléfonos)
  await screenshotElement(page, [
    'div:has(lucide-angular[name="smartphone"])',
    '.bg-green-50'
  ], 'telefono_principal', 'ligth_mode', 30);

  // Panel central
  await screenshotElement(page, '.flex-1.overflow-y-auto.bg-gradient-to-br', 'panel_central', 'ligth_mode', 5);

  // Control de llamada
  await screenshotElement(page, [
    'div:has(h3:has-text("Control de Llamada"))',
    '.bg-white:has(button:has-text("Finalizar"))'
  ], 'control_llamada', 'ligth_mode', 10);

  // Botones de llamada (Silenciar/Finalizar)
  await screenshotElement(page, 'button:has-text("Silenciar"), button:has-text("Activar")', 'boton_silenciar', 'ligth_mode', 20);
  await screenshotElement(page, 'button:has-text("Finalizar")', 'boton_finalizar', 'ligth_mode', 20);

  // Resultado de contacto (si existe)
  const hasResultadoContacto = await isVisible(page, 'select:has(option:has-text("Seleccionar resultado"))');
  if (hasResultadoContacto) {
    await screenshotElement(page, 'div:has(> label:has-text("Resultado de Contacto"))', 'resultado_contacto', 'ligth_mode', 10);
  }

  // Clasificación jerárquica (si existe)
  const hasClasificacion = await isVisible(page, 'div:has-text("Clasificación"):has(select)');
  if (hasClasificacion) {
    await screenshotElement(page, 'div:has(> .text-xs.font-bold:has-text("Clasificación"))', 'clasificacion_jerarquica', 'ligth_mode', 10);
  }

  // Promesa de pago activa (si existe)
  const hasPromesa = await isVisible(page, 'div:has-text("PROMESA DE PAGO ACTIVA")');
  if (hasPromesa) {
    await screenshotElement(page, 'div:has-text("PROMESA DE PAGO ACTIVA")', 'banner_promesa_activa', 'ligth_mode', 10);

    // Botón de voucher
    await screenshotElement(page, 'button:has-text("Voucher")', 'boton_voucher', 'ligth_mode', 30);

    // Detalle de cuotas
    await screenshotElement(page, 'div:has-text("DETALLE DE CUOTAS")', 'detalle_cuotas', 'ligth_mode', 10);
  }

  // Panel derecho (cronograma de pagos)
  await screenshotElement(page, 'app-payment-schedule-view', 'panel_cronograma_pagos', 'ligth_mode', 10);

  // Scroll para ver historial
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await wait(500);

  // Historial de gestiones (si existe)
  await screenshotElement(page, [
    'div:has-text("Historial")',
    'table',
    '.historial'
  ], 'historial_gestiones', 'ligth_mode', 10);

  // Volver arriba
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(300);

  // Captura en modo oscuro
  const themeBtn = page.locator('.sidebar-footer button').filter({ hasText: /Modo|Theme/i }).first();
  if (await themeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await themeBtn.click();
    await wait(1000);
    await screenshot(page, 'cobranza_module_dark', 'dark_mode');

    // Volver a modo claro
    await themeBtn.click();
    await wait(500);
  }
}

async function captureManualManagement(page) {
  console.log('\n═══════════════════════════════════════════');
  console.log('  MÓDULO: GESTIÓN MANUAL');
  console.log('═══════════════════════════════════════════\n');

  await navigateToModule(page, ['Gestión Manual', 'Gestion Manual', 'Manual'], '/manual-management');
  await wait(2000);

  // Vista completa
  await screenshot(page, 'gestion_manual_main_view');

  // Header del módulo
  await screenshotElement(page, '.animate-fade-in', 'gestion_manual_header', '', 10);

  // Sección de selectores de contexto
  await screenshotElement(page, '.section', 'seccion_contexto', '', 5);

  // Card de selección de contexto
  await screenshotElement(page, '.bg-white.dark\\:bg-slate-900.rounded-xl:has-text("Seleccionar Contexto")', 'selectores_contexto', '', 10);

  // Selector de inquilino
  await screenshotElement(page, 'div:has(> label:has-text("Inquilino"))', 'selector_inquilino', '', 30);

  // Selector de cartera
  await screenshotElement(page, 'div:has(> label:has-text("Cartera"))', 'selector_cartera', '', 30);

  // Selector de subcartera
  await screenshotElement(page, 'div:has(> label:has-text("Subcartera"))', 'selector_subcartera', '', 30);

  // Mensaje de advertencia (antes de seleccionar contexto)
  await screenshotElement(page, [
    '.bg-amber-100',
    'div:has(lucide-angular[name="info"])',
    'div:has-text("Selecciona inquilino")'
  ], 'mensaje_advertencia', '', 10);

  // Seleccionar datos en los dropdowns
  console.log('  Seleccionando contexto...');

  const selects = await page.locator('select').all();

  // Seleccionar tenant
  if (selects.length >= 1) {
    await safeSelect(page, 'select >> nth=0', 1);
    await wait(1000);
    console.log('  ✓ Inquilino seleccionado');
  }

  // Re-buscar y seleccionar portfolio
  await wait(500);
  if (await page.locator('select >> nth=1').isVisible()) {
    await safeSelect(page, 'select >> nth=1', 1);
    await wait(1000);
    console.log('  ✓ Cartera seleccionada');
  }

  // Re-buscar y seleccionar subportfolio
  await wait(500);
  if (await page.locator('select >> nth=2').isVisible()) {
    await safeSelect(page, 'select >> nth=2', 1);
    await wait(500);
    console.log('  ✓ Subcartera seleccionada');
  }

  // Captura con selectores llenos
  await screenshot(page, 'selectores_contexto_llenos');

  // Sección de búsqueda
  await screenshotElement(page, '.bg-white.dark\\:bg-slate-900.rounded-xl:has-text("Buscar Cliente")', 'seccion_busqueda', '', 10);

  // Campo de búsqueda
  await screenshotElement(page, 'input[placeholder*="documento"], input[type="text"]', 'campo_busqueda', '', 50);

  // Botón buscar
  await screenshotElement(page, 'button:has-text("Buscar")', 'boton_buscar', '', 30);

  // Intentar buscar un documento
  const searchInput = page.locator('input[type="text"]').first();
  if (await searchInput.isEnabled()) {
    await searchInput.fill('12345678');
    await wait(2000);

    // Resultados de autocompletado (si aparecen)
    const hasResults = await isVisible(page, '.max-h-48, div:has-text("12345678")');
    if (hasResults) {
      await screenshotElement(page, '.max-h-48, .overflow-y-auto:has(div:has-text("12345678"))', 'autocompletado_resultados', '', 10);
    } else {
      await screenshot(page, 'autocompletado_resultados');
    }

    // Verificar si hay error
    const hasError = await isVisible(page, '.bg-red-100, div:has(lucide-angular[name="alert-circle"])');
    if (hasError) {
      await screenshotElement(page, '.bg-red-100, div:has(lucide-angular[name="alert-circle"])', 'mensaje_error_busqueda', '', 10);
    }

    // Limpiar búsqueda
    await searchInput.fill('');
  }
}

async function captureTeamRanking(page) {
  console.log('\n═══════════════════════════════════════════');
  console.log('  MÓDULO: RANKING EQUIPO');
  console.log('═══════════════════════════════════════════\n');

  await navigateToModule(page, ['Ranking', 'Ranking Equipo', 'Team Ranking'], '/team-ranking');
  await wait(2500);

  // Vista completa
  await screenshot(page, 'ranking_equipo_main_view');

  // Header con trofeo
  await screenshotElement(page, '.ranking-header', 'ranking_header', '', 10);

  // Botón refresh
  await screenshotElement(page, '.btn-refresh', 'boton_refresh', '', 30);

  // Verificar estado de carga
  const isLoading = await isVisible(page, '.loading-container');
  if (isLoading) {
    await screenshotElement(page, '.loading-container', 'ranking_loading', '', 10);
    await wait(3000);
  }

  // Verificar error
  const hasError = await isVisible(page, '.error-container');
  if (hasError) {
    await screenshotElement(page, '.error-container', 'ranking_error', '', 10);
  }

  // Contenido principal
  const hasContent = await isVisible(page, '.ranking-content');
  if (hasContent) {
    // Resumen del equipo (5 tarjetas)
    await screenshotElement(page, '.team-summary', 'resumen_equipo', '', 10);

    // Tarjetas individuales
    await screenshotElement(page, '.summary-card >> nth=0', 'tarjeta_agentes', '', 10);
    await screenshotElement(page, '.summary-card >> nth=1', 'tarjeta_gestiones', '', 10);
    await screenshotElement(page, '.summary-card >> nth=2', 'tarjeta_proyeccion', '', 10);
    await screenshotElement(page, '.summary-card >> nth=3', 'tarjeta_recaudo', '', 10);
    await screenshotElement(page, '.summary-card.highlight', 'tarjeta_efectividad', '', 10);

    // Mi posición
    await screenshotElement(page, '.my-position-card', 'tu_posicion', '', 10);

    // Métricas personales
    await screenshotElement(page, '.my-metrics', 'mis_metricas', '', 10);

    // Metas del día (si existen)
    const hasMetas = await isVisible(page, '.metas-card');
    if (hasMetas) {
      await screenshotElement(page, '.metas-card', 'metas_del_dia', '', 10);

      // Barras de progreso
      await screenshotElement(page, '.progress-bar-container', 'barra_progreso', '', 20);
    }

    // Scroll para ver tabla
    await page.evaluate(() => {
      const table = document.querySelector('.ranking-table-container');
      if (table) table.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await wait(300);

    // Tabla de ranking
    await screenshotElement(page, '.ranking-table-container', 'tabla_ranking', '', 10);

    // Cabecera de tabla
    await screenshotElement(page, '.ranking-table thead', 'tabla_cabecera', '', 10);

    // Top 3 (filas destacadas)
    await screenshotElement(page, 'tr.top-3 >> nth=0', 'top_1_posicion', '', 10);

    // Mi fila (si está marcada)
    const hasMiRow = await isVisible(page, 'tr.es-yo');
    if (hasMiRow) {
      await screenshotElement(page, 'tr.es-yo', 'mi_fila_ranking', '', 10);
    }

    // Badge de posición con medalla
    await screenshotElement(page, '.position-badge >> nth=0', 'badge_posicion', '', 20);

    // Badge "TU"
    const hasTuBadge = await isVisible(page, '.badge-yo');
    if (hasTuBadge) {
      await screenshotElement(page, '.badge-yo', 'badge_tu', '', 30);
    }
  }

  // Sin datos (si aplica)
  const noData = await isVisible(page, '.no-data');
  if (noData) {
    await screenshotElement(page, '.no-data', 'sin_datos_ranking', '', 10);
  }
}

async function captureSettings(page) {
  console.log('\n═══════════════════════════════════════════');
  console.log('  MÓDULO: CONFIGURACIÓN');
  console.log('═══════════════════════════════════════════\n');

  // Botón de configuración en sidebar
  await screenshotElement(page, 'a[routerLink="/settings"], a[href*="settings"]', 'boton_configuracion', '', 40);

  // Intentar navegar a configuración
  if (await navigateToModule(page, ['Configuración', 'Settings', 'Config'], '/settings')) {
    await wait(1500);
    await screenshot(page, 'settings_view');
  }
}

// ==================== MAIN ====================

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  CAPTURA DE IMÁGENES - Manual de Usuario Agente v4.0   ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  console.log(`URL Base: ${BASE_URL}`);
  console.log(`Usuario: ${USERNAME}`);
  console.log(`Viewport: ${VIEWPORT.width}x${VIEWPORT.height}`);
  console.log(`Directorio: ${OUTPUT_DIR}\n`);

  ensureDirectories();

  const browser = await chromium.launch({
    headless: false,
    slowMo: SLOW_MO
  });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  try {
    // 1. LOGIN
    const loginSuccess = await captureLoginModule(page);
    if (!loginSuccess) {
      throw new Error('No se pudo completar el login');
    }

    // 2. NAVEGACIÓN
    await captureNavigationModule(page);

    // 3. TEMAS
    await captureThemeToggle(page);

    // 4. COBRANZA
    await captureCollectionManagement(page);

    // 5. GESTIÓN MANUAL
    await captureManualManagement(page);

    // 6. RANKING EQUIPO
    await captureTeamRanking(page);

    // 7. CONFIGURACIÓN
    await captureSettings(page);

  } catch (error) {
    console.error('\n[ERROR FATAL]', error.message);
    await screenshot(page, 'error_fatal');
  } finally {
    // Resumen final
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                    RESUMEN FINAL                        ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    const countFiles = (dir) => {
      try {
        return fs.readdirSync(dir).filter(f => f.endsWith('.png')).length;
      } catch { return 0; }
    };

    const generalCount = countFiles(OUTPUT_DIR);
    const lightCount = countFiles(LIGHT_MODE_DIR);
    const darkCount = countFiles(DARK_MODE_DIR);
    const totalCount = generalCount + lightCount + darkCount;

    console.log(`  Capturas exitosas: ${capturedCount}`);
    console.log(`  Capturas fallidas: ${failedCount}`);
    console.log('');
    console.log('  Archivos generados:');
    console.log(`    - Generales: ${generalCount}`);
    console.log(`    - Modo claro: ${lightCount}`);
    console.log(`    - Modo oscuro: ${darkCount}`);
    console.log(`    - TOTAL: ${totalCount}`);
    console.log('');
    console.log(`  Directorio: ${OUTPUT_DIR}`);

    console.log('\n═══════════════════════════════════════════');
    console.log('  CAPTURAS QUE REQUIEREN ACCIÓN MANUAL');
    console.log('═══════════════════════════════════════════\n');

    console.log('  Las siguientes requieren estados específicos:\n');
    console.log('  COBRANZA:');
    console.log('    - llamada_activa.png       (durante llamada real)');
    console.log('    - estado_en_llamada.png    (con llamada conectada)');
    console.log('    - estado_tipificando.png   (después de colgar)');
    console.log('    - formulario_completo.png  (con todos los campos)');
    console.log('    - notificacion_exito.png   (toast verde)');
    console.log('    - dialog_voucher.png       (modal de voucher)');
    console.log('    - dialog_comprobante.png   (modal OCR)');
    console.log('    - ocr_resultado.png        (después de analizar)');
    console.log('');
    console.log('  GENERAL:');
    console.log('    - permisos_navegador.png   (popup de micrófono)');
    console.log('    - modal_inactividad.png    (timeout sesión)');
    console.log('    - notificacion_toast.png   (mensajes flotantes)');

    console.log('\n  Cerrando navegador...\n');
    await browser.close();
  }
}

// Ejecutar
main().catch(console.error);
