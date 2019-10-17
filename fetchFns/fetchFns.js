export default getAuth = async token => {
  const status = await fetch("http://3.17.152.1:8000/user/auth/", {
    headers: {
      token
    }
  }).then(res => res.status);

  return status;
};
