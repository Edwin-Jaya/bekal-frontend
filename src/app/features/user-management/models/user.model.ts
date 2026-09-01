export interface UserItem{
    id:string,
    full_name:string,
    email:string,
    role:string,
    status:'Active' | 'Inactive';
}

export interface UserDetailItem{
    id:string,
    full_name:string,
    email:string,
    phone_number:string,
    role:string,
    status:'Active' | 'Inactive';
}

export interface CreateUserItem {
  branch: string;
  role: string;
  employee_code: string;
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  status: 'Active' | 'Inactive';
}