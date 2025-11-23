// lib/sound.ts
export const playSuccessSound = () => {
  const audio = new Audio("/sounds/success.mp3");
  audio.volume = 0.7;
  audio.play().catch(() => {});
};

export const playErrorSound = () => {
  const audio = new Audio("/sounds/error.mp3");
  audio.volume = 0.8;
  audio.play().catch(() => {});
};

export const playBeep = () => {
  const audio = new Audio("/sounds/beep.mp3");
  audio.volume = 0.6;
  audio.play().catch(() => {});
};
