type Book = {
  name: string;
  isbn?: string;
  url?: string;
};

type ReaderId = number;

type Reader = {
  telegramId: ReaderId;
  name: string;
};

type ReadingProgress = {
  reader: Reader;
  pctg: number;
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
  joinCurrentReading: (readerId: ReaderId) => Promise<void>;
  leaveCurrentReading: (readerId: ReaderId) => Promise<void>;
  getReaderProgressPctg: (readerId: ReaderId) => Promise<number>;
  setReaderProgressPctg: (readerId: ReaderId, pctg: number) => Promise<void>;
  getGroupProgressPctg: () => Promise<number>;
};
