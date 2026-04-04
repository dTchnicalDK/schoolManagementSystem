"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import {
  applicationSchema,
  type ApplicationFormValues,
} from "@/validations/application";
import { Button } from "@/components/ui/button";
import { submitApplication } from "@/actions/application/submit-application";
import { useRouter } from "next/navigation";

const steps = [
  "Student Info",
  "Parent / Guardian",
  "Previous School",
  "Review & Submit",
];

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      studentName: "",
      dob: "",
      gender: "MALE",
      applyingClass: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      address: "",
      previousSchool: "",
    },
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const values = watch();

  const nextStep = async () => {
    let fields: (keyof ApplicationFormValues)[] = [];

    if (currentStep === 0) {
      fields = ["studentName", "dob", "gender", "applyingClass"];
    }

    if (currentStep === 1) {
      fields = ["parentName", "parentEmail", "parentPhone", "address"];
    }

    if (currentStep === 2) {
      fields = ["previousSchool"];
    }

    const isValid = await trigger(fields);

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    const result = await submitApplication(
      { success: false, message: "" },
      formData,
    );

    if (result.success) {
      alert(result.message);
      form.reset();
      setCurrentStep(0);

      // router.push("/dashboard");
      router.push(`/dashboard/application/${result.applicationId}`);
    } else {
      alert(result.message);
      console.log(result.errors);
    }
  };

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">School Admission</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Online Admission Form
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete the application in a few simple steps.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {steps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;

            return (
              <div
                key={step}
                className={`rounded-2xl border p-4 text-sm transition ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : isCompleted
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : "bg-background"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="font-medium">{step}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-3xl border bg-card p-6 shadow-sm md:p-8"
        >
          {currentStep === 0 && (
            <div className="space-y-6">
              <SectionTitle
                title="Student Information"
                description="Enter the student’s basic admission details."
              />

              <InputField
                label="Student Name"
                error={errors.studentName?.message}
              >
                <input
                  {...register("studentName")}
                  className={inputClass}
                  placeholder="Enter student name"
                />
              </InputField>

              <div className="grid gap-6 md:grid-cols-2">
                <InputField label="Date of Birth" error={errors.dob?.message}>
                  <input
                    {...register("dob")}
                    type="date"
                    className={inputClass}
                  />
                </InputField>

                <InputField
                  label="Applying Class"
                  error={errors.applyingClass?.message}
                >
                  <input
                    {...register("applyingClass")}
                    className={inputClass}
                    placeholder="e.g. Class 1"
                  />
                </InputField>
              </div>

              <InputField label="Gender" error={errors.gender?.message}>
                <select {...register("gender")} className={inputClass}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </InputField>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <SectionTitle
                title="Parent / Guardian Information"
                description="Provide parent or guardian contact details."
              />

              <InputField
                label="Parent Name"
                error={errors.parentName?.message}
              >
                <input
                  {...register("parentName")}
                  className={inputClass}
                  placeholder="Enter parent name"
                />
              </InputField>

              <div className="grid gap-6 md:grid-cols-2">
                <InputField
                  label="Parent Email"
                  error={errors.parentEmail?.message}
                >
                  <input
                    {...register("parentEmail")}
                    type="email"
                    className={inputClass}
                    placeholder="Enter email"
                  />
                </InputField>

                <InputField
                  label="Phone Number"
                  error={errors.parentPhone?.message}
                >
                  <input
                    {...register("parentPhone")}
                    className={inputClass}
                    placeholder="Enter phone number"
                  />
                </InputField>
              </div>

              <InputField label="Address" error={errors.address?.message}>
                <textarea
                  {...register("address")}
                  className={`${inputClass} min-h-25 resize-none`}
                  placeholder="Enter address"
                />
              </InputField>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <SectionTitle
                title="Previous School Information"
                description="Optional details about the student’s previous school."
              />

              <InputField
                label="Previous School Name"
                error={errors.previousSchool?.message}
              >
                <input
                  {...register("previousSchool")}
                  className={inputClass}
                  placeholder="Enter previous school name (optional)"
                />
              </InputField>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
              <SectionTitle
                title="Review & Submit"
                description="Please review the details before submitting."
              />

              <ReviewSection
                title="Student Information"
                items={[
                  ["Student Name", values.studentName],
                  ["Date of Birth", values.dob],
                  ["Gender", values.gender],
                  ["Applying Class", values.applyingClass],
                ]}
              />

              <ReviewSection
                title="Parent / Guardian"
                items={[
                  ["Parent Name", values.parentName],
                  ["Parent Email", values.parentEmail],
                  ["Phone Number", values.parentPhone],
                  ["Address", values.address],
                ]}
              />

              <ReviewSection
                title="Previous School"
                items={[["Previous School", values.previousSchool || "N/A"]]}
              />
            </div>
          )}

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function InputField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function ReviewSection({
  title,
  items,
}: {
  title: string;
  items: [string, string | undefined][];
}) {
  return (
    <div className="rounded-2xl border p-5">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="space-y-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col gap-1 border-b pb-3 last:border-none last:pb-0 md:flex-row md:items-center md:justify-between"
          >
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="font-medium">{value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
