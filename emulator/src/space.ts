class Space {
  constructor(
    public readonly id: string,
    public updated_at: number | string | Date,
    public created_at: number | string | Date,
    public status: boolean,
  ) {}
}

export default Space;
