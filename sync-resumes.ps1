# Run this after the Claude Resume project updates your resumes.
# Copies the latest PDFs and TeX files into the site's assets/Resumes folder.

$src = "C:\Users\avich\OneDrive\Documents\Claude\Projects\Resume\Avi_Gobrin_resume_2026"
$dst = "$PSScriptRoot\assets\Resumes"

Copy-Item -Path "$src\*.pdf" -Destination $dst -Force
Copy-Item -Path "$src\*.tex" -Destination $dst -Force

Write-Host "Synced resumes from $src to $dst."
