import { API } from "../../backed";

const loginMethod = async (userData) => {
  const response = await fetch(`${API}/login`, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

const signupMethod = async (userData) => {
  const response = await fetch(`${API}/signup`, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
export { loginMethod, signupMethod };
