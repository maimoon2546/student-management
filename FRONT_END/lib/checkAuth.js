export const checkAuth = (router, roleRequired) => {
  const user = localStorage.getItem('user');

  if (!user) {
    router.push('/login');
    return null;
  }

  const parsedUser = JSON.parse(user);

  if (roleRequired && parsedUser.role !== roleRequired) {
    router.push('/login');
    return null;
  }

  return parsedUser;
};