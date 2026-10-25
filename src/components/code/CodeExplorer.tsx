import React, { useState, useEffect, useRef, useMemo } from 'react';
import { VehicleType, CodeFocusState } from '../../types/vehicle';
import { CPP_CLASSES, COMPLETE_CPP_PROGRAM } from '../../constants/vehicleCode';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import { Copy, Check, Download, Code2, Sparkles, FileText } from 'lucide-react';

interface CodeExplorerProps {
  currentVehicle: VehicleType;
  codeFocus: CodeFocusState;
}

type TabType = 'Vehicle' | 'Car' | 'ElectricCar' | 'Complete';

export const CodeExplorer: React.FC<CodeExplorerProps> = ({ currentVehicle, codeFocus }) => {
  const [activeTab, setActiveTab] = useState<TabType>(currentVehicle);
  const [copied, setCopied] = useState(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // Sync tab with vehicle selection unless user clicked Complete
  useEffect(() => {
    if (codeFocus.targetClass === 'Complete') {
      setActiveTab('Complete');
    } else {
      setActiveTab(codeFocus.targetClass || currentVehicle);
    }
  }, [currentVehicle, codeFocus.targetClass]);

  // Active code text
  const currentCode = useMemo(() => {
    if (activeTab === 'Complete') {
      return COMPLETE_CPP_PROGRAM;
    }
    return CPP_CLASSES[activeTab].code;
  }, [activeTab]);

  // Determine line highlights from current codeFocus
  const highlightedLines = useMemo(() => {
    if (activeTab === 'Complete') {
      return [];
    }
    const classDef = CPP_CLASSES[activeTab];
    const targetRange = classDef.focusLineRanges[codeFocus.target];
    return targetRange ? targetRange.lines : [];
  }, [activeTab, codeFocus.target]);

  // Re-run Prism highlight whenever code or tab changes
  useEffect(() => {
    Prism.highlightAll();
  }, [currentCode, activeTab, highlightedLines]);

  // Auto-scroll code container to the first highlighted line smoothly
  useEffect(() => {
    if (highlightedLines.length > 0 && codeContainerRef.current) {
      const lineElement = codeContainerRef.current.querySelector(`[data-line="${highlightedLines[0]}"]`);
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedLines]);

  // Copy code handler
  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download .cpp handler
  const handleDownload = () => {
    const filename = activeTab === 'Complete' ? 'vehicleverse_complete.cpp' : `${activeTab}.h`;
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Parse lines for line numbers and highlighting
  const lines = useMemo(() => currentCode.split('\n'), [currentCode]);

  return (
    <div className="flex flex-col h-full bg-graphite-900 border-l border-slate-800 shadow-2xl relative select-text">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-graphite-950/70 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-cyan" />
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-200">
            C++ Code Explorer
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan/10 border border-cyan/30 text-cyan font-mono">
            C++17 Valid
          </span>
        </div>

        {/* Action Buttons: Copy & Download */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-mono rounded bg-graphite-800 border border-slate-700 text-slate-300 hover:text-cyan hover:border-cyan/50 transition-colors"
            title="Copy current C++ code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-mono rounded bg-graphite-800 border border-slate-700 text-slate-300 hover:text-cyan hover:border-cyan/50 transition-colors"
            title="Download .cpp file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center space-x-1 px-2 pt-1.5 border-b border-slate-800/80 bg-graphite-950/40 overflow-x-auto text-xs font-mono">
        {(['Vehicle', 'Car', 'ElectricCar', 'Complete'] as TabType[]).map((tab) => {
          const isActive = activeTab === tab;
          let label = tab === 'Complete' ? 'Complete Program.cpp' : `${tab}.h`;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-t-md border-t border-l border-r transition-all duration-150 flex items-center space-x-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-graphite-900 border-slate-700 text-cyan font-semibold border-b-2 border-b-cyan'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-graphite-900/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Synchronized Code Focus Callout Banner */}
      <div className="px-3 py-2 bg-graphite-950/80 border-b border-slate-800 flex items-start space-x-2.5">
        <Sparkles className="w-4 h-4 text-cyan flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="flex-1 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Active Focus
            </span>
            <span className="font-semibold text-cyan truncate">{codeFocus.title}</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
            {codeFocus.explanation}
          </p>
        </div>
      </div>

      {/* Syntax-Highlighted Code Editor View */}
      <div
        ref={codeContainerRef}
        className="flex-1 overflow-y-auto overflow-x-auto p-3 font-mono text-[12px] bg-graphite-950/90 leading-relaxed technical-editor"
      >
        <pre className="!bg-transparent !p-0 !m-0 !overflow-visible">
          <code className="language-cpp">
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = highlightedLines.includes(lineNum);
              return (
                <div
                  key={lineNum}
                  data-line={lineNum}
                  className={`flex items-start transition-colors duration-150 ${
                    isHighlighted ? 'line-highlight text-cyan-200' : 'hover:bg-slate-800/25'
                  }`}
                >
                  {/* Line Number Gutter */}
                  <span
                    className={`select-none text-right pr-3.5 w-10 flex-shrink-0 text-[11px] font-mono ${
                      isHighlighted ? 'text-cyan font-bold' : 'text-slate-600'
                    }`}
                  >
                    {lineNum}
                  </span>
                  {/* Line Code Content */}
                  <span className="flex-1 pr-2 whitespace-pre">
                    {/* Render raw line; Prism formats the whole code or we can render tokenized string */}
                    {line || ' '}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>

      {/* Explanatory Footer Callout */}
      <div className="p-2.5 border-t border-slate-800 bg-graphite-950/90 text-xs font-mono text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-slate-500">Hierarchy:</span>
          <span className="text-cyan">Vehicle</span>
          <span>→</span>
          <span className="text-fuel">Car</span>
          <span>→</span>
          <span className="text-purple-400">ElectricCar</span>
        </div>
        <span className="text-[10px] text-slate-500">
          Read-only Classroom Mode
        </span>
      </div>
    </div>
  );
};
