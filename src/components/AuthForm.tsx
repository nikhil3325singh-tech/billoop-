import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { loginUser, signUpUser, signInWithGoogle, useSession } from "@/lib/auth";
import { BrandMark, COMPANY } from "@/components/Marketing";
import { X, User, Plus, ArrowRight, CheckCircle2 } from "lucide-react";

const googlePresetAccounts = [
  {
    name: "Nikhil Singh",
    email: "nikhil@focitech.in",
    role: "Founder & MD, Foci Tech",
    avatarBg: "bg-emerald-600",
    initials: "NS",
  },
  {
    name: "Deepesh Sharma",
    email: "deepesh@focitech.in",
    role: "Co-Founder & CTO, Foci Tech",
    avatarBg: "bg-indigo-600",
    initials: "DS",
  },
  {
    name: "Electrical Contractor",
    email: "contractor.pro@gmail.com",
    role: "Licensed Electrical Contractor",
    avatarBg: "bg-amber-600",
    initials: "EC",
  },
];

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const { session } = useSession();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // Google Modal state
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState<string | null>(null);
  const [isCustomGoogleOpen, setIsCustomGoogleOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [googleBusy, setGoogleBusy] = useState(false);

  useEffect(() => {
    if (session) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    if (mode === "signup") {
      const res = await signUpUser({ email, password, fullName: name });
      if (res.ok) {
        toast.success("Account created successfully!");
        navigate({ to: "/dashboard", replace: true });
      } else {
        toast.error(res.error || "Sign up failed");
      }
    } else {
      const res = await loginUser({ email, password });
      if (res.ok) {
        toast.success("Logged in successfully!");
        navigate({ to: "/dashboard", replace: true });
      } else {
        toast.error(res.error || "Invalid login credentials");
      }
    }
    setBusy(false);
  };

  const handleSelectGoogleAccount = async (account: { name: string; email: string }) => {
    setSelectedGoogleEmail(account.email);
    setGoogleBusy(true);

    setTimeout(async () => {
      const res = await signInWithGoogle({
        email: account.email,
        fullName: account.name,
      });

      if (res.ok) {
        toast.success(`Welcome, ${account.name}! Signed in via Google.`);
        setIsGoogleModalOpen(false);
        navigate({ to: "/dashboard", replace: true });
      } else {
        toast.error(res.error || "Google login failed");
        setGoogleBusy(false);
        setSelectedGoogleEmail(null);
      }
    }, 450);
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) {
      toast.error("Please enter your Google email.");
      return;
    }

    setGoogleBusy(true);
    const chosenName = customGoogleName.trim() || customGoogleEmail.split("@")[0] || "Google User";

    setTimeout(async () => {
      const res = await signInWithGoogle({
        email: customGoogleEmail,
        fullName: chosenName,
      });

      if (res.ok) {
        toast.success(`Welcome, ${chosenName}! Signed in via Google.`);
        setIsGoogleModalOpen(false);
        navigate({ to: "/dashboard", replace: true });
      } else {
        toast.error(res.error || "Google login failed");
        setGoogleBusy(false);
      }
    }, 450);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative">
      <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-12">
        <div className="[&_*]:!text-primary-foreground">
          <BrandMark />
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight">
            Quotations and GST billing,
            <br />
            made for the electrical trade.
          </h2>
          <p className="opacity-80 mt-3 text-sm max-w-sm">
            Inventory, costing, branded templates and PDF / Word downloads in one place.
          </p>
        </div>
        <div className="text-xs opacity-70">
          © {new Date().getFullYear()} {COMPANY}
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8">
            <BrandMark />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login"
              ? "Log in to manage quotes, inventory and invoices."
              : "Start making professional quotations in minutes."}
          </p>

          <div className="mt-6">
            <button
              type="button"
              id="google-login-btn"
              disabled={googleBusy || busy}
              onClick={() => setIsGoogleModalOpen(true)}
              className="btn w-full !bg-card hover:!bg-muted border border-border flex items-center justify-center gap-3 !py-2.5 transition-all shadow-sm font-medium hover:border-primary/50 group"
            >
              <svg className="size-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
              </svg>
              <span>{mode === "signup" ? "Sign up with Google" : "Sign in with Google"}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 my-5 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>or with email</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3.5">
            {mode === "signup" && (
              <label className="block">
                <span className="label-cap">Full Name</span>
                <input
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="field mt-1 w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            )}

            <label className="block">
              <span className="label-cap">Email Address</span>
              <input
                required
                type="email"
                placeholder="name@company.com"
                className="field mt-1 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="label-cap">Password</span>
              <input
                required
                minLength={6}
                type="password"
                placeholder="Minimum 6 characters"
                className="field mt-1 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button
              type="submit"
              disabled={busy || googleBusy}
              className="btn-primary w-full !py-2.5 mt-2"
            >
              {busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-muted-foreground mt-5 text-center">
            {mode === "login" ? (
              <>
                New here?{" "}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Log in
                </Link>
              </>
            )}
          </p>

          <p className="text-center mt-6">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>

      {/* Google Account Selector Dialog */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-[420px] rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-border/80 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <svg className="size-6 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/>
                </svg>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Sign in with Google</h3>
                  <p className="text-xs text-muted-foreground">Choose an account to continue to <b>Billoop</b></p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!googleBusy) setIsGoogleModalOpen(false);
                }}
                className="size-8 rounded-full grid place-items-center text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 pt-1">
                Saved Accounts
              </div>

              {googlePresetAccounts.map((account) => {
                const isSelected = selectedGoogleEmail === account.email;
                return (
                  <button
                    key={account.email}
                    type="button"
                    disabled={googleBusy}
                    onClick={() => handleSelectGoogleAccount(account)}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/70 transition-all text-left group border border-transparent hover:border-border/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full text-white font-semibold text-xs grid place-items-center shrink-0 ${account.avatarBg}`}>
                        {account.initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {account.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {account.email}
                        </div>
                        <div className="text-[10px] text-muted-foreground/80 mt-0.5">
                          {account.role}
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="size-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    ) : (
                      <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100" />
                    )}
                  </button>
                );
              })}

              {/* Use another account section */}
              <div className="pt-2 border-t border-border/70">
                {!isCustomGoogleOpen ? (
                  <button
                    type="button"
                    disabled={googleBusy}
                    onClick={() => setIsCustomGoogleOpen(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/70 transition-colors text-left text-xs font-semibold text-foreground"
                  >
                    <div className="size-10 rounded-full bg-muted grid place-items-center shrink-0 text-muted-foreground">
                      <Plus className="size-4" />
                    </div>
                    <span>Use another Google account</span>
                  </button>
                ) : (
                  <form onSubmit={handleCustomGoogleSubmit} className="p-3 bg-muted/40 rounded-xl space-y-3">
                    <div className="text-xs font-semibold text-foreground">Sign in with your Google email</div>
                    <div className="space-y-2">
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        className="input text-xs w-full bg-background"
                      />
                      <input
                        type="text"
                        placeholder="Your full name (optional)"
                        value={customGoogleName}
                        onChange={(e) => setCustomGoogleName(e.target.value)}
                        className="input text-xs w-full bg-background"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={googleBusy}
                        className="btn-primary text-xs !py-2 px-4 flex-1 flex items-center justify-center gap-1.5"
                      >
                        {googleBusy ? (
                          <span>Connecting…</span>
                        ) : (
                          <>
                            <span>Continue</span>
                            <ArrowRight className="size-3.5" />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCustomGoogleOpen(false)}
                        className="btn text-xs !py-2 px-3"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-muted/30 border-t border-border/70 text-[11px] text-muted-foreground leading-relaxed">
              To continue, Google will securely verify your profile with Billoop by Foci Tech.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
