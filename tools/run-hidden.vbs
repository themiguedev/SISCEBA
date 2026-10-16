' ==============================================================================
' SICE-CBA - Lanzador Oculto en Segundo Plano (Sin Ventana de Consola)
' Compatible con Windows 11 y Windows Terminal (wt.exe)
' ==============================================================================
Dim ws, i, cmdLine

Set ws = CreateObject("WScript.Shell")

If WScript.Arguments.Count = 0 Then
  WScript.Quit 1
End If

cmdLine = ""
For i = 0 To WScript.Arguments.Count - 1
  Dim arg
  arg = WScript.Arguments(i)
  If InStr(arg, " ") > 0 Then
    arg = """" & arg & """"
  End If
  If cmdLine = "" Then
    cmdLine = arg
  Else
    cmdLine = cmdLine & " " & arg
  End If
Next

' Usar cmd.exe /c start /b con SW_HIDE (0) para garantizar que Windows Terminal NO abra ventanas
ws.Run "cmd.exe /c start /b " & cmdLine, 0, False
