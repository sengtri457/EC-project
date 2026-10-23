"use client";

export interface SwingSystemOptions {
  entrance?: boolean;
  draught?: boolean;
  brush?: boolean;
  stiffness?: number;
  damping?: number;
}

export interface SwingSystem {
  push: (index: number, force: number) => void;
  destroy: () => void;
}

export function createSwingSystem(
  container: HTMLElement,
  options: SwingSystemOptions = {}
): SwingSystem {
  const {
    entrance = true,
    draught = true,
    stiffness = 22,
    damping = 1.3,
  } = options;

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return {
      push() {},
      destroy() {},
    };
  }

  const cells = Array.from(container.querySelectorAll<HTMLElement>("[data-cell]"));
  const items = cells.map((cell, idx) => ({
    swing: cell.querySelector<HTMLElement>("[data-swing]"),
    shadow: cell.querySelector<HTMLElement>("[data-shadow]"),
    angle: entrance ? (idx % 2 === 0 ? 1 : -1) * (5 + 4 * Math.random()) : 0,
    velocity: 0,
    phase: Math.random() * Math.PI * 2,
    freq: 0.32 + 0.18 * Math.random(),
  }));

  let animId: number;
  let lastTime = performance.now();

  function update(time: number) {
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    items.forEach((item) => {
      if (!item.swing) return;

      // Ambient studio draft oscillation
      const ambient = draught
        ? Math.sin(time * 0.001 * item.freq + item.phase) * 0.35
        : 0;
      const force = -stiffness * (item.angle - ambient) - damping * item.velocity;

      item.velocity += force * dt;
      item.angle += item.velocity * dt;

      // Rotate garment on hanger
      item.swing.style.transform = `rotate(${item.angle.toFixed(3)}deg)`;

      // Dynamic floor shadow transform
      if (item.shadow) {
        const xOffset = item.angle * 2.4;
        const scale = Math.max(0.2, 1 - Math.abs(item.angle) / 70);
        item.shadow.style.transform = `translateX(${xOffset.toFixed(2)}px) scaleX(${scale.toFixed(3)})`;
      }
    });

    animId = requestAnimationFrame(update);
  }

  animId = requestAnimationFrame(update);

  return {
    push(index: number, force: number) {
      if (items[index]) {
        items[index].velocity += force;
      }
    },
    destroy() {
      cancelAnimationFrame(animId);
    },
  };
}
