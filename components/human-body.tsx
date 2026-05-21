"use client"

import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import type { BodyRegion } from "@/types"
import { ZoomIn, ZoomOut, Move, RotateCcw } from "lucide-react"

interface HumanBodyProps {
  regions: BodyRegion[]
  onRegionClick?: (region: BodyRegion) => void
  interactive?: boolean
  size?: "sm" | "md" | "lg"
}

const regionLabels: Record<string, string> = {
  head: "Cabeca",
  brain: "Cerebro",
  eyes: "Olhos",
  neck: "Pescoco",
  chest: "Torax",
  heart: "Coracao",
  lungs: "Pulmoes",
  stomach: "Estomago",
  liver: "Figado",
  kidneys: "Rins",
  intestines: "Intestinos",
  bladder: "Bexiga",
  spine: "Coluna",
  "left-arm": "Braco Esquerdo",
  "right-arm": "Braco Direito",
  "left-hand": "Mao Esquerda",
  "right-hand": "Mao Direita",
  "left-leg": "Perna Esquerda",
  "right-leg": "Perna Direita",
  "left-foot": "Pe Esquerdo",
  "right-foot": "Pe Direito",
  "left-shoulder": "Ombro Esquerdo",
  "right-shoulder": "Ombro Direito",
  "left-knee": "Joelho Esquerdo",
  "right-knee": "Joelho Direito",
  pelvis: "Pelve",
  abdomen: "Abdomen",
}

const regionPositions: Record<string, { x: number; y: number }> = {
  head: { x: 100, y: 35 },
  brain: { x: 100, y: 25 },
  eyes: { x: 100, y: 35 },
  neck: { x: 100, y: 85 },
  chest: { x: 100, y: 125 },
  heart: { x: 88, y: 145 },
  lungs: { x: 100, y: 140 },
  stomach: { x: 108, y: 190 },
  liver: { x: 70, y: 185 },
  kidneys: { x: 100, y: 200 },
  intestines: { x: 100, y: 225 },
  bladder: { x: 100, y: 250 },
  spine: { x: 100, y: 180 },
  abdomen: { x: 100, y: 200 },
  pelvis: { x: 100, y: 270 },
  "left-shoulder": { x: 55, y: 105 },
  "right-shoulder": { x: 145, y: 105 },
  "left-arm": { x: 35, y: 170 },
  "right-arm": { x: 165, y: 170 },
  "left-hand": { x: 25, y: 258 },
  "right-hand": { x: 175, y: 258 },
  "left-leg": { x: 75, y: 370 },
  "right-leg": { x: 125, y: 370 },
  "left-knee": { x: 72, y: 345 },
  "right-knee": { x: 128, y: 345 },
  "left-foot": { x: 68, y: 465 },
  "right-foot": { x: 132, y: 465 },
}

export function HumanBody({ regions, onRegionClick, interactive = false, size = "lg" }: HumanBodyProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return { fill: "#ef4444", stroke: "#ef4444", glow: "rgba(239, 68, 68, 0.8)" }
      case "WARNING":
        return { fill: "#eab308", stroke: "#eab308", glow: "rgba(234, 179, 8, 0.8)" }
      default:
        return { fill: "#22c55e", stroke: "#22c55e", glow: "rgba(34, 197, 94, 0.8)" }
    }
  }

  const sizeClasses = {
    sm: "h-[350px]",
    md: "h-[450px]",
    lg: "h-[550px]",
  }

  const handleRegionClick = (region: BodyRegion) => {
    setSelectedRegion(region)
    if (onRegionClick) {
      onRegionClick(region)
    }
  }

  const getRegionData = (regiao: string) => {
    return regions.find(r => r.regiao === regiao)
  }

  const getPartColor = (regiao: string) => {
    const regionData = getRegionData(regiao)
    if (!regionData) return { fill: "url(#bodyGradient)", stroke: "#22d3ee", opacity: 0.4 }
    
    const colors = getSeverityColor(regionData.severidade)
    return { 
      fill: colors.fill + "40", 
      stroke: colors.stroke, 
      opacity: 1,
      filter: regionData.severidade === "CRITICAL" ? "url(#criticalGlow)" : 
              regionData.severidade === "WARNING" ? "url(#warningGlow)" : undefined
    }
  }

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4))
  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) setPan({ x: 0, y: 0 })
      return newZoom
    })
  }
  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Mouse/Touch handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      const maxPan = (zoom - 1) * 150
      setPan({
        x: Math.max(-maxPan, Math.min(maxPan, newX)),
        y: Math.max(-maxPan, Math.min(maxPan, newY)),
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener("mouseup", handleGlobalMouseUp)
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp)
  }, [])

  return (
    <div className={`relative ${sizeClasses[size]} w-full flex flex-col`}>
      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg bg-background/80 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
          title="Aumentar Zoom"
        >
          <ZoomIn className="h-4 w-4 text-cyan-400" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg bg-background/80 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
          title="Diminuir Zoom"
        >
          <ZoomOut className="h-4 w-4 text-cyan-400" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-lg bg-background/80 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
          title="Resetar"
        >
          <RotateCcw className="h-4 w-4 text-cyan-400" />
        </button>
      </div>

      {/* Zoom indicator */}
      {zoom > 1 && (
        <div className="absolute top-2 left-2 z-20 px-3 py-1 rounded-full bg-background/80 border border-cyan-500/30">
          <span className="text-xs text-cyan-400 font-medium">{Math.round(zoom * 100)}%</span>
        </div>
      )}

      {/* Pan indicator */}
      {zoom > 1 && (
        <div className="absolute bottom-2 left-2 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-background/80 border border-cyan-500/30">
          <Move className="h-3 w-3 text-cyan-400" />
          <span className="text-xs text-muted-foreground">Arraste para mover</span>
        </div>
      )}

      {/* Background grid effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Central glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-[70%] w-[50%] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Human Body Container with zoom and pan */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-hidden flex items-center justify-center ${zoom > 1 ? 'cursor-grab' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          }}
        >
          {/* Human Body SVG */}
          <svg viewBox="0 0 200 500" className="h-full w-auto max-w-full" style={{ height: size === 'lg' ? '500px' : size === 'md' ? '400px' : '300px' }}>
            <defs>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
              </linearGradient>
              
              <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.25" />
              </linearGradient>

              <radialGradient id="organGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
              </radialGradient>

              <filter id="bodyGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="criticalGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feFlood floodColor="#ef4444" floodOpacity="0.9" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="warningGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feFlood floodColor="#eab308" floodOpacity="0.7" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="normalGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feFlood floodColor="#22c55e" floodOpacity="0.5" />
                <feComposite in2="blur" operator="in" />
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Scanning line effect */}
            <motion.line
              x1="30"
              x2="170"
              stroke="url(#bodyGradient)"
              strokeWidth="2"
              opacity="0.5"
              initial={{ y1: 10, y2: 10 }}
              animate={{ y1: [10, 490, 10], y2: [10, 490, 10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* ===== HEAD ===== */}
            <g filter="url(#bodyGlow)">
              <ellipse
                cx="100" cy="40" rx="30" ry="38"
                fill={getPartColor("head").fill}
                stroke={getPartColor("head").stroke}
                strokeWidth="1.5"
                filter={getPartColor("head").filter}
              />
              {/* Face details */}
              <ellipse cx="86" cy="35" rx="5" ry="3" fill="none" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />
              <ellipse cx="114" cy="35" rx="5" ry="3" fill="none" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />
              <circle cx="86" cy="35" r="2" fill="#22d3ee" opacity="0.4" />
              <circle cx="114" cy="35" r="2" fill="#22d3ee" opacity="0.4" />
              <ellipse cx="100" cy="42" rx="3" ry="2" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.4" />
              <path d="M92 52 Q100 58 108 52" fill="none" stroke="#22d3ee" strokeWidth="0.8" opacity="0.5" />
              
              {/* Brain visible through head */}
              <path
                d="M75 28 Q72 18 82 12 Q100 5 118 12 Q128 18 125 28 Q130 38 120 45 Q100 52 80 45 Q70 38 75 28"
                fill={getPartColor("brain").fill}
                stroke={getPartColor("brain").stroke}
                strokeWidth="0.8"
                opacity="0.5"
                filter={getPartColor("brain").filter}
              />
              {/* Brain folds */}
              <path d="M82 20 Q90 25 98 20" fill="none" stroke="#22d3ee" strokeWidth="0.3" opacity="0.4" />
              <path d="M102 20 Q110 25 118 20" fill="none" stroke="#22d3ee" strokeWidth="0.3" opacity="0.4" />
              <path d="M85 30 Q95 35 105 30" fill="none" stroke="#22d3ee" strokeWidth="0.3" opacity="0.4" />
            </g>

            {/* Ears */}
            <ellipse cx="68" cy="40" rx="5" ry="10" fill="url(#skinGradient)" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />
            <ellipse cx="132" cy="40" rx="5" ry="10" fill="url(#skinGradient)" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6" />

            {/* ===== NECK ===== */}
            <path
              d="M88 75 L88 95 Q88 100 92 100 L108 100 Q112 100 112 95 L112 75"
              fill={getPartColor("neck").fill}
              stroke={getPartColor("neck").stroke}
              strokeWidth="1"
              filter={getPartColor("neck").filter}
            />
            {/* Neck muscles/veins */}
            <line x1="92" y1="78" x2="92" y2="95" stroke="#22d3ee" strokeWidth="0.3" opacity="0.4" />
            <line x1="108" y1="78" x2="108" y2="95" stroke="#22d3ee" strokeWidth="0.3" opacity="0.4" />

            {/* ===== TORSO ===== */}
            <path
              d="M70 100 
                 L50 108 
                 L45 180 
                 Q45 200 55 220
                 L60 260
                 Q65 280 85 285
                 L100 288
                 L115 285
                 Q135 280 140 260
                 L145 220
                 Q155 200 155 180
                 L150 108
                 L130 100
                 Q115 105 100 108
                 Q85 105 70 100"
              fill={getPartColor("chest").fill}
              stroke={getPartColor("chest").stroke}
              strokeWidth="1.5"
              filter={getPartColor("chest").filter}
            />

            {/* Rib cage outline */}
            <g opacity="0.3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <path
                  key={i}
                  d={`M60 ${115 + i * 12} Q80 ${120 + i * 12} 100 ${118 + i * 12} Q120 ${120 + i * 12} 140 ${115 + i * 12}`}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="0.5"
                />
              ))}
            </g>

            {/* ===== INTERNAL ORGANS ===== */}
            
            {/* Left Lung */}
            <path
              d="M55 112 
                 Q48 115 48 135 
                 L50 175 
                 Q52 185 62 185 
                 Q78 183 82 160
                 L82 135
                 Q82 115 70 112
                 Z"
              fill={getPartColor("lungs").fill}
              stroke={getPartColor("lungs").stroke}
              strokeWidth="1"
              filter={getPartColor("lungs").filter}
            />
            {/* Lung lobes */}
            <path d="M55 130 Q65 135 75 128" fill="none" stroke={getPartColor("lungs").stroke} strokeWidth="0.5" opacity="0.6" />
            <path d="M52 150 Q65 155 78 148" fill="none" stroke={getPartColor("lungs").stroke} strokeWidth="0.5" opacity="0.6" />
            <path d="M55 165 Q65 170 72 165" fill="none" stroke={getPartColor("lungs").stroke} strokeWidth="0.5" opacity="0.6" />
            
            {/* Right Lung */}
            <path
              d="M145 112 
                 Q152 115 152 135 
                 L150 175 
                 Q148 185 138 185 
                 Q122 183 118 160
                 L118 135
                 Q118 115 130 112
                 Z"
              fill={getPartColor("lungs").fill}
              stroke={getPartColor("lungs").stroke}
              strokeWidth="1"
              filter={getPartColor("lungs").filter}
            />
            <path d="M125 128 Q135 135 145 130" fill="none" stroke={getPartColor("lungs").stroke} strokeWidth="0.5" opacity="0.6" />
            <path d="M122 148 Q135 155 148 150" fill="none" stroke={getPartColor("lungs").stroke} strokeWidth="0.5" opacity="0.6" />
            <path d="M128 165 Q135 170 145 165" fill="none" stroke={getPartColor("lungs").stroke} strokeWidth="0.5" opacity="0.6" />

            {/* Heart */}
            <g filter={getPartColor("heart").filter || "url(#bodyGlow)"}>
              <path
                d="M88 128 
                   C75 122 70 135 70 145 
                   C70 165 88 180 88 180 
                   C88 180 106 165 106 145 
                   C106 135 101 122 88 128"
                fill={getPartColor("heart").fill}
                stroke={getPartColor("heart").stroke}
                strokeWidth="1.5"
              />
              {/* Heart chambers */}
              <line x1="88" y1="140" x2="88" y2="172" stroke={getPartColor("heart").stroke} strokeWidth="0.8" opacity="0.6" />
              <line x1="75" y1="150" x2="101" y2="150" stroke={getPartColor("heart").stroke} strokeWidth="0.8" opacity="0.6" />
              {/* Aorta */}
              <path d="M88 128 Q88 115 95 110 Q105 105 115 108" fill="none" stroke={getPartColor("heart").stroke} strokeWidth="1" opacity="0.7" />
              
              {/* Heartbeat animation */}
              <motion.circle
                cx="88"
                cy="150"
                r="8"
                fill="none"
                stroke={getPartColor("heart").stroke}
                strokeWidth="1"
                initial={{ r: 8, opacity: 0.8 }}
                animate={{ r: [8, 20, 8], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </g>

            {/* Liver */}
            <path
              d="M55 180 
                 Q48 188 52 200 
                 L68 215 
                 Q90 220 95 205
                 L92 185
                 Q88 178 75 178
                 Z"
              fill={getPartColor("liver").fill}
              stroke={getPartColor("liver").stroke}
              strokeWidth="1"
              filter={getPartColor("liver").filter}
            />
            {/* Liver texture */}
            <path d="M60 190 Q70 195 80 190" fill="none" stroke={getPartColor("liver").stroke} strokeWidth="0.3" opacity="0.5" />
            <path d="M55 200 Q68 208 82 200" fill="none" stroke={getPartColor("liver").stroke} strokeWidth="0.3" opacity="0.5" />

            {/* Stomach */}
            <path
              d="M105 178 
                 Q125 178 132 192 
                 Q138 210 125 225
                 L108 230
                 Q92 225 95 205
                 Q98 185 105 178"
              fill={getPartColor("stomach").fill}
              stroke={getPartColor("stomach").stroke}
              strokeWidth="1"
              filter={getPartColor("stomach").filter}
            />
            {/* Stomach folds */}
            <path d="M108 190 Q118 195 125 190" fill="none" stroke={getPartColor("stomach").stroke} strokeWidth="0.4" opacity="0.5" />
            <path d="M105 205 Q115 210 122 205" fill="none" stroke={getPartColor("stomach").stroke} strokeWidth="0.4" opacity="0.5" />

            {/* Kidneys */}
            <g filter={getPartColor("kidneys").filter}>
              <ellipse cx="62" cy="205" rx="10" ry="18" fill={getPartColor("kidneys").fill} stroke={getPartColor("kidneys").stroke} strokeWidth="1" />
              <path d="M58 200 Q62 205 58 210" fill="none" stroke={getPartColor("kidneys").stroke} strokeWidth="0.5" opacity="0.6" />
              
              <ellipse cx="138" cy="205" rx="10" ry="18" fill={getPartColor("kidneys").fill} stroke={getPartColor("kidneys").stroke} strokeWidth="1" />
              <path d="M142 200 Q138 205 142 210" fill="none" stroke={getPartColor("kidneys").stroke} strokeWidth="0.5" opacity="0.6" />
            </g>

            {/* Intestines */}
            <g filter={getPartColor("intestines").filter}>
              <path
                d="M72 225 
                   Q78 230 85 225 Q92 230 100 225 Q108 230 115 225 Q122 230 128 225
                   L130 240 
                   Q125 248 118 242 Q112 248 105 242 Q98 248 92 242 Q85 248 78 242 Q72 248 70 240 
                   Z"
                fill={getPartColor("intestines").fill}
                stroke={getPartColor("intestines").stroke}
                strokeWidth="0.8"
              />
              {/* Small intestine coils */}
              <path d="M78 248 Q85 255 92 248 Q100 255 108 248 Q115 255 122 248" fill="none" stroke={getPartColor("intestines").stroke} strokeWidth="0.5" opacity="0.6" />
              <path d="M80 255 Q88 262 95 255 Q102 262 110 255 Q118 262 120 255" fill="none" stroke={getPartColor("intestines").stroke} strokeWidth="0.5" opacity="0.6" />
            </g>

            {/* Bladder */}
            <ellipse
              cx="100" cy="265" rx="15" ry="12"
              fill={getPartColor("bladder").fill}
              stroke={getPartColor("bladder").stroke}
              strokeWidth="0.8"
              filter={getPartColor("bladder").filter}
            />

            {/* Spine */}
            <g opacity="0.4">
              {Array.from({ length: 15 }).map((_, i) => (
                <rect
                  key={i}
                  x="96" y={100 + i * 12} width="8" height="9" rx="2"
                  fill="none"
                  stroke={getPartColor("spine").stroke}
                  strokeWidth="0.6"
                />
              ))}
            </g>

            {/* ===== PELVIS ===== */}
            <path
              d="M60 265 
                 Q50 275 55 295 
                 L75 310
                 L100 315
                 L125 310
                 L145 295
                 Q150 275 140 265
                 Q130 268 100 270
                 Q70 268 60 265"
              fill={getPartColor("pelvis").fill}
              stroke={getPartColor("pelvis").stroke}
              strokeWidth="1"
              filter={getPartColor("pelvis").filter}
            />
            {/* Pelvis details */}
            <path d="M70 280 Q85 285 100 283 Q115 285 130 280" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.4" />

            {/* ===== ARMS ===== */}
            {/* Left Arm - Upper */}
            <path
              d="M48 108 Q40 108 38 120 L32 175"
              fill="none"
              stroke={getPartColor("left-arm").stroke}
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.25"
            />
            <path
              d="M48 108 Q40 108 38 120 L32 175"
              fill="none"
              stroke={getPartColor("left-arm").stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              filter={getPartColor("left-arm").filter}
            />
            {/* Left Arm - Lower */}
            <path
              d="M32 175 Q28 200 25 240"
              fill="none"
              stroke={getPartColor("left-arm").stroke}
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.25"
            />
            <path
              d="M32 175 Q28 200 25 240"
              fill="none"
              stroke={getPartColor("left-arm").stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            
            {/* Left Hand */}
            <ellipse
              cx="22" cy="258" rx="14" ry="20"
              fill={getPartColor("left-hand").fill}
              stroke={getPartColor("left-hand").stroke}
              strokeWidth="1"
              filter={getPartColor("left-hand").filter}
            />
            {/* Fingers */}
            <g opacity="0.6">
              <line x1="10" y1="250" x2="5" y2="238" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              <line x1="16" y1="246" x2="12" y2="232" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              <line x1="22" y1="244" x2="22" y2="228" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              <line x1="28" y1="246" x2="32" y2="232" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              <line x1="34" y1="252" x2="42" y2="242" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Right Arm - Upper */}
            <path
              d="M152 108 Q160 108 162 120 L168 175"
              fill="none"
              stroke={getPartColor("right-arm").stroke}
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.25"
            />
            <path
              d="M152 108 Q160 108 162 120 L168 175"
              fill="none"
              stroke={getPartColor("right-arm").stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              filter={getPartColor("right-arm").filter}
            />
            {/* Right Arm - Lower */}
            <path
              d="M168 175 Q172 200 175 240"
              fill="none"
              stroke={getPartColor("right-arm").stroke}
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.25"
            />
            <path
              d="M168 175 Q172 200 175 240"
              fill="none"
              stroke={getPartColor("right-arm").stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            
            {/* Right Hand */}
            <ellipse
              cx="178" cy="258" rx="14" ry="20"
              fill={getPartColor("right-hand").fill}
              stroke={getPartColor("right-hand").stroke}
              strokeWidth="1"
              filter={getPartColor("right-hand").filter}
            />
            {/* Fingers */}
            <g opacity="0.6">
              <line x1="190" y1="250" x2="195" y2="238" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              <line x1="184" y1="246" x2="188" y2="232" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              <line x1="178" y1="244" x2="178" y2="228" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              <line x1="172" y1="246" x2="168" y2="232" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
              <line x1="166" y1="252" x2="158" y2="242" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* ===== LEGS ===== */}
            {/* Left Leg - Thigh */}
            <path
              d="M75 310 Q68 340 68 380"
              fill="none"
              stroke={getPartColor("left-leg").stroke}
              strokeWidth="24"
              strokeLinecap="round"
              opacity="0.25"
            />
            <path
              d="M75 310 Q68 340 68 380"
              fill="none"
              stroke={getPartColor("left-leg").stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              filter={getPartColor("left-leg").filter}
            />
            
            {/* Left Knee */}
            <ellipse
              cx="68" cy="355" rx="14" ry="16"
              fill={getPartColor("left-knee").fill}
              stroke={getPartColor("left-knee").stroke}
              strokeWidth="1"
              filter={getPartColor("left-knee").filter}
            />
            <ellipse cx="68" cy="355" rx="6" ry="8" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.5" />
            
            {/* Left Leg - Calf */}
            <path
              d="M68 380 L65 450"
              fill="none"
              stroke={getPartColor("left-leg").stroke}
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.25"
            />
            <path
              d="M68 380 L65 450"
              fill="none"
              stroke={getPartColor("left-leg").stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            
            {/* Left Foot */}
            <ellipse
              cx="60" cy="470" rx="22" ry="14"
              fill={getPartColor("left-foot").fill}
              stroke={getPartColor("left-foot").stroke}
              strokeWidth="1"
              filter={getPartColor("left-foot").filter}
            />
            {/* Toes */}
            <g opacity="0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <circle key={i} cx={42 + i * 8} cy={480} r="3" fill="none" stroke="#22d3ee" strokeWidth="1" />
              ))}
            </g>

            {/* Right Leg - Thigh */}
            <path
              d="M125 310 Q132 340 132 380"
              fill="none"
              stroke={getPartColor("right-leg").stroke}
              strokeWidth="24"
              strokeLinecap="round"
              opacity="0.25"
            />
            <path
              d="M125 310 Q132 340 132 380"
              fill="none"
              stroke={getPartColor("right-leg").stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              filter={getPartColor("right-leg").filter}
            />
            
            {/* Right Knee */}
            <ellipse
              cx="132" cy="355" rx="14" ry="16"
              fill={getPartColor("right-knee").fill}
              stroke={getPartColor("right-knee").stroke}
              strokeWidth="1"
              filter={getPartColor("right-knee").filter}
            />
            <ellipse cx="132" cy="355" rx="6" ry="8" fill="none" stroke="#22d3ee" strokeWidth="0.5" opacity="0.5" />
            
            {/* Right Leg - Calf */}
            <path
              d="M132 380 L135 450"
              fill="none"
              stroke={getPartColor("right-leg").stroke}
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.25"
            />
            <path
              d="M132 380 L135 450"
              fill="none"
              stroke={getPartColor("right-leg").stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            
            {/* Right Foot */}
            <ellipse
              cx="140" cy="470" rx="22" ry="14"
              fill={getPartColor("right-foot").fill}
              stroke={getPartColor("right-foot").stroke}
              strokeWidth="1"
              filter={getPartColor("right-foot").filter}
            />
            {/* Toes */}
            <g opacity="0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <circle key={i} cx={122 + i * 8} cy={480} r="3" fill="none" stroke="#22d3ee" strokeWidth="1" />
              ))}
            </g>

            {/* ===== REGION MARKERS ===== */}
            {regions.map((region) => {
              const position = regionPositions[region.regiao]
              if (!position) return null
              
              const colors = getSeverityColor(region.severidade)
              const isHovered = hoveredRegion === region.regiao
              
              return (
                <g
                  key={region.id}
                  style={{ cursor: interactive ? "pointer" : "default" }}
                  onClick={() => interactive && handleRegionClick(region)}
                  onMouseEnter={() => setHoveredRegion(region.regiao)}
                  onMouseLeave={() => setHoveredRegion(null)}
                >
                  {/* Pulsing outer ring */}
                  <motion.circle
                    cx={position.x}
                    cy={position.y}
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth="2"
                    initial={{ r: 8, opacity: 0.8 }}
                    animate={{ 
                      r: [8, 18, 8], 
                      opacity: [0.8, 0, 0.8] 
                    }}
                    transition={{ 
                      duration: region.severidade === "CRITICAL" ? 0.8 : 1.5, 
                      repeat: Infinity 
                    }}
                  />
                  
                  {/* Main marker */}
                  <motion.circle
                    cx={position.x}
                    cy={position.y}
                    r={isHovered ? 10 : 7}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth="2"
                    filter={region.severidade === "CRITICAL" ? "url(#criticalGlow)" : 
                            region.severidade === "WARNING" ? "url(#warningGlow)" : "url(#normalGlow)"}
                    animate={{
                      scale: region.severidade === "CRITICAL" ? [1, 1.2, 1] : [1, 1.1, 1]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  
                  {/* Inner dot */}
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="3"
                    fill="white"
                    opacity="0.8"
                  />

                  {/* Tooltip on hover */}
                  {isHovered && (
                    <g>
                      <rect
                        x={position.x + 15}
                        y={position.y - 25}
                        width={Math.max(regionLabels[region.regiao]?.length * 7 || 80, region.condicao.length * 5.5)}
                        height="45"
                        rx="4"
                        fill="rgba(0,0,0,0.9)"
                        stroke={colors.stroke}
                        strokeWidth="1"
                      />
                      <text
                        x={position.x + 20}
                        y={position.y - 8}
                        fill={colors.fill}
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {regionLabels[region.regiao] || region.regiao}
                      </text>
                      <text
                        x={position.x + 20}
                        y={position.y + 8}
                        fill="white"
                        fontSize="8"
                      >
                        {region.condicao}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-cyan-500/10">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
          <span className="text-xs text-muted-foreground">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50" />
          <span className="text-xs text-muted-foreground">Atencao</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
          <span className="text-xs text-muted-foreground">Critico</span>
        </div>
      </div>
    </div>
  )
}
