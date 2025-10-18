# Better SVG

Una extensión de Visual Studio Code para editar archivos SVG con vista previa en tiempo real y optimización integrada.

## Características

- ✨ **Editor con vista previa**: Edita tu SVG en un textarea con syntax highlighting mientras ves el resultado renderizado en tiempo real
- ⚡ **Optimización con SVGO**: Botón integrado en la barra de herramientas para optimizar tu SVG
- 🎨 **Fondo en cuadrícula**: La vista previa incluye un fondo en cuadrícula para ver mejor los SVG con transparencia

## Uso

1. Abre cualquier archivo `.svg`
2. La extensión abrirá automáticamente el editor personalizado con:
   - Panel izquierdo: editor de código
   - Panel derecho: vista previa del SVG
3. Haz clic en el icono ⚡ en la barra de herramientas para optimizar el SVG

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

MIT
