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
    if (selectedAnswers[currentQ.id] !== undefined) return;
    const nextAnswers = { ...selectedAnswers, [currentQ.id]: optIndex };
    setSelectedAnswers(nextAnswers);

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

  const score = Object.entries(selectedAnswers).reduce((acc, [qId, ans]) => {
    const q = QUIZ_QUESTIONS.find(item => item.id === Number(qId));
    return q && q.correctIndex === ans ? acc + 1 : acc;
  }, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            OOP Vehicle Hierarchy Knowledge Quiz
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test your understanding of Single vs Multilevel inheritance, protected members, and constructor chains.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600">
          Question {currentIdx + 1} of {totalQuestions}
        </div>
      </div>

      {!isSubmitted ? (
        <div className="space-y-4">
          {/* Question Text */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
              QUESTION {currentQ.id}
            </span>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((opt, optIdx) => {
              const chosen = selectedAnswers[currentQ.id] === optIdx;
              const isCorrect = currentQ.correctIndex === optIdx;

              let btnStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold';
                } else if (chosen && !isCorrect) {
                  btnStyle = 'border-rose-300 bg-rose-50 text-rose-800 font-semibold';
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-3.5 text-left rounded-xl border text-xs flex items-center justify-between transition-all duration-150 ${btnStyle}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="font-medium text-xs">{opt}</span>
                  </div>
                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  )}
                  {isAnswered && chosen && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {isAnswered && (
            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs">
              <span className="font-bold text-blue-900 block mb-1">
                {selectedAnswers[currentQ.id] === currentQ.correctIndex ? '✓ Correct Answer!' : '✗ Incorrect'}
              </span>
              <p className="text-slate-600 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-medium text-slate-500">
              Current Score: {score} / {Object.keys(selectedAnswers).length}
            </span>

            {isAnswered && (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <span>{currentIdx < totalQuestions - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="p-6 rounded-xl bg-white border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">Quiz Completed!</h3>
            <p className="text-xs text-slate-500 mt-1">
              You scored <span className="font-bold text-blue-600 text-sm">{score}</span> out of <span className="text-sm">{totalQuestions}</span> ({Math.round((score / totalQuestions) * 100)}%)
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            {score === totalQuestions
              ? 'Outstanding! You have mastered C++ single and multilevel inheritance hierarchies, constructor ordering, and access modifiers.'
              : 'Great effort! Review the UML inheritance map and C++ code explorer to reinforce the constructor chains and protected access rules.'}
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
