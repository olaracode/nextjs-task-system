import React from "react";
import OAuth from "@/components/auth/oauth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CredentialRegister from "./credentials-register";
import CredentialsLogin from "./credentials-login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "../ui/separator";
export default function AuthCard() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl font-bold">
          Welcome to taskmaster
        </CardTitle>
        <CardDescription className="text-center">
          Please signup/signin to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Login</TabsTrigger>
            <TabsTrigger value="signup">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <CredentialsLogin />
          </TabsContent>
          <TabsContent value="signup">
            <CredentialRegister />
          </TabsContent>
        </Tabs>
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <OAuth />
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          By signing up, you agree to our{" "}
          <a href="#" className="font-medium text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="font-medium text-primary hover:underline">
            Privacy Policy
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
