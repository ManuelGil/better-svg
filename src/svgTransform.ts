/**
 * Copyright 2025 Miguel Ángel Durán
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Map of JSX camelCase attributes to SVG kebab-case attributes
 */
export const jsxToSvgAttributeMap: Record<string, string> = {
  // Stroke attributes
  strokeWidth: 'stroke-width',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeMiterlimit: 'stroke-miterlimit',
  strokeOpacity: 'stroke-opacity',
  // Fill attributes
  fillOpacity: 'fill-opacity',
  fillRule: 'fill-rule',
  // Clip attributes
  clipPath: 'clip-path',
  clipRule: 'clip-rule',
  // Font attributes
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontStyle: 'font-style',
  fontWeight: 'font-weight',
  // Text attributes
  textAnchor: 'text-anchor',
  textDecoration: 'text-decoration',
  dominantBaseline: 'dominant-baseline',
  alignmentBaseline: 'alignment-baseline',
  baselineShift: 'baseline-shift',
  // Gradient/filter attributes
  stopColor: 'stop-color',
  stopOpacity: 'stop-opacity',
  colorInterpolation: 'color-interpolation',
  colorInterpolationFilters: 'color-interpolation-filters',
  floodColor: 'flood-color',
  floodOpacity: 'flood-opacity',
  lightingColor: 'lighting-color',
  // Marker attributes
  markerStart: 'marker-start',
  markerMid: 'marker-mid',
  markerEnd: 'marker-end',
  // Other attributes
  paintOrder: 'paint-order',
  vectorEffect: 'vector-effect',
  shapeRendering: 'shape-rendering',
  imageRendering: 'image-rendering',
  pointerEvents: 'pointer-events',
  xlinkHref: 'xlink:href'
}

/**
 * Create the reverse map: SVG kebab-case to JSX camelCase
 */
export const svgToJsxAttributeMap: Record<string, string> = Object.fromEntries(
  Object.entries(jsxToSvgAttributeMap).map(([jsx, svg]) => [svg, jsx])
)

/**
 * Detects if the SVG content contains JSX-specific syntax
 * (camelCase attributes, expression values like {2}, className, etc.)
 */
export function isJsxSvg (svgContent: string): boolean {
  // Check for JSX expression values like ={2} or ={variable}
  if (/=\{[^}]+\}/.test(svgContent)) {
    return true
  }

  // Check for className attribute
  if (/\bclassName=/.test(svgContent)) {
    return true
  }

  // Check for any known JSX camelCase attributes
  for (const jsxAttr of Object.keys(jsxToSvgAttributeMap)) {
    const regex = new RegExp(`\\b${jsxAttr}=`, 'g')
    if (regex.test(svgContent)) {
      return true
    }
  }

  return false
}

/**
 * Converts JSX SVG syntax to valid SVG XML
 * - Converts expression values {2} to "2"
 * - Converts className to class
 * - Converts camelCase attributes to kebab-case
 */
export function convertJsxToSvg (svgContent: string): string {
  // Convert JSX expression values like {2} to "2"
  // Handle both simple values and expressions
  svgContent = svgContent.replace(/=\{([^}]+)\}/g, '="$1"')

  // Convert className to class
  svgContent = svgContent.replace(/\bclassName=/g, 'class=')

  // Convert all JSX camelCase attributes to SVG kebab-case
  for (const [jsx, svg] of Object.entries(jsxToSvgAttributeMap)) {
    const regex = new RegExp(`\\b${jsx}=`, 'g')
    svgContent = svgContent.replace(regex, `${svg}=`)
  }

  return svgContent
}

/**
 * Converts SVG XML syntax back to JSX
 * - Converts class to className
 * - Converts kebab-case attributes to camelCase
 */
export function convertSvgToJsx (svgContent: string): string {
  // Convert class to className
  svgContent = svgContent.replace(/\bclass=/g, 'className=')

  // Convert all SVG kebab-case attributes to JSX camelCase
  for (const [svg, jsx] of Object.entries(svgToJsxAttributeMap)) {
    // Need to escape hyphens and colons for regex
    const escapedSvg = svg.replace(/[-:]/g, '\\$&')
    const regex = new RegExp(`\\b${escapedSvg}=`, 'g')
    svgContent = svgContent.replace(regex, `${jsx}=`)
  }

  return svgContent
}

/**
 * Prepares JSX SVG content for SVGO optimization
 * Returns the converted SVG and metadata about whether conversion was applied
 */
export function prepareForOptimization (svgContent: string): {
  preparedSvg: string
  wasJsx: boolean
} {
  const wasJsx = isJsxSvg(svgContent)

  if (wasJsx) {
    return {
      preparedSvg: convertJsxToSvg(svgContent),
      wasJsx: true
    }
  }

  return {
    preparedSvg: svgContent,
    wasJsx: false
  }
}

/**
 * Converts optimized SVG back to JSX if the original was JSX
 */
export function finalizeAfterOptimization (optimizedSvg: string, wasJsx: boolean): string {
  if (wasJsx) {
    return convertSvgToJsx(optimizedSvg)
  }

  return optimizedSvg
}
