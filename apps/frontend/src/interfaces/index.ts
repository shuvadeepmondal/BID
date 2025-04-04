export interface NavbarItems {
  href: string;
  tags: string;
  closeNav?: () => void;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone : string;
  admissionYear : string;
  course : string;
  department : string;

}
export interface LoginFormData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}


export interface AttendanceDataa {
  _id: string;
  userId: string;
  status: string;
  date: string;
  __v: number;
}

export interface AttendanceData {
  status: string;
  userName: string;
  userEmail: string;
  date: string;
}

export interface Attendance {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  date: string;
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  inStock: boolean
}

export interface State {
  user: User | null;
}
