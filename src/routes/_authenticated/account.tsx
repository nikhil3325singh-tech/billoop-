import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Shield, Bell, Key, Save, CheckCircle2, Building, Phone } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { useSession } from "@/lib/auth";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account — Billoop" },
      { name: "description", content: "Manage your personal profile, credentials, and account settings." },
    ],
  }),
  component: AccountPage,
});

export function AccountPage() {
  const { session } = useSession();
  const { company } = useStore();

  const [fullName, setFullName] = useState(session?.user?.user_metadata?.full_name || "Electrical Contractor");
  const [email] = useState(session?.user?.email || "contractor@focitech.in");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [role, setRole] = useState("Owner / Managing Contractor");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [quoteReminders, setQuoteReminders] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Account profile updated successfully!");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password changed successfully!");
  };

  return (
    <>
      <PageHeader
        title="My Account"
        subtitle="Manage your personal profile, security credentials, and preferences"
      />

      <div className="p-8 max-w-5xl space-y-6">
        {/* Profile Card */}
        <div className="card-surface p-6">
          <div className="flex items-center gap-4 pb-6 border-b">
            <div className="size-16 rounded-2xl bg-primary text-primary-foreground font-bold font-display text-2xl grid place-items-center shadow-md">
              {fullName.slice(0, 2).toUpperCase() || "ME"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
              <p className="text-sm text-muted-foreground">{email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Active Account
                </span>
                <span className="text-[11px] text-muted-foreground">· {company.name}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <label>
                <span className="label-cap">Full Name</span>
                <div className="relative mt-1">
                  <input
                    required
                    className="field pl-9"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <User className="size-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </label>

              <label>
                <span className="label-cap">Email Address</span>
                <div className="relative mt-1">
                  <input
                    disabled
                    className="field pl-9 opacity-75 cursor-not-allowed bg-muted/30"
                    value={email}
                  />
                  <Mail className="size-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </label>

              <label>
                <span className="label-cap">Phone Number</span>
                <div className="relative mt-1">
                  <input
                    className="field pl-9"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Phone className="size-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </label>

              <label>
                <span className="label-cap">Role / Designation</span>
                <div className="relative mt-1">
                  <input
                    className="field pl-9"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <Building className="size-4 text-muted-foreground absolute left-3 top-3" />
                </div>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button type="submit" className="btn-primary">
                <Save className="size-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Security & Password */}
        <div className="card-surface p-6">
          <div className="flex items-center gap-2 pb-4 border-b">
            <Key className="size-5 text-primary" />
            <h3 className="font-semibold text-base">Security & Password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="mt-4 space-y-4 max-w-xl">
            <label className="block">
              <span className="label-cap">Current Password</span>
              <input
                type="password"
                placeholder="••••••••"
                className="field mt-1"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>

            <div className="grid md:grid-cols-2 gap-4">
              <label className="block">
                <span className="label-cap">New Password</span>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="field mt-1"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="label-cap">Confirm New Password</span>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  className="field mt-1"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            </div>

            <button type="submit" className="btn">
              <Shield className="size-4" />
              <span>Update Password</span>
            </button>
          </form>
        </div>

        {/* Notification Preferences */}
        <div className="card-surface p-6">
          <div className="flex items-center gap-2 pb-4 border-b">
            <Bell className="size-5 text-primary" />
            <h3 className="font-semibold text-base">Notification Preferences</h3>
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg border border-border/70 hover:bg-muted/30 cursor-pointer">
              <div>
                <div className="font-medium text-sm text-foreground">Email Notifications for Quotation Approvals</div>
                <div className="text-xs text-muted-foreground">Receive instant alerts when a quotation is accepted or converted</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="size-4 accent-primary cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-border/70 hover:bg-muted/30 cursor-pointer">
              <div>
                <div className="font-medium text-sm text-foreground">Payment Due Reminders</div>
                <div className="text-xs text-muted-foreground">Automated reminder alerts for pending GST invoices approaching due dates</div>
              </div>
              <input
                type="checkbox"
                checked={quoteReminders}
                onChange={(e) => setQuoteReminders(e.target.checked)}
                className="size-4 accent-primary cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
