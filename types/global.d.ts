interface FileState {
  path: string;
  name: string;
  lastModified: number;
  size: number;
  type: string;
  preview: string;
}

type FileStore = {
  key: FileKey;
  name: string;
  size: string;
  type: string;
  value: string;
};

export { FileState, FileStore };
