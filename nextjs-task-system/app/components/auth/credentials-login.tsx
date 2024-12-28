import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";
const CredentialsLogin = () => {
  return (
    <form
      className="space-y-2"
      action={async (formData) => {
        "use server";
        try {
          await signIn("credentials", formData);
        } catch (error) {
          console.error(error);
        }
      }}
    >
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
        required
      />
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="*********"
        required
      />
      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
};

export default CredentialsLogin;
