class ExtendableArray<T> extends Array<T> {
  constructor(defaultData?: Array<T>) {
    super();

    if (!defaultData) return;

    for (const val of defaultData.values()) this.push(val);
  }

  push(val?: Array<T> | T): number {
    if (!val) return this.length;

    if (Array.isArray(val)) {
      val.forEach((val) => {
        super.push(val);
      });
    } else {
      super.push(val);
    }

    return this.length;
  }

  extend(source?: Array<T> | T): ExtendableArray<T> | undefined {
    const newArr = Object.create(this);
    newArr.push(source);

    return newArr;
  }
}

export default ExtendableArray;
