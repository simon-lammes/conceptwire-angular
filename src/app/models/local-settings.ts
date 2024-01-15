/**
 * The settings which are device specific and should therefore be stored locally.
 */
export interface LocalSettings {
  projectDirectory?: FileSystemDirectoryHandle | null;
}
