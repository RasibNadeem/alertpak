export const base = "https://www.alertpak.hexaadev.com";
// export const base = "http://localhost:5006";

export const config = async () => {
  let token = await localStorage.getItem("userToken");
  return {
    headers: {
      Authorization: `${token}`,
      Accept: "application/json",
    },
  };
};

export const multipartConfig = async () => {
  let token = await localStorage.getItem("userToken");
  return {
    headers: {
      Authorization: `${token}`,
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  };
};
