const DIMENSIONS = 5;

export class TasteVector {
  private constructor(public readonly values: number[]) {
    if (values.length !== DIMENSIONS) {
      throw new Error(`TasteVector must have exactly ${DIMENSIONS} dimensions`);
    }
    if (values.some(v => v < 0 || v > 1)) {
      throw new Error("All values must be between 0 and 1");
    }
  }

  static fromAnswers(answers: string[]): TasteVector {
    const mapping: Record<string, number> = {
      a: 0.0, b: 0.25, c: 0.5, d: 0.75, e: 1.0,
    };
    const values = answers.map(a => mapping[a.toLowerCase()] ?? 0.5);
    return new TasteVector(values);
  }

  static fromArray(values: number[]): TasteVector {
    return new TasteVector([...values]);
  }

  toArray(): number[] {
    return [...this.values];
  }

  static dimensions(): number {
    return DIMENSIONS;
  }
}
