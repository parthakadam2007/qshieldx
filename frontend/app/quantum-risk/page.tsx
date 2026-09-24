"use client"

import * as React from "react"

import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Database,
  Network,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
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


/* =========================================================
   TYPES
========================================================= */

type AnyRecord = Record<string, any>

type MoscaAsset = {
  id: string
  risk: number | null
  asset: string
  family: string
  status: string
  criticality: string
  recommended: string
  migrationPriority: string
  migrationWindow: string
  qars: number | null
  lifetimeYears: number | null
}


/* =========================================================
   PAGE
========================================================= */

export default function QuantumRiskPage() {
  const { data, isLoading } = useGlobalData()

  React.useEffect(() => {
    document.title = "Quantum Risk Assessment | QShieldX Dashboard"
  }, [])


  /* =======================================================
     CURRENT YEAR
  ======================================================= */

  const currentYear = new Date().getFullYear()


  /* =======================================================
     MOSCA SCENARIO CONTROLS

     X = data secrecy lifetime
     Y = migration time
     Z = quantum threat year

     X comes from the real scan dataset.

     Y and Z are interactive scenario parameters.
     They are NOT claimed to be backend measurements.
  ======================================================= */

  const datasetX =
    typeof data.scan?.shelfLifeYears === "number"
      ? data.scan.shelfLifeYears
      : 12

  const [moscaX, setMoscaX] = React.useState(datasetX)

  const [moscaY, setMoscaY] = React.useState(4)

  const [moscaZ, setMoscaZ] = React.useState(currentYear + 4)


  React.useEffect(() => {
    if (typeof data.scan?.shelfLifeYears === "number") {
      setMoscaX(data.scan.shelfLifeYears)
    }
  }, [data.scan?.shelfLifeYears])


  /* =======================================================
     MOSCA CALCULATION

     Mosca condition:

       X + Y > Z

     In the UI we normalize Z to a number of years from
     the current year.

       threat horizon = Z - current year

     This is a scenario calculation based on the
     user-controlled X/Y/Z values.
  ======================================================= */

  const threatHorizonYears = Math.max(
    0,
    moscaZ - currentYear,
  )

  const exposureYears = moscaX + moscaY

  const scenarioAtRisk =
    exposureYears > threatHorizonYears


  /* =======================================================
     REAL QUANTUM RISK DATA
  ======================================================= */

  const quantumRisk = Array.isArray(data.quantumRisk)
    ? data.quantumRisk
    : []


  const assets = Array.isArray(data.assets)
    ? data.assets
    : []


  const certificates = Array.isArray(data.certificates)
    ? data.certificates
    : []


  const algorithms = Array.isArray(data.algorithms)
    ? data.algorithms
    : []


  /* =======================================================
     BUILD ASSET TABLE

     IMPORTANT:
     We do not invent missing cryptographic information.

     Family/recommendation comes from actual certificate /
     algorithm evidence.
  ======================================================= */

  const moscaAssets: MoscaAsset[] = quantumRisk.map(
    (item: AnyRecord, index: number) => {

      const asset = assets.find(
        (a: AnyRecord) =>
          a.name === item.asset,
      )

      const certificate = certificates.find(
        (c: AnyRecord) =>
          c.cn === item.asset,
      )


      let family = ""
      let recommended = ""


      /* ---------------------------------------------------
         RSA
      --------------------------------------------------- */

      if (
        certificate?.signature_algorithm?.includes("RSA")
      ) {
        family = "RSA"

        if (
          certificate?.key_length === 4096
        ) {
          recommended = "ML-DSA 65 hybrid"
        } else {
          recommended = "ML-KEM 768 hybrid"
        }
      }


      /* ---------------------------------------------------
         ECDSA
      --------------------------------------------------- */

      if (
        certificate?.signature_algorithm?.includes(
          "ECDSA",
        )
      ) {
        family = "ECC"
        recommended = "ML-DSA 65"
      }


      /* ---------------------------------------------------
         Ed25519
      --------------------------------------------------- */

      if (
        certificate?.signature_algorithm?.includes(
          "Ed25519",
        )
      ) {
        family = "EdDSA"
        recommended = "SLH-DSA"
      }


      return {
        id: `${item.asset}-${index}`,

        /*
         * IMPORTANT:
         * Mosca risk score, not QARS.
         */
        risk:
          typeof item.mosca === "number"
            ? item.mosca
            : null,

        asset: item.asset,

        family,

        status:
          asset?.quantum_status ?? "",

        criticality:
          asset?.business_criticality ?? "",

        recommended,

        migrationPriority:
          item.migrationPriority ?? "",

        migrationWindow:
          item.migrationWindow ?? "",

        qars:
          typeof item.qars === "number"
            ? item.qars
            : null,

        lifetimeYears:
          typeof asset?.lifetime_years === "number"
            ? asset.lifetime_years
            : null,
      }
    },
  )


  /* =======================================================
     MOSCA ASSET TIMING ANALYSIS

     For each asset:

       asset lifetime + scenario migration time

     compared with:

       selected quantum-threat horizon

     We use actual lifetime_years from the dataset.
  ======================================================= */

  const timingAssets = moscaAssets.map(
    (item) => {

      const lifetime =
        item.lifetimeYears ?? moscaX

      const requiredYears =
        lifetime + moscaY

      const atRisk =
        requiredYears > threatHorizonYears

      const withinMargin =
        requiredYears <= threatHorizonYears &&
        requiredYears >= threatHorizonYears - 2

      return {
        ...item,
        lifetime,
        requiredYears,
        atRisk,
        withinMargin,
      }
    },
  )


  const atRiskCount =
    timingAssets.filter(
      (item) => item.atRisk,
    ).length


  const withinMarginCount =
    timingAssets.filter(
      (item) => item.withinMargin,
    ).length


  const vulnerableCount =
    timingAssets.filter(
      (item) =>
        item.status === "Vulnerable",
    ).length


  /* =======================================================
     RISK MATRIX

     Built from actual assets + quantumRisk records.
  ======================================================= */

  const riskMatrix = {
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
  }


  quantumRisk.forEach(
    (risk: AnyRecord) => {

      const asset = assets.find(
        (a: AnyRecord) =>
          a.name === risk.asset,
      )

      const criticality =
        asset?.business_criticality

      const riskCategory =
        risk.riskCategory


      if (
        criticality === "Critical" &&
        riskCategory === "Critical"
      ) {
        riskMatrix.Critical.High += 1
      }

      else if (
        criticality === "Critical" &&
        riskCategory === "High"
      ) {
        riskMatrix.Critical.Medium += 1
      }

      else if (
        criticality === "Critical"
      ) {
        riskMatrix.Critical.Low += 1
      }


      else if (
        criticality === "High" &&
        riskCategory === "Critical"
      ) {
        riskMatrix.High.High += 1
      }

      else if (
        criticality === "High" &&
        riskCategory === "High"
      ) {
        riskMatrix.High.Medium += 1
      }

      else if (
        criticality === "High"
      ) {
        riskMatrix.High.Low += 1
      }


      else if (
        criticality === "Medium" &&
        riskCategory === "Critical"
      ) {
        riskMatrix.Medium.High += 1
      }

      else if (
        criticality === "Medium" &&
        riskCategory === "High"
      ) {
        riskMatrix.Medium.Medium += 1
      }

      else if (
        criticality === "Medium"
      ) {
        riskMatrix.Medium.Low += 1
      }
    },
  )


  /* =======================================================
     HELPERS
  ======================================================= */

  const getStatusBadge = (
    status: string,
  ) => {

    if (status === "Vulnerable") {
      return (
        <Badge
          variant="destructive"
          className="text-[10px]"
        >
          Vulnerable
        </Badge>
      )
    }

    if (status === "At Risk") {
      return (
        <Badge
          variant="secondary"
          className="border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px]"
        >
          At Risk
        </Badge>
      )
    }

    if (status === "Quantum Ready") {
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 text-emerald-500 text-[10px]"
        >
          Quantum Ready
        </Badge>
      )
    }

    return (
      <span className="text-muted-foreground">
        —
      </span>
    )
  }


  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Loading quantum-risk data...
        </div>
      </div>
    )
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-300">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4">

        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">

            <Network className="size-6 text-primary" />

            Quantum Risk Assessment

          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Analyze the vulnerability of your cryptographic
            assets against post-quantum threats (CRQC).
          </p>
        </div>

      </div>


      {/* =================================================
          TABS
      ================================================= */}

      <Tabs
        defaultValue="matrix"
        className="w-full"
      >

        <TabsList className="mb-4 grid w-full grid-cols-2 md:grid-cols-4">

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


        {/* =================================================
            RISK MATRIX
        ================================================= */}

        <TabsContent
          value="matrix"
          className="space-y-4"
        >

          <Card>

            <CardHeader>

              <CardTitle>
                Business Criticality × Quantum Risk
              </CardTitle>

              <CardDescription>
                Risk distribution calculated from the existing
                QShieldX quantum-risk records.
              </CardDescription>

            </CardHeader>

            <CardContent>

              <div className="grid grid-cols-4 gap-2 text-center text-sm">

                <div className="border-b p-2 font-semibold">
                  Criticality \ Risk
                </div>

                <div className="border-b p-2 font-semibold text-emerald-500">
                  Low
                </div>

                <div className="border-b p-2 font-semibold text-amber-500">
                  Medium
                </div>

                <div className="border-b p-2 font-semibold text-red-500">
                  High
                </div>


                {/* CRITICAL */}

                <div className="flex items-center justify-end border-r p-4 font-semibold">
                  Critical
                </div>

                <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-4">
                  {riskMatrix.Critical.Low} Assets
                </div>

                <div className="rounded border border-amber-500/20 bg-amber-500/10 p-4">
                  {riskMatrix.Critical.Medium} Assets
                </div>

                <div className="rounded border border-red-500/30 bg-red-500/20 p-4 font-bold text-red-400">
                  {riskMatrix.Critical.High} Assets
                </div>


                {/* HIGH */}

                <div className="flex items-center justify-end border-r p-4 font-semibold">
                  High
                </div>

                <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-4">
                  {riskMatrix.High.Low} Assets
                </div>

                <div className="rounded border border-amber-500/20 bg-amber-500/10 p-4">
                  {riskMatrix.High.Medium} Assets
                </div>

                <div className="rounded border border-red-500/30 bg-red-500/20 p-4 font-bold text-red-400">
                  {riskMatrix.High.High} Assets
                </div>


                {/* MEDIUM */}

                <div className="flex items-center justify-end border-r p-4 font-semibold">
                  Medium
                </div>

                <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-4">
                  {riskMatrix.Medium.Low} Assets
                </div>

                <div className="rounded border p-4">
                  {riskMatrix.Medium.Medium} Assets
                </div>

                <div className="rounded border border-red-500/20 bg-red-500/10 p-4">
                  {riskMatrix.Medium.High} Assets
                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>


        {/* =================================================
            ALGORITHM INVENTORY
        ================================================= */}

        <TabsContent
          value="inventory"
          className="space-y-4"
        >

          <Card>

            <CardHeader>

              <CardTitle>
                Cryptographic Algorithm Inventory
              </CardTitle>

              <CardDescription>
                Detected cryptographic primitives and the
                PQC migration paths present in the dataset.
              </CardDescription>

            </CardHeader>

            <CardContent>

              <div className="overflow-x-auto rounded-md border">

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
                        Protocol / Context
                      </TableHead>

                      <TableHead>
                        Asset Origin
                      </TableHead>

                      <TableHead>
                        PQC Recommendation
                      </TableHead>

                      <TableHead>
                        Priority
                      </TableHead>

                      <TableHead>
                        Status
                      </TableHead>

                    </TableRow>

                  </TableHeader>


                  <TableBody>

                    {algorithms.map(
                      (
                        item: AnyRecord,
                        index: number,
                      ) => (

                        <TableRow key={index}>

                          <TableCell className="font-mono font-medium">
                            {item.name}
                          </TableCell>

                          <TableCell className="font-mono text-muted-foreground">
                            {item.key_size || "—"}
                          </TableCell>

                          <TableCell>
                            {item.used_by || "—"}
                          </TableCell>

                          <TableCell>
                            {item.used_by || "—"}
                          </TableCell>

                          <TableCell className="font-mono text-primary">
                            {item.pqc_recommendation || "—"}
                          </TableCell>

                          <TableCell>
                            {item.migration_priority || "—"}
                          </TableCell>

                          <TableCell>

                            <Badge
                              variant={
                                item.quantum_vulnerability ===
                                "Low"
                                  ? "outline"
                                  : item.quantum_vulnerability ===
                                      "Medium"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {item.quantum_vulnerability || "—"}
                            </Badge>

                          </TableCell>

                        </TableRow>

                      ),
                    )}

                  </TableBody>

                </Table>

              </div>

            </CardContent>

          </Card>

        </TabsContent>


        {/* =================================================
            MOSCA LAB
        ================================================= */}

        <TabsContent
          value="timeline"
          className="space-y-6"
        >

          {/* MOSCA HEADER */}

          <Card>

            <CardHeader>

              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">

                <div>

                  <CardTitle className="flex items-center gap-2 text-xl">

                    <CalendarClock className="size-5 text-primary" />

                    Mosca Lab

                  </CardTitle>

                  <CardDescription className="mt-1">
                    Stress-test the current cryptographic estate
                    against harvest-now-decrypt-later assumptions.
                  </CardDescription>

                </div>

                <Badge
                  variant="outline"
                  className="w-fit"
                >
                  Scenario Analysis
                </Badge>

              </div>

              <p className="pt-3 text-xs leading-6 text-muted-foreground">

                Mosca's theorem is commonly expressed as
                <span className="mx-1 font-semibold text-foreground">
                  X + Y &gt; Z
                </span>

                where X represents data secrecy lifetime,
                Y represents migration time, and Z represents
                the arrival of a cryptographically relevant
                quantum computer.

              </p>

            </CardHeader>


            <CardContent className="space-y-6">

              {/* =========================================
                  PRESETS
              ========================================= */}

              <div>

                <div className="mb-3 flex items-center gap-2">

                  <SlidersHorizontal className="size-4" />

                  <h3 className="text-sm font-semibold">
                    Scenario parameters
                  </h3>

                </div>


                <div className="grid gap-3 md:grid-cols-3">

                  {/* X */}

                  <div className="rounded-xl border p-4">

                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-xs font-semibold">
                          X · Data secrecy lifetime
                        </p>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Current scan value
                        </p>

                      </div>

                      <Database className="size-4 text-muted-foreground" />

                    </div>


                    <div className="mt-5 flex items-end gap-2">

                      <span className="text-3xl font-bold">
                        {moscaX}
                      </span>

                      <span className="pb-1 text-xs text-muted-foreground">
                        years
                      </span>

                    </div>


                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={moscaX}
                      onChange={(event) =>
                        setMoscaX(
                          Number(event.target.value),
                        )
                      }
                      className="mt-5 w-full accent-primary"
                    />

                    <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                      <span>1 yr</span>
                      <span>30 yrs</span>
                    </div>

                    <p className="mt-3 text-[10px] text-muted-foreground">
                      Loaded from the current QShieldX scan.
                    </p>

                  </div>


                  {/* Y */}

                  <div className="rounded-xl border p-4">

                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-xs font-semibold">
                          Y · Migration time
                        </p>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Scenario parameter
                        </p>

                      </div>

                      <Timer className="size-4 text-muted-foreground" />

                    </div>


                    <div className="mt-5 flex items-end gap-2">

                      <span className="text-3xl font-bold">
                        {moscaY}
                      </span>

                      <span className="pb-1 text-xs text-muted-foreground">
                        years
                      </span>

                    </div>


                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="1"
                      value={moscaY}
                      onChange={(event) =>
                        setMoscaY(
                          Number(event.target.value),
                        )
                      }
                      className="mt-5 w-full accent-primary"
                    />

                    <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                      <span>0 yrs</span>
                      <span>15 yrs</span>
                    </div>

                    <p className="mt-3 text-[10px] text-muted-foreground">
                      Adjustable planning assumption.
                    </p>

                  </div>


                  {/* Z */}

                  <div className="rounded-xl border p-4">

                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-xs font-semibold">
                          Z · Quantum threat year
                        </p>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Scenario parameter
                        </p>

                      </div>

                      <Zap className="size-4 text-muted-foreground" />

                    </div>


                    <div className="mt-5 flex items-end gap-2">

                      <span className="text-3xl font-bold">
                        {moscaZ}
                      </span>

                      <span className="pb-1 text-xs text-muted-foreground">
                        year
                      </span>

                    </div>


                    <input
                      type="range"
                      min={currentYear}
                      max={currentYear + 25}
                      step="1"
                      value={moscaZ}
                      onChange={(event) =>
                        setMoscaZ(
                          Number(event.target.value),
                        )
                      }
                      className="mt-5 w-full accent-primary"
                    />

                    <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                      <span>{currentYear}</span>
                      <span>{currentYear + 25}</span>
                    </div>

                    <p className="mt-3 text-[10px] text-muted-foreground">
                      Adjustable CRQC arrival scenario.
                    </p>

                  </div>

                </div>

              </div>


              {/* =========================================
                  SUMMARY
              ========================================= */}

              <div className="grid gap-3 md:grid-cols-4">

                <Card>

                  <CardContent className="p-4">

                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Estate posture
                    </p>

                    <p
                      className={`mt-2 text-xl font-bold ${
                        scenarioAtRisk
                          ? "text-red-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {scenarioAtRisk
                        ? "Timing Risk"
                        : "Within Margin"}
                    </p>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Scenario result
                    </p>

                  </CardContent>

                </Card>


                <Card>

                  <CardContent className="p-4">

                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      At risk
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-400">
                      {atRiskCount}
                    </p>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Assets crossing X + Y &gt; Z
                    </p>

                  </CardContent>

                </Card>


                <Card>

                  <CardContent className="p-4">

                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      HNDL exposure
                    </p>

                    <p className="mt-2 text-2xl font-bold text-amber-400">
                      {vulnerableCount}
                    </p>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Existing vulnerable assets
                    </p>

                  </CardContent>

                </Card>


                <Card>

                  <CardContent className="p-4">

                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      X + Y vs Z
                    </p>

                    <p className="mt-2 text-xl font-bold">

                      {exposureYears}

                      <span className="mx-1 text-muted-foreground">
                        vs
                      </span>

                      {threatHorizonYears}

                    </p>

                    <p className="mt-1 text-[10px] text-muted-foreground">
                      years from today
                    </p>

                  </CardContent>

                </Card>

              </div>


              {/* =========================================
                  MOSCA GRAPH
              ========================================= */}

              <Card>

                <CardHeader>

                  <CardTitle>
                    Mosca timing model
                  </CardTitle>

                  <CardDescription>
                    Interactive scenario timeline using the
                    selected X, Y and Z values.
                  </CardDescription>

                </CardHeader>


                <CardContent>

                  <div className="relative overflow-hidden rounded-xl border bg-muted/20 p-6 md:p-10">

                    {/* TRACK */}

                    <div className="absolute left-[8%] right-[8%] top-[90px] hidden h-[2px] bg-border md:block" />


                    {/* ACTIVE EXCESS */}

                    {scenarioAtRisk && (
                      <div
                        className="absolute left-[8%] top-[89px] hidden h-[4px] rounded-full bg-red-500 md:block"
                        style={{
                          width: `${Math.min(
                            84,
                            Math.max(
                              10,
                              (exposureYears /
                                Math.max(
                                  exposureYears,
                                  threatHorizonYears,
                                )) *
                                70,
                            ),
                          )}%`,
                        }}
                      />
                    )}


                    <div className="relative grid gap-10 md:grid-cols-3">

                      {/* TODAY */}

                      <div className="relative flex flex-col items-center text-center">

                        <div className="relative z-10 flex size-12 items-center justify-center rounded-full border-4 border-background bg-primary/15 text-primary shadow-lg">

                          <CalendarClock className="size-5" />

                        </div>

                        <p className="mt-4 text-sm font-semibold">
                          Today
                        </p>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Migration planning starts
                        </p>

                        <Badge
                          variant="outline"
                          className="mt-3 border-primary/30 text-primary"
                        >
                          Current year · {currentYear}
                        </Badge>

                      </div>


                      {/* X + Y */}

                      <div className="relative flex flex-col items-center text-center">

                        <div className="relative z-10 flex size-12 items-center justify-center rounded-full border-4 border-background bg-amber-500/15 text-amber-500 shadow-lg">

                          <Database className="size-5" />

                        </div>

                        <p className="mt-4 text-sm font-semibold">
                          X + Y
                        </p>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Data lifetime + migration
                        </p>

                        <Badge
                          variant="outline"
                          className="mt-3 border-amber-500/30 text-amber-500"
                        >
                          {moscaX} + {moscaY} = {exposureYears} years
                        </Badge>

                      </div>


                      {/* Z */}

                      <div className="relative flex flex-col items-center text-center">

                        <div
                          className={`relative z-10 flex size-12 items-center justify-center rounded-full border-4 border-background shadow-lg ${
                            scenarioAtRisk
                              ? "bg-red-500/15 text-red-400"
                              : "bg-emerald-500/15 text-emerald-400"
                          }`}
                        >

                          <Zap className="size-5" />

                        </div>

                        <p className="mt-4 text-sm font-semibold">
                          Quantum Threat Horizon
                        </p>

                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Selected CRQC year
                        </p>

                        <Badge
                          variant="outline"
                          className={
                            scenarioAtRisk
                              ? "mt-3 border-red-500/30 text-red-400"
                              : "mt-3 border-emerald-500/30 text-emerald-400"
                          }
                        >
                          {moscaZ} · {threatHorizonYears} years
                        </Badge>

                      </div>

                    </div>


                    {/* FORMULA */}

                    <div
                      className={`mt-10 rounded-xl border-l-4 p-4 ${
                        scenarioAtRisk
                          ? "border-red-500 bg-red-500/5"
                          : "border-emerald-500 bg-emerald-500/5"
                      }`}
                    >

                      <div className="flex items-start gap-3">

                        {scenarioAtRisk ? (
                          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-red-400" />
                        ) : (
                          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                        )}

                        <div>

                          <p className="text-sm font-semibold">

                            {exposureYears} years

                            <span className="mx-2 text-muted-foreground">
                              vs
                            </span>

                            {threatHorizonYears} years

                          </p>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">

                            X + Y = {moscaX} + {moscaY} ={" "}
                            {exposureYears} years.

                            The selected Z horizon is{" "}
                            {threatHorizonYears} years
                            from the current year.

                          </p>

                          <p
                            className={`mt-2 text-xs font-semibold ${
                              scenarioAtRisk
                                ? "text-red-400"
                                : "text-emerald-400"
                            }`}
                          >

                            {scenarioAtRisk
                              ? "The selected scenario crosses the Mosca timing threshold."
                              : "The selected scenario remains within the selected timing horizon."}

                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </CardContent>

              </Card>


              {/* =========================================
                  ASSET TIMING TABLE
              ========================================= */}

              <div className="grid gap-6 lg:grid-cols-[1.7fr_0.8fr]">


                {/* TABLE */}

                <Card>

                  <CardHeader>

                    <CardTitle>
                      Assets at risk under this scenario
                    </CardTitle>

                    <CardDescription>
                      Existing QShieldX quantum-risk records
                      evaluated against the selected scenario.
                    </CardDescription>

                  </CardHeader>


                  <CardContent>

                    <div className="overflow-x-auto">

                      <Table>

                        <TableHeader>

                          <TableRow>

                            <TableHead>
                              Risk
                            </TableHead>

                            <TableHead>
                              Asset
                            </TableHead>

                            <TableHead>
                              Family
                            </TableHead>

                            <TableHead>
                              Status
                            </TableHead>

                            <TableHead>
                              Criticality
                            </TableHead>

                            <TableHead>
                              Recommended
                            </TableHead>

                          </TableRow>

                        </TableHeader>


                        <TableBody>

                          {moscaAssets.length > 0 ? (

                            moscaAssets.map(
                              (item) => (

                                <TableRow
                                  key={item.id}
                                >

                                  <TableCell className="font-mono font-semibold">
                                    {item.risk ?? "—"}
                                  </TableCell>


                                  <TableCell className="font-medium">
                                    {item.asset}
                                  </TableCell>


                                  <TableCell className="font-mono">
                                    {item.family || "—"}
                                  </TableCell>


                                  <TableCell>
                                    {getStatusBadge(
                                      item.status,
                                    )}
                                  </TableCell>


                                  <TableCell>
                                    {item.criticality || "—"}
                                  </TableCell>


                                  <TableCell className="font-mono text-primary">
                                    {item.recommended || "—"}
                                  </TableCell>

                                </TableRow>

                              ),
                            )

                          ) : (

                            <TableRow>

                              <TableCell
                                colSpan={6}
                                className="py-10 text-center text-sm text-muted-foreground"
                              >
                                No quantum-risk records
                                available.
                              </TableCell>

                            </TableRow>

                          )}

                        </TableBody>

                      </Table>

                    </div>

                  </CardContent>

                </Card>


                {/* RIGHT SUMMARY */}

                <Card>

                  <CardHeader>

                    <CardTitle>
                      At risk under this scenario
                    </CardTitle>

                    <CardDescription>
                      Based on the existing quantum-risk
                      records and selected X/Y/Z scenario.
                    </CardDescription>

                  </CardHeader>


                  <CardContent>

                    <div className="flex flex-col items-center justify-center py-8">

                      <div
                        className={`text-5xl font-bold ${
                          atRiskCount > 0
                            ? "text-red-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {atRiskCount}
                      </div>

                      <div className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
                        Assets
                      </div>


                      <div className="mt-8 flex flex-wrap justify-center gap-2">

                        <Badge
                          variant="outline"
                          className="border-red-500/30 text-red-400"
                        >
                          AT RISK · {atRiskCount}
                        </Badge>

                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 text-emerald-400"
                        >
                          WITHIN MARGIN ·{" "}
                          {withinMarginCount}
                        </Badge>

                      </div>


                      <div className="mt-8 w-full rounded-xl border-l-4 border-red-500 bg-red-500/5 p-4">

                        <div className="flex items-start gap-2">

                          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-400" />

                          <div>

                            <p className="text-xs font-semibold">
                              Timing exposure
                            </p>

                            <p className="mt-1 text-xs leading-5 text-muted-foreground">

                              X + Y ={" "}
                              <strong className="text-foreground">
                                {exposureYears}
                              </strong>{" "}
                              years versus{" "}
                              <strong className="text-foreground">
                                {threatHorizonYears}
                              </strong>{" "}
                              years until the selected
                              quantum-threat year.

                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </CardContent>

                </Card>

              </div>


              {/* =========================================
                  SCENARIO RESULT
              ========================================= */}

              <div
                className={`rounded-xl border-l-4 p-5 ${
                  scenarioAtRisk
                    ? "border-red-500 bg-red-500/5"
                    : "border-emerald-500 bg-emerald-500/5"
                }`}
              >

                <div className="flex items-start gap-3">

                  {scenarioAtRisk ? (
                    <AlertTriangle className="mt-0.5 size-5 text-red-400" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 size-5 text-emerald-400" />
                  )}

                  <div>

                    <p className="text-sm font-semibold">
                      Mosca scenario result
                    </p>

                    <p className="mt-1 text-xs leading-6 text-muted-foreground">

                      X + Y = {moscaX} + {moscaY} ={" "}
                      {exposureYears} years.

                      The selected Z horizon is{" "}
                      {threatHorizonYears} years from the
                      current year ({currentYear}).

                      {" "}

                      {scenarioAtRisk
                        ? "The selected scenario therefore crosses the Mosca timing threshold."
                        : "The selected scenario remains within the selected timing horizon."}

                    </p>

                  </div>

                </div>

              </div>

            </CardContent>

          </Card>

        </TabsContent>


        {/* =================================================
            PQC RECOMMENDATIONS
        ================================================= */}

        <TabsContent
          value="pqc"
          className="space-y-4"
        >

          <Card>

            <CardHeader>

              <CardTitle>
                PQC Recommendations
              </CardTitle>

              <CardDescription>
                Recommendations already present in the QShieldX
                algorithm inventory.
              </CardDescription>

            </CardHeader>


            <CardContent>

              <div className="overflow-x-auto rounded-md border">

                <Table>

                  <TableHeader>

                    <TableRow>

                      <TableHead>
                        Algorithm
                      </TableHead>

                      <TableHead>
                        Vulnerability
                      </TableHead>

                      <TableHead>
                        Recommended PQC
                      </TableHead>

                      <TableHead>
                        Migration Priority
                      </TableHead>

                      <TableHead>
                        Used By
                      </TableHead>

                    </TableRow>

                  </TableHeader>


                  <TableBody>

                    {algorithms.map(
                      (
                        item: AnyRecord,
                        index: number,
                      ) => (

                        <TableRow key={index}>

                          <TableCell className="font-mono font-semibold">
                            {item.name}
                          </TableCell>

                          <TableCell>

                            <Badge
                              variant={
                                item.quantum_vulnerability ===
                                "Low"
                                  ? "outline"
                                  : item.quantum_vulnerability ===
                                      "Medium"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {item.quantum_vulnerability || "—"}
                            </Badge>

                          </TableCell>

                          <TableCell className="font-mono text-primary">
                            {item.pqc_recommendation || "—"}
                          </TableCell>

                          <TableCell>
                            {item.migration_priority || "—"}
                          </TableCell>

                          <TableCell>
                            {item.used_by || "—"}
                          </TableCell>

                        </TableRow>

                      ),
                    )}

                  </TableBody>

                </Table>

              </div>

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>

    </div>
  )
}