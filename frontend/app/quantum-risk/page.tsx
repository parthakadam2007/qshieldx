// "use client"

// import * as React from "react"

// import {
//   AlertTriangle,
//   ArrowRight,
//   CalendarClock,
//   CheckCircle2,
//   Database,
//   Network,
//   ShieldAlert,
//   ShieldCheck,
//   SlidersHorizontal,
//   Timer,
//   Zap,
// } from "lucide-react"

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// import { Badge } from "@/components/ui/badge"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs"

// import { useGlobalData } from "@/app/context/GlobalDataContext"
// import { useRouter } from "next/navigation"

// /* =========================================================
//    TYPES
// ========================================================= */

// type AnyRecord = Record<string, any>

// type MoscaAsset = {
//   id: string
//   risk: number | null
//   asset: string
//   family: string
//   status: string
//   criticality: string
//   recommended: string
//   migrationPriority: string
//   migrationWindow: string
//   qars: number | null
//   lifetimeYears: number | null
// }


// /* =========================================================
//    PAGE
// ========================================================= */

// export default function QuantumRiskPage() {
//   const { data, isLoading } = useGlobalData()
//   const router = useRouter()

//   React.useEffect(() => {
//     document.title = "Quantum Risk Assessment | QShieldX Dashboard"
//   }, [])


//   /* =======================================================
//      CURRENT YEAR
//   ======================================================= */

//   const currentYear = new Date().getFullYear()


//   /* =======================================================
//      MOSCA SCENARIO CONTROLS

//      X = data secrecy lifetime
//      Y = migration time
//      Z = quantum threat year

//      X comes from the real scan dataset.

//      Y and Z are interactive scenario parameters.
//      They are NOT claimed to be backend measurements.
//   ======================================================= */

//   const datasetX =
//     typeof data.scan?.shelfLifeYears === "number"
//       ? data.scan.shelfLifeYears
//       : 12

//   const [moscaX, setMoscaX] = React.useState(datasetX)

//   const [moscaY, setMoscaY] = React.useState(4)

//   const [moscaZ, setMoscaZ] = React.useState(currentYear + 4)


//   React.useEffect(() => {
//     if (typeof data.scan?.shelfLifeYears === "number") {
//       setMoscaX(data.scan.shelfLifeYears)
//     }
//   }, [data.scan?.shelfLifeYears])


//   /* =======================================================
//      MOSCA CALCULATION

//      Mosca condition:

//        X + Y > Z

//      In the UI we normalize Z to a number of years from
//      the current year.

//        threat horizon = Z - current year

//      This is a scenario calculation based on the
//      user-controlled X/Y/Z values.
//   ======================================================= */

//   const threatHorizonYears = Math.max(
//     0,
//     moscaZ - currentYear,
//   )

//   const exposureYears = moscaX + moscaY

//   const scenarioAtRisk =
//     exposureYears > threatHorizonYears


//   /* =======================================================
//      REAL QUANTUM RISK DATA
//   ======================================================= */

//   const quantumRisk = Array.isArray(data.quantumRisk)
//     ? data.quantumRisk
//     : []


//   const assets = Array.isArray(data.assets)
//     ? data.assets
//     : []


//   const certificates = Array.isArray(data.certificates)
//     ? data.certificates
//     : []


//   const algorithms = Array.isArray(data.algorithms)
//     ? data.algorithms
//     : []


//   /* =======================================================
//      BUILD ASSET TABLE

//      IMPORTANT:
//      We do not invent missing cryptographic information.

//      Family/recommendation comes from actual certificate /
//      algorithm evidence.
//   ======================================================= */

//   const moscaAssets: MoscaAsset[] = quantumRisk.map(
//     (item: AnyRecord, index: number) => {

//       const asset = assets.find(
//         (a: AnyRecord) =>
//           a.name === item.asset,
//       )

//       const certificate = certificates.find(
//         (c: AnyRecord) =>
//           c.cn === item.asset,
//       )


//       let family = ""
//       let recommended = ""


//       /* ---------------------------------------------------
//          RSA
//       --------------------------------------------------- */

//       if (
//         certificate?.signature_algorithm?.includes("RSA")
//       ) {
//         family = "RSA"

//         if (
//           certificate?.key_length === 4096
//         ) {
//           recommended = "ML-DSA 65 hybrid"
//         } else {
//           recommended = "ML-KEM 768 hybrid"
//         }
//       }


//       /* ---------------------------------------------------
//          ECDSA
//       --------------------------------------------------- */

//       if (
//         certificate?.signature_algorithm?.includes(
//           "ECDSA",
//         )
//       ) {
//         family = "ECC"
//         recommended = "ML-DSA 65"
//       }


//       /* ---------------------------------------------------
//          Ed25519
//       --------------------------------------------------- */

//       if (
//         certificate?.signature_algorithm?.includes(
//           "Ed25519",
//         )
//       ) {
//         family = "EdDSA"
//         recommended = "SLH-DSA"
//       }


//       return {
//         id: `${item.asset}-${index}`,

//         /*
//          * IMPORTANT:
//          * Mosca risk score, not QARS.
//          */
//         risk:
//           typeof item.mosca === "number"
//             ? item.mosca
//             : null,

//         asset: item.asset,

//         family,

//         status:
//           asset?.quantum_status ?? "",

//         criticality:
//           asset?.business_criticality ?? "",

//         recommended,

//         migrationPriority:
//           item.migrationPriority ?? "",

//         migrationWindow:
//           item.migrationWindow ?? "",

//         qars:
//           typeof item.qars === "number"
//             ? item.qars
//             : null,

//         lifetimeYears:
//           typeof asset?.lifetime_years === "number"
//             ? asset.lifetime_years
//             : null,
//       }
//     },
//   )


//   /* =======================================================
//      MOSCA ASSET TIMING ANALYSIS

//      For each asset:

//        asset lifetime + scenario migration time

//      compared with:

//        selected quantum-threat horizon

//      We use actual lifetime_years from the dataset.
//   ======================================================= */

//   const timingAssets = moscaAssets.map(
//     (item) => {

//       const lifetime =
//         item.lifetimeYears ?? moscaX

//       const requiredYears =
//         lifetime + moscaY

//       const atRisk =
//         requiredYears > threatHorizonYears

//       const withinMargin =
//         requiredYears <= threatHorizonYears &&
//         requiredYears >= threatHorizonYears - 2

//       return {
//         ...item,
//         lifetime,
//         requiredYears,
//         atRisk,
//         withinMargin,
//       }
//     },
//   )


//   const atRiskCount =
//     timingAssets.filter(
//       (item) => item.atRisk,
//     ).length


//   const withinMarginCount =
//     timingAssets.filter(
//       (item) => item.withinMargin,
//     ).length


//   const vulnerableCount =
//     timingAssets.filter(
//       (item) =>
//         item.status === "Vulnerable",
//     ).length


//   /* =======================================================
//      RISK MATRIX

//      Built from actual assets + quantumRisk records.
//   ======================================================= */

//    const assessedRiskByAsset = new Map(
//   quantumRisk.map((risk: AnyRecord) => [
//     risk.asset,
//     risk,
//   ]),
// )

// const allAssets = assets.map(
//   (asset: AnyRecord) => {

//     const risk = assessedRiskByAsset.get(
//       asset.name,
//     )

//     return {
//       ...asset,
//       quantumRisk: risk ?? null,

//       riskCategory:
//         risk?.riskCategory ?? null,

//       mosca:
//         typeof risk?.mosca === "number"
//           ? risk.mosca
//           : null,

//       qars:
//         typeof risk?.qars === "number"
//           ? risk.qars
//           : null,
//     }
//   },
// )


// /* =======================================================
//    MATRIX COUNTS

//    Only assessed assets are placed into Low / Medium / High.

//    Unassessed assets are counted separately.
// ======================================================= */

//   {/* =====================================================
//     BUSINESS CRITICALITY × QUANTUM RISK
//     Uses existing asset classifications only.
    
//     quantum_status:
//       Quantum Ready -> Low
//       At Risk       -> Medium
//       Vulnerable    -> High
// ===================================================== */}

// const riskMatrix = {
//   Critical: {
//     Low: 0,
//     Medium: 0,
//     High: 0,
//   },
//   High: {
//     Low: 0,
//     Medium: 0,
//     High: 0,
//   },
//   Medium: {
//     Low: 0,
//     Medium: 0,
//     High: 0,
//   },
// }

// const quantumStatusToRisk = {
//   "Quantum Ready": "Low",
//   "At Risk": "Medium",
//   "Vulnerable": "High",
// } as const

// data.assets.forEach((asset: any) => {
//   const criticality = asset.business_criticality
//   const risk = quantumStatusToRisk[asset.quantum_status as keyof typeof quantumStatusToRisk]

//   if (
//     criticality &&
//     risk &&
//     riskMatrix[criticality as keyof typeof riskMatrix]
//   ) {
//     riskMatrix[
//       criticality as keyof typeof riskMatrix
//     ][risk as "Low" | "Medium" | "High"] += 1
//   }
// })


//   /* =======================================================
//      HELPERS
//   ======================================================= */

//   const getStatusBadge = (
//     status: string,
//   ) => {

//     if (status === "Vulnerable") {
//       return (
//         <Badge
//           variant="destructive"
//           className="text-[10px]"
//         >
//           Vulnerable
//         </Badge>
//       )
//     }

//     if (status === "At Risk") {
//       return (
//         <Badge
//           variant="secondary"
//           className="border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px]"
//         >
//           At Risk
//         </Badge>
//       )
//     }

//     if (status === "Quantum Ready") {
//       return (
//         <Badge
//           variant="outline"
//           className="border-emerald-500/30 text-emerald-500 text-[10px]"
//         >
//           Quantum Ready
//         </Badge>
//       )
//     }

//     return (
//       <span className="text-muted-foreground">
//         —
//       </span>
//     )
//   }


//   /* =======================================================
//      LOADING
//   ======================================================= */

//   if (isLoading) {
//     return (
//       <div className="flex min-h-[60vh] items-center justify-center">
//         <div className="text-sm text-muted-foreground">
//           Loading quantum-risk data...
//         </div>
//       </div>
//     )
//   }


//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <div className="flex h-full flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-300">

//       {/* =================================================
//           HEADER
//       ================================================= */}

//       <div className="flex flex-col gap-4">

//         <div>
//           <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">

//             <Network className="size-6 text-primary" />

//             Quantum Risk Assessment

//           </h1>

//           <p className="mt-1 text-sm text-muted-foreground">
//             Analyze the vulnerability of your cryptographic
//             assets against post-quantum threats (CRQC).
//           </p>
//         </div>

//       </div>


//       {/* =================================================
//           TABS
//       ================================================= */}

//       <Tabs
//         defaultValue="matrix"
//         className="w-full"
//       >

//         <TabsList className="mb-4 grid w-full grid-cols-2 md:grid-cols-4">

//           <TabsTrigger value="matrix">
//             Risk Matrix
//           </TabsTrigger>

//           <TabsTrigger value="inventory">
//             Algorithm Inventory
//           </TabsTrigger>

//           <TabsTrigger value="timeline">
//             Mosca Timeline
//           </TabsTrigger>

//           <TabsTrigger value="pqc">
//             PQC Recommendations
//           </TabsTrigger>

//         </TabsList>


//         {/* =================================================
//             RISK MATRIX
//         ================================================= */}

//         <TabsContent
//           value="matrix"
//           className="space-y-4"
//         >

//          <Card className="bg-background/50 backdrop-blur">
//   <CardHeader>
//     <CardTitle>
//       Business Criticality × Quantum Risk
//     </CardTitle>

//     <CardDescription>
//       Risk distribution calculated from the existing QShieldX
//       asset classifications.
//     </CardDescription>
//   </CardHeader>

//   <CardContent>

//     <div className="grid grid-cols-4 gap-2 text-center text-sm">

//       {/* HEADER */}

//       <div className="p-2 border-b font-semibold">
//         Criticality \ Risk
//       </div>

//       <div className="p-2 border-b font-semibold text-emerald-500">
//         Low
//       </div>

//       <div className="p-2 border-b font-semibold text-amber-500">
//         Medium
//       </div>

//       <div className="p-2 border-b font-semibold text-red-500">
//         High
//       </div>


//       {/* =================================================
//           CRITICAL
//       ================================================= */}

//       <div className="flex items-center justify-end border-r p-4 font-semibold">
//         Critical
//       </div>

//       <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-4">
//         {riskMatrix.Critical.Low} Assets
//       </div>

//       <div className="rounded border border-amber-500/30 bg-amber-500/10 p-4">
//         {riskMatrix.Critical.Medium} Assets
//       </div>

//       <div className="rounded border border-red-500/30 bg-red-500/15 p-4 font-bold text-red-400">
//         {riskMatrix.Critical.High} Assets
//       </div>


//       {/* =================================================
//           HIGH
//       ================================================= */}

//       <div className="flex items-center justify-end border-r p-4 font-semibold">
//         High
//       </div>

//       <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-4">
//         {riskMatrix.High.Low} Assets
//       </div>

//       <div className="rounded border border-amber-500/30 bg-amber-500/10 p-4">
//         {riskMatrix.High.Medium} Assets
//       </div>

//       <div className="rounded border border-red-500/30 bg-red-500/15 p-4 font-bold text-red-400">
//         {riskMatrix.High.High} Assets
//       </div>


//       {/* =================================================
//           MEDIUM
//       ================================================= */}

//       <div className="flex items-center justify-end border-r p-4 font-semibold">
//         Medium
//       </div>

//       <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-4">
//         {riskMatrix.Medium.Low} Assets
//       </div>

//       <div className="rounded border border-amber-500/20 bg-amber-500/5 p-4">
//         {riskMatrix.Medium.Medium} Assets
//       </div>

//       <div className="rounded border border-red-500/20 bg-red-500/10 p-4">
//         {riskMatrix.Medium.High} Assets
//       </div>

//     </div>

//   </CardContent>
// </Card>
//         </TabsContent>


//         {/* =================================================
//             ALGORITHM INVENTORY
//         ================================================= */}

//         <TabsContent
//           value="inventory"
//           className="space-y-4"
//         >

//           <Card>

//             <CardHeader>

//               <CardTitle>
//                 Cryptographic Algorithm Inventory
//               </CardTitle>

//               <CardDescription>
//                 Detected cryptographic primitives and the
//                 PQC migration paths present in the dataset.
//               </CardDescription>

//             </CardHeader>

//             <CardContent>

//               <div className="overflow-x-auto rounded-md border">

//                 <Table>

//                   <TableHeader>

//                     <TableRow>

//                       <TableHead>
//                         Algorithm
//                       </TableHead>

//                       <TableHead>
//                         Key Size
//                       </TableHead>

//                       <TableHead>
//                         Protocol / Context
//                       </TableHead>

//                       <TableHead>
//                         Asset Origin
//                       </TableHead>

//                       <TableHead>
//                         PQC Recommendation
//                       </TableHead>

//                       <TableHead>
//                         Priority
//                       </TableHead>

//                       <TableHead>
//                         Status
//                       </TableHead>

//                     </TableRow>

//                   </TableHeader>


//                   <TableBody>

//                     {algorithms.map(
//                       (
//                         item: AnyRecord,
//                         index: number,
//                       ) => (

//                         <TableRow key={index}>

//                           <TableCell className="font-mono font-medium">
//                             {item.name}
//                           </TableCell>

//                           <TableCell className="font-mono text-muted-foreground">
//                             {item.key_size || "—"}
//                           </TableCell>

//                           <TableCell>
//                             {item.used_by || "—"}
//                           </TableCell>

//                           <TableCell>
//                             {item.used_by || "—"}
//                           </TableCell>

//                           <TableCell className="font-mono text-primary">
//                             {item.pqc_recommendation || "—"}
//                           </TableCell>

//                           <TableCell>
//                             {item.migration_priority || "—"}
//                           </TableCell>

//                           <TableCell>

//                             <Badge
//                               variant={
//                                 item.quantum_vulnerability ===
//                                 "Low"
//                                   ? "outline"
//                                   : item.quantum_vulnerability ===
//                                       "Medium"
//                                     ? "secondary"
//                                     : "destructive"
//                               }
//                             >
//                               {item.quantum_vulnerability || "—"}
//                             </Badge>

//                           </TableCell>

//                         </TableRow>

//                       ),
//                     )}

//                   </TableBody>

//                 </Table>

//               </div>

//             </CardContent>

//           </Card>

//         </TabsContent>


//         {/* =================================================
//             MOSCA LAB
//         ================================================= */}

//         <TabsContent
//           value="timeline"
//           className="space-y-6"
//         >

//           {/* MOSCA HEADER */}

//           <Card>

//             <CardHeader>

//               <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

//                 <div>

//                   <CardTitle className="flex items-center gap-2 text-xl">

//                     <CalendarClock className="size-5 text-primary" />

//                     Mosca Lab

//                   </CardTitle>

//                   <CardDescription className="mt-1">
//                     Stress-test the current cryptographic estate
//                     against harvest-now-decrypt-later assumptions.
//                   </CardDescription>

//                 </div>

//                 <Badge
//                   variant="outline"
//                   className="w-fit"
//                 >
//                   Scenario Analysis
//                 </Badge>

//               </div>

//               <p className="pt-3 text-xs leading-6 text-muted-foreground">

//                 Mosca's theorem is commonly expressed as
//                 <span className="mx-1 font-semibold text-foreground">
//                   X + Y &gt; Z
//                 </span>

//                 where X represents data secrecy lifetime,
//                 Y represents migration time, and Z represents
//                 the arrival of a cryptographically relevant
//                 quantum computer.

//               </p>

//             </CardHeader>


//             <CardContent className="space-y-6">

//               {/* =========================================
//                   PRESETS
//               ========================================= */}

//               <div>

//                 <div className="mb-3 flex items-center gap-2">

//                   <SlidersHorizontal className="size-4" />

//                   <h3 className="text-sm font-semibold">
//                     Scenario parameters
//                   </h3>

//                 </div>


//                 <div className="grid gap-3 md:grid-cols-3">

//                   {/* X */}

//                   <div className="rounded-xl border p-4">

//                     <div className="flex items-start justify-between">

//                       <div>

//                         <p className="text-xs font-semibold">
//                           X · Data secrecy lifetime
//                         </p>

//                         <p className="mt-1 text-[11px] text-muted-foreground">
//                           Current scan value
//                         </p>

//                       </div>

//                       <Database className="size-4 text-muted-foreground" />

//                     </div>


//                     <div className="mt-5 flex items-end gap-2">

//                       <span className="text-3xl font-bold">
//                         {moscaX}
//                       </span>

//                       <span className="pb-1 text-xs text-muted-foreground">
//                         years
//                       </span>

//                     </div>


//                     <input
//                       type="range"
//                       min="1"
//                       max="30"
//                       step="1"
//                       value={moscaX}
//                       onChange={(event) =>
//                         setMoscaX(
//                           Number(event.target.value),
//                         )
//                       }
//                       className="mt-5 w-full accent-primary"
//                     />

//                     <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
//                       <span>1 yr</span>
//                       <span>30 yrs</span>
//                     </div>

//                     <p className="mt-3 text-[10px] text-muted-foreground">
//                       Loaded from the current QShieldX scan.
//                     </p>

//                   </div>


//                   {/* Y */}

//                   <div className="rounded-xl border p-4">

//                     <div className="flex items-start justify-between">

//                       <div>

//                         <p className="text-xs font-semibold">
//                           Y · Migration time
//                         </p>

//                         <p className="mt-1 text-[11px] text-muted-foreground">
//                           Scenario parameter
//                         </p>

//                       </div>

//                       <Timer className="size-4 text-muted-foreground" />

//                     </div>


//                     <div className="mt-5 flex items-end gap-2">

//                       <span className="text-3xl font-bold">
//                         {moscaY}
//                       </span>

//                       <span className="pb-1 text-xs text-muted-foreground">
//                         years
//                       </span>

//                     </div>


//                     <input
//                       type="range"
//                       min="0"
//                       max="15"
//                       step="1"
//                       value={moscaY}
//                       onChange={(event) =>
//                         setMoscaY(
//                           Number(event.target.value),
//                         )
//                       }
//                       className="mt-5 w-full accent-primary"
//                     />

//                     <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
//                       <span>0 yrs</span>
//                       <span>15 yrs</span>
//                     </div>

//                     <p className="mt-3 text-[10px] text-muted-foreground">
//                       Adjustable planning assumption.
//                     </p>

//                   </div>


//                   {/* Z */}

//                   <div className="rounded-xl border p-4">

//                     <div className="flex items-start justify-between">

//                       <div>

//                         <p className="text-xs font-semibold">
//                           Z · Quantum threat year
//                         </p>

//                         <p className="mt-1 text-[11px] text-muted-foreground">
//                           Scenario parameter
//                         </p>

//                       </div>

//                       <Zap className="size-4 text-muted-foreground" />

//                     </div>


//                     <div className="mt-5 flex items-end gap-2">

//                       <span className="text-3xl font-bold">
//                         {moscaZ}
//                       </span>

//                       <span className="pb-1 text-xs text-muted-foreground">
//                         year
//                       </span>

//                     </div>


//                     <input
//                       type="range"
//                       min={currentYear}
//                       max={currentYear + 25}
//                       step="1"
//                       value={moscaZ}
//                       onChange={(event) =>
//                         setMoscaZ(
//                           Number(event.target.value),
//                         )
//                       }
//                       className="mt-5 w-full accent-primary"
//                     />

//                     <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
//                       <span>{currentYear}</span>
//                       <span>{currentYear + 25}</span>
//                     </div>

//                     <p className="mt-3 text-[10px] text-muted-foreground">
//                       Adjustable CRQC arrival scenario.
//                     </p>

//                   </div>

//                 </div>

//               </div>


//               {/* =========================================
//                   SUMMARY
//               ========================================= */}

//               <div className="grid gap-3 md:grid-cols-4">

//                 <Card>

//                   <CardContent className="p-4">

//                     <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
//                       Estate posture
//                     </p>

//                     <p
//                       className={`mt-2 text-xl font-bold ${
//                         scenarioAtRisk
//                           ? "text-red-400"
//                           : "text-emerald-400"
//                       }`}
//                     >
//                       {scenarioAtRisk
//                         ? "Timing Risk"
//                         : "Within Margin"}
//                     </p>

//                     <p className="mt-1 text-[10px] text-muted-foreground">
//                       Scenario result
//                     </p>

//                   </CardContent>

//                 </Card>


//                 <Card>

//                   <CardContent className="p-4">

//                     <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
//                       At risk
//                     </p>

//                     <p className="mt-2 text-2xl font-bold text-red-400">
//                       {atRiskCount}
//                     </p>

//                     <p className="mt-1 text-[10px] text-muted-foreground">
//                       Assets crossing X + Y &gt; Z
//                     </p>

//                   </CardContent>

//                 </Card>


//                 <Card>

//                   <CardContent className="p-4">

//                     <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
//                       HNDL exposure
//                     </p>

//                     <p className="mt-2 text-2xl font-bold text-amber-400">
//                       {vulnerableCount}
//                     </p>

//                     <p className="mt-1 text-[10px] text-muted-foreground">
//                       Existing vulnerable assets
//                     </p>

//                   </CardContent>

//                 </Card>


//                 <Card>

//                   <CardContent className="p-4">

//                     <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
//                       X + Y vs Z
//                     </p>

//                     <p className="mt-2 text-xl font-bold">

//                       {exposureYears}

//                       <span className="mx-1 text-muted-foreground">
//                         vs
//                       </span>

//                       {threatHorizonYears}

//                     </p>

//                     <p className="mt-1 text-[10px] text-muted-foreground">
//                       years from today
//                     </p>

//                   </CardContent>

//                 </Card>

//               </div>


//               {/* =========================================
//                   MOSCA GRAPH
//               ========================================= */}

//               <Card>

//                 <CardHeader>

//                   <CardTitle>
//                     Mosca timing model
//                   </CardTitle>

//                   <CardDescription>
//                     Interactive scenario timeline using the
//                     selected X, Y and Z values.
//                   </CardDescription>

//                 </CardHeader>


//                 <CardContent>

//                   <div className="relative overflow-hidden rounded-xl border bg-muted/20 p-6 md:p-10">

//                     {/* TRACK */}

//                     <div className="absolute left-[8%] right-[8%] top-[90px] hidden h-[2px] bg-border md:block" />


//                     {/* ACTIVE EXCESS */}

//                     {scenarioAtRisk && (
//                       <div
//                         className="absolute left-[8%] top-[89px] hidden h-[4px] rounded-full bg-red-500 md:block"
//                         style={{
//                           width: `${Math.min(
//                             84,
//                             Math.max(
//                               10,
//                               (exposureYears /
//                                 Math.max(
//                                   exposureYears,
//                                   threatHorizonYears,
//                                 )) *
//                                 70,
//                             ),
//                           )}%`,
//                         }}
//                       />
//                     )}


//                     <div className="relative grid gap-10 md:grid-cols-3">

//                       {/* TODAY */}

//                       <div className="relative flex flex-col items-center text-center">

//                         <div className="relative z-10 flex size-12 items-center justify-center rounded-full border-4 border-background bg-primary/15 text-primary shadow-lg">

//                           <CalendarClock className="size-5" />

//                         </div>

//                         <p className="mt-4 text-sm font-semibold">
//                           Today
//                         </p>

//                         <p className="mt-1 text-[11px] text-muted-foreground">
//                           Migration planning starts
//                         </p>

//                         <Badge
//                           variant="outline"
//                           className="mt-3 border-primary/30 text-primary"
//                         >
//                           Current year · {currentYear}
//                         </Badge>

//                       </div>


//                       {/* X + Y */}

//                       <div className="relative flex flex-col items-center text-center">

//                         <div className="relative z-10 flex size-12 items-center justify-center rounded-full border-4 border-background bg-amber-500/15 text-amber-500 shadow-lg">

//                           <Database className="size-5" />

//                         </div>

//                         <p className="mt-4 text-sm font-semibold">
//                           X + Y
//                         </p>

//                         <p className="mt-1 text-[11px] text-muted-foreground">
//                           Data lifetime + migration
//                         </p>

//                         <Badge
//                           variant="outline"
//                           className="mt-3 border-amber-500/30 text-amber-500"
//                         >
//                           {moscaX} + {moscaY} = {exposureYears} years
//                         </Badge>

//                       </div>


//                       {/* Z */}

//                       <div className="relative flex flex-col items-center text-center">

//                         <div
//                           className={`relative z-10 flex size-12 items-center justify-center rounded-full border-4 border-background shadow-lg ${
//                             scenarioAtRisk
//                               ? "bg-red-500/15 text-red-400"
//                               : "bg-emerald-500/15 text-emerald-400"
//                           }`}
//                         >

//                           <Zap className="size-5" />

//                         </div>

//                         <p className="mt-4 text-sm font-semibold">
//                           Quantum Threat Horizon
//                         </p>

//                         <p className="mt-1 text-[11px] text-muted-foreground">
//                           Selected CRQC year
//                         </p>

//                         <Badge
//                           variant="outline"
//                           className={
//                             scenarioAtRisk
//                               ? "mt-3 border-red-500/30 text-red-400"
//                               : "mt-3 border-emerald-500/30 text-emerald-400"
//                           }
//                         >
//                           {moscaZ} · {threatHorizonYears} years
//                         </Badge>

//                       </div>

//                     </div>


//                     {/* FORMULA */}

//                     <div
//                       className={`mt-10 rounded-xl border-l-4 p-4 ${
//                         scenarioAtRisk
//                           ? "border-red-500 bg-red-500/5"
//                           : "border-emerald-500 bg-emerald-500/5"
//                       }`}
//                     >

//                       <div className="flex items-start gap-3">

//                         {scenarioAtRisk ? (
//                           <ShieldAlert className="mt-0.5 size-5 shrink-0 text-red-400" />
//                         ) : (
//                           <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-400" />
//                         )}

//                         <div>

//                           <p className="text-sm font-semibold">

//                             {exposureYears} years

//                             <span className="mx-2 text-muted-foreground">
//                               vs
//                             </span>

//                             {threatHorizonYears} years

//                           </p>

//                           <p className="mt-1 text-xs leading-5 text-muted-foreground">

//                             X + Y = {moscaX} + {moscaY} ={" "}
//                             {exposureYears} years.

//                             The selected Z horizon is{" "}
//                             {threatHorizonYears} years
//                             from the current year.

//                           </p>

//                           <p
//                             className={`mt-2 text-xs font-semibold ${
//                               scenarioAtRisk
//                                 ? "text-red-400"
//                                 : "text-emerald-400"
//                             }`}
//                           >

//                             {scenarioAtRisk
//                               ? "The selected scenario crosses the Mosca timing threshold."
//                               : "The selected scenario remains within the selected timing horizon."}

//                           </p>

//                         </div>

//                       </div>

//                     </div>

//                   </div>

//                 </CardContent>

//               </Card>


//               {/* =========================================
//                   ASSET TIMING TABLE
//               ========================================= */}

//               <div className="grid gap-6 lg:grid-cols-[1.7fr_0.8fr]">


//                 {/* TABLE */}

//                 <Card>

//                   <CardHeader>

//                     <CardTitle>
//                       Assets at risk under this scenario
//                     </CardTitle>

//                     <CardDescription>
//                       Existing QShieldX quantum-risk records
//                       evaluated against the selected scenario.
//                     </CardDescription>

//                   </CardHeader>


//                   <CardContent>

//                     <div className="overflow-x-auto">

//                       <Table>

//                         <TableHeader>

//                           <TableRow>

//                             <TableHead>
//                               Risk
//                             </TableHead>

//                             <TableHead>
//                               Asset
//                             </TableHead>

//                             <TableHead>
//                               Family
//                             </TableHead>

//                             <TableHead>
//                               Status
//                             </TableHead>

//                             <TableHead>
//                               Criticality
//                             </TableHead>

//                             <TableHead>
//                               Recommended
//                             </TableHead>

//                           </TableRow>

//                         </TableHeader>


//                         <TableBody>

//                           {moscaAssets.length > 0 ? (

//                             moscaAssets.map(
//                               (item) => (

//                                 <TableRow
//                                   key={item.id}
//                                 >

//                                   <TableCell className="font-mono font-semibold">
//                                     {item.risk ?? "—"}
//                                   </TableCell>


//                                   <TableCell className="font-medium">
//                                     {item.asset}
//                                   </TableCell>


//                                   <TableCell className="font-mono">
//                                     {item.family || "—"}
//                                   </TableCell>


//                                   <TableCell>
//                                     {getStatusBadge(
//                                       item.status,
//                                     )}
//                                   </TableCell>


//                                   <TableCell>
//                                     {item.criticality || "—"}
//                                   </TableCell>


//                                   <TableCell className="font-mono text-primary">
//                                     {item.recommended || "—"}
//                                   </TableCell>

//                                 </TableRow>

//                               ),
//                             )

//                           ) : (

//                             <TableRow>

//                               <TableCell
//                                 colSpan={6}
//                                 className="py-10 text-center text-sm text-muted-foreground"
//                               >
//                                 No quantum-risk records
//                                 available.
//                               </TableCell>

//                             </TableRow>

//                           )}

//                         </TableBody>

//                       </Table>

//                     </div>

//                   </CardContent>

//                 </Card>


//                 {/* RIGHT SUMMARY */}

//                 <Card>

//                   <CardHeader>

//                     <CardTitle>
//                       At risk under this scenario
//                     </CardTitle>

//                     <CardDescription>
//                       Based on the existing quantum-risk
//                       records and selected X/Y/Z scenario.
//                     </CardDescription>

//                   </CardHeader>


//                   <CardContent>

//                     <div className="flex flex-col items-center justify-center py-8">

//                       <div
//                         className={`text-5xl font-bold ${
//                           atRiskCount > 0
//                             ? "text-red-400"
//                             : "text-emerald-400"
//                         }`}
//                       >
//                         {atRiskCount}
//                       </div>

//                       <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
//                         Assets
//                       </div>


//                       <div className="mt-8 flex flex-wrap justify-center gap-2">

//                         <Badge
//                           variant="outline"
//                           className="border-red-500/30 text-red-400"
//                         >
//                           AT RISK · {atRiskCount}
//                         </Badge>

//                         <Badge
//                           variant="outline"
//                           className="border-emerald-500/30 text-emerald-400"
//                         >
//                           WITHIN MARGIN ·{" "}
//                           {withinMarginCount}
//                         </Badge>

//                       </div>


//                       <div className="mt-8 w-full rounded-xl border-l-4 border-red-500 bg-red-500/5 p-4">

//                         <div className="flex items-start gap-2">

//                           <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-400" />

//                           <div>

//                             <p className="text-xs font-semibold">
//                               Timing exposure
//                             </p>

//                             <p className="mt-1 text-xs leading-5 text-muted-foreground">

//                               X + Y ={" "}
//                               <strong className="text-foreground">
//                                 {exposureYears}
//                               </strong>{" "}
//                               years versus{" "}
//                               <strong className="text-foreground">
//                                 {threatHorizonYears}
//                               </strong>{" "}
//                               years until the selected
//                               quantum-threat year.

//                             </p>

//                           </div>

//                         </div>

//                       </div>

//                     </div>

//                   </CardContent>

//                 </Card>

//               </div>


//               {/* =========================================
//                   SCENARIO RESULT
//               ========================================= */}

//               <div
//                 className={`rounded-xl border-l-4 p-5 ${
//                   scenarioAtRisk
//                     ? "border-red-500 bg-red-500/5"
//                     : "border-emerald-500 bg-emerald-500/5"
//                 }`}
//               >

//                 <div className="flex items-start gap-3">

//                   {scenarioAtRisk ? (
//                     <AlertTriangle className="mt-0.5 size-5 text-red-400" />
//                   ) : (
//                     <CheckCircle2 className="mt-0.5 size-5 text-emerald-400" />
//                   )}

//                   <div>

//                     <p className="text-sm font-semibold">
//                       Mosca scenario result
//                     </p>

//                     <p className="mt-1 text-xs leading-6 text-muted-foreground">

//                       X + Y = {moscaX} + {moscaY} ={" "}
//                       {exposureYears} years.

//                       The selected Z horizon is{" "}
//                       {threatHorizonYears} years from the
//                       current year ({currentYear}).

//                       {" "}

//                       {scenarioAtRisk
//                         ? "The selected scenario therefore crosses the Mosca timing threshold."
//                         : "The selected scenario remains within the selected timing horizon."}

//                     </p>

//                   </div>

//                 </div>

//               </div>

//             </CardContent>

//           </Card>

//         </TabsContent>


//         {/* =================================================
//             PQC RECOMMENDATIONS
//         ================================================= */}

//         <TabsContent
//           value="pqc"
//           className="space-y-4"
//         >

//           <Card>

//             <CardHeader>

//               <CardTitle>
//                 PQC Recommendations
//               </CardTitle>

//               <CardDescription>
//                 Recommendations already present in the QShieldX
//                 algorithm inventory.
//               </CardDescription>

//             </CardHeader>


//             <CardContent>

//               <div className="overflow-x-auto rounded-md border">

//                 <Table>

//                   <TableHeader>

//                     <TableRow>

//                       <TableHead>
//                         Algorithm
//                       </TableHead>

//                       <TableHead>
//                         Vulnerability
//                       </TableHead>

//                       <TableHead>
//                         Recommended PQC
//                       </TableHead>

//                       <TableHead>
//                         Migration Priority
//                       </TableHead>

//                       <TableHead>
//                         Used By
//                       </TableHead>

//                     </TableRow>

//                   </TableHeader>


//                   <TableBody>

//                     {algorithms.map(
//                       (
//                         item: AnyRecord,
//                         index: number,
//                       ) => (

//                         <TableRow key={index}>

//                           <TableCell className="font-mono font-semibold">
//                             {item.name}
//                           </TableCell>

//                           <TableCell>

//                             <Badge
//                               variant={
//                                 item.quantum_vulnerability ===
//                                 "Low"
//                                   ? "outline"
//                                   : item.quantum_vulnerability ===
//                                       "Medium"
//                                     ? "secondary"
//                                     : "destructive"
//                               }
//                             >
//                               {item.quantum_vulnerability || "—"}
//                             </Badge>

//                           </TableCell>

//                           <TableCell className="font-mono text-primary">
//                             {item.pqc_recommendation || "—"}
//                           </TableCell>

//                           <TableCell>
//                             {item.migration_priority || "—"}
//                           </TableCell>

//                           <TableCell>
//                             {item.used_by || "—"}
//                           </TableCell>

//                         </TableRow>

//                       ),
//                     )}

//                   </TableBody>

//                 </Table>

//               </div>

//             </CardContent>

//           </Card>

//         </TabsContent>

//       </Tabs>

//     </div>
//   )
// }

"use client"

import * as React from "react"
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileKey2,
  Network,
  ShieldAlert,
  ShieldCheck,
  Target,
  Timer,
  Zap,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { useGlobalData } from "@/app/context/GlobalDataContext"

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type RiskLevel = "Low" | "Medium" | "High"

type Asset = {
  id?: string
  name?: string
  asset_type?: string
  artifact_type?: string
  algorithm?: string
  business_criticality?: string
  lifetime_years?: number
  quantum_status?: string
  owner_team?: string
  cloud_provider?: string
  tags?: string[]
}

type QuantumRisk = {
  asset?: string
  mosca?: number
  qars?: number
  migrationPriority?: string
  migrationWindow?: string
  riskCategory?: string
}

type Algorithm = {
  name?: string
  key_size?: string | number
  used_by?: string
  pqc_recommendation?: string
  quantum_vulnerability?: string
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeRisk(status?: string): RiskLevel {
  const value = String(status || "").toLowerCase()

  if (
    value.includes("vulnerable") ||
    value.includes("critical") ||
    value.includes("high")
  ) {
    return "High"
  }

  if (
    value.includes("risk") ||
    value.includes("medium") ||
    value.includes("at risk")
  ) {
    return "Medium"
  }

  return "Low"
}

function normalizeCriticality(value?: string) {
  const normalized = String(value || "").toLowerCase()

  if (normalized === "critical") return "Critical"
  if (normalized === "high") return "High"
  if (normalized === "medium") return "Medium"

  return "Unclassified"
}

function riskFromQuantumStatus(status?: string): RiskLevel {
  const value = String(status || "").toLowerCase()

  if (value.includes("vulnerable")) return "High"
  if (value.includes("at risk")) return "Medium"
  if (value.includes("ready")) return "Low"

  return "Low"
}

function riskBadgeVariant(risk: RiskLevel) {
  if (risk === "High") return "destructive"
  if (risk === "Medium") return "secondary"
  return "outline"
}

function priorityVariant(priority?: string) {
  if (priority === "Immediate") return "destructive"
  if (priority === "Wave 1") return "secondary"
  return "outline"
}

function getPqcRecommendation(
  algorithm?: string,
  existingRecommendation?: string
) {
  if (existingRecommendation) {
    return existingRecommendation
  }

  const value = String(algorithm || "").toUpperCase()

  if (
    value.includes("RSA") ||
    value.includes("ECDH") ||
    value.includes("DH") ||
    value.includes("X25519")
  ) {
    return "ML-KEM"
  }

  if (
    value.includes("ECDSA") ||
    value.includes("EC") ||
    value.includes("DSA")
  ) {
    return "ML-DSA"
  }

  if (value.includes("SHA-1") || value.includes("MD5")) {
    return "SHA-256 / SHA-3"
  }

  if (value.includes("AES-128")) {
    return "AES-256"
  }

  if (value.includes("3DES")) {
    return "AES-256-GCM"
  }

  return "Review crypto usage"
}

function getMigrationApproach(
  algorithm?: string,
  recommendation?: string
) {
  const value = `${algorithm || ""} ${recommendation || ""}`.toUpperCase()

  if (
    value.includes("RSA") ||
    value.includes("ECDH") ||
    value.includes("X25519") ||
    value.includes("KEM")
  ) {
    return "Hybrid transition"
  }

  if (
    value.includes("ECDSA") ||
    value.includes("DSA") ||
    value.includes("SIGNATURE")
  ) {
    return "Parallel signature migration"
  }

  if (
    value.includes("SHA-1") ||
    value.includes("MD5") ||
    value.includes("HASH")
  ) {
    return "Replace legacy hash"
  }

  return "Application assessment"
}

function getRecommendationReason(
  algorithm?: string,
  recommendation?: string
) {
  const current = algorithm || "the detected cryptographic algorithm"
  const replacement =
    recommendation || "the identified PQC migration target"

  return `QShieldX detected ${current}. The recommended migration direction is ${replacement}. Validate protocol, library, certificate, key-management, and interoperability dependencies before production rollout.`
}

function getMigrationSteps(
  algorithm?: string,
  recommendation?: string
) {
  const current = algorithm || "current cryptography"
  const replacement =
    recommendation || "the recommended PQC mechanism"

  return [
    `Inventory every usage of ${current} associated with this asset.`,
    `Validate application and library support for ${replacement}.`,
    "Create a migration test environment and establish interoperability tests.",
    "Introduce the new cryptographic mechanism alongside the existing mechanism where hybrid migration is appropriate.",
    "Measure compatibility, latency, certificate/key-size, and operational impact.",
    "Deploy progressively through staging and controlled production rollout.",
    "Monitor failures and dependent services after deployment.",
    `Retire ${current} only after the replacement has been validated across all dependent systems.`,
  ]
}

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

export default function QuantumRiskPage() {
  const { data, isLoading } = useGlobalData()

  React.useEffect(() => {
    document.title = "Quantum Risk Assessment | QShieldX Dashboard"
  }, [])

  const assets = (data?.assets || []) as Asset[]
  const quantumRisk = (data?.quantumRisk || []) as QuantumRisk[]
  const algorithms = (data?.algorithms || []) as Algorithm[]

  /* ------------------------------------------------------------------------ */
  /* Risk Matrix                                                              */
  /* ------------------------------------------------------------------------ */

  const riskMatrix = React.useMemo(() => {
    const matrix = {
      Critical: {
        Low: 0,
        Medium: 0,
        High: 0,
      },
      High: {
        Low: 0,
        Medium: 0,
        High: 0,
      },
      Medium: {
        Low: 0,
        Medium: 0,
        High: 0,
      },
      Unclassified: {
        Low: 0,
        Medium: 0,
        High: 0,
      },
    }

    assets.forEach((asset) => {
      const criticality = normalizeCriticality(
        asset.business_criticality
      )

      const risk = riskFromQuantumStatus(
        asset.quantum_status
      )

      matrix[criticality][risk]++
    })

    return matrix
  }, [assets])

  const matrixTotal = Object.values(riskMatrix).reduce(
    (total, row) =>
      total + row.Low + row.Medium + row.High,
    0
  )

  /* ------------------------------------------------------------------------ */
  /* Risk lookup                                                              */
  /* ------------------------------------------------------------------------ */

  const quantumRiskByAsset = React.useMemo(() => {
    const map = new Map<string, QuantumRisk>()

    quantumRisk.forEach((item) => {
      if (item.asset) {
        map.set(item.asset.toLowerCase(), item)
      }
    })

    return map
  }, [quantumRisk])

  /* ------------------------------------------------------------------------ */
  /* Mosca scenario                                                           */
  /* ------------------------------------------------------------------------ */

  const [moscaPreset, setMoscaPreset] =
    React.useState("NIST Baseline")

  const [xLifetime, setXLifetime] =
    React.useState(12)

  const [yMigration, setYMigration] =
    React.useState(3)

  const [zThreat, setZThreat] =
    React.useState(8)

  function setPreset(preset: string) {
    setMoscaPreset(preset)

    if (preset === "NIST Baseline") {
      setXLifetime(12)
      setYMigration(3)
      setZThreat(8)
    }

    if (preset === "Optimistic") {
      setXLifetime(10)
      setYMigration(2)
      setZThreat(12)
    }

    if (preset === "Regulatory") {
      setXLifetime(15)
      setYMigration(5)
      setZThreat(10)
    }
  }

  const moscaExposure =
    xLifetime + yMigration > zThreat

  const moscaGap =
    xLifetime + yMigration - zThreat

  /* ------------------------------------------------------------------------ */
  /* Detailed recommendation records                                          */
  /* ------------------------------------------------------------------------ */

  const recommendationRecords = React.useMemo(() => {
    return algorithms.map((algorithm, index) => {
      const usedBy = algorithm.used_by || ""

      const matchedRisk = quantumRisk.find((risk) => {
        if (!risk.asset || !usedBy) return false

        return (
          risk.asset.toLowerCase().includes(
            usedBy.toLowerCase()
          ) ||
          usedBy.toLowerCase().includes(
            risk.asset.toLowerCase()
          )
        )
      })

      const recommendation = getPqcRecommendation(
        algorithm.name,
        algorithm.pqc_recommendation
      )

      return {
        id: `${algorithm.name || "algorithm"}-${index}`,
        algorithm: algorithm.name || "Unknown algorithm",
        keySize: algorithm.key_size || "Not available",
        usedBy: usedBy || "Not available",
        vulnerability:
          algorithm.quantum_vulnerability ||
          "Not available",
        recommendation,
        approach: getMigrationApproach(
          algorithm.name,
          recommendation
        ),
        reason: getRecommendationReason(
          algorithm.name,
          recommendation
        ),
        risk: normalizeRisk(
          algorithm.quantum_vulnerability
        ),
        qars: matchedRisk?.qars,
        priority: matchedRisk?.migrationPriority,
        window: matchedRisk?.migrationWindow,
        steps: getMigrationSteps(
          algorithm.name,
          recommendation
        ),
      }
    })
  }, [algorithms, quantumRisk])

  /* ------------------------------------------------------------------------ */
  /* Asset-specific recommendations                                            */
  /* ------------------------------------------------------------------------ */

  const exposedAssets = React.useMemo(() => {
    return quantumRisk
      .filter((item) => item.asset)
      .sort(
        (a, b) =>
          Number(b.qars || 0) -
          Number(a.qars || 0)
      )
  }, [quantumRisk])

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ActivityIcon />
          Loading quantum risk data...
        </div>
      </div>
    )
  }

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-300">

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Network className="size-6 text-primary" />
          Quantum Risk Assessment
        </h1>

        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Analyze discovered cryptographic assets, understand quantum
          exposure, model migration timing, and review post-quantum
          migration recommendations.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tabs                                                               */}
      {/* ------------------------------------------------------------------ */}

      <Tabs
        defaultValue="matrix"
        className="w-full"
      >

        <TabsList className="mb-4 grid w-full grid-cols-2 md:w-auto md:grid-cols-4">

          <TabsTrigger value="matrix">
            Risk Matrix
          </TabsTrigger>

          <TabsTrigger value="inventory">
            Algorithm Inventory
          </TabsTrigger>

          <TabsTrigger value="timeline">
            Mosca Timeline
          </TabsTrigger>

          <TabsTrigger value="pqc">
            PQC Recommendations
          </TabsTrigger>

        </TabsList>

        {/* ================================================================ */}
        {/* TAB 1 — RISK MATRIX                                             */}
        {/* ================================================================ */}

        <TabsContent
          value="matrix"
          className="space-y-4"
        >

          <Card className="bg-background/50 backdrop-blur">

            <CardHeader>
              <CardTitle>
                Business Criticality × Quantum Risk
              </CardTitle>

              <CardDescription>
                Risk distribution across the complete discovered
                asset inventory. Assets without a business-criticality
                classification remain explicitly unclassified.
              </CardDescription>
            </CardHeader>

            <CardContent>

              <div className="overflow-x-auto">

                <div className="min-w-[760px]">

                  <div className="grid grid-cols-4 gap-2 text-center text-sm">

                    {/* Header */}

                    <div className="p-3 font-semibold border-b">
                      Criticality \ Risk
                    </div>

                    <div className="p-3 font-semibold border-b text-emerald-500">
                      Low
                    </div>

                    <div className="p-3 font-semibold border-b text-amber-500">
                      Medium
                    </div>

                    <div className="p-3 font-semibold border-b text-destructive">
                      High
                    </div>

                    {/* Critical */}

                    <MatrixLabel label="Critical" />

                    <MatrixCell
                      value={riskMatrix.Critical.Low}
                      tone="low"
                    />

                    <MatrixCell
                      value={riskMatrix.Critical.Medium}
                      tone="medium"
                    />

                    <MatrixCell
                      value={riskMatrix.Critical.High}
                      tone="high"
                    />

                    {/* High */}

                    <MatrixLabel label="High" />

                    <MatrixCell
                      value={riskMatrix.High.Low}
                      tone="low"
                    />

                    <MatrixCell
                      value={riskMatrix.High.Medium}
                      tone="medium"
                    />

                    <MatrixCell
                      value={riskMatrix.High.High}
                      tone="high"
                    />

                    {/* Medium */}

                    <MatrixLabel label="Medium" />

                    <MatrixCell
                      value={riskMatrix.Medium.Low}
                      tone="low"
                    />

                    <MatrixCell
                      value={riskMatrix.Medium.Medium}
                      tone="medium"
                    />

                    <MatrixCell
                      value={riskMatrix.Medium.High}
                      tone="high"
                    />

                    {/* Unclassified */}

                    <MatrixLabel label="Unclassified" />

                    <MatrixCell
                      value={riskMatrix.Unclassified.Low}
                      tone="low"
                      highlight={
                        riskMatrix.Unclassified.Low > 0
                      }
                    />

                    <MatrixCell
                      value={riskMatrix.Unclassified.Medium}
                      tone="medium"
                    />

                    <MatrixCell
                      value={riskMatrix.Unclassified.High}
                      tone="high"
                    />

                  </div>

                </div>

              </div>

              {/* Matrix explanation */}

              <div className="mt-5 grid gap-3 md:grid-cols-3">

                <InfoCard
                  icon={
                    <ShieldCheck className="size-4 text-emerald-500" />
                  }
                  title="Low"
                  text="Assets currently marked Quantum Ready in the inventory."
                />

                <InfoCard
                  icon={
                    <AlertTriangle className="size-4 text-amber-500" />
                  }
                  title="Medium"
                  text="Assets currently marked At Risk and requiring migration planning."
                />

                <InfoCard
                  icon={
                    <ShieldAlert className="size-4 text-destructive" />
                  }
                  title="High"
                  text="Assets currently marked Vulnerable and requiring priority assessment."
                />

              </div>

              {/* Inventory accounting */}

              <div className="mt-5 rounded-lg border bg-muted/20 p-4">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-sm font-medium">
                      Inventory accounting
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Every asset in the current inventory is represented
                      in this matrix.
                    </p>

                  </div>

                  <Badge variant="outline">
                    {matrixTotal} Assets
                  </Badge>

                </div>

                {matrixTotal !== assets.length && (
                  <p className="mt-3 text-xs text-amber-500">
                    Matrix count does not match the current asset array.
                    Review the source inventory before interpreting the
                    distribution.
                  </p>
                )}

                {riskMatrix.Unclassified.Low > 0 && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    {riskMatrix.Unclassified.Low} assets are currently
                    unclassified for business criticality. QShieldX does
                    not assign a criticality value that is absent from
                    the source inventory.
                  </p>
                )}

              </div>

            </CardContent>

          </Card>

          {/* High exposure assets */}

          <Card className="bg-background/50 backdrop-blur">

            <CardHeader>

              <CardTitle>
                Assets with Recorded Quantum Risk
              </CardTitle>

              <CardDescription>
                Existing quantum-risk records ordered by QARS score.
              </CardDescription>

            </CardHeader>

            <CardContent>

              {exposedAssets.length === 0 ? (
                <EmptyState
                  icon={<ShieldCheck className="size-5" />}
                  title="No quantum-risk records available"
                  text="The current data source does not contain asset-level quantum-risk records."
                />
              ) : (
                <div className="rounded-md border overflow-hidden">

                  <Table>

                    <TableHeader>
                      <TableRow>

                        <TableHead>
                          Asset
                        </TableHead>

                        <TableHead>
                          QARS
                        </TableHead>

                        <TableHead>
                          Risk
                        </TableHead>

                        <TableHead>
                          Migration Priority
                        </TableHead>

                        <TableHead>
                          Migration Window
                        </TableHead>

                      </TableRow>
                    </TableHeader>

                    <TableBody>

                      {exposedAssets.map((item, index) => (

                        <TableRow key={`${item.asset}-${index}`}>

                          <TableCell className="font-mono font-medium">
                            {item.asset}
                          </TableCell>

                          <TableCell>
                            {item.qars ?? "Not available"}
                          </TableCell>

                          <TableCell>

                            {item.riskCategory ? (
                              <Badge
                                variant={riskBadgeVariant(
                                  normalizeRisk(item.riskCategory)
                                )}
                              >
                                {item.riskCategory}
                              </Badge>
                            ) : (
                              "Not available"
                            )}

                          </TableCell>

                          <TableCell>

                            {item.migrationPriority ? (
                              <Badge
                                variant={priorityVariant(
                                  item.migrationPriority
                                )}
                              >
                                {item.migrationPriority}
                              </Badge>
                            ) : (
                              "Not available"
                            )}

                          </TableCell>

                          <TableCell>
                            {item.migrationWindow ||
                              "Not available"}
                          </TableCell>

                        </TableRow>

                      ))}

                    </TableBody>

                  </Table>

                </div>
              )}

            </CardContent>

          </Card>

        </TabsContent>

        {/* ================================================================ */}
        {/* TAB 2 — ALGORITHM INVENTORY                                     */}
        {/* ================================================================ */}

        <TabsContent
          value="inventory"
          className="space-y-4"
        >

          <Card className="bg-background/50 backdrop-blur">

            <CardHeader>

              <CardTitle>
                Cryptographic Algorithm Inventory
              </CardTitle>

              <CardDescription>
                Algorithms actually present in the current QShieldX
                data source. No fallback or synthetic algorithms are
                displayed.
              </CardDescription>

            </CardHeader>

            <CardContent>

              {algorithms.length === 0 ? (

                <EmptyState
                  icon={<FileKey2 className="size-5" />}
                  title="No algorithm inventory available"
                  text="The current data source does not contain algorithm records."
                />

              ) : (

                <div className="rounded-md border overflow-x-auto">

                  <Table>

                    <TableHeader>

                      <TableRow>

                        <TableHead>
                          Algorithm
                        </TableHead>

                        <TableHead>
                          Key Size
                        </TableHead>

                        <TableHead>
                          Usage / Asset
                        </TableHead>

                        <TableHead>
                          Quantum Vulnerability
                        </TableHead>

                        <TableHead>
                          PQC Recommendation
                        </TableHead>

                        <TableHead>
                          Status
                        </TableHead>

                      </TableRow>

                    </TableHeader>

                    <TableBody>

                      {algorithms.map(
                        (algorithm, index) => {

                          const risk = normalizeRisk(
                            algorithm.quantum_vulnerability
                          )

                          return (

                            <TableRow
                              key={`${algorithm.name}-${index}`}
                            >

                              <TableCell className="font-mono font-medium">
                                {algorithm.name ||
                                  "Not available"}
                              </TableCell>

                              <TableCell className="font-mono text-muted-foreground">
                                {algorithm.key_size ||
                                  "Not available"}
                              </TableCell>

                              <TableCell>
                                {algorithm.used_by ||
                                  "Not available"}
                              </TableCell>

                              <TableCell>

                                {algorithm.quantum_vulnerability ||
                                  "Not available"}

                              </TableCell>

                              <TableCell className="font-medium text-primary">

                                {getPqcRecommendation(
                                  algorithm.name,
                                  algorithm.pqc_recommendation
                                )}

                              </TableCell>

                              <TableCell>

                                <Badge
                                  variant={riskBadgeVariant(
                                    risk
                                  )}
                                >
                                  {risk}
                                </Badge>

                              </TableCell>

                            </TableRow>

                          )
                        }
                      )}

                    </TableBody>

                  </Table>

                </div>

              )}

            </CardContent>

          </Card>

        </TabsContent>

        {/* ================================================================ */}
        {/* TAB 3 — MOSCA TIMELINE                                          */}
        {/* ================================================================ */}

        <TabsContent
          value="timeline"
          className="space-y-4"
        >

          <Card className="bg-background/50 backdrop-blur">

            <CardHeader>

              <CardTitle className="flex items-center gap-2">
                <Timer className="size-5 text-primary" />
                Mosca Risk Timeline
              </CardTitle>

              <CardDescription>
                Scenario model using X + Y {'>'} Z, where X is data
                secrecy lifetime, Y is migration time, and Z is the
                assumed quantum-threat horizon.
              </CardDescription>

            </CardHeader>

            <CardContent className="space-y-6">

              {/* Scenario controls */}

              <div className="rounded-xl border bg-muted/20 p-5">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div>

                    <p className="font-medium">
                      Scenario Inputs
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      These values are analyst-controlled scenario
                      assumptions. They are not presented as measured
                      backend values.
                    </p>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {[
                      "NIST Baseline",
                      "Optimistic",
                      "Regulatory",
                      "Custom",
                    ].map((preset) => (

                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          if (preset === "Custom") {
                            setMoscaPreset("Custom")
                          } else {
                            setPreset(preset)
                          }
                        }}
                        className={`rounded-md border px-3 py-1.5 text-xs transition-colors ${
                          moscaPreset === preset
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {preset}
                      </button>

                    ))}

                  </div>

                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-3">

                  <MoscaSlider
                    label="X — Data Secrecy Lifetime"
                    description="How long the protected information needs confidentiality."
                    value={xLifetime}
                    min={1}
                    max={30}
                    unit="years"
                    icon={
                      <Clock3 className="size-4 text-primary" />
                    }
                    onChange={(value) => {
                      setMoscaPreset("Custom")
                      setXLifetime(value)
                    }}
                  />

                  <MoscaSlider
                    label="Y — Migration Time"
                    description="Estimated time needed to migrate the affected environment."
                    value={yMigration}
                    min={1}
                    max={20}
                    unit="years"
                    icon={
                      <Timer className="size-4 text-amber-500" />
                    }
                    onChange={(value) => {
                      setMoscaPreset("Custom")
                      setYMigration(value)
                    }}
                  />

                  <MoscaSlider
                    label="Z — Quantum Threat Horizon"
                    description="Analyst-selected horizon used for this scenario."
                    value={zThreat}
                    min={1}
                    max={30}
                    unit="years"
                    icon={
                      <Zap className="size-4 text-destructive" />
                    }
                    onChange={(value) => {
                      setMoscaPreset("Custom")
                      setZThreat(value)
                    }}
                  />

                </div>

              </div>

              {/* Formula */}

              <div className="rounded-xl border p-5">

                <div className="grid gap-4 md:grid-cols-3">

                  <TimelineValue
                    label="X"
                    value={`${xLifetime} years`}
                    description="Data secrecy lifetime"
                  />

                  <TimelineValue
                    label="Y"
                    value={`${yMigration} years`}
                    description="Migration time"
                  />

                  <TimelineValue
                    label="Z"
                    value={`${zThreat} years`}
                    description="Quantum threat horizon"
                  />

                </div>

                <div className="mt-5 rounded-lg border bg-muted/30 p-5 text-center">

                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Scenario calculation
                  </p>

                  <p className="mt-3 text-2xl font-semibold">

                    {xLifetime} + {yMigration}{" "}
                    {moscaExposure ? ">" : "≤"}{" "}
                    {zThreat}

                  </p>

                  <div className="mt-3">

                    {moscaExposure ? (

                      <Badge
                        variant="destructive"
                        className="px-3 py-1"
                      >
                        Exposure condition triggered
                      </Badge>

                    ) : (

                      <Badge
                        variant="outline"
                        className="px-3 py-1"
                      >
                        Exposure condition not triggered
                      </Badge>

                    )}

                  </div>

                  <p className="mt-3 text-xs text-muted-foreground">

                    Scenario gap:{" "}
                    <strong>
                      {Math.abs(moscaGap)} years
                    </strong>

                  </p>

                </div>

              </div>

              {/* Visual timeline */}

              <div className="rounded-xl border p-5">

                <div className="grid gap-5 md:grid-cols-3">

                  <TimelineCard
                    icon={
                      <Target className="size-5 text-primary" />
                    }
                    title="Today"
                    subtitle="Migration planning"
                    text="Identify affected assets, owners, protocols, certificates, keys, and application dependencies."
                  />

                  <TimelineCard
                    icon={
                      <Clock3 className="size-5 text-amber-500" />
                    }
                    title={`X — ${xLifetime} years`}
                    subtitle="Data value horizon"
                    text="Represents the selected period for which protected information must retain confidentiality."
                  />

                  <TimelineCard
                    icon={
                      <ShieldAlert className="size-5 text-destructive" />
                    }
                    title={`Z — ${zThreat} years`}
                    subtitle="Quantum threat scenario"
                    text="Represents the analyst-selected horizon used to test the migration scenario."
                  />

                </div>

              </div>

              <div className="rounded-lg border-l-4 border-primary bg-muted/30 p-4 text-sm">

                <p className="font-medium">
                  Important
                </p>

                <p className="mt-1 text-muted-foreground">
                  The X/Y/Z controls are scenario inputs. QShieldX
                  should not present the selected values as a measured
                  prediction of when a cryptographically relevant
                  quantum computer will exist.
                </p>

              </div>

            </CardContent>

          </Card>

        </TabsContent>

        {/* ================================================================ */}
        {/* TAB 4 — PQC RECOMMENDATIONS                                     */}
        {/* ================================================================ */}

        <TabsContent
          value="pqc"
          className="space-y-5"
        >

          {/* Recommendation intro */}

          <Card className="bg-background/50 backdrop-blur">

            <CardHeader>

              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                <div>

                  <CardTitle className="flex items-center gap-2">

                    <ShieldCheck className="size-5 text-primary" />

                    Post-Quantum Migration Recommendations

                  </CardTitle>

                  <CardDescription className="max-w-3xl">

                    Detailed migration guidance derived from the
                    cryptographic algorithms and quantum-risk records
                    currently available to QShieldX.

                  </CardDescription>

                </div>

                <Badge variant="outline">
                  {recommendationRecords.length} Algorithm Recommendations
                </Badge>

              </div>

            </CardHeader>

            <CardContent>

              <div className="grid gap-3 md:grid-cols-3">

                <InfoCard
                  icon={
                    <Network className="size-4 text-primary" />
                  }
                  title="Key Establishment"
                  text="Use the detected key-establishment context to determine whether an ML-KEM migration or hybrid transition is applicable."
                />

                <InfoCard
                  icon={
                    <FileKey2 className="size-4 text-amber-500" />
                  }
                  title="Digital Signatures"
                  text="Review certificate, PKI, signing, and verification dependencies before moving signature mechanisms."
                />

                <InfoCard
                  icon={
                    <ShieldAlert className="size-4 text-destructive" />
                  }
                  title="Legacy Cryptography"
                  text="Legacy or quantum-vulnerable primitives should be traced to every dependent application before retirement."
                />

              </div>

            </CardContent>

          </Card>

          {/* No algorithms */}

          {recommendationRecords.length === 0 ? (

            <Card>

              <CardContent className="py-12">

                <EmptyState
                  icon={
                    <FileKey2 className="size-5" />
                  }
                  title="No algorithm records available"
                  text="Detailed algorithm-specific PQC recommendations cannot be generated until algorithm inventory data is available."
                />

              </CardContent>

            </Card>

          ) : (

            <div className="space-y-3">

              {recommendationRecords.map(
                (recommendation) => (

                  <RecommendationCard
                    key={recommendation.id}
                    recommendation={recommendation}
                  />

                )
              )}

            </div>

          )}

          {/* Asset-level migration queue */}

          {exposedAssets.length > 0 && (

            <Card className="bg-background/50 backdrop-blur">

              <CardHeader>

                <CardTitle>
                  Asset Migration Queue
                </CardTitle>

                <CardDescription>
                  Existing quantum-risk records requiring migration
                  planning. Select an asset to inspect its risk and
                  migration context.
                </CardDescription>

              </CardHeader>

              <CardContent>

                <div className="space-y-3">

                  {exposedAssets.map(
                    (risk, index) => {

                      const matchingAsset =
                        assets.find(
                          (asset) =>
                            asset.name?.toLowerCase() ===
                            risk.asset?.toLowerCase()
                        )

                      return (

                        <AssetRecommendation
                          key={`${risk.asset}-${index}`}
                          risk={risk}
                          asset={matchingAsset}
                        />

                      )
                    }
                  )}

                </div>

              </CardContent>

            </Card>

          )}

        </TabsContent>

      </Tabs>

    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Matrix Components                                                          */
/* -------------------------------------------------------------------------- */

function MatrixLabel({
  label,
}: {
  label: string
}) {
  return (
    <div className="flex items-center justify-end border-r p-4 font-semibold">
      {label}
    </div>
  )
}

function MatrixCell({
  value,
  tone,
  highlight = false,
}: {
  value: number
  tone: "low" | "medium" | "high"
  highlight?: boolean
}) {
  const classes = {
    low: "bg-emerald-500/10 border-emerald-500/20",
    medium: "bg-amber-500/10 border-amber-500/30",
    high: "bg-destructive/10 border-destructive/30",
  }

  return (
    <div
      className={`flex min-h-[74px] items-center justify-center rounded border p-4 ${classes[tone]} ${
        highlight ? "ring-1 ring-emerald-400/40" : ""
      }`}
    >
      <span
        className={`font-semibold ${
          highlight
            ? "text-emerald-400"
            : tone === "high"
              ? "text-destructive"
              : tone === "medium"
                ? "text-amber-500"
                : ""
        }`}
      >
        {value} {value === 1 ? "Asset" : "Assets"}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Mosca Components                                                           */
/* -------------------------------------------------------------------------- */

function MoscaSlider({
  label,
  description,
  value,
  min,
  max,
  unit,
  icon,
  onChange,
}: {
  label: string
  description: string
  value: number
  min: number
  max: number
  unit: string
  icon: React.ReactNode
  onChange: (value: number) => void
}) {
  return (
    <div className="rounded-lg border bg-background/50 p-4">

      <div className="flex items-center gap-2">

        {icon}

        <p className="text-sm font-medium">
          {label}
        </p>

      </div>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {description}
      </p>

      <div className="mt-5 flex items-center justify-between">

        <span className="text-2xl font-bold">
          {value}
        </span>

        <span className="text-xs text-muted-foreground">
          {unit}
        </span>

      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="mt-4 w-full accent-primary"
      />

      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>

    </div>
  )
}

function TimelineValue({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">

      <div className="text-xs font-semibold text-muted-foreground">
        {label}
      </div>

      <div className="mt-2 text-xl font-semibold">
        {value}
      </div>

      <div className="mt-1 text-xs text-muted-foreground">
        {description}
      </div>

    </div>
  )
}

function TimelineCard({
  icon,
  title,
  subtitle,
  text,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  text: string
}) {
  return (
    <div className="relative rounded-xl border bg-muted/10 p-5">

      <div className="flex items-center gap-3">

        <div className="rounded-lg border bg-background p-2">
          {icon}
        </div>

        <div>

          <p className="font-semibold">
            {title}
          </p>

          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>

        </div>

      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {text}
      </p>

    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Recommendation Components                                                  */
/* -------------------------------------------------------------------------- */

type RecommendationRecord = {
  id: string
  algorithm: string
  keySize: string | number
  usedBy: string
  vulnerability: string
  recommendation: string
  approach: string
  reason: string
  risk: RiskLevel
  qars?: number
  priority?: string
  window?: string
  steps: string[]
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: RecommendationRecord
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Card className="overflow-hidden bg-background/50 backdrop-blur">

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left"
      >

        <div className="p-5">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex min-w-0 items-start gap-4">

              <div className="mt-0.5 rounded-lg border bg-muted/30 p-2">

                {recommendation.risk === "High" ? (
                  <ShieldAlert className="size-5 text-destructive" />
                ) : recommendation.risk === "Medium" ? (
                  <AlertTriangle className="size-5 text-amber-500" />
                ) : (
                  <ShieldCheck className="size-5 text-emerald-500" />
                )}

              </div>

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">

                  <h3 className="font-semibold">
                    {recommendation.algorithm}
                  </h3>

                  <Badge
                    variant={riskBadgeVariant(
                      recommendation.risk
                    )}
                  >
                    {recommendation.risk}
                  </Badge>

                  {recommendation.priority && (
                    <Badge
                      variant={priorityVariant(
                        recommendation.priority
                      )}
                    >
                      {recommendation.priority}
                    </Badge>
                  )}

                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {recommendation.usedBy}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">

                <p className="text-xs text-muted-foreground">
                  Recommended direction
                </p>

                <p className="font-semibold text-primary">
                  {recommendation.recommendation}
                </p>

              </div>

              {open ? (
                <ChevronDown className="size-5 rotate-180 transition-transform" />
              ) : (
                <ChevronDown className="size-5 transition-transform" />
              )}

            </div>

          </div>

        </div>

      </button>

      {open && (

        <div className="border-t">

          <div className="grid gap-5 p-5 lg:grid-cols-3">

            {/* Current */}

            <div className="rounded-lg border bg-muted/20 p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current State
              </p>

              <div className="mt-4 space-y-3">

                <DetailRow
                  label="Algorithm"
                  value={recommendation.algorithm}
                />

                <DetailRow
                  label="Key Size"
                  value={String(
                    recommendation.keySize
                  )}
                />

                <DetailRow
                  label="Usage"
                  value={recommendation.usedBy}
                />

                <DetailRow
                  label="Quantum Vulnerability"
                  value={recommendation.vulnerability}
                />

                <DetailRow
                  label="QARS"
                  value={
                    recommendation.qars !== undefined
                      ? String(recommendation.qars)
                      : "Not available"
                  }
                />

              </div>

            </div>

            {/* Recommendation */}

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Recommended Transition
              </p>

              <div className="mt-4">

                <p className="text-xl font-semibold">
                  {recommendation.recommendation}
                </p>

                <div className="mt-4 space-y-3">

                  <DetailRow
                    label="Approach"
                    value={recommendation.approach}
                  />

                  <DetailRow
                    label="Priority"
                    value={
                      recommendation.priority ||
                      "Not available"
                    }
                  />

                  <DetailRow
                    label="Timeline"
                    value={
                      recommendation.window ||
                      "Not available"
                    }
                  />

                </div>

              </div>

            </div>

            {/* Reason */}

            <div className="rounded-lg border bg-muted/20 p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Why This Recommendation
              </p>

              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {recommendation.reason}
              </p>

            </div>

          </div>

          {/* Migration playbook */}

          <div className="border-t bg-muted/10 p-5">

            <div className="flex items-center gap-2">

              <Target className="size-4 text-primary" />

              <h4 className="font-semibold">
                Migration Playbook
              </h4>

            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">

              {recommendation.steps.map(
                (step, index) => (

                  <div
                    key={index}
                    className="flex gap-3 rounded-lg border bg-background/50 p-3"
                  >

                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </div>

                    <p className="text-sm leading-5 text-muted-foreground">
                      {step}
                    </p>

                  </div>

                )
              )}

            </div>

            <div className="mt-5 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">

              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />

              <p className="text-xs leading-5 text-muted-foreground">
                This is a migration recommendation generated from
                the available QShieldX inventory. Validate the
                application protocol, cryptographic library,
                certificates, keys, dependencies, interoperability,
                and operational requirements before making the
                production change.
              </p>

            </div>

          </div>

        </div>

      )}

    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Asset Recommendation                                                       */
/* -------------------------------------------------------------------------- */

function AssetRecommendation({
  risk,
  asset,
}: {
  risk: QuantumRisk
  asset?: Asset
}) {
  const [open, setOpen] = React.useState(false)

  const statusRisk = normalizeRisk(
    risk.riskCategory
  )

  return (
    <div className="rounded-lg border">

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
      >

        <div className="flex min-w-0 items-center gap-3">

          <div className="rounded-md border bg-muted/20 p-2">

            {statusRisk === "High" ? (
              <ShieldAlert className="size-4 text-destructive" />
            ) : statusRisk === "Medium" ? (
              <AlertTriangle className="size-4 text-amber-500" />
            ) : (
              <ShieldCheck className="size-4 text-emerald-500" />
            )}

          </div>

          <div className="min-w-0">

            <p className="truncate font-mono text-sm font-medium">
              {risk.asset}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {asset?.asset_type ||
                "Asset type not available"}
              {" · "}
              {asset?.artifact_type ||
                "Artifact type not available"}
            </p>

          </div>

        </div>

        <div className="flex shrink-0 items-center gap-3">

          <Badge
            variant={riskBadgeVariant(statusRisk)}
          >
            QARS {risk.qars ?? "N/A"}
          </Badge>

          <ChevronDown
            className={`size-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />

        </div>

      </button>

      {open && (

        <div className="border-t bg-muted/10 p-4">

          <div className="grid gap-4 md:grid-cols-4">

            <DetailRow
              label="Business Criticality"
              value={
                asset?.business_criticality ||
                "Not available"
              }
            />

            <DetailRow
              label="Quantum Status"
              value={
                asset?.quantum_status ||
                "Not available"
              }
            />

            <DetailRow
              label="Migration Priority"
              value={
                risk.migrationPriority ||
                "Not available"
              }
            />

            <DetailRow
              label="Migration Window"
              value={
                risk.migrationWindow ||
                "Not available"
              }
            />

          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">

            <DetailRow
              label="Owner Team"
              value={
                asset?.owner_team ||
                "Not available"
              }
            />

            <DetailRow
              label="Cloud Provider"
              value={
                asset?.cloud_provider ||
                "Not available"
              }
            />

          </div>

        </div>

      )}

    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* General UI Components                                                      */
/* -------------------------------------------------------------------------- */

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-lg border bg-muted/10 p-4">

      <div className="flex items-center gap-2">

        {icon}

        <p className="text-sm font-medium">
          {title}
        </p>

      </div>

      <p className="mt-2 text-xs leading-5 text-muted-foreground">
        {text}
      </p>

    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>

      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium">
        {value}
      </p>

    </div>
  )
}

function EmptyState({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">

      <div className="rounded-full border bg-muted/30 p-3">
        {icon}
      </div>

      <h3 className="mt-4 font-medium">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {text}
      </p>

    </div>
  )
}

function ActivityIcon() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.25"
      />

      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}