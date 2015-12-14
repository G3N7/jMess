@echo off

set /p apiKey=Enter API Key:%=%
.nuget\nuget setApiKey %apiKey%

@echo ---------------------------------------------------
.nuget\nuget pack jMess.Build.nuspec -IncludeReferencedProjects -ExcludeEmptyDirectories -Build -Properties Configuration=Release
@echo Finished Building: jMess.Build
@echo ---------------------------------------------------

@echo Pushing To Nuget and SymbolSource...
set /p diStructureMapVersion=Enter jMess Package Version:%=%
.nuget\nuget push jMess.%diStructureMapVersion%.nupkg
@echo ---------------------------------------------------

pause