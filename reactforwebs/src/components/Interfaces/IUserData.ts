export default interface IUserData {
  first_name: string
  last_name: string
  email: string
  username: string
}

export interface IAuthData {
  access: string
  refresh: string
  user: IUserData
}
