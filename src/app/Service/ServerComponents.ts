import axios from "axios";

const SetCookie = async (token: string) => {
  return await axios.post(
    "/api/auth",
    {
      token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const GetCookie = async () => {
  return await axios.get("/api/auth", {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
const DeleteCookie = async () => {
  return await axios.delete("/api/auth", {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export { SetCookie, GetCookie, DeleteCookie };
