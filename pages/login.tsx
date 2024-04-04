import UserContext from "@/contexts/UserContext";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Router } from "next/router";
import { useContext } from "react";
import { toast } from "react-toastify";

type User = {
  accessToken: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
};

async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(apiUrl + "/v1/tokens/authentication", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }
  console.log("login", response);

  const data = await response.json();

  const user = {
    accessToken: data.authentication_token.token,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
    },
  };

  console.log("user", user);
  return user;
}

export default function Login() {
  const { login } = useContext(UserContext);

  const mutation = useMutation({
    mutationFn: signIn,
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    mutation.mutate({ email, password });

    console.log({ email, password });
  };

  if (mutation.isSuccess) {
    console.log(mutation.data);
    const userData = mutation.data;

    login(userData);

    toast.success("Login successful");
    setTimeout(() => {
      window.location.href = "/videos";
    }, 500);
  }

  if (mutation.isError) {
    toast.error("Login failed");
  }

  return (
    <>
      <div className="h-full bg-white">
        <div className="h-full">
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={onSubmit} method="POST">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Not a member?{" "}
                <Link
                  href="/register"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
