"use client";

import { useState, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { BgmPlayer } from "@/components/bgm-player";
import { SceneEntrance } from "@/components/scenes/scene-entrance";
import { SceneSound } from "@/components/scenes/scene-sound";
import { SceneMontage } from "@/components/scenes/scene-montage";
import { SceneQuestion } from "@/components/scenes/scene-question";
import { SceneResult } from "@/components/scenes/scene-result";
import { SceneBrand } from "@/components/scenes/scene-brand";
import {
  questions,
  resultProfiles,
  calculateResult,
  generateSessionId,
  type ScoreMap,
  type PersonalityType,
  type Gathering,
} from "@/lib/linky-types";

type Scene =
  | "entrance"
  | "sound"
  | "montage"
  | "question-0"
  | "question-1"
  | "question-2"
  | "result"
  | "brand";

const sceneOrder: Scene[] = [
  "entrance",
  "sound",
  "montage",
  "question-0",
  "question-1",
  "question-2",
  "result",
  "brand",
];

export function LinkyExperience() {
  const [currentScene, setCurrentScene] = useState<Scene>("entrance");
  const [answers, setAnswers] = useState<ScoreMap[]>([]);
  const [answerLabels, setAnswerLabels] = useState<string[]>([]);
  const [resultType, setResultType] = useState<PersonalityType | null>(null);
  const [selectedGathering, setSelectedGathering] = useState<Gathering | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const sessionIdRef = useRef(generateSessionId());

  const goToScene = useCallback((scene: Scene) => {
    setCurrentScene(scene);
  }, []);

  const handleAnswer = useCallback(
    (questionIndex: number, scores: ScoreMap, label: string) => {
      const newAnswers = [...answers, scores];
      const newLabels = [...answerLabels, label];
      setAnswers(newAnswers);
      setAnswerLabels(newLabels);

      if (questionIndex < 2) {
        goToScene(sceneOrder[sceneOrder.indexOf(`question-${questionIndex}`) + 1]);
      } else {
        const result = calculateResult(newAnswers);
        setResultType(result);
        goToScene("result");
      }
    },
    [answers, answerLabels, goToScene]
  );

  const handleGatheringSelect = useCallback(
    (gathering: Gathering) => {
      setSelectedGathering(gathering);

      // Save everything to Google Sheets
      const totals: ScoreMap = { talk: 0, depth: 0, spark: 0, focus: 0 };
      for (const a of answers) {
        for (const key of Object.keys(totals) as PersonalityType[]) {
          totals[key] += a[key];
        }
      }

      fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          resultType,
          selectedGathering: gathering.name,
          answers: answerLabels,
          ...totals,
        }),
      }).catch(() => {
        // Silently fail - non-critical
      });

      goToScene("brand");
    },
    [answers, answerLabels, resultType, goToScene]
  );

  return (
    <main className="h-dvh w-full overflow-hidden">
      <BgmPlayer
        soundEnabled={soundEnabled}
        paused={currentScene === "montage"}
        onSoundToggle={setSoundEnabled}
      />
      <AnimatePresence mode="wait">
        {currentScene === "entrance" && (
          <SceneEntrance
            key="entrance"
            onNext={() => goToScene("sound")}
          />
        )}

        {currentScene === "sound" && (
          <SceneSound
            key="sound"
            onNext={(enabled) => {
              setSoundEnabled(enabled);
              goToScene("montage");
            }}
          />
        )}

        {currentScene === "montage" && (
          <SceneMontage
            key="montage"
            soundEnabled={soundEnabled}
            onNext={() => goToScene("question-0")}
          />
        )}

        {currentScene === "question-0" && (
          <SceneQuestion
            key="question-0"
            question={questions[0]}
            questionIndex={0}
            connectionLines={0}
            onAnswer={(scores, label) => handleAnswer(0, scores, label)}
          />
        )}

        {currentScene === "question-1" && (
          <SceneQuestion
            key="question-1"
            question={questions[1]}
            questionIndex={1}
            connectionLines={1}
            onAnswer={(scores, label) => handleAnswer(1, scores, label)}
          />
        )}

        {currentScene === "question-2" && (
          <SceneQuestion
            key="question-2"
            question={questions[2]}
            questionIndex={2}
            connectionLines={2}
            onAnswer={(scores, label) => handleAnswer(2, scores, label)}
          />
        )}

        {currentScene === "result" && resultType && (
          <SceneResult
            key="result"
            profile={resultProfiles[resultType]}
            onNext={handleGatheringSelect}
          />
        )}

        {currentScene === "brand" && (
          <SceneBrand key="brand" selectedGathering={selectedGathering} />
        )}
      </AnimatePresence>
    </main>
  );
}
