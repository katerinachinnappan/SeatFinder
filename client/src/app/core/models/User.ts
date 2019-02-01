export class User {
    username?: string;
    password?: string;
    userType?: string;
    email?: string;
}

export enum UserType {
    STUDENT = 'STUDENT',
    SCHOOL_STAFF = 'SCHOOL_STAFF'
}
