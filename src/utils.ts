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
 * Formats bytes into a readable string (bytes or KB)
 */
export function formatBytes (bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`
  return `${(bytes / 1024).toFixed(2)} KB`
}

/**
 * Calculates savings between original and optimized content
 */
export function calculateSavings (originalContent: string, optimizedContent: string) {
  const originalSize = Buffer.byteLength(originalContent, 'utf8')
  const optimizedSize = Buffer.byteLength(optimizedContent, 'utf8')
  const savingPercent = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2)

  return {
    originalSize,
    optimizedSize,
    savingPercent,
    originalSizeFormatted: formatBytes(originalSize),
    optimizedSizeFormatted: formatBytes(optimizedSize)
  }
}

export function propagateStrokeAndFill (svgContent: string): string {
  const svgOpenTagMatch = svgContent.match(/<svg[^>]*>/i)
  if (!svgOpenTagMatch) return svgContent

  const svgOpenTag = svgOpenTagMatch[0]
  const strokeMatch = svgOpenTag.match(/\bstroke\s*=\s*["']([^"']+)["']/)
  const stroke = strokeMatch ? strokeMatch[1] : null

  if (stroke) {
    const shapeElements = ['path', 'line', 'polyline', 'polygon', 'circle', 'ellipse', 'rect']
    const shapeRegex = new RegExp(`<(${shapeElements.join('|')})([^>]*?)(\\/?>)`, 'gi')

    svgContent = svgContent.replace(shapeRegex, (match, tagName, attrs, ending) => {
      if (attrs && /\bstroke\s*=/.test(attrs)) {
        return match
      }
      return `<${tagName}${attrs || ''} stroke="${stroke}"${ending}`
    })
  }

  return svgContent
}

function ensureMinimumSizeCore (svgContent: string, minSize: number): string {
  const svgOpenTagMatch = svgContent.match(/<svg[^>]*>/i)
  if (!svgOpenTagMatch) return svgContent

  const svgOpenTag = svgOpenTagMatch[0]
  const hasWidth = /\bwidth\s*=\s*["'][^"']+["']/.test(svgOpenTag)
  const hasHeight = /\bheight\s*=\s*["'][^"']+["']/.test(svgOpenTag)
  const viewBoxMatch = svgOpenTag.match(/viewBox\s*=\s*["']([^"']+)["']/)

  if (!hasWidth && !hasHeight) {
    if (viewBoxMatch) {
      const viewBoxParts = viewBoxMatch[1].split(/\s+/)
      if (viewBoxParts.length >= 4) {
        const vbWidth = parseFloat(viewBoxParts[2])
        const vbHeight = parseFloat(viewBoxParts[3])
        const scale = minSize / Math.max(vbWidth, vbHeight)
        const newWidth = Math.round(vbWidth * scale)
        const newHeight = Math.round(vbHeight * scale)
        svgContent = svgContent.replace('<svg', `<svg width="${newWidth}" height="${newHeight}"`)
      } else {
        svgContent = svgContent.replace('<svg', `<svg width="${minSize}" height="${minSize}"`)
      }
    } else {
      svgContent = svgContent.replace('<svg', `<svg width="${minSize}" height="${minSize}"`)
    }
  }

  return svgContent
}

export function ensureMinimumSizeHover (svgContent: string, minSize: number): string {
  svgContent = ensureMinimumSizeCore(svgContent, minSize)

  const svgOpenTagMatch = svgContent.match(/<svg[^>]*>/i)
  if (!svgOpenTagMatch) return svgContent

  const svgOpenTag = svgOpenTagMatch[0]
  const widthMatch = svgOpenTag.match(/\bwidth\s*=\s*["'](\d+(?:\.\d+)?)(?:px)?["']/)
  const heightMatch = svgOpenTag.match(/\bheight\s*=\s*["'](\d+(?:\.\d+)?)(?:px)?["']/)

  if (widthMatch && heightMatch) {
    const width = parseFloat(widthMatch[1])
    const height = parseFloat(heightMatch[1])

    if (width < minSize && height < minSize) {
      const scale = minSize / Math.max(width, height)
      const newWidth = Math.round(width * scale)
      const newHeight = Math.round(height * scale)

      svgContent = svgContent
        .replace(/\bwidth\s*=\s*["']\d+(?:\.\d+)?(?:px)?["']/, `width="${newWidth}"`)
        .replace(/\bheight\s*=\s*["']\d+(?:\.\d+)?(?:px)?["']/, `height="${newHeight}"`)
    }
  }

  return svgContent
}

export function ensureMinimumSizeGutter (svgContent: string, minSize: number): string {
  return ensureMinimumSizeCore(svgContent, minSize)
}
