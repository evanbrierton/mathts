class Matrix extends Array {
  public rows: number;

  public columns: number;

  public square: boolean;

  constructor(rows) {
    rows.forEach((row) => {
      if (row.length !== rows[0].length) throw Error('All rows must be of the same length.');
    });
    super(...rows);

    this.rows = rows.length;
    this.columns = rows[0].length;
    this.square = rows.length === rows[0].length;
  }
}

export default Matrix;
