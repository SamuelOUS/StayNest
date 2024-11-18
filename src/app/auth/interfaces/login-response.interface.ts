export interface LogInResponse {
    success: boolean
    message?: string
}

export interface SignUpResponse extends LogInResponse{}