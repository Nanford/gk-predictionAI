param(
  [string]$InputPath = "",
  [string]$OutputPath = (Join-Path $PSScriptRoot "..\data\import\universities.csv")
)

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
if (-not $InputPath) {
  $InputPath = Get-ChildItem -LiteralPath $projectRoot -Filter "*.xls" |
    Select-Object -First 1 -ExpandProperty FullName
}
if (-not $InputPath) {
  throw "No .xls workbook was found in the project root."
}

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
  $workbook = $excel.Workbooks.Open((Resolve-Path $InputPath))
  $sheet = $workbook.Worksheets.Item(1)
  $values = $sheet.UsedRange.Value2
  $provinceName = ""
  $rows = [System.Collections.Generic.List[object]]::new()

  for ($row = 1; $row -le $values.GetLength(0); $row++) {
    $first = [string]($values[$row, 1])
    $name = [string]($values[$row, 2])
    $code = [string]($values[$row, 3])

    foreach ($candidate in @($first, $name)) {
      if ($candidate -match "\d" -and $candidate -notmatch "^\d+$") {
        $provinceName = (($candidate -replace "\d.*$", "") -replace "[^\p{L}]+$", "").Trim()
      }
    }

    if ($code -match "^\d+$" -and $name) {
      $rows.Add([pscustomobject]@{
        code = $code
        name = $name
        authority = [string]($values[$row, 4])
        province_name = $provinceName
        city = [string]($values[$row, 5])
        education_level = [string]($values[$row, 6])
        remark = [string]($values[$row, 7])
      })
    }
  }

  $outputDirectory = Split-Path -Parent $OutputPath
  New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null
  $rows | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
  Write-Output "Exported $($rows.Count) universities to $OutputPath."
} finally {
  if ($workbook) {
    $workbook.Close($false)
  }
  $excel.Quit()
  [Runtime.InteropServices.Marshal]::FinalReleaseComObject($excel) | Out-Null
}
