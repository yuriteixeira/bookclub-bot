type Book = {
  name: string;
  isbn: string;
  url: string;
};

type ReaderId = number;

type Reader = {
  id: ReaderId;
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
  getCurrentReading: () => Promise<Reading | undefined>;
  joinCurrentReading: (readerId: ReaderId) => Promise<void>;
  leaveCurrentReading: (readerId: ReaderId) => Promise<void>;
  getReaderProgressPctg: (readerId: ReaderId) => Promise<number>;
  getGroupProgressPctg: () => Promise<number>;
};
