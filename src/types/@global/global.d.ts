
type idT = number

type ListData<T> = {
  data: T[],
  nextCursor: string | null,
  numData?: number | null,
}

type GetData<T> = {
  data: T
}