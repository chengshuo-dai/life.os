/**
 * Life.OS Visual Effects — Shader & Glitch Control
 *
 * Frontend hooks aligned with Technical Alignment Guide §3:
 *   - triggerGlitch(): activates .glitch-active CSS tremor on elements
 *   - initShader(): initializes a canvas-based noise/distortion overlay
 *
 * These are dispatched via custom DOM events so any component or
 * the global apiFetch wrapper can trigger them without direct imports.
 *
 * Events:
 *   lifeos:glitch-start  — fired when API request enters Pending state
 *   lifeos:glitch-end    — fired when API request reaches Success/Error
 *   lifeos:shader-init   — fires initShader() on a target canvas
 *   lifeos:shader-end    — tears down the shader animation
 */

// ─── Element-level Glitch ────────────────────────────────

/**
 * Applies `.glitch-active` to an element for a specified duration.
 * If no element is provided, applies to `document.body`.
 * The dual-color (cyan/red) tremor is defined in globals.css.
 */
export function triggerGlitch(
  target?: HTMLElement | null,
  durationMs = 600
): void {
  const el = target || document.body;
  if (!el) return;

  el.classList.add('glitch-active');
  el.setAttribute('data-text', el.textContent?.slice(0, 120) || '');

  if (durationMs > 0) {
    setTimeout(() => {
      el.classList.remove('glitch-active');
      el.removeAttribute('data-text');
    }, durationMs);
  }
}

/** Remove glitch immediately. */
export function clearGlitch(target?: HTMLElement | null): void {
  const el = target || document.body;
  if (!el) return;
  el.classList.remove('glitch-active');
  el.removeAttribute('data-text');
}

// ─── Canvas Shader (Noise + Distortion) ──────────────────

let shaderRafId: number | null = null;
let shaderActive = false;

/**
 * Initialize a full-viewport canvas overlay with animated noise/distortion.
 * Creates a <canvas> if one doesn't exist, or reuses the provided element.
 * The effect is a scanning interference pattern — subtle enough to not
 * distract from prose, visible enough to signal "system working."
 */
export function initShader(canvasEl?: HTMLCanvasElement | null): HTMLCanvasElement {
  // Reuse or create
  let canvas = canvasEl || null;
  if (!canvas) {
    // Check for existing shader canvas
    const existing = document.getElementById('lifeos-shader-canvas') as HTMLCanvasElement | null;
    if (existing) {
      canvas = existing;
    } else {
      canvas = document.createElement('canvas');
      canvas.id = 'lifeos-shader-canvas';
      canvas.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:30;opacity:0.12;';
      document.body.appendChild(canvas);
    }
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Match viewport dimensions
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  shaderActive = true;
  let phase = 0;

  const draw = () => {
    if (!shaderActive) return;
    phase += 0.02;

    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let y = 0; y < h; y++) {
      // Scanning interference lines
      const scanLine = Math.sin(y * 0.1 + phase) * 0.5 + 0.5;
      const scanLine2 = Math.sin(y * 0.03 - phase * 0.7) * 0.5 + 0.5;

      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        // Perlin-like noise approximation
        const noise =
          (Math.sin(x * 0.05 + phase) * Math.cos(y * 0.05 - phase) +
            Math.sin(x * 0.1 - phase * 0.5) * Math.cos(y * 0.1 + phase * 0.3)) *
          0.5;

        // Cyan channel modulated by scan lines + noise
        const r = Math.max(0, noise * 15 * scanLine);
        const g = Math.max(0, noise * 20 * scanLine2);
        const b = Math.max(0, noise * 40 * scanLine);

        data[i] = r;       // R
        data[i + 1] = g;   // G
        data[i + 2] = b;   // B (cyan-dominant)
        data[i + 3] = Math.max(0, Math.min(255, noise * 60)); // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);
    shaderRafId = requestAnimationFrame(draw);
  };

  shaderRafId = requestAnimationFrame(draw);
  return canvas;
}

/** Stop and remove the shader canvas animation. */
export function deactivateShader(): void {
  shaderActive = false;
  if (shaderRafId !== null) {
    cancelAnimationFrame(shaderRafId);
    shaderRafId = null;
  }
  const canvas = document.getElementById('lifeos-shader-canvas');
  if (canvas) {
    canvas.remove();
  }
}

/** Check if the shader is currently animating. */
export function isShaderActive(): boolean {
  return shaderActive;
}

// ─── Custom Event Bindings ───────────────────────────────

/**
 * Listen for Life.OS effect events and respond.
 * Call once in the provider/layout to wire up global effect hooks.
 */
export function bindEffectEvents(): () => void {
  const onGlitchStart = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    triggerGlitch(detail?.target || document.body, detail?.durationMs ?? 600);
  };

  const onGlitchEnd = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    clearGlitch(detail?.target || document.body);
  };

  const onShaderInit = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    initShader(detail?.canvas || null);
  };

  const onShaderEnd = () => {
    deactivateShader();
  };

  window.addEventListener('lifeos:glitch-start', onGlitchStart);
  window.addEventListener('lifeos:glitch-end', onGlitchEnd);
  window.addEventListener('lifeos:shader-init', onShaderInit);
  window.addEventListener('lifeos:shader-end', onShaderEnd);

  // Return cleanup function
  return () => {
    window.removeEventListener('lifeos:glitch-start', onGlitchStart);
    window.removeEventListener('lifeos:glitch-end', onGlitchEnd);
    window.removeEventListener('lifeos:shader-init', onShaderInit);
    window.removeEventListener('lifeos:shader-end', onShaderEnd);
    deactivateShader();
  };
}

// ─── Convenience: trigger effect events ──────────────────

/** Fire glitch-start — use in apiFetch pending state. */
export function dispatchGlitchStart(target?: HTMLElement, durationMs?: number): void {
  window.dispatchEvent(
    new CustomEvent('lifeos:glitch-start', {
      detail: { target, durationMs },
    })
  );
}

/** Fire glitch-end — use in apiFetch success/error state. */
export function dispatchGlitchEnd(target?: HTMLElement): void {
  window.dispatchEvent(
    new CustomEvent('lifeos:glitch-end', {
      detail: { target },
    })
  );
}

/** Fire shader-init — use for heavy data-loading sequences. */
export function dispatchShaderInit(canvas?: HTMLCanvasElement): void {
  window.dispatchEvent(
    new CustomEvent('lifeos:shader-init', {
      detail: { canvas },
    })
  );
}

/** Fire shader-end — tear down after loading completes. */
export function dispatchShaderEnd(): void {
  window.dispatchEvent(new CustomEvent('lifeos:shader-end'));
}
