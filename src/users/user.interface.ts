import { Role } from "src/auth/roles/role.enum";

export interface UserI {
    id: number;
    uuid: string;
    name: string;
    email: string;
    roles: Role[];
    description: string;
    age: number;
}