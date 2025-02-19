import * as z from "zod";

export const profileSchema = z.object({
  editSection: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    designation: z
      .string()
      .min(2, "Designation must be at least 2 characters")
      .max(50, "Designation must be less than 50 characters"),
    mobileNumber: z
      .string()
      .regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number"),
    alternativeNumber: z
      .string()
      .regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    presentAddress: z
      .string()
      .min(5, "Present address must be at least 5 characters")
      .max(100, "Present address must be less than 100 characters"),
    permanentAddress: z
      .string()
      .min(5, "Permanent address must be at least 5 characters")
      .max(100, "Permanent address must be less than 100 characters"),
    city: z
      .string()
      .min(2, "City must be at least 2 characters")
      .max(50, "City must be less than 50 characters"),
    postalCode: z
      .string()
      .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid postal code"),
    country: z
      .string()
      .min(2, "Country must be at least 2 characters")
      .max(50, "Country must be less than 50 characters"),
  }),
  detailSection: z.object({
    department: z.string().min(1, "Please select a department"),
    email: z
      .string()
      .email("Please enter a valid email")
      .min(1, "Email is required"),
  }),
});
