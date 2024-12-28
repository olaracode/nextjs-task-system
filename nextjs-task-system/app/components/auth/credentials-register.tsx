"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Github, Mail } from "lucide-react";

export default function CredentialRegister() {
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
  function handleRegister() {
    fetch("/api/v1/users", {
      method: "POST",
    });
  }
  return (
    <form className="mt-5 grid gap-4">
      <Label htmlFor="email">Name</Label>
      <Input
        id="name"
        name="name"
        type="text"
        placeholder="Task master"
        required
      />
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="Enter your email"
        required
      />
      <Label htmlFor="email">Image</Label>
      <Input
        id="image"
        name="image"
        type="url"
        placeholder="https://example.com/image.jpg"
        required
      />
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        name="password"
        type="password"
        placeholder="Enter your email"
        required
      />
      <Button type="submit" className="w-full">
        Sign up
      </Button>
    </form>
  );
}
