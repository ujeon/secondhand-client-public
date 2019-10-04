export default getAuth = async token => {
  const status = await fetch("http://10.0.2.2:8000/user/auth/", {
    headers: {
      token
    }
  }).then(res => res.status);

  return status;
};
