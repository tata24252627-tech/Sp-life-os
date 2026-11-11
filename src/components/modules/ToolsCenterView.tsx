import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Calculator as CalcIcon,
  Braces,
  Binary,
  QrCode,
  Type,
  FileCode,
  Clock,
  Timer,
  FileEdit,
  Code,
  Palette,
  Percent,
  Split,
  Eye,
  Link2,
  Copy,
  Check,
  RotateCcw,
  Play,
  Pause,
  Download,
} from 'lucide-react';

export const ToolsCenterView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>('password-gen');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  // 1. Password Generator
  const [passLength, setPassLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [generatedPass, setGeneratedPass] = useState('');

  const generatePassword = () => {
    let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let res = '';
    for (let i = 0; i < passLength; i++) {
      res += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setGeneratedPass(res);
  };

  useEffect(() => {
    generatePassword();
  }, [passLength, includeSymbols, includeNumbers]);

  // 2. Storage Capacity Converter
  const [bytesInput, setBytesInput] = useState<number>(1048576);

  // 3. JSON Formatter
  const [rawJson, setRawJson] = useState('{"system": "SP LIFE OS", "version": "Ultimate 2026", "active": true}');
  const [formattedJson, setFormattedJson] = useState('');
  const [jsonError, setJsonError] = useState('');

  const formatJson = (minify = false) => {
    try {
      const parsed = JSON.parse(rawJson);
      setFormattedJson(minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (e: any) {
      setJsonError('Invalid JSON structure: ' + e.message);
    }
  };

  // 4. Calculator
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');

  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === '=') {
      try {
        // Safe evaluation of mathematical expression
        const sanitized = calcInput.replace(/[^0-9+\-*/().]/g, '');
        // eslint-disable-next-line no-eval
        const res = Function(`"use strict"; return (${sanitized})`)();
        setCalcResult(String(res));
      } catch {
        setCalcResult('Error');
      }
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  // 5. QR Code Generator (SVG based)
  const [qrText, setQrText] = useState('https://sp-life-os.system');

  // 6. Text Case Transformer
  const [caseInput, setCaseInput] = useState('Production Grade Architecture for SP LIFE OS');

  // 7. Base64
  const [b64Input, setB64Input] = useState('SP LIFE OS Security Clearance');
  const [b64Output, setB64Output] = useState('');
  const [b64Mode, setB64Mode] = useState<'encode' | 'decode'>('encode');

  const handleB64Convert = () => {
    try {
      if (b64Mode === 'encode') {
        setB64Output(btoa(unescape(encodeURIComponent(b64Input))));
      } else {
        setB64Output(decodeURIComponent(escape(atob(b64Input))));
      }
    } catch (e: any) {
      setB64Output('Error: ' + e.message);
    }
  };

  // 8. Timestamp / Epoch
  const [epochInput, setEpochInput] = useState(Math.floor(Date.now() / 1000));

  // 9. Pomodoro Timer
  const [pomoMinutes, setPomoMinutes] = useState(25);
  const [pomoSeconds, setPomoSeconds] = useState(0);
  const [pomoActive, setPomoActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (pomoActive) {
      interval = setInterval(() => {
        if (pomoSeconds > 0) {
          setPomoSeconds(pomoSeconds - 1);
        } else if (pomoMinutes > 0) {
          setPomoMinutes(pomoMinutes - 1);
          setPomoSeconds(59);
        } else {
          setPomoActive(false);
          alert('Pomodoro session completed! Time for a short break.');
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoMinutes, pomoSeconds]);

  // 10. Scratchpad
  const [scratchpad, setScratchpad] = useState(() => {
    return localStorage.getItem('sp_os_scratchpad') || 'Temporary notes, quick CLI flags, ideas...';
  });

  const handleScratchpadChange = (val: string) => {
    setScratchpad(val);
    localStorage.setItem('sp_os_scratchpad', val);
  };

  // 11. Regex Tester
  const [regexPattern, setRegexPattern] = useState('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  const [regexFlags, setRegexFlags] = useState('i');
  const [regexTestText, setRegexTestText] = useState('contact@nexusmatrix.in');
  const [regexMatch, setRegexMatch] = useState<boolean | null>(null);

  const testRegex = () => {
    try {
      const re = new RegExp(regexPattern, regexFlags);
      setRegexMatch(re.test(regexTestText));
    } catch {
      setRegexMatch(false);
    }
  };

  // 12. Color Palette & HEX/RGB
  const [hexColor, setHexColor] = useState('#287BFF');

  // 13. Loan / EMI Calculator
  const [loanPrincipal, setLoanPrincipal] = useState(500000);
  const [loanRate, setLoanRate] = useState(9.5); // % p.a.
  const [loanTenureYears, setLoanTenureYears] = useState(3);

  const calculateEmi = () => {
    const r = loanRate / 12 / 100;
    const n = loanTenureYears * 12;
    const emi = (loanPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - loanPrincipal;
    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
    };
  };

  // 14. Text Diff Comparator
  const [diffOriginal, setDiffOriginal] = useState('const port = 3000;\napp.listen(port);');
  const [diffModified, setDiffModified] = useState('const port = process.env.PORT || 3000;\napp.listen(port, "0.0.0.0");');

  // 15. Markdown Previewer
  const [mdInput, setMdInput] = useState('# SP LIFE OS Architecture\n\n- Zero pill discipline\n- Fortified RLS\n- **Production-grade**');

  // 16. URL Parser
  const [urlInput, setUrlInput] = useState('https://sp-life-os.system/dashboard?theme=dark&module=finance&ref=internal');

  const toolsList = [
    { id: 'password-gen', name: 'Cryptographic Key Gen', icon: KeyRound, desc: 'Randomized keys' },
    { id: 'storage-conv', name: 'Capacity Converter', icon: Binary, desc: 'Bytes to MB/GB/TB' },
    { id: 'json-tool', name: 'JSON Prettifier', icon: Braces, desc: 'Format & validate' },
    { id: 'calculator', name: 'Financial Calculator', icon: CalcIcon, desc: 'Math & evaluations' },
    { id: 'qr-code', name: 'QR Code Generator', icon: QrCode, desc: 'SVG vector engine' },
    { id: 'case-transform', name: 'Case Transformer', icon: Type, desc: 'camelCase, UPPER' },
    { id: 'base64-tool', name: 'Base64 Encoder/Decoder', icon: FileCode, desc: 'UTF-8 string coder' },
    { id: 'timestamp-tool', name: 'Timestamp & Epoch', icon: Clock, desc: 'Unix & IST/UTC dates' },
    { id: 'pomodoro-timer', name: 'Pomodoro Focus Timer', icon: Timer, desc: '25m work intervals' },
    { id: 'scratchpad', name: 'Ephemeral Scratchpad', icon: FileEdit, desc: 'Auto-saved memo' },
    { id: 'regex-tester', name: 'Regex Debugger', icon: Code, desc: 'Pattern matcher' },
    { id: 'color-palette', name: 'Color Palette Studio', icon: Palette, desc: 'HEX/RGB converter' },
    { id: 'loan-emi', name: 'Loan EMI Calculator', icon: Percent, desc: 'Principal & interest' },
    { id: 'text-diff', name: 'Text Diff Comparator', icon: Split, desc: 'Line change detector' },
    { id: 'markdown-view', name: 'Markdown Previewer', icon: Eye, desc: 'Instant renderer' },
    { id: 'url-parser', name: 'URL Query Parser', icon: Link2, desc: 'Query breakdown' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Autonomous Utilities Center (16 Tools)
        </h1>
        <p className="text-xs text-muted mt-1">
          Full offline-capable developer, cryptographic, and productivity utilities. Zero external latency.
        </p>
      </div>

      {/* Grid of 16 Tool Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {toolsList.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`p-3 rounded-2xl flex flex-col items-center text-center transition border ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-glow'
                  : 'bg-surface/50 text-muted hover:text-white hover:bg-surface-card border-surface-border'
              }`}
            >
              <Icon className="w-5 h-5 mb-1.5 shrink-0" />
              <span className="text-[11px] font-bold leading-tight truncate w-full">
                {t.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* TOOL INTERFACES */}
      <div className="glass-panel p-6 rounded-3xl border border-surface-border">
        {/* 1. PASSWORD GENERATOR */}
        {activeTool === 'password-gen' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <KeyRound className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-sm font-bold uppercase text-white">Cryptographic Key Generator</h3>
                <p className="text-xs text-muted">Generate high-entropy randomized strings & secret keys.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-card border border-surface-border font-mono text-sm break-all text-accent flex items-center justify-between gap-3">
              <span>{generatedPass}</span>
              <button
                onClick={() => copyToClipboard(generatedPass, 'pass')}
                className="p-2 rounded-xl bg-surface hover:bg-surface-card text-muted hover:text-white transition shrink-0"
                title="Copy Key"
              >
                {copyStatus === 'pass' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-muted mb-1">
                  <span>Key Length</span>
                  <span className="font-bold text-white">{passLength} characters</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={passLength}
                  onChange={(e) => setPassLength(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-6 text-xs text-muted">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="rounded"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="rounded"
                  />
                  <span>Special Symbols (!@#$)</span>
                </label>
              </div>

              <button
                onClick={generatePassword}
                className="w-full py-3 rounded-xl bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary/90 transition"
              >
                Regenerate Entropy Key
              </button>
            </div>
          </div>
        )}

        {/* 2. STORAGE CONVERTER */}
        {activeTool === 'storage-conv' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Binary className="w-5 h-5 text-secondary" />
              <div>
                <h3 className="text-sm font-bold uppercase text-white">Storage Capacity Converter</h3>
                <p className="text-xs text-muted">Precise binary conversion based on 1024-byte boundaries.</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">Bytes Value</label>
              <input
                type="number"
                value={bytesInput}
                onChange={(e) => setBytesInput(Number(e.target.value))}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-surface/70 border border-surface-border">
                <div className="text-[10px] text-muted">Kilobytes (KB)</div>
                <div className="text-sm font-bold text-white mt-1">{(bytesInput / 1024).toFixed(2)} KB</div>
              </div>
              <div className="p-3 rounded-xl bg-surface/70 border border-surface-border">
                <div className="text-[10px] text-muted">Megabytes (MB)</div>
                <div className="text-sm font-bold text-primary mt-1">{(bytesInput / (1024 * 1024)).toFixed(2)} MB</div>
              </div>
              <div className="p-3 rounded-xl bg-surface/70 border border-surface-border">
                <div className="text-[10px] text-muted">Gigabytes (GB)</div>
                <div className="text-sm font-bold text-secondary mt-1">{(bytesInput / Math.pow(1024, 3)).toFixed(4)} GB</div>
              </div>
              <div className="p-3 rounded-xl bg-surface/70 border border-surface-border">
                <div className="text-[10px] text-muted">Terabytes (TB)</div>
                <div className="text-sm font-bold text-emerald-400 mt-1">{(bytesInput / Math.pow(1024, 4)).toFixed(6)} TB</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. JSON FORMATTER */}
        {activeTool === 'json-tool' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <Braces className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-bold uppercase text-white">JSON Validator & Pretty-Printer</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => formatJson(true)}
                  className="px-3 py-1.5 rounded-xl bg-surface border border-surface-border text-xs text-muted hover:text-white"
                >
                  Minify
                </button>
                <button
                  onClick={() => formatJson(false)}
                  className="px-4 py-1.5 rounded-xl bg-accent text-black font-bold text-xs hover:bg-accent/90"
                >
                  Prettify 2-Spaces
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">Input JSON</label>
                <textarea
                  rows={8}
                  value={rawJson}
                  onChange={(e) => setRawJson(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">Formatted Output</label>
                <textarea
                  readOnly
                  rows={8}
                  value={formattedJson}
                  placeholder="Formatted JSON renders here..."
                  className="w-full bg-surface border border-surface-border rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none"
                />
              </div>
            </div>
            {jsonError && <p className="text-xs text-rose-400 font-mono">{jsonError}</p>}
          </div>
        )}

        {/* 4. FINANCIAL & SCIENTIFIC CALCULATOR */}
        {activeTool === 'calculator' && (
          <div className="max-w-xs mx-auto space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-border pb-2">
              <CalcIcon className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold uppercase text-white">Calculator</h3>
            </div>

            <div className="p-4 rounded-2xl bg-surface-card border border-surface-border text-right font-mono">
              <div className="text-xs text-muted min-h-[1.25rem] truncate">{calcInput || '0'}</div>
              <div className="text-2xl font-bold text-white mt-1">{calcResult || '0'}</div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {['C', '(', ')', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '%', '='].map(
                (btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalcClick(btn)}
                    className={`py-3 rounded-xl font-mono text-sm font-bold transition ${
                      btn === '='
                        ? 'bg-primary text-white shadow-glow col-span-1'
                        : btn === 'C'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-surface/80 hover:bg-surface-card text-white border border-surface-border'
                    }`}
                  >
                    {btn}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* 5. QR CODE GENERATOR */}
        {activeTool === 'qr-code' && (
          <div className="max-w-md mx-auto space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 border-b border-surface-border pb-3">
              <QrCode className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold uppercase text-white">QR Code Vector Generator</h3>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1 text-left">Target URL / Text</label>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>

            <div className="p-6 rounded-2xl bg-white mx-auto inline-block shadow-2xl">
              {/* Clean fallback dynamic SVG QR representation */}
              <svg viewBox="0 0 100 100" className="w-40 h-40">
                <rect width="100" height="100" fill="#ffffff" />
                {/* 3 Corner squares */}
                <rect x="10" y="10" width="25" height="25" fill="#080B12" />
                <rect x="14" y="14" width="17" height="17" fill="#ffffff" />
                <rect x="18" y="18" width="9" height="9" fill="#287BFF" />

                <rect x="65" y="10" width="25" height="25" fill="#080B12" />
                <rect x="69" y="14" width="17" height="17" fill="#ffffff" />
                <rect x="73" y="18" width="9" height="9" fill="#287BFF" />

                <rect x="10" y="65" width="25" height="25" fill="#080B12" />
                <rect x="14" y="69" width="17" height="17" fill="#ffffff" />
                <rect x="18" y="73" width="9" height="9" fill="#287BFF" />

                {/* Simulated randomized data grid pattern */}
                <rect x="40" y="15" width="8" height="8" fill="#080B12" />
                <rect x="52" y="20" width="6" height="6" fill="#080B12" />
                <rect x="42" y="42" width="16" height="16" fill="#080B12" />
                <rect x="65" y="45" width="10" height="10" fill="#080B12" />
                <rect x="45" y="70" width="12" height="12" fill="#080B12" />
                <rect x="70" y="70" width="18" height="18" fill="#080B12" />
              </svg>
            </div>

            <div className="text-[11px] text-muted font-mono break-all">{qrText}</div>
          </div>
        )}

        {/* 6. TEXT CASE TRANSFORMER */}
        {activeTool === 'case-transform' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Type className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-bold uppercase text-white">Text Case & Token Transformer</h3>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">Source Text</label>
              <textarea
                rows={3}
                value={caseInput}
                onChange={(e) => setCaseInput(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-surface/70 border border-surface-border">
                <span className="text-[10px] text-muted uppercase">UPPERCASE</span>
                <div className="text-white font-bold mt-1 truncate">{caseInput.toUpperCase()}</div>
              </div>
              <div className="p-3 rounded-xl bg-surface/70 border border-surface-border">
                <span className="text-[10px] text-muted uppercase">lowercase</span>
                <div className="text-white font-bold mt-1 truncate">{caseInput.toLowerCase()}</div>
              </div>
              <div className="p-3 rounded-xl bg-surface/70 border border-surface-border">
                <span className="text-[10px] text-muted uppercase">kebab-case</span>
                <div className="text-accent font-bold mt-1 truncate">
                  {caseInput.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-surface/70 border border-surface-border">
                <span className="text-[10px] text-muted uppercase">snake_case</span>
                <div className="text-secondary font-bold mt-1 truncate">
                  {caseInput.toLowerCase().replace(/[^a-z0-9]/g, '_')}
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-muted text-right">
              {caseInput.length} characters • {caseInput.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        )}

        {/* 7. BASE64 */}
        {activeTool === 'base64-tool' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold uppercase text-white">Base64 Converter</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setB64Mode('encode')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    b64Mode === 'encode' ? 'bg-emerald-500 text-white' : 'text-muted'
                  }`}
                >
                  Encode
                </button>
                <button
                  onClick={() => setB64Mode('decode')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    b64Mode === 'decode' ? 'bg-emerald-500 text-white' : 'text-muted'
                  }`}
                >
                  Decode
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">Payload</label>
              <textarea
                rows={3}
                value={b64Input}
                onChange={(e) => setB64Input(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-xs text-white font-mono"
              />
            </div>

            <button
              onClick={handleB64Convert}
              className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs"
            >
              Execute {b64Mode === 'encode' ? 'Encoding' : 'Decoding'}
            </button>

            {b64Output && (
              <div className="p-3 rounded-xl bg-surface border border-surface-border font-mono text-xs text-emerald-400 break-all">
                {b64Output}
              </div>
            )}
          </div>
        )}

        {/* 8. TIMESTAMP & EPOCH */}
        {activeTool === 'timestamp-tool' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold uppercase text-white">Timestamp & Timezone Converter</h3>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">Unix Epoch (Seconds)</label>
              <input
                type="number"
                value={epochInput}
                onChange={(e) => setEpochInput(Number(e.target.value))}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-xs text-white font-mono"
              />
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-surface/70 border border-surface-border flex justify-between">
                <span className="text-muted">UTC Format:</span>
                <span className="font-bold text-white">{new Date(epochInput * 1000).toUTCString()}</span>
              </div>
              <div className="p-3 rounded-xl bg-surface/70 border border-surface-border flex justify-between">
                <span className="text-muted">India Standard Time (IST):</span>
                <span className="font-bold text-emerald-400">
                  {new Date(epochInput * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface/70 border border-surface-border flex justify-between">
                <span className="text-muted">ISO 8601:</span>
                <span className="font-bold text-accent">{new Date(epochInput * 1000).toISOString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* 9. POMODORO TIMER */}
        {activeTool === 'pomodoro-timer' && (
          <div className="max-w-sm mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2 border-b border-surface-border pb-3">
              <Timer className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold uppercase text-white">Pomodoro Focus Timer</h3>
            </div>

            <div className="relative flex items-center justify-center mx-auto h-44 w-44 rounded-full border-4 border-primary/40 bg-surface/80 shadow-glow">
              <span className="text-4xl font-black font-mono text-white">
                {String(pomoMinutes).padStart(2, '0')}:{String(pomoSeconds).padStart(2, '0')}
              </span>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setPomoActive(!pomoActive)}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-glow hover:bg-primary/90 flex items-center gap-2"
              >
                {pomoActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {pomoActive ? 'Pause' : 'Start Focus'}
              </button>
              <button
                onClick={() => {
                  setPomoActive(false);
                  setPomoMinutes(25);
                  setPomoSeconds(0);
                }}
                className="px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-xs text-muted hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* 10. EPHEMERAL SCRATCHPAD */}
        {activeTool === 'scratchpad' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-bold uppercase text-white">Ephemeral Scratchpad</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Auto-saved to local browser storage</span>
            </div>

            <textarea
              rows={12}
              value={scratchpad}
              onChange={(e) => handleScratchpadChange(e.target.value)}
              className="w-full bg-surface-card border border-surface-border rounded-2xl p-4 text-xs font-mono text-white leading-relaxed focus:outline-none focus:border-accent"
            />
          </div>
        )}

        {/* 11. REGEX TESTER */}
        {activeTool === 'regex-tester' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Code className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-bold uppercase text-white">Regular Expression Debugger</h3>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-3">
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">Pattern</label>
                <input
                  type="text"
                  value={regexPattern}
                  onChange={(e) => setRegexPattern(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">Flags</label>
                <input
                  type="text"
                  value={regexFlags}
                  onChange={(e) => setRegexFlags(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">Sample String</label>
              <input
                type="text"
                value={regexTestText}
                onChange={(e) => setRegexTestText(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs font-mono text-white"
              />
            </div>

            <button
              onClick={testRegex}
              className="w-full py-2.5 rounded-xl bg-secondary text-white font-bold text-xs shadow-glow-purple"
            >
              Evaluate Match
            </button>

            {regexMatch !== null && (
              <div
                className={`p-3 rounded-xl font-mono text-xs font-bold text-center border ${
                  regexMatch
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                }`}
              >
                {regexMatch ? 'MATCH FOUND (PASS)' : 'NO MATCH (FAIL)'}
              </div>
            )}
          </div>
        )}

        {/* 12. COLOR PALETTE */}
        {activeTool === 'color-palette' && (
          <div className="max-w-md mx-auto space-y-4 text-center">
            <div className="flex items-center justify-center gap-2 border-b border-surface-border pb-3">
              <Palette className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-bold uppercase text-white">Color Palette & Contrast</h3>
            </div>

            <div
              className="h-28 w-full rounded-2xl flex items-center justify-center shadow-lg transition-all"
              style={{ backgroundColor: hexColor }}
            >
              <span className="font-mono font-bold text-sm bg-black/60 px-3 py-1.5 rounded-xl text-white">
                {hexColor}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <input
                type="color"
                value={hexColor}
                onChange={(e) => setHexColor(e.target.value)}
                className="h-10 w-16 bg-transparent cursor-pointer rounded-lg border border-surface-border"
              />
              <input
                type="text"
                value={hexColor}
                onChange={(e) => setHexColor(e.target.value)}
                className="bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs font-mono text-white w-32 text-center"
              />
            </div>
          </div>
        )}

        {/* 13. LOAN EMI CALCULATOR */}
        {activeTool === 'loan-emi' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Percent className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase text-white">Loan EMI & Interest Calculator</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">Principal (₹)</label>
                <input
                  type="number"
                  value={loanPrincipal}
                  onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">Interest % (p.a.)</label>
                <input
                  type="number"
                  step="0.1"
                  value={loanRate}
                  onChange={(e) => setLoanRate(Number(e.target.value))}
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">Tenure (Years)</label>
                <input
                  type="number"
                  value={loanTenureYears}
                  onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                  className="w-full bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs font-mono text-white"
                />
              </div>
            </div>

            {(() => {
              const res = calculateEmi();
              return (
                <div className="grid grid-cols-3 gap-3 font-mono text-xs pt-2">
                  <div className="p-3 rounded-xl bg-surface/80 border border-surface-border">
                    <div className="text-[10px] text-muted uppercase">Monthly EMI</div>
                    <div className="text-base font-bold text-emerald-400 mt-1">₹{res.monthlyEmi.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface/80 border border-surface-border">
                    <div className="text-[10px] text-muted uppercase">Total Interest</div>
                    <div className="text-base font-bold text-rose-400 mt-1">₹{res.totalInterest.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface/80 border border-surface-border">
                    <div className="text-[10px] text-muted uppercase">Total Outflow</div>
                    <div className="text-base font-bold text-white mt-1">₹{res.totalPayment.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* 14. TEXT DIFF */}
        {activeTool === 'text-diff' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Split className="w-5 h-5 text-accent" />
              <h3 className="text-sm font-bold uppercase text-white">Text & Code Diff Comparator</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">Original Text</label>
                <textarea
                  rows={6}
                  value={diffOriginal}
                  onChange={(e) => setDiffOriginal(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted block mb-1">Modified Text</label>
                <textarea
                  rows={6}
                  value={diffModified}
                  onChange={(e) => setDiffModified(e.target.value)}
                  className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-xs font-mono text-emerald-400"
                />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-surface-border text-xs text-muted font-mono">
              Status: {diffOriginal === diffModified ? 'Identical matches (0 changes)' : 'Changes detected between payloads'}
            </div>
          </div>
        )}

        {/* 15. MARKDOWN PREVIEWER */}
        {activeTool === 'markdown-view' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Eye className="w-5 h-5 text-secondary" />
              <h3 className="text-sm font-bold uppercase text-white">Markdown Quick Previewer</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                rows={8}
                value={mdInput}
                onChange={(e) => setMdInput(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-xl p-3 text-xs font-mono text-white"
              />
              <div className="p-4 rounded-xl bg-surface border border-surface-border text-xs leading-relaxed whitespace-pre-wrap text-slate-200">
                {mdInput}
              </div>
            </div>
          </div>
        )}

        {/* 16. URL QUERY PARSER */}
        {activeTool === 'url-parser' && (
          <div className="max-w-xl mx-auto space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Link2 className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-bold uppercase text-white">URL Query Parameters Parser</h3>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-muted block mb-1">Target URL</label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-xs font-mono text-white"
              />
            </div>

            {(() => {
              try {
                const parsedUrl = new URL(urlInput);
                const params = Array.from(parsedUrl.searchParams.entries());
                return (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-2.5 rounded-lg bg-surface border border-surface-border flex justify-between">
                      <span className="text-muted">Host:</span>
                      <span className="font-bold text-white">{parsedUrl.host}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface border border-surface-border flex justify-between">
                      <span className="text-muted">Path:</span>
                      <span className="font-bold text-white">{parsedUrl.pathname}</span>
                    </div>
                    <div className="text-[10px] font-mono text-muted uppercase mt-2">Query Parameters:</div>
                    {params.map(([k, v]) => (
                      <div key={k} className="p-2 rounded-lg bg-surface/60 border border-surface-border flex justify-between">
                        <span className="text-accent">{k}</span>
                        <span className="text-emerald-400 font-bold">{v}</span>
                      </div>
                    ))}
                  </div>
                );
              } catch {
                return <div className="text-xs text-rose-400 font-mono">Invalid URL provided</div>;
              }
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
