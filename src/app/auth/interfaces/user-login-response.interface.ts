export interface UserLogInResponse {
    name: string;
    username: string;
    photo: string;
    email: string;
    isOwner: boolean;
    token: string;
}

export interface UserSignUpResponse extends UserLogInResponse{}