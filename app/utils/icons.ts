const modules = import.meta.glob('~/assets/svg/icons/*.svg', { eager: true });

export const iconMap = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => {
    const name = path.split('/').pop()?.replace('.svg', '') || '';
    return [name, (mod as { default: string }).default];
  })
);
