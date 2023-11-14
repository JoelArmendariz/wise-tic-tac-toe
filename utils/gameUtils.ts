export const getGameTileBorderClasses = (x: number, y: number): string => {
  let borderClasses = "border-primary-border";
  if (x === 0 || x === 1) {
    borderClasses += " border-b";
  }
  if (y === 0 || y === 1) {
    borderClasses += " border-r";
  }
  return borderClasses;
};
