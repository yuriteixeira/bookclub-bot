export type Book = {
  name: string;
  isbn?: string;
  url?: string;
};

export type ReaderId = number;

export type ReadingProgress = {
  name: string;
  pctg: number;
  start: Date;
  lastUpdate: Date;
};

export type Reading = {
  book: Book;
  readersProgress: Record<ReaderId, ReadingProgress>;
  isCurrent: boolean;
  start: Date;
  end?: Date;
};

export type ReadingModel = {
  startNewReading: (book: Book) => Promise<void>;
  getCurrentReading: () => Promise<Reading | undefined>;
  joinCurrentReading: (id: ReaderId, name: string) => Promise<void>;
  leaveCurrentReading: (readerId: ReaderId) => Promise<void>;
  // getReaderProgressPctg: (readerId: ReaderId) => Promise<number>;
  updateProgressCurrentReading: (id: ReaderId, pctg: number) => Promise<void>;
  // getGroupProgressPctg: () => Promise<number>;
};
