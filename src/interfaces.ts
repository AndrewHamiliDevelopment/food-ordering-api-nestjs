export enum Role {
    SUPERADMIN,
    ADMIN,
    CLIENT,
  }
  
  export interface Claim {
    apps: ClaimApp[];
  }
  
  export interface ClaimApp {
    name: string;
    role: Role;
  }
  