param([switch]$Quiet)
$ErrorActionPreference='Stop'
try {
 $bassRoot=$PSScriptRoot
 $bassLauncher=Join-Path $bassRoot 'launch.ps1'
 if(!(Test-Path -LiteralPath $bassLauncher)){throw '缺少 launch.ps1，请先完整解压应用文件夹。'}
 $bassDesktop=[Environment]::GetFolderPath('Desktop')
 $bassShell=New-Object -ComObject WScript.Shell
 $bassShortcutPath=Join-Path $bassDesktop '贝斯每日练习.lnk'
 $bassShortcut=$bassShell.CreateShortcut($bassShortcutPath)
 $bassShortcut.TargetPath=Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
 $bassShortcut.Arguments='-NoLogo -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "'+$bassLauncher+'"'
 $bassShortcut.WorkingDirectory=$bassRoot
 $bassShortcut.Description='贝斯每日练习 · 本地版 · 七层教学、33 种音阶、音级地图与 Jam'
 $bassShortcut.WindowStyle=7
 $bassShortcut.Save()
 if(!$Quiet){Add-Type -AssemblyName System.Windows.Forms;[System.Windows.Forms.MessageBox]::Show('已创建桌面入口“贝斯每日练习”。以后双击它即可开始。','贝斯每日练习')|Out-Null}
 Write-Output $bassShortcutPath
} catch {
 if($Quiet){throw}
 Add-Type -AssemblyName System.Windows.Forms
 [System.Windows.Forms.MessageBox]::Show($_.Exception.Message,'创建桌面入口失败')|Out-Null
 exit 1
}
