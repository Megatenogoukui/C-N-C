"use server";

import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validation";

export async function registerAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!name || !email || !password || !confirmPassword) {
    redirect("/signup?error=Please%20fill%20all%20fields");
  }

  if (password.length < 8) {
    redirect("/signup?error=Password%20must%20be%20at%20least%208%20characters");
  }

  if (password !== confirmPassword) {
    redirect("/signup?error=Passwords%20do%20not%20match");
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/signup?error=An%20account%20already%20exists%20for%20that%20email");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      passwordHash
    }
  });

  redirect("/login?registered=1");
}

export async function requestPasswordResetAction(formData: FormData) {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email")
  });

  if (!parsed.success) {
    redirect("/forgot-password?error=Enter%20a%20valid%20email%20address");
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user) {
    redirect("/forgot-password?sent=1");
  }

  await db.passwordResetToken.deleteMany({
    where: { userId: user.id, usedAt: null }
  });

  const token = randomBytes(24).toString("hex");
  await db.passwordResetToken.create({
    data: {
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      userId: user.id
    }
  });

  redirect(`/forgot-password?sent=1&token=${token}`);
}

export async function resetPasswordAction(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Reset details are invalid";
    redirect(`/reset-password?token=${encodeURIComponent(String(formData.get("token") || ""))}&error=${encodeURIComponent(message)}`);
  }

  const resetToken = await db.passwordResetToken.findUnique({
    where: { token: parsed.data.token },
    include: { user: true }
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    redirect("/forgot-password?error=This%20reset%20link%20is%20invalid%20or%20expired");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await db.$transaction([
    db.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash }
    }),
    db.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() }
    })
  ]);

  redirect("/login?reset=1");
}
