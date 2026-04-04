"use client";

import * as React from "react";
import { Play, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface CodeChallengeProps {
  id: string;
  initialCode: string;
  expectedOutput: string;
  successMessage?: string;
  height?: number;
}

export function CodeChallenge({ id, initialCode, expectedOutput, successMessage = "🎉 Misi Berhasil! Logika Anda Sempurna!", height = 240 }: CodeChallengeProps) {
  const [src, setSrc] = React.useState(initialCode.trim());
  const [ran, setRan] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (id) {
      const cached = localStorage.getItem(`vd_cc_${id}`);
      if (cached && cached !== initialCode.trim()) {
        setSrc(cached);
      }
      const passed = localStorage.getItem(`vd_cc_passed_${id}`);
      if (passed === "true") {
        setIsSuccess(true);
      }
    }
  }, [id, initialCode]);

  React.useEffect(() => {
    if (id) {
      if (src !== initialCode.trim()) {
        localStorage.setItem(`vd_cc_${id}`, src);
      } else {
        localStorage.removeItem(`vd_cc_${id}`);
      }
    }
  }, [src, id, initialCode]);

  React.useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Validate expected structure
      if (e.data && e.data.type === 'VD_CODE_EXPECTATION') {
        const out = e.data.payload.trim();
        const expected = expectedOutput.trim();
        setIsLoading(false);
        
        if (out === expected || out.includes(expected)) {
           setIsSuccess(true);
           if (id) localStorage.setItem(`vd_cc_passed_${id}`, "true");
           confetti({
             particleCount: 150,
             spread: 70,
             origin: { y: 0.6 }
           });
        } else {
           setIsSuccess(false);
        }
      } else if (e.data && e.data.type === 'VD_CODE_RUNNING') {
        setIsLoading(true);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [expectedOutput, id]);

  const run = () => {
    setIsSuccess(null);
    setIsLoading(true);
    setRan(true);

    const encodedCode = encodeURIComponent(src);
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Courier New', Courier, monospace; font-size: 13px; margin: 0; padding: 12px; background: #0f172a; color: #f8fafc; line-height: 1.5; }
          #output { white-space: pre-wrap; word-wrap: break-word; }
          .error { color: #f43f5e; }
          .loading { color: #94a3b8; font-style: italic; }
        </style>
      </head>
      <body>
        <div id="output"><span class="loading">Evaluating code...</span></div>
        <script>
          const outDiv = document.getElementById('output');
          let capturedOutput = "";
          let isFirstLine = true;
          
          window.parent.postMessage({ type: 'VD_CODE_RUNNING' }, '*');
          
          function printOut(text) {
            capturedOutput += text + "\\n";
            if(isFirstLine) { outDiv.innerHTML = ""; isFirstLine = false; }
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
              
              if(isFirstLine) { outDiv.innerHTML = "<span class='loading'>[No Output]</span>"; }
              
              // SEND RESULT BACK TO REACT PARENT
              window.parent.postMessage({ type: 'VD_CODE_EXPECTATION', payload: capturedOutput }, '*');

            } catch (err) {
              if(isFirstLine) { outDiv.innerHTML = ""; isFirstLine = false; }
              outDiv.innerHTML += "<br/><span class='error'><strong>ERROR:</strong><br/>" + err.message + "</span>";
              window.parent.postMessage({ type: 'VD_CODE_EXPECTATION', payload: 'ERROR' }, '*');
            }
          }
          // main(); 
        </script>
        <script src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js" onload="main()" onerror="outDiv.innerHTML = '<span class=\\'error\\'>Koneksi Internet Gagal: Tidak dapat mengunduh Pyodide. Pastikan Anda terkoneksi ke internet.</span>'; window.parent.postMessage({ type: 'VD_CODE_EXPECTATION', payload: 'ERROR' }, '*');"></script>
      </body>
      </html>
    `;
    
    if (iframeRef.current) {
        iframeRef.current.srcdoc = htmlTemplate;
    }
  }

  const reset = () => {
    setSrc(initialCode.trim())
    setRan(false)
    setIsSuccess(null)
    setIsLoading(false)
    if (id) {
       localStorage.removeItem(`vd_cc_${id}`);
       localStorage.removeItem(`vd_cc_passed_${id}`);
    }
    if (iframeRef.current) iframeRef.current.srcdoc = "";
  }

  return (
    <div className="not-prose my-8 relative group p-[1.5px] rounded-2xl overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
      {/* Animated shimmering border background */}
      <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,var(--color-primary)_0%,transparent_10%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full bg-card rounded-[14px] overflow-hidden border border-border">
        {/* Target Banner */}
        <div className="bg-primary/5 px-4 py-3 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
           <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full">Mini-Mission</span>
              <span className="text-sm font-medium text-foreground">Target Output: <code className="bg-background px-1.5 py-0.5 rounded text-primary border border-border">{expectedOutput}</code></span>
           </div>
           {isSuccess === true && (
               <div className="flex items-center gap-1.5 text-green-500 text-sm font-bold animate-in fade-in zoom-in">
                   <CheckCircle2 className="w-4 h-4" /> LULUS
               </div>
           )}
           {isSuccess === false && (
               <div className="flex items-center gap-1.5 text-rose-500 text-sm font-bold animate-in fade-in zoom-in">
                   <XCircle className="w-4 h-4" /> GAGAL
               </div>
           )}
        </div>

        <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-muted/30 border-b text-xs text-muted-foreground font-mono">
          <span className="flex-1 opacity-70">Tulis Kodemu Disini (Auto-Saved)</span>
          <button onClick={reset} className="inline-flex items-center gap-1 hover:text-foreground transition-colors focus:outline-none">
            <RotateCcw className="h-3 w-3" /> Ulangi
          </button>
          <button 
            onClick={run} 
            disabled={isLoading}
            className={cn(
               "inline-flex items-center gap-1.5 rounded px-3 py-1 font-medium transition-colors text-primary-foreground shadow-sm focus:outline-none",
               isLoading ? "bg-primary/50 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
            )}>
            <Play className="h-3.5 w-3.5" /> {isLoading ? "Memeriksa..." : "Jalankan Validasi"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-x md:divide-y-0 divide-border">
          {/* Editor */}
          <textarea
            value={src}
            onChange={e => {
               setSrc(e.target.value);
               setIsSuccess(null);
            }}
            className={cn(
              "w-full resize-none bg-[#0f172a] p-4 font-mono text-[13px] leading-relaxed outline-none text-[#f8fafc] placeholder:text-zinc-600",
            )}
            style={{ height }}
            spellCheck={false}
          />

          {/* Output */}
          <div className="relative bg-[#0f172a] border-t md:border-t-0 p-4">
            {!ran ? (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-[#94a3b8] text-sm font-mono bg-[#0f172a] z-10 opacity-70">
                <Play className="w-8 h-8 opacity-20" />
                <span className="text-center px-4">Klik "Jalankan Validasi" untuk mencoba.</span>
              </div>
            ) : null}
            
            <iframe
              ref={iframeRef}
              title="challenge-output"
              className={cn("w-full bg-[#0f172a] rounded overflow-hidden", !ran && "opacity-0")}
              style={{ height: height - 32, border: 'none' }}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
        
        {isSuccess === true && (
            <div className="bg-green-500/10 px-4 py-3 border-t border-green-500/20 text-green-600 font-semibold text-sm flex items-center gap-2">
               <CheckCircle2 className="w-5 h-5 shrink-0" />
               {successMessage}
            </div>
        )}
        {isSuccess === false && (
            <div className="bg-rose-500/10 px-4 py-3 border-t border-rose-500/20 text-rose-600 font-semibold text-sm flex items-center gap-2">
               <XCircle className="w-5 h-5 shrink-0" />
               <span className="leading-snug">Output Terminal tidak sesuai target. Mohon periksa kembali logika kodingan Anda!</span>
            </div>
        )}
      </div>
    </div>
  )
}
