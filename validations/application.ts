import { z } from "zod";

export const studentInfoSchema = z.object({
  studentName: z.string().min(2, "Student name must be at least 2 characters"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    error: "Please select gender",
  }),
  applyingClass: z.string().min(1, "Applying class is required"),
});

export const parentInfoSchema = z.object({
  parentName: z.string().min(2, "Parent name is required"),
  parentEmail: z.email("Enter a valid email"),
  parentPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
  address: z.string().min(5, "Address is required"),
});

export const previousSchoolSchema = z.object({
  previousSchool: z.string().optional(),
});

export const applicationSchema = studentInfoSchema
  .merge(parentInfoSchema)
  .merge(previousSchoolSchema);

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
