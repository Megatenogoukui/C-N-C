"use server";

import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { forgotPasswordSchema, profileSchema, registerSchema, resetPasswordSchema } from "@/lib/validation";

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    pincode: formData.get("pincode"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Please fill all required fields";
    redirect(`/signup?error=${encodeURIComponent(message)}`);
  }

  const { name, email, phone, address, pincode, password } = parsed.data;
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/signup?error=An%20account%20already%20exists%20for%20that%20email");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      phone,
      address,
      pincode,
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

  await db.user.update({
    where: { id: resetToken.userId },
    data: { passwordHash }
  });
  await db.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { usedAt: new Date() }
  });

  redirect("/login?reset=1");
}

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account");
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    pincode: formData.get("pincode")
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || "Profile details are invalid";
    redirect(`/account?error=${encodeURIComponent(message)}`);
  }

  await db.user.update({
    where: { id: session.user.id },
    data: parsed.data
  });

  redirect("/account?updated=1");
}
