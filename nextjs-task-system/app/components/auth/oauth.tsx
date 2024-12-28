import { signIn } from "@/lib/auth";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function OAuth() {
  return (
    <div className="space-y-4">
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <Button type="submit" className="w-full" variant="outline">
          <Github className="mr-2 h-4 w-4" />
          Sign up with GitHub
        </Button>
      </form>
    </div>
  );
}
