"use client";
import React, { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
export default function CredentialRegister() {
  const router = useRouter();
  const [data, setData] = React.useState({
    email: "",
    password: "",
    image: "",
    name: "",
  });
  function handleChange(e: any) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }
  function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    api
      .register(data)
      .then(({ user }) => {
        toast("User created " + user.name);
        api.login({ password: data.password, email: data.email }).then(() => {
          router.push("/dashboard");
          toast.success("Welcome to taskmaster");
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("There has been an error creating the user");
      });
  }
  return (
    <form className="mt-5 grid gap-4" onSubmit={handleRegister}>
      <Label htmlFor="email">Name</Label>
      <Input
        id="name"
        name="name"
        type="text"
        placeholder="Task master"
        onChange={handleChange}
        required
      />
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
        onChange={handleChange}
        required
      />
      <Label htmlFor="email">Image</Label>
      <Input
        id="image"
        name="image"
        type="url"
        placeholder="https://example.com/image.jpg"
        onChange={handleChange}
        required
      />
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Enter your email"
        onChange={handleChange}
        required
      />
      <Button type="submit" className="w-full">
        Sign up
      </Button>
    </form>
  );
}
