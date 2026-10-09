param([switch]$NoBrowser,[switch]$Stop)
$ErrorActionPreference='Stop'
$bassRoot=$PSScriptRoot
$bassPort=if($env:BASS_LOCAL_PORT){[int]$env:BASS_LOCAL_PORT}else{5175}
$bassUrl='http://127.0.0.1:'+$bassPort
$bassData=Join-Path $bassRoot 'data'
function Show-BassError([string]$text){
 if($NoBrowser){Write-Error $text;exit 1}
 Add-Type -AssemblyName System.Windows.Forms
 [System.Windows.Forms.MessageBox]::Show($text,'贝斯每日练习') | Out-Null
 exit 1
}
function Read-BassHealth {
 try { return Invoke-RestMethod -Uri ($bassUrl+'/health') -TimeoutSec 2 -UseBasicParsing } catch { return $null }
}
$bassHash=[System.Security.Cryptography.SHA256]::Create()
$bassBytes=$bassHash.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($bassRoot.ToLowerInvariant()))
$bassInstall=([System.BitConverter]::ToString($bassBytes).Replace('-','').ToLowerInvariant()).Substring(0,16)
function Matches-Bass($health){return ($health -and $health.app -eq 'bass-practice-local' -and $health.installation -eq $bassInstall)}
function Stop-BassInstance {
 $bassControl=Get-Content -LiteralPath (Join-Path $bassData 'server.json') -Raw -Encoding UTF8 | ConvertFrom-Json
 Invoke-RestMethod -Uri ($bassUrl+'/__stop') -Method Post -Headers @{'X-Bass-Control'=$bassControl.token} -TimeoutSec 8 -UseBasicParsing | Out-Null
 for($bassWait=0;$bassWait -lt 40;$bassWait++){
  if(!(Read-BassHealth)){return}
  Start-Sleep -Milliseconds 100
 }
 throw '旧服务尚未关闭，请稍后重新打开。练习记录已保留。'
}
try {
 $bassHealth=Read-BassHealth
 if($Stop){
  if(Matches-Bass $bassHealth){
   Stop-BassInstance
  }
  exit 0
 }
 if($bassHealth -and !(Matches-Bass $bassHealth)){Show-BassError '端口 5175 已被另一份工具占用，请先关闭另一份，再打开本文件夹内的版本。'}
 $bassParts=@('server.cjs','engine.cjs','lab-engine.cjs')|ForEach-Object{
  $bassFileBytes=[System.IO.File]::ReadAllBytes((Join-Path $bassRoot $_))
  ([System.BitConverter]::ToString($bassHash.ComputeHash($bassFileBytes))).Replace('-','').ToLowerInvariant()
 }
 $bassBuildBytes=$bassHash.ComputeHash([System.Text.Encoding]::UTF8.GetBytes(($bassParts -join ':')))
 $bassBuild=([System.BitConverter]::ToString($bassBuildBytes).Replace('-','').ToLowerInvariant())
 if((Matches-Bass $bassHealth) -and $bassHealth.build -ne $bassBuild){
  Stop-BassInstance
  $bassHealth=$null
 }
 if(!(Matches-Bass $bassHealth)){
  [System.IO.Directory]::CreateDirectory($bassData) | Out-Null
  $bassNode=Join-Path $bassRoot 'runtime/node.exe'
  $bassServer=Join-Path $bassRoot 'server.cjs'
  if(!(Test-Path -LiteralPath $bassNode)){Show-BassError '缺少 runtime/node.exe，请保留整个工具文件夹。'}
  $bassProcess=Start-Process -FilePath $bassNode -ArgumentList ('"'+$bassServer+'"') -WorkingDirectory $bassRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $bassData 'server.log') -RedirectStandardError (Join-Path $bassData 'server-error.log')
  for($bassTry=0;$bassTry -lt 40;$bassTry++){
   Start-Sleep -Milliseconds 250
   $bassHealth=Read-BassHealth
   if((Matches-Bass $bassHealth) -and $bassHealth.build -eq $bassBuild){break}
   if($bassProcess.HasExited){break}
  }
  if(!(Matches-Bass $bassHealth)){Show-BassError ('未能启动。请查看 '+(Join-Path $bassData 'server-error.log')+'；若端口 5175 被占用，请关闭占用程序后重试。')}
 }
 if(!$NoBrowser){Start-Process $bassUrl}
 Write-Output $bassUrl
} catch {Show-BassError $_.Exception.Message}
