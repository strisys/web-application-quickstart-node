

export const isColumnar = (data: any): boolean => {
  let result = true;

  Object.keys(data).forEach((k) => {
    if (typeof data[k] !== 'object') {
      result = false;
      return;
    }
  });

  return result;
}

export const transform = (data: any) => {
  if (!data) {
    return data;
  }

  if (!isColumnar(data)) {
    return data;
  }

  const keys = Object.keys(data);

  if (!keys || !keys.length) {
    return data;
  }

  const columnIndexes = Object.keys(data[keys[0]]);

  if (!columnIndexes || !columnIndexes.length) {
    return data;
  }

  const createRecord = () => {
    const record: Record<string, any> = {};

    keys.forEach((key) => {
      record[key] = null;
    })

    return record;
  }

  return columnIndexes.map(createRecord).map((record) => {
    for (let c = 0; (c < columnIndexes.length); c++) {
      for (let k = 0; (k < keys.length); k++) {
        record[keys[k]] = data[keys[k]][c];
      }
    }

    columnIndexes.shift()
    return record;
  });
}