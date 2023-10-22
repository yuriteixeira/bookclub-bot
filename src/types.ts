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

type Reading = {
  book: Book;
  readersProgress: Record<ReaderId, ReadingProgress>;
  isCurrent: boolean;
  start: Date;
  end?: Date;
};

type ReadingModel = {
  getCurrentReading: () => Reading;
  joinReading: (readerId: ReaderId, reading: Reading) => void;
  leaveReading: (readerId: ReaderId, reading: Reading) => void;
  getReaderProgressPctg: (readerId: ReaderId, reading: Reading) => number;
  getGroupsProgressPctg: (reading: Reading) => number;
};
