export interface UserModel {
  id: string;
  username: string;
  initials: string;
  date: Date;
  color: string;
}

export interface IShoppingItem {
  id: string;
  name: string;
  createdAt: Date;
  assignedUser: UserModel| null;
}

export class ShoppingItem implements IShoppingItem {
  id: string;
  name: string;
  createdAt: Date;
  assignedUser: UserModel | null;

  constructor(name?: string, id?: string, assignedUser?: UserModel) {
    this.id = id ?? '';
    this.name = name ?? '';
    this.createdAt = new Date();
    this.assignedUser = assignedUser ?? null;
  }
}

export interface AlertResponse {
  data: any;
  status: number;
}

export interface LogModel {
  id?: string;
  message: any;
  username?: string;
  timestamp: Date;
  userColor: string;
}

export interface DropzoneLayout {
  container: string;
  list: string;
  dndHorizontal: boolean;
}
