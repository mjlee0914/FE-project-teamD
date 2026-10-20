export interface User {
    id: number;
    loginId: string;
    password: string;
    name: string;
}

export interface LoginFormValues {
    email: string;
    password: string;
}
