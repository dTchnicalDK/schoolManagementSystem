"use server";

import { auth } from "@/auth";
// import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/validations/application";

export type SubmitApplicationState = {
  success: boolean;
  message: string;
  applicationId?: string;
  errors?: Record<string, string[]>;
};

export async function submitApplication(
  _prevState: SubmitApplicationState,
  formData: FormData,
): Promise<SubmitApplicationState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to submit an application.",
      };
    }

    // Optional strict role check
    if (session.user.role !== "PARENT") {
      return {
        success: false,
        message: "Only parent accounts can submit applications.",
      };
    }

    const rawData = {
      studentName: formData.get("studentName"),
      dob: formData.get("dob"),
      gender: formData.get("gender"),
      applyingClass: formData.get("applyingClass"),
      parentName: formData.get("parentName"),
      parentEmail: formData.get("parentEmail"),
      parentPhone: formData.get("parentPhone"),
      address: formData.get("address"),
      previousSchool: formData.get("previousSchool"),
    };

    const parsed = applicationSchema.safeParse(rawData);

    if (!parsed.success) {
      const fieldErrors = parsed.error.issues.reduce(
        (accu, issue) => {
          const field = issue.path[0] as string;
          if (!accu[field]) {
            accu[field] = [];
          }
          accu[field].push(issue.message);
          return accu;
        },
        {} as Record<string, string[]>,
      );

      return {
        success: false,
        message: "Please fix the form errors.",
        errors: fieldErrors,
      };
    }

    // if (!parsed.success) {
    //   return {
    //     success: false,
    //     message: "Please fix the form errors.",
    //     errors: parsed.error.flatten().fieldErrors,
    //   };
    // }

    const data = parsed.data;

    const application = await prisma.application.create({
      data: {
        studentName: data.studentName,
        dob: new Date(data.dob),
        gender: data.gender,
        applyingClass: data.applyingClass,
        previousSchool: data.previousSchool || null,

        parentName: data.parentName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone,
        address: data.address,

        parentId: session.user.id,
        status: "SUBMITTED",

        auditLogs: {
          create: {
            actorId: session.user.id,
            actorRole: session.user.role,
            action: "SUBMITTED",
            fromStatus: null,
            toStatus: "SUBMITTED",
            note: "Application submitted by parent",
          },
        },
      },
    });

    return {
      success: true,
      message: "Application submitted successfully.",
      applicationId: application.id,
    };
  } catch (error) {
    console.error("submitApplication error:", error);

    return {
      success: false,
      message: "Something went wrong while submitting the application.",
    };
  }
}
