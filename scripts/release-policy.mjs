export const repository = 'dosen-blip/hintonx-site';
export const developmentURL = 'https://hintonx-site.pages.dev';

export function assertRelease({target, dirty, branch, head, remoteHead, canPush, request}) {
  if (target !== 'development') throw new Error('Only the existing development target is configured. Live launch requires its domain and approvers.');
  if (!request?.trim()) throw new Error('A request reference is required.');
  if (!canPush) throw new Error('The authenticated GitHub user needs repository write access.');
  if (dirty) throw new Error('Commit or resolve working-tree changes before release.');
  if (branch !== 'main' || !head || head !== remoteHead) throw new Error('Release must match the latest shared main revision.');
}

export function assetRoute(file) {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.slice(0, -10)}`;
  return `/${file}`;
}
