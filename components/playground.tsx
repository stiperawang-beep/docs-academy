"use client"

import * as React from "react"
import { Play, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlaygroundProps {
  id?: string
  code: string
  language?: "html" | "js" | "python"
  height?: number
}

export function Playground({ id, code, language = "python", height = 240 }: PlaygroundProps) {
  const [src, setSrc] = React.useState(code.trim())
  const [output, setOutput] = React.useState(code.trim())
  const [ran, setRan] = React.useState(false)

  const [isLoading, setIsLoading] = React.useState(false)

  // Load from Cache Strategy
  React.useEffect(() => {
    if (id) {
      const cached = localStorage.getItem(`vd_pg_${id}`);
      if (cached && cached !== code.trim()) {
        setSrc(cached);
      }
    }
  }, [id, code]);

  // Save to Cache Strategy
  React.useEffect(() => {
    if (id) {
      if (src !== code.trim()) {
        localStorage.setItem(`vd_pg_${id}`, src);
      } else {
        localStorage.removeItem(`vd_pg_${id}`); // Clean up if default
      }
    }
  }, [src, id, code]);

  const run = () => {
    let finalHtml = "";
    
    if (language === "python") {
      const encodedCode = encodeURIComponent(src);
      finalHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Courier New', Courier, monospace; font-size: 13px; margin: 0; padding: 12px; background: #ffffff; color: #1a1b26; line-height: 1.5; }
          #output { white-space: pre-wrap; word-wrap: break-word; }
          .error { color: #e11d48; }
          .loading { color: #64748b; font-style: italic; }
          .highlight { display: inline-block; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; margin-bottom: 8px; font-weight: bold; font-size: 11px; color: #3b82f6;}
        </style>
      </head>
      <body>
        <div id="output"><span class="loading">Memanaskan Mesin Python (WASM Pyodide)... Harap tunggu sebentar.</span></div>
        <script>
          const outDiv = document.getElementById('output');
          let isFirstLine = true;
          
          function printOut(text) {
            if(isFirstLine) { outDiv.innerHTML = "<div class='highlight'>Terminal Output:</div><br/>"; isFirstLine = false; }
            // Escape HTML text safely
            const div = document.createElement('div');
            div.textContent = text;
            outDiv.innerHTML += div.innerHTML + "\\n";
          }
          
          function printErr(text) {
             if(isFirstLine) { outDiv.innerHTML = ""; isFirstLine = false; }
             const div = document.createElement('div');
             div.textContent = text;
             outDiv.innerHTML += "<span class='error'>" + div.innerHTML + "</span>\\n";
          }
          
          async function main() {
            try {
              let pyodide = await loadPyodide({
                stdout: printOut,
                stderr: printErr
              });
              const pythonCode = decodeURIComponent("${encodedCode}");
              await pyodide.runPythonAsync(pythonCode);
              
              if(isFirstLine) { // If nothing printed yet
                 outDiv.innerHTML = "<div class='highlight'>Status:</div><span style='color: #16a34a;'>[Program Selesai - Tidak ada nilai print ke layar]</span>";
              }
            } catch (err) {
              if(isFirstLine) { outDiv.innerHTML = ""; isFirstLine = false; }
              outDiv.innerHTML += "<br/><span class='error'><strong>FATAL ERROR:</strong><br/>" + err.message + "</span>";
            }
          }
          // main(); DO NOT CALL HERE, WAIT FOR SCRIPT TO LOAD
        </script>
        <script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js" onload="main()" onerror="outDiv.innerHTML = '<span class=\\'error\\'>Koneksi Internet Gagal: Tidak dapat mengunduh Pyodide. Pastikan Anda terkoneksi ke internet.</span>'"></script>
      </body>
      </html>
      `;
    } else if (language === "js") {
      finalHtml = `<script>${src}</script>`;
    } else {
      finalHtml = src;
    }
    
    setOutput(finalHtml)
    setRan(true)
  }

  const reset = () => {
    setSrc(code.trim())
    setOutput(code.trim())
    setRan(false)
    if (id) localStorage.removeItem(`vd_pg_${id}`)
  }

  return (
    <div className="not-prose my-6 rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b text-xs text-muted-foreground font-mono">
        <span className="flex-1">▶ Live Playground — {language.toUpperCase()}</span>
        <button onClick={reset} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
        <button onClick={run} className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground rounded px-2 py-0.5 hover:bg-primary/90 transition-colors font-medium">
          <Play className="h-3 w-3" /> Run
        </button>
      </div>

      <div className="grid grid-cols-2 divide-x divide-border">
        {/* Editor */}
        <div>
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground border-b bg-muted/30">Editor</div>
          <textarea
            value={src}
            onChange={e => setSrc(e.target.value)}
            className={cn(
              "w-full resize-none bg-background p-3 font-mono text-xs leading-5 outline-none text-foreground",
            )}
            style={{ height }}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div>
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground border-b bg-muted/30">
            {ran ? "Output" : "Preview (click Run)"}
          </div>
          {ran ? (
            <iframe
              srcDoc={output}
              title="playground-output"
              className="w-full bg-white"
              style={{ height }}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="flex items-center justify-center text-muted-foreground/40 text-xs font-mono" style={{ height }}>
              Click ▶ Run to see output
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
