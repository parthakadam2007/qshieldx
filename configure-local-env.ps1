$ErrorActionPreference = "Stop"

function Get-LocalSupabaseValue {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,
        [Parameter(Mandatory = $true)]
        [string]$StatusOutput
    )

    $pattern = '(?m)^' + [regex]::Escape($Name) + '="([^"]*)"$'
    $match = [regex]::Match($StatusOutput, $pattern)
    if (-not $match.Success) {
        throw "Could not find $Name in Supabase status output. Make sure Supabase is running."
    }

    return $match.Groups[1].Value
}

function Set-EnvValue {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,
        [Parameter(Mandatory = $true)]
        [string]$Name,
        [Parameter(Mandatory = $true)]
        [string]$Value
    )

    $directory = Split-Path -Parent $Path
    if (-not (Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }

    $content = if (Test-Path $Path) { Get-Content $Path -Raw } else { "" }
    $line = '{0}="{1}"' -f $Name, $Value
    $pattern = '(?m)^' + [regex]::Escape($Name) + '=.*$'

    if ($content -match $pattern) {
        $content = [regex]::Replace($content, $pattern, $line)
    } else {
        $content = $content.TrimEnd() + "`r`n$line`r`n"
    }

    Set-Content -Path $Path -Value $content -NoNewline
}

Set-Location $PSScriptRoot

if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    throw "Node.js and npx are required. Install Node.js before running this script."
}

if (-not (Test-Path "supabase\config.toml")) {
    throw "supabase\config.toml was not found. Run this script from the QShieldX repository."
}

Write-Host "Reading local Supabase credentials..."
$statusOutputFile = Join-Path $env:TEMP "qshieldx-supabase-status-$PID.txt"
$statusErrorFile = Join-Path $env:TEMP "qshieldx-supabase-status-$PID.err"
$statusProcess = Start-Process -FilePath "npx.cmd" -ArgumentList @("supabase", "status", "-o", "env") -Wait -PassThru -NoNewWindow -RedirectStandardOutput $statusOutputFile -RedirectStandardError $statusErrorFile
$statusOutput = Get-Content $statusOutputFile -Raw
Remove-Item $statusOutputFile, $statusErrorFile -Force -ErrorAction SilentlyContinue

if ($statusProcess.ExitCode -ne 0) {
    throw "Could not read local Supabase status. Start it with: npx supabase start"
}

$apiUrl = Get-LocalSupabaseValue -Name "API_URL" -StatusOutput $statusOutput
$anonKey = Get-LocalSupabaseValue -Name "ANON_KEY" -StatusOutput $statusOutput
$serviceRoleKey = Get-LocalSupabaseValue -Name "SERVICE_ROLE_KEY" -StatusOutput $statusOutput

$frontendEnv = Join-Path $PSScriptRoot "frontend\.env.local"
Set-EnvValue -Path $frontendEnv -Name "NEXT_PUBLIC_SUPABASE_URL" -Value $apiUrl
Set-EnvValue -Path $frontendEnv -Name "NEXT_PUBLIC_SUPABASE_ANON_KEY" -Value $anonKey

$backendEnv = Join-Path $PSScriptRoot "backend\.env"
Set-EnvValue -Path $backendEnv -Name "SUPABASE_URL" -Value $apiUrl
Set-EnvValue -Path $backendEnv -Name "SUPABASE_ANON_KEY" -Value $anonKey
Set-EnvValue -Path $backendEnv -Name "SUPABASE_SERVICE_ROLE_KEY" -Value $serviceRoleKey

Write-Host "Local environment variables configured."
Write-Host "Frontend: frontend\.env.local"
Write-Host "Backend:  backend\.env"
Write-Host "Supabase: $apiUrl"