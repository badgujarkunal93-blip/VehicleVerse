import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Award, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'In the hierarchy Vehicle -> Car -> ElectricCar, what type of inheritance connects Vehicle to Car?',
    options: [
      'Multiple Inheritance',
      'Single Inheritance',
      'Hierarchical Inheritance',
      'Hybrid Inheritance'
    ],
    correctIndex: 1,
    explanation: 'Single inheritance occurs when a derived class (Car) inherits from exactly one base class (Vehicle).'
  },
  {
    id: 2,
    question: 'Why are data members such as "speed" declared as "protected" instead of "private" in the Vehicle base class?',
    options: [
      'So they can be accessed anywhere from main()',
      'To allow derived classes (Car and ElectricCar) direct access while keeping them hidden from outside code',
      'To make them global variables across all translation units',
      'Because C++ does not allow private members in classes'
    ],
    correctIndex: 1,
    explanation: 'Protected members are inaccessible from client code outside the class hierarchy, but directly accessible inside member functions of derived classes.'
  },
  {
    id: 3,
    question: 'When creating an object of ElectricCar, in what order are constructors executed?',
    options: [
      'ElectricCar() -> Car() -> Vehicle()',
      'Car() -> ElectricCar() -> Vehicle()',
      'Vehicle() -> Car() -> ElectricCar()',
      'Constructors run in parallel'
    ],
    correctIndex: 2,
    explanation: 'In C++, construction order begins with the most base class (Vehicle), proceeds down the hierarchy (Car), and terminates at the most derived class (ElectricCar).'
  },
  {
    id: 4,
    question: 'Which newly introduced attribute belongs specifically to the Car class?',
    options: [
      'speed',
      'batteryLevel',
      'fuelLevel',
      'regenerativeBraking'
    ],
    correctIndex: 2,
    explanation: 'Car introduces fuelLevel for internal combustion fuel tracking. speed is inherited from Vehicle, and batteryLevel is introduced later in ElectricCar.'
  },
  {
    id: 5,
    question: 'In what order are the destructors invoked when an ElectricCar object goes out of scope?',
    options: [
      '~Vehicle() -> ~Car() -> ~ElectricCar()',
      '~ElectricCar() -> ~Car() -> ~Vehicle()',
      '~Car() -> ~Vehicle() -> ~ElectricCar()',
      'Destructors are only called if manually triggered'
    ],
    correctIndex: 1,
    explanation: 'Destructors in C++ execute in strict REVERSE order of construction: first ~ElectricCar(), then ~Car(), and finally ~Vehicle().'
  },
  {
    id: 6,
    question: 'What type of inheritance does the full chain Vehicle -> Car -> ElectricCar represent?',
    options: [
      'Multilevel Inheritance',
      'Multiple Inheritance',
      'Multipath Inheritance',
      'Interface Inheritance'
    ],
    correctIndex: 0,
    explanation: 'When a class (ElectricCar) is derived from a class (Car) that is already derived from another class (Vehicle), it constitutes Multilevel Inheritance.'
  }
];

export const QuizPanel: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const isAnswered = selectedAnswers[currentQ.id] !== undefined;

  const handleSelectOption = (optIndex: number) => {
    if (selectedAnswers[currentQ.id] !== undefined) return; // Prevent changing after answer
    const nextAnswers = { ...selectedAnswers, [currentQ.id]: optIndex };
    setSelectedAnswers(nextAnswers);

    // If answering the last question, check if completed
    if (Object.keys(nextAnswers).length === totalQuestions) {
      const score = Object.entries(nextAnswers).reduce((acc, [qId, ans]) => {
        const q = QUIZ_QUESTIONS.find(item => item.id === Number(qId));
        return q && q.correctIndex === ans ? acc + 1 : acc;
      }, 0);

      if (score === totalQuestions) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
  };

  // Calculate score
  const score = Object.entries(selectedAnswers).reduce((acc, [qId, ans]) => {
    const q = QUIZ_QUESTIONS.find(item => item.id === Number(qId));
    return q && q.correctIndex === ans ? acc + 1 : acc;
  }, 0);

  return (
    <div className="bg-graphite-900 border border-slate-800 rounded-lg p-4 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan" />
            OOP Vehicle Hierarchy Knowledge Quiz
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test your understanding of Single vs Multilevel inheritance, protected members, and constructor chains.
          </p>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded bg-graphite-800 border border-slate-700 text-cyan">
          Question {currentIdx + 1} of {totalQuestions}
        </div>
      </div>

      {!isSubmitted ? (
        <div className="space-y-4">
          {/* Question Text */}
          <div className="p-3 rounded-lg bg-graphite-950/70 border border-slate-800">
            <span className="text-xs font-mono text-cyan font-semibold block mb-1">
              QUESTION {currentQ.id}
            </span>
            <p className="text-sm font-medium text-slate-100 leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((opt, optIdx) => {
              const chosen = selectedAnswers[currentQ.id] === optIdx;
              const isCorrect = currentQ.correctIndex === optIdx;

              let btnStyle = 'border-slate-800 bg-graphite-950/60 hover:border-slate-700 text-slate-300';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold ring-1 ring-emerald-500/40';
                } else if (chosen && !isCorrect) {
                  btnStyle = 'border-rose-500 bg-rose-950/40 text-rose-300 font-semibold ring-1 ring-rose-500/40';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-3 text-left rounded-lg border text-xs font-mono flex items-center justify-between transition-all duration-150 ${btnStyle}`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="w-5 h-5 rounded-md bg-graphite-800 flex items-center justify-center text-[11px] font-bold text-slate-400">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                  {isAnswered && chosen && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout (appears once answered) */}
          {isAnswered && (
            <div className="p-3 rounded-lg bg-graphite-950 border border-slate-800 text-xs">
              <span className="font-semibold text-cyan font-mono block mb-1">
                {selectedAnswers[currentQ.id] === currentQ.correctIndex ? '✓ Correct Answer!' : '✗ Incorrect'}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-slate-500">
              Current Score: {score} / {Object.keys(selectedAnswers).length}
            </span>

            {isAnswered && (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan text-graphite-950 font-mono text-xs font-bold hover:bg-cyan-300 transition-colors shadow-md"
              >
                <span>{currentIdx < totalQuestions - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="p-6 rounded-lg bg-graphite-950/80 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-cyan/10 border border-cyan/40 flex items-center justify-center text-cyan">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-100">Quiz Completed!</h3>
            <p className="text-xs text-slate-400 mt-1">
              You scored <span className="font-bold text-cyan text-sm">{score}</span> out of <span className="text-sm">{totalQuestions}</span> ({Math.round((score / totalQuestions) * 100)}%)
            </p>
          </div>

          <div className="p-3 rounded bg-graphite-900 border border-slate-800 text-xs text-slate-300 max-w-md mx-auto">
            {score === totalQuestions
              ? 'Outstanding! You have mastered C++ single and multilevel inheritance hierarchies, constructor ordering, and access modifiers.'
              : 'Great effort! Review the UML inheritance map and C++ code explorer to reinforce the constructor chains and protected access rules.'}
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-graphite-800 border border-slate-700 text-slate-200 hover:text-cyan hover:border-cyan text-xs font-mono font-semibold transition-all shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
