export interface LoginData {
	email: string
	password: string
	driver_id?: string
	platform?: string
	driver_token?: string
}

export interface RegisterData {
	email: string
	password: string
	confirm_password: string
	nickname?: string
	avatar?: string
}

export interface PublicKeyData {
	secret_bundle: string
}

export interface UserInfoParams {
	user_id: string
}

export interface UpdateUserInfData {
	avatar?: string;
    coss_id?: string;
    nickname?: string;
    signature?: string;
    tel?: string;
    [property: string]: any;
}

export interface updatePassWorData {
	old_password: string
	password: string
	confirm_password: string
}

export interface SearchUserParams {
	email: string
}
