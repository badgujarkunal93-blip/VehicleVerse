import React, { useState, useEffect, useRef, useMemo } from 'react';
import { VehicleType, CodeFocusState } from '../../types/vehicle';
import { CPP_CLASSES, COMPLETE_CPP_PROGRAM } from '../../constants/vehicleCode';
import Prism from 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import { Copy, Check, Download, Lightbulb } from 'lucide-react';

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

  const lines = useMemo(() => currentCode.split('\n'), [currentCode]);

  return (
    <div className="flex flex-col h-full bg-transparent select-text">
      {/* Top Header Row matching reference image */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight font-sans">
              C++ Code Explorer
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-sans">
              C++17
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 font-sans">
            Explore the class hierarchy and see the code for each class.
          </p>
        </div>

        {/* Copy & Download Actions */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Editor Container Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Tabs Row */}
        <div className="flex items-center space-x-1 px-3 border-b border-slate-200 bg-slate-50/60 overflow-x-auto text-xs font-sans">
          {(['Vehicle', 'Car', 'ElectricCar', 'Complete'] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab === 'Complete' ? 'Complete Program.cpp' : `${tab}.h`;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 transition-all duration-150 font-medium whitespace-nowrap text-xs border-b-2 ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-semibold bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Syntax-Highlighted Code View */}
        <div
          ref={codeContainerRef}
          className="flex-1 overflow-y-auto overflow-x-auto p-4 font-mono text-[12px] bg-white leading-relaxed"
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
                      isHighlighted ? 'line-highlight' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Line Number Gutter */}
                    <span
                      className={`select-none text-right pr-3.5 w-9 flex-shrink-0 text-[11px] font-mono ${
                        isHighlighted ? 'text-blue-600 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {lineNum}
                    </span>
                    {/* Line Content */}
                    <span className="flex-1 pr-2 whitespace-pre text-slate-800">
                      {line || ' '}
                    </span>
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
      </div>

      {/* Current Focus Card at Bottom matching reference image */}
      <div className="mt-3 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start space-x-3 shadow-sm">
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <div className="font-bold text-blue-900 text-xs">
            Current focus: {codeFocus.title || codeFocus.target}
          </div>
          <p className="text-slate-600 mt-0.5 leading-relaxed text-xs">
            {codeFocus.explanation}
          </p>
        </div>
      </div>
    </div>
  );
};
