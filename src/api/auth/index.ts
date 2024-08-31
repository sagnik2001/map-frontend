import { postRequest } from "../../services/request";

export interface SignupRequest {
    id_token: string;
}

export interface SignupResponse {
    message: string;
    status: number;
    data: {
        auth_token: string;
        email: string;
    };
}

export const signupReq = (id_token: string) =>
    postRequest<SignupRequest, SignupResponse>({
        path: `/authenticate`,
        req: {
            id_token: id_token
        },
        headers: {
            'Content-Type': 'application/json'
        },
    });