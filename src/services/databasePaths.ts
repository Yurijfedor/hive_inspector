export const userRoot = (uid: string) => `users/${uid}`;

export const userHives = (uid: string) => `users/${uid}/hives`;

export const userHive = (uid: string, hiveId: string) =>
  `users/${uid}/hives/${hiveId}`;

export const userRuntime = (uid: string) => `users/${uid}/runtime`;
