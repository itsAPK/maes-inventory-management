class Token {
  public getToken(key: string) {
    if (window !== undefined) {
      return localStorage.getItem(key);
    }
  }

  public setToken(key: string, token: string) {
    localStorage.setItem(key, token);
  }

  public removeToken(key: string) {
    localStorage.removeItem(key);
  }
}

const AuthToken = new Token();

export default AuthToken;
