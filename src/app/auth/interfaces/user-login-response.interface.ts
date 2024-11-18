export interface UserLogInResponse {
    id: string;
    name: string;
    username: string;
    profilePicture: string;
    email: string;
    isOwner: boolean;
    token: string;
}

export interface UserSignUpResponse extends UserLogInResponse{}