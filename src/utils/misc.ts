
export function replaceItem<ObjT>(listData: ObjT[], toReplace: ObjT, on: (data: ObjT) => boolean): ObjT[] {
  const idx = listData.findIndex(on);
  if (idx < 0) {
    return listData;
  }
  const newData = [...listData];
  newData.splice(idx, 1, toReplace);
  return newData;
}


export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

