import React, { useState, useEffect } from 'react';
import { X, Check, ChevronUp, ChevronDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import { runAllStrategyTests } from '../../data/vpTestCases';

export function StrategyValidator({ onClose }) {
  const [results, setResults] = useState(null);
  const [expandedGame, setExpandedGame] = useState(null);
  const [showOnlyFailed, setShowOnlyFailed] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- run tests on mount
    setResults(runAllStrategyTests());
  }, []);

  if (!results) return <div className="p-4 text-white">Running tests...</div>;

  const { totalPassed, totalTests } = results;
  const allPassed = totalPassed === totalTests;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-auto">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Strategy Validator</h2>
            <p className="text-[#888] text-sm">Testing optimal play recommendations</p>
          </div>
          <button onClick={onClose} className="no-animate text-[#888] hover:text-white p-2">
            <X size={24} />
          </button>
        </div>

        {/* Summary */}
        <div className={`p-4 rounded mb-4 ${allPassed ? 'bg-emerald-900/30 border border-emerald-500/50' : 'bg-red-900/30 border border-red-500/50'}`}>
          <div className="flex items-center gap-3">
            {allPassed ? (
              <CheckCircle2 size={24} className="text-emerald-400" />
            ) : (
              <AlertTriangle size={24} className="text-red-400" />
            )}
            <div>
              <p className={`font-bold ${allPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                {totalPassed} / {totalTests} tests passed
              </p>
              <p className="text-[#888] text-sm">
                {allPassed ? 'All strategy recommendations are correct!' : `${totalTests - totalPassed} tests failing - review below`}
              </p>
            </div>
          </div>
        </div>

        {/* Filter toggle */}
        {!allPassed && (
          <label className="flex items-center gap-2 mb-4 text-sm text-[#888]">
            <input
              type="checkbox"
              checked={showOnlyFailed}
              onChange={(e) => setShowOnlyFailed(e.target.checked)}
              className="rounded"
            />
            Show only failed tests
          </label>
        )}

        {/* Results by game */}
        {Object.entries(results.results).map(([gameType, gameResults]) => {
          const gamePassed = gameResults.filter(r => r.passed).length;
          const gameTotal = gameResults.length;
          const gameAllPassed = gamePassed === gameTotal;
          const displayResults = showOnlyFailed ? gameResults.filter(r => !r.passed) : gameResults;

          if (showOnlyFailed && displayResults.length === 0) return null;

          return (
            <div key={gameType} className="mb-4">
              <button
                onClick={() => setExpandedGame(expandedGame === gameType ? null : gameType)}
                className={`w-full flex items-center justify-between p-3 rounded text-left ${
                  gameAllPassed ? 'bg-emerald-900/20 hover:bg-emerald-900/30' : 'bg-red-900/20 hover:bg-red-900/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  {gameAllPassed ? (
                    <Check size={16} className="text-emerald-400" />
                  ) : (
                    <X size={16} className="text-red-400" />
                  )}
                  <span className="text-white font-medium">{gameType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${gameAllPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                    {gamePassed}/{gameTotal}
                  </span>
                  {expandedGame === gameType ? <ChevronUp size={16} className="text-[#888]" /> : <ChevronDown size={16} className="text-[#888]" />}
                </div>
              </button>

              {expandedGame === gameType && (
                <div className="mt-2 space-y-2">
                  {displayResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded border ${
                        result.passed
                          ? 'bg-[#161616] border-[#333]'
                          : 'bg-red-900/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {result.passed ? (
                              <Check size={14} className="text-emerald-400 shrink-0" />
                            ) : (
                              <X size={14} className="text-red-400 shrink-0" />
                            )}
                            <span className="text-white text-sm font-medium">{result.name}</span>
                          </div>

                          {/* Hand display */}
                          <div className="flex gap-1 my-2">
                            {result.cards.map((card, i) => {
                              const isExpectedHold = result.expectedHold.includes(i);
                              const isActualHold = result.actualHold.includes(i);
                              return (
                                <div
                                  key={i}
                                  className={`w-10 h-14 rounded border-2 flex flex-col items-center justify-center text-xs font-bold ${
                                    isExpectedHold && isActualHold ? 'bg-emerald-600 border-emerald-500 text-white' :
                                    isExpectedHold && !isActualHold ? 'bg-red-600 border-red-500 text-white' :
                                    !isExpectedHold && isActualHold ? 'bg-amber-600 border-amber-500 text-white' :
                                    'bg-[#1a1a1a] border-[#333]'
                                  }`}
                                >
                                  <span className={!isExpectedHold && !isActualHold ? (card.color === 'text-red-500' ? 'text-red-400' : 'text-white') : ''}>{card.rank}</span>
                                  <span className={!isExpectedHold && !isActualHold ? (card.color === 'text-red-500' ? 'text-red-400' : 'text-white') : ''}>{card.suit}</span>
                                </div>
                              );
                            })}
                          </div>

                          {!result.passed && (
                            <div className="text-xs space-y-1">
                              <p className="text-red-400">
                                Expected hold: [{result.expectedHold.join(', ')}]
                              </p>
                              <p className="text-amber-400">
                                Actual hold: [{result.actualHold.join(', ')}] - "{result.actualName}"
                              </p>
                              <p className="text-[#666]">{result.actualReason}</p>
                            </div>
                          )}

                          {result.passed && (
                            <p className="text-xs text-[#666]">
                              {result.actualName} - {result.actualReason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Legend */}
        <div className="mt-6 p-3 bg-[#161616] rounded border border-[#333]">
          <p className="text-[#888] text-xs font-medium mb-2">Card Colors:</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-emerald-600 border border-emerald-500"></div>
              <span className="text-[#888]">Correct hold</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-red-600 border border-red-500"></div>
              <span className="text-[#888]">Should hold (missed)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-amber-600 border border-amber-500"></div>
              <span className="text-[#888]">Wrong hold</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-[#1a1a1a] border border-[#333]"></div>
              <span className="text-[#888]">Correct discard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
