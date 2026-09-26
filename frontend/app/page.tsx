"use client"
import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleCheck,
  Cpu,
  Database,
  Eye,
  Fingerprint,
  Globe2,
  KeyRound,
  LockKeyhole,
  Menu,
  Network,
  Radar,
  ScanSearch,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from "lucide-react"
import * as THREE from "three"
import { ThemeToggle } from "@/components/theme-toggle"
const ease = [0.16, 1, 0.3, 1] as const
const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
}
const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}
const features = [
  {
    icon: ScanSearch,
    title: "Input & Discovery",
    description:
      "Scan GitHub repositories, commits, ZIP and container artifacts, and live domains to discover cryptographic assets across the enterprise.",
  },
  {
    icon: Radar,
    title: "8-Tier Hybrid Discovery",
    description:
      "Combine AST parsing, dependency analysis, binary and container inspection, HSM/KMS discovery, identity audits, eBPF runtime tracing, and SSRF-defended OSINT probing.",
  },
  {
    icon: Cpu,
    title: "AI Evidence Fusion",
    description:
      "LangGraph agents correlate and normalize evidence, manage contradictions, score confidence, suppress false positives, and reach a sovereign consensus without moving sensitive code off-premises.",
  },
  {
    icon: Database,
    title: "CycloneDX 1.7 CBOM",
    description:
      "Generate a standardized cryptographic inventory with algorithms, libraries, keys, certificates, dependencies, vulnerability metadata, and discovery provenance.",
  },
  {
    icon: Network,
    title: "Neo4j Crypto Digital Twin",
    description:
      "Map applications, services, APIs, libraries, algorithms, certificates, data, infrastructure, and external dependencies to analyze blast radius, centrality, attack paths, and quantum-risk propagation.",
  },
  {
    icon: Radar,
    title: "Mosca Risk & HNDL",
    description:
      "Use data shelf life, migration time, and threat horizon to identify immediate risk where D + T exceeds Q, including Harvest Now, Decrypt Later exposure.",
  },
  {
    icon: ShieldCheck,
    title: "Cryptographic Health Score",
    description:
      "Calculate a 0–100 SecOps health score from algorithm weakness, severity, graph centrality, blast radius, temporal urgency, and asset criticality.",
  },
  {
    icon: Fingerprint,
    title: "7D Crypto Agility",
    description:
      "Measure migration complexity across API coupling, dependency depth, performance, hardware constraints, backward compatibility, FIPS compliance, and refactoring effort.",
  },
  {
    icon: KeyRound,
    title: "NIST PQC Mapping",
    description:
      "Map vulnerable algorithms to FIPS 203 ML-KEM, FIPS 204 ML-DSA, and FIPS 205 SLH-DSA with hybrid, compatibility-aware migration priorities.",
  },
  {
    icon: Terminal,
    title: "Automated Remediation",
    description:
      "Move from vulnerable crypto to a PQC recommendation, code and configuration changes, validation, and GitHub or GitLab auto-PR delivery.",
  },
  {
    icon: LockKeyhole,
    title: "Customer-First Prioritization",
    description:
      "Prioritize remediation using customer exposure, sensitive data, business criticality, blast radius, quantum vulnerability, migration difficulty, and HNDL risk.",
  },
  {
    icon: Shield,
    title: "CI/CD Crypto Security Gate",
    description:
      "Generate SARIF 2.1.0 findings for GitHub, GitLab, and CI/CD pipelines, then block builds when new cryptographic violations are introduced.",
  },
  {
    icon: Eye,
    title: "Blockchain & Merkle Verification",
    description:
      "Validate cryptographic asset integrity through SHA-256 hashing, Merkle tree construction, digital signatures, and blockchain anchoring on the Sepolia testnet. Compare computed and on-chain Merkle roots, verify CBOM authenticity, and maintain tamper-evident records with transaction-level and IPFS proof for transparent, auditable verification.",
  },
  {
    icon: Eye,
    title: "Actionable Security Dashboards",
    description:
      "Expose health, risk trends, critical assets, AI evidence, CBOM inventory, Digital Twin paths, PQC migration, remediation, and compliance status in one workflow.",
  },

]
const workflow = [
  {
    number: "01",
    icon: ScanSearch,
    title: "Discover",
    text: "Scan enterprise infrastructure and identify cryptographic artifacts.",
  },
  {
    number: "02",
    icon: Fingerprint,
    title: "Verify",
    text: "Normalize, deduplicate, enrich, and fuse evidence with confidence and contradiction management.",
  },
  {
    number: "03",
    icon: Network,
    title: "Map",
    text: "Generate a CycloneDX CBOM and connect the ecosystem in the Neo4j Crypto Digital Twin.",
  },
  {
    number: "04",
    icon: Radar,
    title: "Quantify",
    text: "Calculate blast radius, Mosca/HNDL risk, health score, and cryptographic agility.",
  },
  {
    number: "05",
    icon: Fingerprint,
    title: "Prioritize",
    text: "Rank customer-facing, sensitive, critical, and difficult-to-migrate assets first.",
  },
  {
    number: "06",
    icon: KeyRound,
    title: "Migrate",
    text: "Map legacy algorithms to NIST PQC alternatives and generate compatibility-aware fixes.",
  },
  {
    number: "07",
    icon: Terminal,
    title: "Remediate",
    text: "Validate code, configuration, and dependency changes before opening an auto-PR.",
  },
  {
    number: "08",
    icon: ShieldCheck,
    title: "Enforce",
    text: "Publish SARIF findings and block new cryptographic risk in GitHub, GitLab, and CI/CD.",
  },
]
const capabilities = [
  "GitHub repository and commit scanning",
  "ZIP, Docker, and OCI artifact inspection",
  "Live domain TLS, certificate, and cipher discovery",
  "Source AST and dependency/SCA analysis",
  "Binary, HSM/KMS, identity, and eBPF runtime discovery",
  "SSRF-defended OSINT probing",
  "LangGraph multi-agent evidence routing",
  "False-positive suppression and confidence scoring",
  "CycloneDX 1.7 CBOM export",
  "Neo4j graph traversal and blast-radius analysis",
  "Mosca model and HNDL detection",
  "7D agility and NIST PQC mapping",
  "Auto-remediation, auto-PR, SARIF, and CI/CD gates",
]
const securityItems = [
  {
    icon: LockKeyhole,
    title: "Security-first architecture",
    text: "Designed around visibility, controlled access, auditable discovery, and structured cryptographic intelligence.",
  },
  {
    icon: KeyRound,
    title: "Cryptographic visibility",
    text: "Move from unknown cryptographic dependencies to an inventory you can understand and manage.",
  },
  {
    icon: Eye,
    title: "Actionable intelligence",
    text: "Turn raw discovery results into prioritized information for engineering and security teams.",
  },
]
function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="mx-auto max-w-3xl text-center"
    >
      <div className="mb-4 inline-flex items-center gap-2 border border-white/10 bg-white/[0.025] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-slate-400">
        <Sparkles className="h-3 w-3" />
        {eyebrow}
      </div>
      <h2 className="text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-7 text-slate-500 sm:text-lg">
        {description}
      </p>
    </motion.div>
  )
}
function BackgroundGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, black 10%, transparent 72%)",
        }}
      />
      <div className="absolute left-1/2 top-[-360px] h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[120px]" />
    </div>
  )
}
function FloatingParticles() {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${(index * 37) % 100}%`,
        top: `${(index * 61) % 100}%`,
        delay: (index % 8) * 0.28,
        duration: 4 + (index % 5),
        size: index % 4 === 0 ? 2 : 1,
      })),
    []
  )
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-white/50"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            opacity: [0.08, 0.5, 0.08],
            y: [0, -16, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
function CryptoSphere3D() {
  const mountRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) {
      return
    }
    let renderer: THREE.WebGLRenderer | null = null
    let animationFrame = 0
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      36,
      Math.max(mount.clientWidth, 1) / Math.max(mount.clientHeight, 1),
      0.1,
      100
    )
    camera.position.set(0, 0.7, 8.6)
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)
    const root = new THREE.Group()
    scene.add(root)
    const sphereGroup = new THREE.Group()
    sphereGroup.rotation.x = -0.12
    root.add(sphereGroup)
    const sphereGeometry = new THREE.SphereGeometry(2.35, 48, 32)
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    })
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphereGroup.add(sphere)
    const ribbonMaterials = [
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.28,
      }),
      new THREE.LineBasicMaterial({
        color: 0xbdbdbd,
        transparent: true,
        opacity: 0.22,
      }),
      new THREE.LineBasicMaterial({
        color: 0x8f8f8f,
        transparent: true,
        opacity: 0.18,
      }),
    ]
    const ribbonCount = 34
    for (let band = 0; band < ribbonCount; band += 1) {
      const points: THREE.Vector3[] = []
      const phase = (band / ribbonCount) * Math.PI * 2
      const tilt = ((band % 5) - 2) * 0.035
      for (let i = 0; i <= 220; i += 1) {
        const t = (i / 220) * Math.PI * 2
        const latitude =
          Math.sin(t * 2 + phase) * 0.16 +
          Math.cos(t * 3 - phase) * 0.06
        const radius = 2.32 + Math.sin(t * 5 + phase) * 0.035
        const horizontal = Math.cos(latitude)
        const x =
          radius *
          horizontal *
          Math.cos(t + phase * 0.06) *
          (1 + Math.sin(t * 2 + phase) * 0.045)
        const y =
          radius * Math.sin(latitude) +
          Math.sin(t * 4 + phase) * 0.08 +
          tilt
        const z =
          radius *
          horizontal *
          Math.sin(t + phase * 0.06) *
          (1 + Math.cos(t * 3 + phase) * 0.035)
        points.push(new THREE.Vector3(x, y, z))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(
        geometry,
        ribbonMaterials[band % ribbonMaterials.length]
      )
      line.rotation.y = (band % 7) * 0.11
      line.rotation.z = (band % 4) * 0.08
      sphereGroup.add(line)
    }
    const arcMaterials = [
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.42,
      }),
      new THREE.LineBasicMaterial({
        color: 0xa8a8a8,
        transparent: true,
        opacity: 0.28,
      }),
    ]
    for (let arcIndex = 0; arcIndex < 9; arcIndex += 1) {
      const points: THREE.Vector3[] = []
      for (let i = 0; i <= 180; i += 1) {
        const t = (i / 180) * Math.PI * 2
        const radius = 2.38 + Math.sin(t * 4 + arcIndex) * 0.025
        const x = radius * Math.cos(t)
        const y =
          Math.sin(t * 2 + arcIndex * 0.7) *
          1.8 *
          Math.sin(t + 0.4)
        const z = radius * Math.sin(t)
        points.push(new THREE.Vector3(x, y, z))
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(
        geometry,
        arcMaterials[arcIndex % arcMaterials.length]
      )
      line.rotation.x = arcIndex * 0.23
      line.rotation.y = arcIndex * 0.17
      line.rotation.z = arcIndex * 0.09
      sphereGroup.add(line)
    }
    const shieldShape = new THREE.Shape()
    shieldShape.moveTo(0, 1.1)
    shieldShape.lineTo(0.92, 0.68)
    shieldShape.lineTo(0.78, -0.42)
    shieldShape.quadraticCurveTo(0.52, -1.05, 0, -1.28)
    shieldShape.quadraticCurveTo(-0.52, -1.05, -0.78, -0.42)
    shieldShape.lineTo(-0.92, 0.68)
    shieldShape.closePath()
    const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.06,
      bevelThickness: 0.05,
      curveSegments: 8,
    })
    shieldGeometry.center()
    const shieldMaterial = new THREE.MeshBasicMaterial({
      color: 0xe8e8e8,
      transparent: true,
      opacity: 0.82,
    })
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial)
    shield.scale.setScalar(0.64)
    shield.position.set(0, 0, 0.28)
    root.add(shield)
    const shieldInnerMaterial = new THREE.LineBasicMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.8,
    })
    const shieldEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(shieldGeometry),
      shieldInnerMaterial
    )
    shieldEdges.scale.copy(shield.scale)
    shieldEdges.position.copy(shield.position)
    root.add(shieldEdges)
    const nucleusGeometry = new THREE.IcosahedronGeometry(0.32, 2)
    const nucleusMaterial = new THREE.MeshBasicMaterial({
      color: 0x0a0a0a,
      transparent: true,
      opacity: 0.96,
      wireframe: true,
    })
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial)
    nucleus.position.set(0, 0, 0.52)
    root.add(nucleus)
    const keyLight = new THREE.PointLight(0xffffff, 2.4, 8)
    keyLight.position.set(0, 0.5, 2.8)
    scene.add(keyLight)
    const rimLight = new THREE.PointLight(0xdddddd, 1.2, 7)
    rimLight.position.set(-3, 1.5, -2)
    scene.add(rimLight)
    const platformGroup = new THREE.Group()
    platformGroup.position.y = -2.65
    root.add(platformGroup)
    const platformMaterials = [
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.22,
      }),
      new THREE.LineBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.16,
      }),
      new THREE.LineBasicMaterial({
        color: 0x555555,
        transparent: true,
        opacity: 0.18,
      }),
    ]
    const platformRadii = [2.1, 2.65, 3.15, 3.62, 4.05]
    platformRadii.forEach((radius, index) => {
      const geometry = new THREE.RingGeometry(
        radius - 0.008,
        radius + 0.008,
        160
      )
      const ring = new THREE.Mesh(
        geometry,
        platformMaterials[index % platformMaterials.length]
      )
      ring.rotation.x = -Math.PI / 2
      platformGroup.add(ring)
    })
    for (let ringIndex = 0; ringIndex < 7; ringIndex += 1) {
      const radius = 2.35 + ringIndex * 0.29
      const points: THREE.Vector3[] = []
      for (let i = 0; i <= 120; i += 1) {
        const t = (i / 120) * Math.PI * 1.18
        points.push(
          new THREE.Vector3(
            Math.cos(t) * radius,
            0,
            Math.sin(t) * radius
          )
        )
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const arc = new THREE.Line(
        geometry,
        platformMaterials[(ringIndex + 1) % platformMaterials.length]
      )
      arc.rotation.y = ringIndex * 0.6
      platformGroup.add(arc)
    }
    const telemetryGroup = new THREE.Group()
    root.add(telemetryGroup)
    for (let i = 0; i < 72; i += 1) {
      const angle = (i / 72) * Math.PI * 2
      const radius = 2.5 + (i % 8) * 0.2
      const height = 0.15 + (i % 9) * 0.13
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const points = [
        new THREE.Vector3(x, -2.6, z),
        new THREE.Vector3(x, -2.6 + height, z),
      ]
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const material = new THREE.LineBasicMaterial({
        color: i % 5 === 0 ? 0xffffff : 0x777777,
        transparent: true,
        opacity: i % 5 === 0 ? 0.42 : 0.18,
      })
      telemetryGroup.add(new THREE.Line(geometry, material))
      if (i % 5 === 0) {
        const nodeGeometry = new THREE.SphereGeometry(0.025, 8, 8)
        const nodeMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
        })
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial)
        node.position.set(x, -2.6 + height, z)
        telemetryGroup.add(node)
      }
    }
    const particleCount = 900
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i += 1) {
      const index = i * 3
      const radius = 5.5 + Math.random() * 5.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      particlePositions[index] =
        Math.sin(phi) * Math.cos(theta) * radius
      particlePositions[index + 1] =
        Math.cos(phi) * radius * 0.62
      particlePositions[index + 2] =
        Math.sin(phi) * Math.sin(theta) * radius
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    )
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.012,
      transparent: true,
      opacity: 0.38,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(
      particleGeometry,
      particleMaterial
    )
    scene.add(particles)
    const floorGeometry = new THREE.CircleGeometry(4.6, 96)
    const floorMaterial = new THREE.MeshBasicMaterial({
      color: 0x050505,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -2.72
    root.add(floor)
    const clock = new THREE.Clock()
    const render = () => {
      const elapsed = clock.getElapsedTime()
      sphereGroup.rotation.y = elapsed * 0.055
      sphereGroup.rotation.x =
        -0.12 + Math.sin(elapsed * 0.18) * 0.035
      shield.rotation.y = Math.sin(elapsed * 0.32) * 0.09
      shield.rotation.x = Math.sin(elapsed * 0.24) * 0.045
      shieldEdges.rotation.copy(shield.rotation)
      nucleus.rotation.x = elapsed * 0.24
      nucleus.rotation.y = elapsed * 0.38
      nucleus.scale.setScalar(
        1 + Math.sin(elapsed * 1.7) * 0.04
      )
      platformGroup.rotation.y = -elapsed * 0.018
      telemetryGroup.rotation.y = elapsed * 0.018
      particles.rotation.y = elapsed * 0.006
      const pulse =
        1.7 + Math.sin(elapsed * 1.35) * 0.35
      keyLight.intensity = pulse
      renderer?.render(scene, camera)
      animationFrame = window.requestAnimationFrame(render)
    }
    render()
    const handleResize = () => {
      if (!renderer || !mount) {
        return
      }
      const width = Math.max(mount.clientWidth, 1)
      const height = Math.max(mount.clientHeight, 1)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
      )
    }
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(mount)
    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        if (mesh.geometry) {
          mesh.geometry.dispose()
        }
        if (mesh.material) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material]
          materials.forEach((material) => material.dispose())
        }
      })
      renderer?.dispose()
      if (renderer?.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])
  return (
    <div
      ref={mountRef}
      className="relative h-[540px] w-full"
      aria-label="Three-dimensional QShieldX cryptographic security core"
    >
      <div className="absolute inset-x-12 bottom-12 h-24 rounded-full bg-white/[0.025] blur-3xl" />
    </div>
  )
}
function CryptoTelemetryCard({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType
  label: string
  value: string
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: [0.62, 1, 0.62], y: [0, -5, 0] }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute z-20 border border-white/10 bg-black/70 px-3 py-2.5 backdrop-blur-xl ${className ?? ""}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/[0.035]">
          <Icon className="h-3.5 w-3.5 text-slate-300" />
        </div>
        <div>
          <div className="text-[8px] uppercase tracking-[0.2em] text-slate-600">
            {label}
          </div>
          <div className="mt-0.5 text-[11px] font-medium text-slate-200">
            {value}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
function Navbar() {
  const [open, setOpen] = React.useState(false)
  return (
    <header className="relative z-50 border-b border-white/[0.06] bg-black/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center border border-white/15 bg-white/[0.03]">
            <div className="absolute inset-1.5 border border-white/10" />
            <Shield className="relative h-[17px] w-[17px] text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.18em] text-white">
              QSHIELD<span className="text-slate-500">X</span>
            </div>
            <div className="text-[8px] uppercase tracking-[0.3em] text-slate-600">
              Cryptographic Intelligence
            </div>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#platform"
            className="text-xs uppercase tracking-[0.12em] text-slate-500 transition hover:text-white"
          >
            Platform
          </a>
          <a
            href="#workflow"
            className="text-xs uppercase tracking-[0.12em] text-slate-500 transition hover:text-white"
          >
            Workflow
          </a>
          <a
            href="#capabilities"
            className="text-xs uppercase tracking-[0.12em] text-slate-500 transition hover:text-white"
          >
            Capabilities
          </a>
          <a
            href="#security"
            className="text-xs uppercase tracking-[0.12em] text-slate-500 transition hover:text-white"
          >
            Security
          </a>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-slate-400 transition hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 border border-white/20 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-black transition hover:bg-slate-200"
          >
            Get started
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="border border-white/10 p-2 text-slate-300 md:hidden"
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/[0.06] bg-black px-5 py-5 md:hidden">
          <div className="flex flex-col gap-1">
            {[
              ["#platform", "Platform"],
              ["#workflow", "Workflow"],
              ["#capabilities", "Capabilities"],
              ["#security", "Security"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-xs uppercase tracking-[0.12em] text-slate-400 hover:text-white"
              >
                {label}
              </a>
            ))}
            <div className="mt-3 flex gap-2 border-t border-white/[0.06] pt-4">
              <Link
                href="/login"
                className="flex-1 border border-white/10 px-4 py-3 text-center text-xs uppercase tracking-[0.1em] text-slate-300"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="flex-1 bg-white px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-black"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.05] bg-[#050505]">
      <BackgroundGrid />
      <FloatingParticles />
      <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-2 px-5 py-16 sm:px-8 lg:grid-cols-[0.93fr_1.07fr] lg:px-10 lg:py-20">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="relative z-30 max-w-2xl"
        >
          <motion.div variants={reveal}>
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.025] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.24em] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Enterprise Cryptographic Discovery
            </div>
          </motion.div>
          <motion.h1
            variants={reveal}
            className="mt-7 text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-white sm:text-6xl lg:text-[72px] xl:text-[82px]"
          >
            Discover
            <br />
            the cryptographic
            <br />
            <span className="text-slate-500">unknown.</span>
          </motion.h1>
          <motion.p
            variants={reveal}
            className="mt-7 max-w-xl text-base leading-7 text-slate-500 sm:text-lg"
          >
            QShieldX maps cryptographic assets across enterprise
            infrastructure, turns discovery into structured CBOM
            intelligence, and helps teams prepare for the post-quantum era.
          </motion.p>
          <motion.div
            variants={reveal}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-black transition hover:bg-slate-200"
            >
              Explore QShieldX
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#platform"
              className="inline-flex items-center justify-center gap-2 border border-white/10 bg-white/[0.02] px-5 py-3 text-xs font-medium uppercase tracking-[0.1em] text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              View platform
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>
          <motion.div
            variants={reveal}
            className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-[10px] uppercase tracking-[0.12em] text-slate-600"
          >
            <span className="flex items-center gap-2">
              <CircleCheck className="h-3.5 w-3.5 text-slate-400" />
              Asset discovery
            </span>
            <span className="flex items-center gap-2">
              <CircleCheck className="h-3.5 w-3.5 text-slate-400" />
              CBOM intelligence
            </span>
            <span className="flex items-center gap-2">
              <CircleCheck className="h-3.5 w-3.5 text-slate-400" />
              PQC readiness
            </span>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease }}
          className="relative z-20 -mx-4 sm:-mx-8 lg:mx-0"
        >
          <CryptoSphere3D />
          <CryptoTelemetryCard
            icon={LockKeyhole}
            label="TLS"
            value="Protected"
            className="left-[8%] top-[26%]"
          />
          <CryptoTelemetryCard
            icon={KeyRound}
            label="PQC"
            value="Assessment"
            className="right-[7%] top-[18%]"
          />
          <CryptoTelemetryCard
            icon={Database}
            label="CBOM"
            value="12.8K assets"
            className="bottom-[17%] left-[8%]"
          />
          <CryptoTelemetryCard
            icon={Radar}
            label="Risk engine"
            value="Analyzing"
            className="bottom-[13%] right-[6%]"
          />
        </motion.div>
      </div>
      <div className="relative mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 border border-white/[0.07] bg-black/50 sm:grid-cols-4">
          {[
            ["12.8K+", "Crypto assets"],
            ["42", "Algorithms"],
            ["3.4K+", "Certificates"],
            ["186", "Risk signals"],
          ].map(([value, label], index) => (
            <div
              key={label}
              className={`px-5 py-5 sm:px-6 ${
                index !== 0 ? "border-l border-white/[0.07]" : ""
              }`}
            >
              <div className="text-2xl font-semibold tracking-tight text-white">
                {value}
              </div>
              <div className="mt-1 text-[9px] uppercase tracking-[0.18em] text-slate-600">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
function PlatformPreview() {
  return (
    <section id="platform" className="relative border-b border-white/[0.05] py-24">
      <BackgroundGrid />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="The platform"
          title="A command layer for cryptographic visibility."
          description="Bring discovery, inventory, analysis, and readiness signals into one security workflow."
        />
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.8, ease }}
          className="mt-14 overflow-hidden border border-white/[0.08] bg-[#080808]"
        >
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-white/50" />
              <div className="h-2 w-2 rounded-full bg-white/20" />
              <div className="h-2 w-2 rounded-full bg-white/10" />
              <span className="ml-3 text-[9px] uppercase tracking-[0.16em] text-slate-600">
                qshieldx / cryptographic intelligence
              </span>
            </div>
            <div className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-slate-600 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
              Live analysis
            </div>
          </div>
          <div className="grid lg:grid-cols-[210px_1fr]">
            <aside className="hidden border-r border-white/[0.06] p-4 lg:block">
              <div className="mb-6 flex items-center gap-2 px-2">
                <div className="flex h-7 w-7 items-center justify-center border border-white/10 bg-white/[0.035]">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-slate-200">
                  QShieldX
                </span>
              </div>
              <div className="space-y-1">
                {[
                  ["Overview", true],
                  ["Cryptographic Assets", false],
                  ["CBOM", false],
                  ["Quantum Risk", false],
                  ["Targets", false],
                ].map(([name, active]) => (
                  <div
                    key={String(name)}
                    className={`px-3 py-2 text-[10px] ${
                      active
                        ? "border border-white/10 bg-white/[0.06] text-white"
                        : "text-slate-600"
                    }`}
                  >
                    {name}
                  </div>
                ))}
              </div>
            </aside>
            <div className="p-5 sm:p-7">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-slate-600">
                    Enterprise overview
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    Cryptographic posture
                  </h3>
                </div>
                <div className="inline-flex w-fit items-center gap-2 border border-white/10 bg-white/[0.025] px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                  Scan healthy
                </div>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Assets discovered", "12,842", "+18.4%"],
                  ["Certificates", "3,421", "+8.2%"],
                  ["Quantum exposed", "186", "-4.6%"],
                  ["PQC ready", "61%", "+11.8%"],
                ].map(([label, value, change]) => (
                  <div
                    key={label}
                    className="border border-white/[0.07] bg-white/[0.02] p-4"
                  >
                    <div className="text-[10px] text-slate-600">{label}</div>
                    <div className="mt-2 flex items-end justify-between gap-2">
                      <span className="text-2xl font-semibold text-white">
                        {value}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_.8fr]">
                <div className="border border-white/[0.07] bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-600">
                        Discovery activity
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-300">
                        Cryptographic assets over time
                      </p>
                    </div>
                    <Globe2 className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="mt-8 flex h-40 items-end gap-2">
                    {[36, 52, 44, 66, 58, 78, 68, 86, 73, 92, 80, 96].map(
                      (height, index) => (
                        <motion.div
                          key={index}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.7,
                            delay: index * 0.035,
                            ease,
                          }}
                          className="flex-1 rounded-t-[1px] bg-white/25"
                        />
                      )
                    )}
                  </div>
                </div>
                <div className="border border-white/[0.07] bg-white/[0.02] p-5">
                  <p className="text-[10px] text-slate-600">
                    Risk distribution
                  </p>
                  <div className="mt-5 flex items-center justify-center">
                    <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-white/10 border-r-white/40 border-t-white/60">
                      <div className="text-center">
                        <div className="text-3xl font-semibold text-white">
                          186
                        </div>
                        <div className="text-[8px] uppercase tracking-[0.15em] text-slate-600">
                          signals
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2 text-[10px]">
                    {[
                      ["Low", "58%"],
                      ["Medium", "27%"],
                      ["High", "15%"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between text-slate-500"
                      >
                        <span>{label}</span>
                        <span className="text-slate-300">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
function FeatureGrid() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Core capabilities"
          title="From discovery to readiness."
          description="Build a living picture of where cryptography exists, what it depends on, and where migration effort is needed."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-14 grid gap-px border border-white/[0.07] bg-white/[0.07] md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={reveal}
                className="group relative bg-[#080808] p-6 transition duration-500 hover:bg-white/[0.035]"
              >
                <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.025]">
                  <Icon className="h-4.5 w-4.5 text-slate-300" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
                <div className="mt-5 flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-500 opacity-0 transition group-hover:opacity-100">
                  Explore capability
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
function Workflow() {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden border-y border-white/[0.05] bg-white/[0.012] py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <SectionHeading
            eyebrow="Workflow"
            title="One continuous cryptographic intelligence loop."
            description="Connect discovery and analysis so teams can move from scattered cryptographic evidence to an organized readiness program."
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="relative"
          >
            <div className="absolute bottom-8 left-[27px] top-8 hidden w-px bg-gradient-to-b from-white/30 via-white/10 to-transparent sm:block" />
            <div className="space-y-5">
              {workflow.map((item) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.number}
                    variants={reveal}
                    className="relative grid gap-4 border border-white/[0.07] bg-black/50 p-5 sm:grid-cols-[56px_1fr] sm:items-center"
                  >
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center border border-white/10 bg-black text-slate-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-600">
                        Step {item.number}
                      </div>
                      <h3 className="mt-1 text-base font-semibold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
function Capabilities() {
  return (
    <section id="capabilities" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="border border-white/[0.07] bg-[#080808]">
          <div className="grid lg:grid-cols-[.9fr_1.1fr]">
            <div className="border-b border-white/[0.06] p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
              <div className="flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.025]">
                <Cpu className="h-5 w-5 text-slate-300" />
              </div>
              <h2 className="mt-7 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Built for the cryptographic layer of modern infrastructure.
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-600">
                Cryptography is distributed across applications, networks,
                certificates, services, libraries, devices, and operational
                tooling. QShieldX turns that distributed footprint into
                structured security intelligence.
              </p>
              <Link
                href="/register"
                className="group mt-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white"
              >
                Start exploring
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="p-8 sm:p-10 lg:p-14">
              <div className="grid gap-px border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2">
                {capabilities.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.045,
                      ease,
                    }}
                    className="flex items-start gap-3 bg-[#080808] p-4"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-white/10">
                      <Check className="h-3 w-3 text-slate-300" />
                    </div>
                    <span className="text-sm leading-5 text-slate-400">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
function SecuritySection() {
  return (
    <section id="security" className="relative border-t border-white/[0.05] py-24">
      <BackgroundGrid />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Security by design"
          title="Make cryptographic risk visible."
          description="A strong security posture starts with knowing where cryptography is used, how it is connected, and what needs attention."
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="mt-14 grid gap-px border border-white/[0.07] bg-white/[0.07] md:grid-cols-3"
        >
          {securityItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                variants={reveal}
                className="bg-[#080808] p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.025]">
                  <Icon className="h-4.5 w-4.5 text-slate-300" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="mt-6 border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8"
        >
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/10">
                <ShieldCheck className="h-4 w-4 text-slate-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Cryptographic visibility is a security control.
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                  Identify what exists before deciding what needs to change.
                  QShieldX provides the inventory and intelligence layer for
                  that process.
                </p>
              </div>
            </div>
            <Link
              href="/register"
              className="inline-flex shrink-0 items-center justify-center gap-2 border border-white/15 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300 transition hover:bg-white hover:text-black"
            >
              Explore
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.05] py-24">
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[120px]" />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-white/15 bg-white/[0.03]">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-7 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Know what exists.
            <br />
            Prepare for what&apos;s next.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Start with discovery. Understand your cryptographic footprint.
            Build the intelligence needed for a practical post-quantum
            readiness program.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-black transition hover:bg-slate-200"
            >
              Get started with QShieldX
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 border border-white/10 bg-white/[0.02] px-5 py-3 text-xs font-medium uppercase tracking-[0.1em] text-slate-400 transition hover:text-white"
            >
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-white/15 bg-white/[0.03]">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold tracking-[0.16em] text-white">
                QSHIELD<span className="text-slate-500">X</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-xs leading-5 text-slate-700">
              Enterprise cryptographic discovery, CBOM intelligence, and
              post-quantum readiness.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.12em] text-slate-600">
            <a href="#platform" className="hover:text-white">
              Platform
            </a>
            <a href="#workflow" className="hover:text-white">
              Workflow
            </a>
            <a href="#capabilities" className="hover:text-white">
              Capabilities
            </a>
            <a href="#security" className="hover:text-white">
              Security
            </a>
            <Link href="/login" className="hover:text-white">
              Sign in
            </Link>
          </div>
          <div className="flex h-9 w-9 items-center justify-center border border-white/10 text-slate-600">
            <ShieldCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-8 border-t border-white/[0.05] pt-6 text-[10px] uppercase tracking-[0.1em] text-slate-700">
          © {new Date().getFullYear()} QShieldX. Cryptographic intelligence
          platform.
        </div>
      </div>
    </footer>
  )
}
export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const progress = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"]
  )
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white selection:bg-white/10 selection:text-white">
      <motion.div
        style={{ width: progress }}
        className="fixed left-0 top-0 z-[100] h-[1px] bg-white"
      />
      <Navbar />
      <Hero />
      <PlatformPreview />
      <FeatureGrid />
      <Workflow />
      <Capabilities />
      <SecuritySection />
      <CTA />
      <Footer />
    </main>
  )
}
