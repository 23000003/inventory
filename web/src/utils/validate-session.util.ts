export const isSessionExpired = (tokenExp: number | null) => {
  const exp = new Date((tokenExp as number) * 1000);
  if (tokenExp) {
    const now = new Date();
    if (exp < now) {
      return true;
    }
  }
  return false;
};
