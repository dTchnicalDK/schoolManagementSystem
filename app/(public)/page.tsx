import { auth } from "@/auth";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  School,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  console.log(session?.user?.id); // cuid from DB
  console.log(session?.user?.role); // "PARENT" (default)
  return (
    <div className="font-sans grid grid-rows-[4px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div>Welcome</div>
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-background to-background" />
          <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm shadow-sm backdrop-blur">
              <School className="h-4 w-4 text-primary" />
              <span>Admissions Open for 2026–27 Session</span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              School Admissions Made{" "}
              <span className="text-primary">
                Simple, Transparent, and Fast
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Apply online, track admission progress, and manage the entire
              admission workflow in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/apply">
                <Button size="lg" className="w-full sm:w-auto">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Parent Login
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                title="100% Online"
                description="Apply from anywhere without visiting campus first."
              />
              <StatCard
                title="Real-Time Tracking"
                description="Parents can monitor application progress anytime."
              />
              <StatCard
                title="Secure Workflow"
                description="Admin and reviewer roles ensure smooth admissions."
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Why Choose This Portal
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A Better Admission Experience for Everyone
            </h2>
            <p className="mt-4 text-muted-foreground">
              Designed for parents, administrators, and reviewers with a clean
              and easy workflow.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<ClipboardList className="h-6 w-6 text-primary" />}
              title="Simple Online Application"
              description="Parents can complete admission forms in a guided multi-step process."
            />
            <FeatureCard
              icon={<FileCheck2 className="h-6 w-6 text-primary" />}
              title="Status Tracking"
              description="Track whether your application is submitted, under review, accepted, or rejected."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-primary" />}
              title="Reviewer Workflow"
              description="Assigned reviewers can add remarks and recommendations efficiently."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-6 w-6 text-primary" />}
              title="Role-Based Access"
              description="Secure access for parents, administrators, and reviewers."
            />
            <FeatureCard
              icon={<GraduationCap className="h-6 w-6 text-primary" />}
              title="Admission Transparency"
              description="Every stage of the application process is visible and structured."
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-6 w-6 text-primary" />}
              title="Centralized Management"
              description="Admins can manage all applications, reviewers, and settings from one panel."
            />
          </div>
        </section>

        {/* Process Section */}
        <section className="border-y bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Admission Process
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-muted-foreground">
                A simple admission flow from application to decision.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StepCard
                step="01"
                title="Create Account"
                description="Register as a parent and access the admission portal."
              />
              <StepCard
                step="02"
                title="Fill Application"
                description="Complete student, parent, and previous school details."
              />
              <StepCard
                step="03"
                title="Track Review"
                description="Your application is reviewed by assigned staff."
              />
              <StepCard
                step="04"
                title="Get Decision"
                description="Receive the final admission outcome online."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border bg-linear-to-r from-primary/10 via-background to-primary/5 px-6 py-12 text-center shadow-sm sm:px-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Start Your Child’s Admission Journey Today
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Complete the application online and stay updated every step of the
              way.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/apply">
                <Button size="lg">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/register">
                <Button size="lg" variant="outline">
                  Create Parent Account
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/20">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <School className="h-4 w-4 text-primary" />
              <span>School Admission Portal</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <Link href="/apply" className="hover:text-foreground">
                Apply
              </Link>
              <Link href="/login" className="hover:text-foreground">
                Login
              </Link>
              <Link href="/register" className="hover:text-foreground">
                Register
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function StatCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-background/80 p-6 text-left shadow-sm backdrop-blur">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-background p-6 shadow-sm">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {step}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
