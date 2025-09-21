export const logout = () => {
    localStorage.removeItem('token');
    location.replace('/');
}