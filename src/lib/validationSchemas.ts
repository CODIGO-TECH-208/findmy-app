import * as Yup from "yup";

export const loginSchema = Yup.object({
  phone: Yup.string()
    .trim()
    .required("Phone number is required")
    .matches(/^0[2-5][0-9]{8}$/, "Please enter a valid Ghana phone number"),
  password: Yup.string()
    .required("Password is required"),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .max(100, "Name must be less than 100 characters"),
  phone: Yup.string()
    .trim()
    .required("Phone number is required")
    .matches(/^0[2-5][0-9]{8}$/, "Please enter a valid Ghana phone number (e.g., 0241234567)"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

export const postItemSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Item name is required")
    .max(100, "Item name must be less than 100 characters"),
  category: Yup.string()
    .required("Please select a category"),
  description: Yup.string()
    .trim()
    .required("Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  location: Yup.string()
    .required("Please select a location"),
  date: Yup.string()
    .required("Date is required"),
  reward: Yup.boolean(),
});

export const claimSchema = Yup.object({
  reason: Yup.string()
    .trim()
    .required("Please provide a reason")
    .max(500, "Reason must be less than 500 characters"),
  details: Yup.string()
    .trim()
    .max(500, "Details must be less than 500 characters"),
});

export type LoginFormValues = Yup.InferType<typeof loginSchema>;
export type RegisterFormValues = Yup.InferType<typeof registerSchema>;
export type PostItemFormValues = Yup.InferType<typeof postItemSchema>;
export type ClaimFormValues = Yup.InferType<typeof claimSchema>;
