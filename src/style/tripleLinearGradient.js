function tripleLinearGradient(color, colorState, colorStateSecondary, angle) {
  if (angle === undefined) {
    angle = 310;
  }
  return `linear-gradient(${angle}deg, ${color}, ${colorState}, ${colorStateSecondary})`;
}

export default tripleLinearGradient;

// linear-gradient(159.02deg, #0f123b 14.25%, #090d2e 56.45%, #020515 86.14%)