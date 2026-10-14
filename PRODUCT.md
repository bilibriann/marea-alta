# Product

## Platform

web

## Users

Encargados de compras y de calidad en empresas farmacéuticas, alimentarias, logísticas, acuícolas y agropecuarias en Chile y el Cono Sur. Llegan al sitio evaluando proveedores de embalaje térmico / cadena de frío o directamente pidiendo una cotización.

## Product Purpose

Marea Alta Chile SpA fabrica embalajes térmicos de alta precisión para mantener la cadena de frío durante el transporte de productos sensibles a la temperatura (farmacéutico, alimentario, logístico, acuícola, agropecuario, health care). El sitio existe para generar confianza técnica y convertir visitas en solicitudes de cotización o contacto comercial.

## Positioning

33 años de trayectoria (fundada en 1987) fabricando soluciones de cadena de frío, con certificación ISO 9001 vigente desde 2008 (organismo AENOR, red IQNET) y distribución activa en Chile y el Cono Sur. La combinación de trayectoria larga + certificación formal + cobertura regional es lo que un competidor nuevo o solo local no puede igualar de inmediato.

## Operating Context

- Sitio 100% estático (Next.js App Router, `output: 'export'`), desplegado en Hostinger vía FTP con GitHub Actions.
- Contenido editorial (servicios, sectores, testimonios, clientes, certificaciones, home) vive en `src/content/` y está pensado para ser editado eventualmente por un CMS (Sveltia o Decap) sin tocar componentes.
- Rutas: home, `/servicios` (índice) + `/[servicio]` (detalle por slug), `/productos`, `/contacto`.
- Operan desde Lo Espejo, RM, con distribución regional — no e-commerce, el flujo de conversión es cotización/contacto, no compra directa online.

## Capabilities and Constraints

- Servicios documentados individualmente (control de calidad, trazabilidad, monitoreo de temperatura, resistencia al aplastamiento, certificación de procesos, laboratorio de innovación, servicio postventa).
- Sectores atendidos: farmacéuticas, soluciones alimentarias, operadores & logística, acuícolas, agropecuaria, health care.
- `src/content/clientes.json` y las categorías de `productos.json` están vacíos hoy; `testimonios.json` tiene un único testimonio con nombre de empresa genérico ("Cliente Marea Alta"). Contenido real (logos de clientes, catálogo de productos, testimonios adicionales) viene en camino vía CMS — no son huecos permanentes, tratar como pendiente de carga, no como ausencia deliberada.
- Formulario de contacto usa un stub (`src/lib/forms.ts`), no un backend de envío real todavía.

## Brand Commitments

- Nombre legal: Marea Alta Chile SpA.
- Certificaciones formales a exhibir: ISO 9001 (desde 2008, organismo AENOR) e IQNET.
- Redes: Instagram, LinkedIn, Facebook (@mareaaltachile / mareaalta).
- Contacto: ventas@mareaalta-latam.com, +56 9 4041 7967, José Joaquín Prieto 9001, Bodegas 11-12, Galpón 2, Lo Espejo, RM. Horario Lun–Vie 9:00–18:00.

## Evidence on Hand

- Misión, visión y 5 valores corporativos confirmados en `src/content/home.json`.
- Un testimonio real con nombre y cargo (Juan Emilio D'jaber C., Gerente de Operaciones) pero empresa anonimizada como "Cliente Marea Alta" — no inventar más testimonios ni atribuir empresas específicas hasta que llegue contenido real.
- Sin logos de clientes ni catálogo de productos todavía: no fabricar logos, nombres de clientes ni productos ficticios; diseñar de forma que estas secciones absorban contenido real cuando llegue vía CMS.
- Mockups de diseño de referencia (Stitch, no publicados) en `/design-reference/` — evidencia de exploración visual previa, no autoridad de producto.

## Product Principles

- Credibilidad técnica ante compradores B2B exigentes (regulados) pesa más que estilo aspiracional genérico.
- La certificación formal (ISO 9001, IQNET) y la trayectoria de 33 años son pruebas, no eslóganes — deben quedar verificables, no diluidas en marketing vago.
- El sitio es una herramienta de generación de cotizaciones/contacto, no una tienda: cada superficie debe empujar hacia `/contacto` o la solicitud de cotización.
- El contenido editorial vive fuera del código (`src/content/`) para que el futuro CMS lo actualice sin tocar componentes; el diseño no debe asumir que el contenido actual (incluyendo huecos vacíos) es definitivo.
