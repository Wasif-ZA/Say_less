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
    <ScreenWrapper bgClassName="bg-grid-pattern">
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
      <div className="pb-28 flex flex-col gap-3 animate-slideUpIn">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className={`card-surface rounded-[28px] p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-all border ${
                isSelected ? "border-white/40 ring-2 ring-white/20" : "border-white/10"
              }`}
            >
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-[22px] font-bold leading-tight">{cat.name}</h2>
                <p className="font-body text-[14px] leading-snug text-white/50 mt-1 line-clamp-2">
                  {cat.description || `${cat.words.length} words`}
                </p>
              </div>
              <div className="text-[48px] shrink-0">{cat.emoji}</div>
            </button>
          );
        })}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-linear-to-t from-[#ff1b6b] to-transparent pointer-events-none flex justify-center">
        <button onClick={handlePlay} className="btn-big btn-white text-2xl max-w-lg pointer-events-auto">
          PLAY
        </button>
      </div>
    </ScreenWrapper>
  );
}
