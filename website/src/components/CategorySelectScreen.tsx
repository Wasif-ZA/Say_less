"use client";

import { useGame } from "@/hooks/useGame";
import { CATEGORIES } from "@/lib/wordbanks";
import { STORAGE_KEYS } from "@/lib/constants";
import { saveToStorage } from "@/lib/storage";
import { ScreenWrapper } from "./ScreenWrapper";

export function CategorySelectScreen() {
  const { state, dispatch } = useGame();

  function selectCategory(id: string) {
    saveToStorage(STORAGE_KEYS.LAST_CATEGORY_ID, id);
    dispatch({ type: "SET_CATEGORY", categoryId: id });
  }

  function handlePlay() {
    const catId = state.categoryId || CATEGORIES[0].id;
    if (!state.categoryId) selectCategory(catId);
    else saveToStorage(STORAGE_KEYS.LAST_CATEGORY_ID, catId);
    dispatch({ type: "SET_PHASE", phase: "players" });
  }

  const activeCategoryId = state.categoryId || CATEGORIES[0].id;

  return (
    <ScreenWrapper bgClassName="bg-imposter">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <button
          onClick={() => dispatch({ type: "SET_PHASE", phase: "home" })}
          className="text-white text-3xl font-bold w-10 h-10 flex items-center justify-center active:scale-95 transition-transform"
        >
          ‹
        </button>
        <h1 className="font-display text-3xl font-bold tracking-wide drop-shadow-md">Categories</h1>
        <div className="w-10" />
      </div>

      {/* Category list */}
      <div className="mb-32 card-surface rounded-[20px] overflow-hidden ruled animate-slideUpIn">
        {CATEGORIES.map((cat, i) => {
          const isSelected = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              aria-pressed={isSelected}
              className={`w-full px-4 py-3.5 grid grid-cols-[34px_1fr_auto] items-center gap-3 text-left transition-colors ${isSelected ? "bg-go" : "active:bg-mint"}`}
            >
              <span className="text-[13px] font-bold tabular-nums text-ink-2">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span className="block text-[18px] font-bold leading-tight">{cat.name}</span>
                <span className="block text-[14px] leading-snug mt-0.5 text-ink-2 line-clamp-2">
                  {cat.description || `${cat.words.length} words`}
                </span>
              </span>
              <span className="text-[30px] w-10 text-center shrink-0">{isSelected ? "✓" : cat.emoji}</span>
            </button>
          );
        })}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-imposter pointer-events-none flex justify-center">
        <button onClick={handlePlay} className="btn-big btn-white text-2xl max-w-lg pointer-events-auto">
          PLAY
        </button>
      </div>
    </ScreenWrapper>
  );
}
