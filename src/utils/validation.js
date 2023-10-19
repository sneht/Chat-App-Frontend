import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  fullname: Yup.string().required("Full name is required"),
  email: Yup.string().required("email is required"),
  password: Yup.string().required("password is required"),
});
