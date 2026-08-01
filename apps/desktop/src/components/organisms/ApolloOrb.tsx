import { useEffect, useRef } from "react";

export type OrbState = "idle" | "listening" | "thinking" | "speaking";

type ApolloOrbProps = {
    // Amplitude do microfone/fala normalizada em 0..1 (dirige a "respiração" da malha).
    level: number;
    state: OrbState;
    size?: number;
};

// Cor base (RGB) por estado — a malha é desenhada em additive glow sobre o fundo escuro.
const PALETTE: Record<OrbState, [number, number, number]> = {
    idle: [75, 139, 245], // azul Apliquefy
    listening: [56, 232, 225], // ciano energizado
    thinking: [151, 117, 250], // roxo
    speaking: [245, 194, 91], // âmbar/solar (Apollo)
};

// Malha esférica: anéis de latitude/longitude projetados ortograficamente e girando.
// Canvas 2D puro — sem three.js (dependência pesada para um efeito que cabe em ~80 linhas).
export function ApolloOrb({ level, state, size = 320 }: ApolloOrbProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // refs para o loop de animação ler o valor mais recente sem recriar o rAF a cada frame
    const levelRef = useRef(level);
    const stateRef = useRef(state);
    levelRef.current = level;
    stateRef.current = state;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.scale(dpr, dpr);

        const cx = size / 2;
        const cy = size / 2;
        const baseR = size * 0.32;

        // Grade da esfera (latitude × longitude).
        const LAT = 13;
        const LON = 24;

        let raf = 0;
        let angle = 0;
        // valor suavizado da amplitude para a malha não "tremer"
        let smooth = 0;

        const render = (t: number) => {
            const target = levelRef.current;
            smooth += (target - smooth) * 0.15;
            const s = stateRef.current;
            const [r, g, b] = PALETTE[s];

            // pulso lento contínuo + reação à voz + "pensando" respira mais rápido
            const idlePulse = Math.sin(t / 900) * 0.03;
            const think = s === "thinking" ? Math.sin(t / 220) * 0.05 : 0;
            const R = baseR * (1 + idlePulse + think + smooth * 0.35);
            const rotSpeed = s === "thinking" ? 0.02 : 0.006 + smooth * 0.02;
            angle += rotSpeed;

            ctx.clearRect(0, 0, size, size);
            ctx.globalCompositeOperation = "lighter";
            // tremor rápido (~22 Hz) proporcional à amplitude real da fala — sub-pixel, vibra sem saltar
            const tremor = s === "speaking" ? smooth : 0;
            ctx.save();
            ctx.translate(Math.sin(t / 7) * tremor * 0.5, Math.cos(t / 9) * tremor * 0.4);

            // halo de fundo
            const glow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.9);
            glow.addColorStop(0, `rgba(${r},${g},${b},${0.22 + smooth * 0.25})`);
            glow.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, size, size);

            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            // projeta um ponto (lat, lon) da esfera, girando em torno do eixo Y
            const project = (lat: number, lon: number) => {
                const x = Math.cos(lat) * Math.cos(lon);
                const y = Math.sin(lat);
                const z = Math.cos(lat) * Math.sin(lon);
                const rx = x * cosA - z * sinA;
                const rz = x * sinA + z * cosA;
                return { px: cx + rx * R, py: cy + y * R, depth: (rz + 1) / 2 }; // depth 0(atrás)..1(frente)
            };

            // anéis de latitude
            for (let i = 1; i < LAT; i++) {
                const lat = -Math.PI / 2 + (Math.PI * i) / LAT;
                ctx.beginPath();
                for (let j = 0; j <= LON; j++) {
                    const lon = (2 * Math.PI * j) / LON;
                    const p = project(lat, lon);
                    if (j === 0) ctx.moveTo(p.px, p.py);
                    else ctx.lineTo(p.px, p.py);
                }
                ctx.strokeStyle = `rgba(${r},${g},${b},0.16)`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // meridianos de longitude
            for (let j = 0; j < LON; j += 2) {
                const lon = (2 * Math.PI * j) / LON;
                ctx.beginPath();
                for (let i = 0; i <= LAT; i++) {
                    const lat = -Math.PI / 2 + (Math.PI * i) / LAT;
                    const p = project(lat, lon);
                    if (i === 0) ctx.moveTo(p.px, p.py);
                    else ctx.lineTo(p.px, p.py);
                }
                ctx.strokeStyle = `rgba(${r},${g},${b},0.10)`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // nós (vértices) — mais brilhantes na frente
            for (let i = 1; i < LAT; i++) {
                const lat = -Math.PI / 2 + (Math.PI * i) / LAT;
                for (let j = 0; j < LON; j += 1) {
                    const lon = (2 * Math.PI * j) / LON;
                    const p = project(lat, lon);
                    const a = 0.25 + p.depth * 0.75;
                    const rad = 0.7 + p.depth * (1.3 + smooth * 2);
                    ctx.beginPath();
                    ctx.arc(p.px, p.py, rad, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${r},${g},${b},${a * (0.5 + smooth * 0.5)})`;
                    ctx.fill();
                }
            }

            // núcleo
            const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * (0.5 + smooth * 0.3));
            core.addColorStop(0, `rgba(255,255,255,${0.5 + smooth * 0.4})`);
            core.addColorStop(0.4, `rgba(${r},${g},${b},0.5)`);
            core.addColorStop(1, "rgba(0,0,0,0)");
            ctx.fillStyle = core;
            ctx.beginPath();
            ctx.arc(cx, cy, R * (0.5 + smooth * 0.3), 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
            ctx.globalCompositeOperation = "source-over";
            raf = requestAnimationFrame(render);
        };

        raf = requestAnimationFrame(render);
        return () => cancelAnimationFrame(raf);
    }, [size]);

    return <canvas ref={canvasRef} style={{ width: size, height: size }} aria-hidden />;
}
