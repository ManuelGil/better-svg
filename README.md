# Better SVG

Una extensión de Visual Studio Code para editar archivos SVG con vista previa en tiempo real y optimización integrada.

## Características

- ✨ **Editor con vista previa en lateral**: Edita tu SVG en un textarea con preview en tiempo real en el panel de "Explorer"
- 🎨 **Control de currentColor**: Cambia el valor de `currentColor` para previsualizar diferentes esquemas de color
- 🌓 **Fondo oscuro**: Activa/desactiva un fondo oscuro para visualizar mejor SVGs con colores claros
- 🔍 **Zoom y pan**: Zoom in/out con click o Alt+click, scroll con Alt, y arrastra para hacer pan
- ⚡ **Optimización con SVGO**: Botón integrado en la barra de herramientas para optimizar tu SVG
- 📐 **Fondo en cuadrícula**: La vista previa incluye un fondo en cuadrícula para ver mejor los SVG con transparencia

## Uso

1. Abre cualquier archivo `.svg`
2. La extensión abrirá automáticamente el editor personalizado con:
   - Editor de código ocupando todo el panel
   - Panel de preview
3. Haz clic en el icono ⚡ en la barra de herramientas para optimizar el SVG

### Controles del preview

- **Arrastrar panel**: Haz clic en el header "Preview" y arrastra
- **Redimensionar**: Usa el handle de resize en la esquina inferior derecha
- **Zoom in**: Click normal sobre el preview
- **Zoom out**: Mantén Alt + Click
- **Zoom con scroll**: Mantén Alt + usa la rueda del ratón
- **Pan**: Cuando hay zoom, arrastra el SVG con el botón izquierdo
- **Cambiar currentColor**: Click en el icono de paleta + círculo de color
- **Fondo oscuro**: Click en el icono de luna

## Estructura del proyecto

```
better-svg/
├── src/
│   ├── extension.ts           # Punto de entrada de la extensión
│   ├── svgEditorProvider.ts   # Proveedor del editor personalizado
│   └── webview/               # Archivos del webview
│       ├── index.html         # Template HTML
│       ├── styles.css         # Estilos CSS
│       └── main.js            # Lógica JavaScript del webview
└── package.json
```

## Instalación para desarrollo

```bash
cd better-svg
npm install
npm run compile
```

Luego presiona `F5` en VS Code para abrir una ventana de extensión para probar.

## Compilar

```bash
npm run compile
```

## Empaquetar

```bash
npm install -g @vscode/vsce
vsce package
```

## Licencia

Copyright 2025 Miguel Ángel Durán

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
