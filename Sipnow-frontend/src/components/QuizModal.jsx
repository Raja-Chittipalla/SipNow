// import { useEffect, useState } from "react";
// import { useQuiz } from "../hooks/useContent.js";
// import { scrollToSection } from "../utils/links.js";

// function computeResult(answers, quizResults) {
//   const totals = {};
//   answers.forEach((opt) => {
//     Object.entries(opt.scores).forEach(([key, val]) => {
//       totals[key] = (totals[key] || 0) + val;
//     });
//   });
//   let winner = "wine";
//   let best = -1;
//   Object.entries(totals).forEach(([key, val]) => {
//     if (val > best) {
//       best = val;
//       winner = key;
//     }
//   });
//   return quizResults[winner];
// }

// export default function QuizModal({ isOpen, onClose }) {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [wasOpen, setWasOpen] = useState(isOpen);
//   const {
//     data: { quizQuestions, quizResults },
//   } = useQuiz();

//   if (isOpen !== wasOpen) {
//     setWasOpen(isOpen);
//     if (isOpen) {
//       setCurrentQuestion(0);
//       setAnswers([]);
//     }
//   }

//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isOpen]);

//   useEffect(() => {
//     if (!isOpen) return;
//     const onKeyDown = (e) => {
//       if (e.key === "Escape") onClose();
//     };
//     document.addEventListener("keydown", onKeyDown);
//     return () => document.removeEventListener("keydown", onKeyDown);
//   }, [isOpen, onClose]);

//   if (!isOpen || quizQuestions.length === 0) return null;

//   const isResult = answers.length === quizQuestions.length;
//   const question = quizQuestions[currentQuestion];

//   const selectOption = (opt) => {
//     const next = [...answers];
//     next[currentQuestion] = opt;
//     setAnswers(next);
//     if (currentQuestion < quizQuestions.length - 1) {
//       setCurrentQuestion((q) => q + 1);
//     }
//   };

//   const retake = () => {
//     setCurrentQuestion(0);
//     setAnswers([]);
//   };

//   const result = isResult ? computeResult(answers, quizResults) : null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
//       <div
//         className="absolute inset-0 bg-black/70 backdrop-blur-sm"
//         onClick={onClose}
//       ></div>
//       <div className="relative glass-panel border border-outline-variant/30 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-14 shadow-2xl scrollbar-hide">
//         <button
//           aria-label="Close quiz"
//           className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
//           onClick={onClose}
//         >
//           <span className="material-symbols-outlined">close</span>
//         </button>
//         <div className="flex items-center gap-2 mb-10">
//           {quizQuestions.map((_, i) => (
//             <div
//               className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
//                 isResult || i <= currentQuestion
//                   ? "bg-primary"
//                   : "bg-outline-variant/30"
//               }`}
//               key={i}
//             ></div>
//           ))}
//         </div>

//         {!isResult ? (
//           <div>
//             <p className="text-primary font-label-md uppercase tracking-[0.3em] text-xs mb-4">
//               Question {currentQuestion + 1} of {quizQuestions.length}
//             </p>
//             <h3 className="font-display-lg text-3xl md:text-4xl mb-10 leading-tight">
//               {question.question}
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {question.options.map((opt) => (
//                 <button
//                   className="glass-panel border border-outline-variant/30 rounded-2xl p-6 flex items-center gap-4 text-left hover:border-primary hover:bg-primary/10 transition-all duration-300 group"
//                   key={opt.label}
//                   onClick={() => selectOption(opt)}
//                 >
//                   <span className="material-symbols-outlined text-primary text-2xl">
//                     {opt.icon}
//                   </span>
//                   <span className="font-label-md text-on-surface group-hover:text-primary transition-colors">
//                     {opt.label}
//                   </span>
//                 </button>
//               ))}
//             </div>
//             <div className="mt-10">
//               <button
//                 className="text-on-surface-variant hover:text-primary transition-colors font-label-md flex items-center gap-2 disabled:opacity-0 disabled:pointer-events-none"
//                 disabled={currentQuestion === 0}
//                 onClick={() => setCurrentQuestion((q) => Math.max(0, q - 1))}
//               >
//                 <span className="material-symbols-outlined text-[20px]">
//                   arrow_back
//                 </span>
//                 Back
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="text-center space-y-8 py-6">
//             <span className="material-symbols-outlined text-primary text-6xl">
//               auto_awesome
//             </span>
//             <div className="space-y-3">
//               <p className="text-primary font-label-md uppercase tracking-[0.3em] text-xs">
//                 Your Match
//               </p>
//               <h3 className="font-display-lg text-4xl">{result.title}</h3>
//               <p className="text-on-surface-variant font-body-lg max-w-lg mx-auto leading-relaxed">
//                 {result.desc}
//               </p>
//             </div>
//             <div className="flex flex-wrap justify-center gap-4 pt-2">
//               <a
//                 className="primary-gradient px-10 py-4 rounded-full font-label-md shadow-xl shadow-primary/30 hover:scale-105 transition-transform"
//                 href="#best-sellers"
//                 onClick={(e) => {
//                   scrollToSection("best-sellers")(e);
//                   onClose();
//                 }}
//               >
//                 Shop {result.title}
//               </a>
//               <button
//                 className="glass-panel border border-outline-variant/30 px-10 py-4 rounded-full font-label-md hover:bg-surface-container-low transition-colors"
//                 onClick={retake}
//               >
//                 Retake Quiz
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../hooks/useContent.js";

const QUIZ_RESULT_ROUTES = {
  beer: "/beer-cider",
  wine: "/wine",
  spirits: "/spirits",
  premix: "/premix",
  zeroproof: "/zero-alcohol",
};

function computeResult(answers, quizResults) {
  const totals = {};
  answers.forEach((opt) => {
    Object.entries(opt.scores).forEach(([key, val]) => {
      totals[key] = (totals[key] || 0) + val;
    });
  });
  let winner = "wine";
  let best = -1;
  Object.entries(totals).forEach(([key, val]) => {
    if (val > best) {
      best = val;
      winner = key;
    }
  });
  return { ...quizResults[winner], key: winner };
}

export default function QuizModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [wasOpen, setWasOpen] = useState(isOpen);
  const {
    data: { quizQuestions, quizResults },
  } = useQuiz();

  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setCurrentQuestion(0);
      setAnswers([]);
    }
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || quizQuestions.length === 0) return null;

  const isResult = answers.length === quizQuestions.length;
  const question = quizQuestions[currentQuestion];

  const selectOption = (opt) => {
    const next = [...answers];
    next[currentQuestion] = opt;
    setAnswers(next);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    }
  };

  const retake = () => {
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const result = isResult ? computeResult(answers, quizResults) : null;

  const shopResult = () => {
    navigate(QUIZ_RESULT_ROUTES[result.key]);
    window.scrollTo({ top: 0, behavior: "smooth" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative glass-panel border border-outline-variant/30 rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-14 shadow-2xl scrollbar-hide">
        <button
          aria-label="Close quiz"
          className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
          onClick={onClose}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex items-center gap-2 mb-10">
          {quizQuestions.map((_, i) => (
            <div
              className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                isResult || i <= currentQuestion
                  ? "bg-primary"
                  : "bg-outline-variant/30"
              }`}
              key={i}
            ></div>
          ))}
        </div>

        {!isResult ? (
          <div>
            <p className="text-primary font-label-md uppercase tracking-[0.3em] text-xs mb-4">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </p>
            <h3 className="font-display-lg text-3xl md:text-4xl mb-10 leading-tight">
              {question.question}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {question.options.map((opt) => (
                <button
                  className="glass-panel border border-outline-variant/30 rounded-2xl p-6 flex items-center gap-4 text-left hover:border-primary hover:bg-primary/10 transition-all duration-300 group"
                  key={opt.label}
                  onClick={() => selectOption(opt)}
                >
                  <span className="material-symbols-outlined text-primary text-2xl">
                    {opt.icon}
                  </span>
                  <span className="font-label-md text-on-surface group-hover:text-primary transition-colors">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-10">
              <button
                className="text-on-surface-variant hover:text-primary transition-colors font-label-md flex items-center gap-2 disabled:opacity-0 disabled:pointer-events-none"
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion((q) => Math.max(0, q - 1))}
              >
                <span className="material-symbols-outlined text-[20px]">
                  arrow_back
                </span>
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8 py-6">
            <span className="material-symbols-outlined text-primary text-6xl">
              auto_awesome
            </span>
            <div className="space-y-3">
              <p className="text-primary font-label-md uppercase tracking-[0.3em] text-xs">
                Your Match
              </p>
              <h3 className="font-display-lg text-4xl">{result.title}</h3>
              <p className="text-on-surface-variant font-body-lg max-w-lg mx-auto leading-relaxed">
                {result.desc}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                className="primary-gradient px-10 py-4 rounded-full font-label-md shadow-xl shadow-primary/30 hover:scale-105 transition-transform"
                onClick={shopResult}
                type="button"
              >
                Shop {result.title}
              </button>
              <button
                className="glass-panel border border-outline-variant/30 px-10 py-4 rounded-full font-label-md hover:bg-surface-container-low transition-colors"
                onClick={retake}
              >
                Retake Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
