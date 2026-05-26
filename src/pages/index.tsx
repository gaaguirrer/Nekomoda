import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import { submitAnswers } from "@/infrastructure/web/lib/recommendations";
import { getOrCreateUserId } from "@/infrastructure/web/lib/userId";

const QUESTIONS = [
  {
    question: "¿Cómo defines tu estilo diario?",
    subtitle: "Esta elección nos ayuda a curar prendas que realmente se adapten a tu ritmo de vida.",
    options: [
      { value: "a", label: "Muy casual", icon: "weekend" },
      { value: "b", label: "Casual", icon: "dry_cleaning" },
      { value: "c", label: "Semi-formal", icon: "styler" },
      { value: "d", label: "Formal", icon: "work" },
      { value: "e", label: "Muy formal", icon: "diamond" },
    ],
  },
  {
    question: "¿Qué colores predominan en tu armario?",
    subtitle: "Tu paleta de colores nos dice mucho sobre tu personalidad.",
    options: [
      { value: "a", label: "Solo neutros", icon: "contrast" },
      { value: "b", label: "Mayoría neutros", icon: "invert_colors" },
      { value: "c", label: "Equilibrio", icon: "palette" },
      { value: "d", label: "Mayoría vibrantes", icon: "flare" },
      { value: "e", label: "Solo vibrantes", icon: "colorize" },
    ],
  },
  {
    question: "¿Prefieres prendas lisas o con estampados?",
    subtitle: "Los detalles marcan la diferencia en tu look.",
    options: [
      { value: "a", label: "Siempre lisas", icon: "checkroom" },
      { value: "b", label: "Casi lisas", icon: "cottage" },
      { value: "c", label: "Ambas", icon: "style" },
      { value: "d", label: "Detalles moderados", icon: "auto_awesome" },
      { value: "e", label: "Estampados llamativos", icon: "celebration" },
    ],
  },
  {
    question: "¿Qué tipo de eventos frecuentas?",
    subtitle: "Queremos recomendarte prendas para cada ocasión.",
    options: [
      { value: "a", label: "Solo diario/trabajo", icon: "business_center" },
      { value: "b", label: "Reuniones informales", icon: "groups" },
      { value: "c", label: "Salidas casuales", icon: "local_cafe" },
      { value: "d", label: "Cenas y fiestas", icon: "dinner_dining" },
      { value: "e", label: "Fiestas y galas", icon: "celebration" },
    ],
  },
  {
    question: "¿Cuánto inviertes normalmente en una prenda?",
    subtitle: "Selecciona el rango que mejor represente tu filosofía de compra.",
    options: [
      { value: "a", label: "Mínimo indispensable", icon: "savings" },
      { value: "b", label: "Económico", icon: "shopping_cart" },
      { value: "c", label: "Moderado", icon: "shopping_bag" },
      { value: "d", label: "Alto", icon: "card_membership" },
      { value: "e", label: "Lujo", icon: "diamond" },
    ],
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const router = useRouter();

  const handleSelect = useCallback((value: string) => {
    setSelected(value);
  }, []);

  const handleSubmit = useCallback(async (finalAnswers: string[]) => {
    setLoading(true);
    try {
      const userId = getOrCreateUserId();
      await submitAnswers(finalAnswers, userId);
      setShowCalc(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3500);
    } catch {
      setLoading(false);
    }
  }, [router]);

  const handleNext = useCallback(() => {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);

    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleSubmit(newAnswers);
    }
  }, [selected, answers, step, handleSubmit]);

  const handleSkip = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  if (showCalc) {
    return <CalculationScreen />;
  }

  const currentQuestion = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-sand-bg">
      <div className="fixed top-0 left-0 w-full h-1 bg-surface-container-high z-[60]">
        <div
          className="h-full bg-coral-vibrant transition-all duration-700 ease-out"
          style={{ width: `${progress}%`, boxShadow: "0 0 8px rgba(255, 127, 80, 0.4)" }}
        />
      </div>

      <main className="flex-grow flex flex-col items-center justify-center px-5 md:px-6 py-20 max-w-[600px] mx-auto w-full">
        <div className="mb-8 flex items-center gap-2">
          <span className="text-label-caps text-on-surface-variant uppercase tracking-widest">
            Paso {step + 1} de {QUESTIONS.length}
          </span>
        </div>

        <header className="text-center mb-16 w-full">
          <h1 className="text-display-lg-mobile md:text-display-lg mb-6 text-ink-black tracking-tight leading-tight">
            {currentQuestion.question}
          </h1>
          <p className="text-body-lg text-on-surface-variant">{currentQuestion.subtitle}</p>
        </header>

        <div className="w-full space-y-4">
          {currentQuestion.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              className={`w-full group flex items-center justify-between p-6 sm:p-8 bg-surface-container-lowest border transition-all duration-200 active:scale-[0.98] ${
                selected === opt.value
                  ? "border-2 border-ink-black bg-surface-container"
                  : "border border-outline-variant hover:border-ink-black"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-ink-black">
                  {opt.icon}
                </span>
                <span className="text-body-lg">{opt.label}</span>
              </div>
              <span className={`material-symbols-outlined transition-opacity ${
                selected === opt.value ? "opacity-100" : "opacity-0"
              } text-ink-black`}>
                check_circle
              </span>
            </button>
          ))}
        </div>

        <footer className="mt-16 w-full flex flex-col gap-4">
          <button
            onClick={handleNext}
            disabled={!selected || loading}
            className="w-full py-4 bg-ink-black text-surface-bright text-label-caps uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:bg-on-primary-fixed-variant"
          >
            {loading ? "Procesando..." : step < QUESTIONS.length - 1 ? "Continuar" : "Finalizar Perfil"}
          </button>
          <button
            onClick={handleSkip}
            className="w-full py-3 text-on-surface-variant text-label-caps uppercase tracking-widest hover:text-ink-black transition-colors"
          >
            Omitir por ahora
          </button>
        </footer>
      </main>
    </div>
  );
}

function CalculationScreen() {
  return (
    <section className="fixed inset-0 bg-sand-bg z-[100] flex flex-col items-center justify-center text-center px-6 animate-fade-in-up">
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 border-2 border-coral-muted rounded-full animate-ping opacity-25" />
        <div className="absolute inset-2 border-2 border-coral-vibrant rounded-full animate-pulse opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-ink-black">auto_awesome</span>
        </div>
      </div>
      <h2 className="text-display-lg-mobile md:text-display-lg mb-6">Analizando tu ADN de estilo</h2>
      <div className="w-64 h-[2px] bg-surface-container overflow-hidden mx-auto mb-6">
        <div
          className="h-full bg-ink-black transition-all duration-[3000ms] ease-out"
          style={{ width: "100%" }}
        />
      </div>
      <p className="text-body-lg text-on-surface-variant" id="calc-status">
        Curando recomendaciones personalizadas...
      </p>
    </section>
  );
}
