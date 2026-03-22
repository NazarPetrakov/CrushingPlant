export class Equipment {
  id: string;
  name: string;
  status: string;
  type: string;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    status: string,
    type: string,
    updatedAt: Date,
  ) {
    ((this.id = id),
      (this.name = name),
      (this.status = status),
      (this.type = type));
    this.updatedAt = updatedAt;
  }
}
