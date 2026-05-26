import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { apiGet, apiPost } from "@/infrastructure/web/lib/apiClient";
import { getUserId } from "@/infrastructure/demo/demoMode";

const QUESTIONS = [
  {
    id: "q1",
    question: "¿Cómo defines tu estilo diario?",
    options: [
      { value: "a", label: "Muy casual" },
      { value: "b", label: "Casual" },
      { value: "c", label: "Semi-formal" },
      { value: "d", label: "Formal" },
      { value: "e", label: "Muy formal" },
    ],
  },
  {
    id: "q2",
    question: "¿Qué colores predominan en tu armario?",
    options: [
      { value: "a", label: "Solo neutros" },
      { value: "b", label: "Mayoría neutros" },
      { value: "c", label: "Equilibrio" },
      { value: "d", label: "Mayoría vibrantes" },
      { value: "e", label: "Solo vibrantes" },
    ],
  },
  {
    id: "q3",
    question: "¿Prefieres prendas lisas o con estampados?",
    options: [
      { value: "a", label: "Siempre lisas" },
      { value: "b", label: "Casi lisas" },
      { value: "c", label: "Ambas" },
      { value: "d", label: "Detalles moderados" },
      { value: "e", label: "Estampados llamativos" },
    ],
  },
  {
    id: "q4",
    question: "¿Qué tipo de eventos frecuentas?",
    options: [
      { value: "a", label: "Solo diario/trabajo" },
      { value: "b", label: "Reuniones informales" },
      { value: "c", label: "Salidas casuales" },
      { value: "d", label: "Cenas y fiestas" },
      { value: "e", label: "Fiestas y galas" },
    ],
  },
  {
    id: "q5",
    question: "¿Cuánto inviertes normalmente en una prenda?",
    options: [
      { value: "a", label: "Mínimo indispensable" },
      { value: "b", label: "Económico" },
      { value: "c", label: "Moderado" },
      { value: "d", label: "Alto" },
      { value: "e", label: "Lujo" },
    ],
  },
];

const Q_IDS = ["q1", "q2", "q3", "q4", "q5"];

export default function SettingsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = getUserId();
      try {
        const res = await apiGet("/api/onboarding", { userId });
        if (res.ok) {
          const data = await res.json();
          if (data.answers) {
            const loaded: Record<string, string> = {};
            data.answers.forEach((ans: string, i: number) => {
              loaded[Q_IDS[i]] = ans;
            });
            setAnswers(loaded);
          }
        }
      } catch {
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const setAnswer = (qId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    const allAnswered = Q_IDS.every(id => answers[id]);
    if (!allAnswered) {
      setError("Responde todas las preguntas");
      return;
    }

    setSaving(true);
    setError("");
    const userId = getUserId();
    const mappedAnswers = Q_IDS.map(id => answers[id]);

    try {
      const res = await apiPost("/api/onboarding", { userId, answers: mappedAnswers });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error ?? "Error al guardar");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const allAnswered = Q_IDS.every(id => answers[id]);

  return (
    <div className="min-h-screen bg-sand-bg">
      <Navbar
        showBack
        title="Ajustes de Estilo"
        rightSlot={
          <div className="flex items-center gap-3">
            {saved && <span className="text-label-caps text-green-600">✓ Guardado</span>}
            <button
              onClick={handleSave}
              disabled={saving || loadingProfile}
              className="px-4 py-2 bg-ink-black text-white text-label-caps uppercase tracking-widest text-sm disabled:opacity-30 hover:bg-on-primary-fixed-variant transition-colors"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        }
      />

      <main className="pt-24 pb-24 max-w-[680px] mx-auto px-5">
        <div className="mb-8">
          <h1 className="text-headline-md mb-2">Personaliza tu Perfil de Estilo</h1>
          <p className="text-body-md text-on-surface-variant">
            Tus respuestas ayudan al algoritmo a encontrar las mejores recomendaciones para ti. Puedes modificarlas cuando quieras.
          </p>
        </div>

        <div className="border-t border-outline-variant pt-2" />

        {error && (
          <div className="mt-4 p-4 bg-error-container border border-error text-error text-body-md">{error}</div>
        )}

        {loadingProfile ? (
          <div className="mt-6 space-y-10">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="animate-pulse">
                <div className="h-4 bg-surface-container w-1/4 mb-4" />
                <div className="h-6 bg-surface-container w-3/4 mb-4" />
                {Array.from({ length: 5 }).map((_, oi) => (
                  <div key={oi} className="h-14 bg-surface-container mb-2" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-10">
            {QUESTIONS.map((q, idx) => (
              <div key={q.id}>
                <p className="text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">Pregunta {idx + 1}</p>
                <h3 className="text-body-lg font-medium mb-4">{q.question}</h3>
                <div className="space-y-2">
                  {q.options.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setAnswer(q.id, opt.value)}
                      className={`w-full text-left p-4 border transition-all ${
                        answers[q.id] === opt.value
                          ? "border-ink-black bg-surface-container text-ink-black"
                          : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-ink-black"
                      }`}
                    >
                      <span className="text-body-md">{opt.label}</span>
                      {answers[q.id] === opt.value && (
                        <span className="float-right material-symbols-outlined text-ink-black">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving || loadingProfile || !allAnswered}
            className="flex-1 py-4 bg-ink-black text-white text-label-caps uppercase tracking-widest disabled:opacity-30 hover:bg-on-primary-fixed-variant transition-colors"
          >
            {saving ? "Guardando..." : "Guardar Preferencias"}
          </button>
          <Link
            href="/dashboard"
            className="flex-1 py-4 border border-outline-variant text-ink-black text-label-caps uppercase tracking-widest text-center hover:border-ink-black transition-colors"
          >
            Ir al Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
