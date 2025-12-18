
import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  prepareForOptimization,
  finalizeAfterOptimization,
  isJsxSvg
} from './svgTransform'

describe('Astro Support', () => {
    it('should handle Astro expression syntax (similar to JSX)', () => {
        const input = '<svg width={size} height={size}><path d={path} /></svg>'
        const { preparedSvg, wasJsx } = prepareForOptimization(input)
        
        // Should be detected as "JSX-like"
        assert.ok(wasJsx, 'Should detect Astro/JSX expression')
        assert.ok(preparedSvg.includes('data-better-svg-temp-width='))
        
        const final = finalizeAfterOptimization(preparedSvg, wasJsx)
        assert.strictEqual(final, input)
    })

    it('should handle Astro class:list', () => {
        const input = '<svg class:list={["icon", className]}></svg>'
        const { preparedSvg, wasJsx } = prepareForOptimization(input)
        
        // class:list is a valid attribute name with : (namespace-like)
        // It has expression value ={...}
        assert.ok(wasJsx)
        assert.ok(preparedSvg.includes('data-better-svg-temp-class:list='))
        
        const final = finalizeAfterOptimization(preparedSvg, wasJsx)
        assert.strictEqual(final, input)
    })
})

describe('Vue Support', () => {
    // Vue uses :attr="value" or v-bind:attr="value"
    // CAUTION: The current `svgTransform` logic focuses on JSX-style `={}` expressions.
    // If Vue uses quotes `:width="size"`, replaceJsxExpressions will NOT touch it because it looks for `={`.
    // SVGO might strip `:width` if it doesn't recognize it.
    
    it('should preserve Vue :bound attributes', () => {
        const input = '<svg :width="size" :height="size"><path /></svg>'
        const { preparedSvg, wasJsx } = prepareForOptimization(input)
        
        // Currently it ignores Vue syntax
        assert.strictEqual(wasJsx, false)
        assert.strictEqual(preparedSvg, input)
    })

    it('should preserve Vue v-bind attributes', () => {
        const input = '<svg v-bind:width="size"></svg>'
        const { preparedSvg, wasJsx } = prepareForOptimization(input)
        assert.strictEqual(wasJsx, false)
    })
    
    it('should preserve Vue @event handlers', () => {
        const input = '<svg @click="handleClick"></svg>'
        const { preparedSvg, wasJsx } = prepareForOptimization(input)
        assert.strictEqual(wasJsx, false)
    })
})
