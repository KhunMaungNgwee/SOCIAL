import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "../../api/auth";
import useAuth from "../../hooks/useAuth";
import { toast } from "../../components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

const RegisterSchema = z
  .object({
    name: z.string().min(2, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    confirmPassword: z.string().min(4),
    profilePictureUrl: z.string().url("Invalid URL"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const LoginView = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { userLogin } = useAuth();

  type FormValues = {
    email: string;
    password: string;
    confirmPassword?: string;
    name?: string;
    profilePictureUrl?: string;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(isRegister ? RegisterSchema : LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      profilePictureUrl: "",
    },
    shouldUnregister: true,
  });

  const password = form.watch("password");

  useEffect(() => {
    if (isRegister && password) {
      form.setValue("confirmPassword", password, {
        shouldValidate: true,
        shouldTouch: false,
      });
    }
  }, [password, form, isRegister]);

  const { mutate: loginUser } = useLoginMutation({
    onMutate: () => setIsLoading(true),
    onSuccess: (response) => {
      const innerData = response.data;

      if (!innerData || !innerData.token) {
        toast({
          title: "Login failed",
          description: "No token returned from API",
          variant: "destructive",
        });
        return;
      }

      userLogin(innerData.token);

      toast({
        title: `You logged in with the following email: ${
          form.getValues().email
        }`,
        description: "Successful login",
        variant: "success",
      });

      navigate("/", { replace: true });
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error?.message || "Invalid credentials",
        variant: "destructive",
      });
    },
    onSettled: () => setIsLoading(false),
  });

  const { mutate: registerUser } = useRegisterMutation({
    onMutate: () => setIsLoading(true),
    onSuccess: (response) => {
      const innerData = response.data;

      console.log("Register response:", response);
      console.log("Registered user:", innerData?.user);

      if (!innerData || !innerData.user) {
        toast({
          title: "Registration failed",
          description: "No user returned from API",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Registration successful!",
        description: `Account created for ${innerData.user.email}. Please login.`,
      });

      setIsRegister(false);
      form.reset({
        email: innerData.user.email,
        password: "",
        confirmPassword: "",
        name: "",
        profilePictureUrl: "",
      });
    },
    onError: (error) => {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    },
    onSettled: () => setIsLoading(false),
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    console.log("Form errors:", form.formState.errors); // Add this
    console.log("Is form valid?", form.formState.isValid); // Add this
    if (isRegister) {
      if (!data.name || !data.profilePictureUrl) {
        toast({
          title: "Registration failed",
          description: "All fields are required",
          variant: "destructive",
        });
        return;
      }
      const formData = {
        name: data.name,
        email: data.email,
        password: data.password,
        profilePictureUrl: data.profilePictureUrl,
        confirmPassword: data.password,
      };
      registerUser(formData);
    } else {
      loginUser({
        email: data.email,
        password: data.password,
      });
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-tr from-purple-100 via-pink-100 to-blue-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-[90vw] max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Social</h1>
        <p className="text-center text-gray-500 mb-6">
          {isRegister ? "Create a new account" : "Login to your account"}
        </p>

        {/* Toggle */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              form.clearErrors();
              form.reset({
                email: form.getValues().email,
                password: form.getValues().password,
                confirmPassword: "",
                name: "",
                profilePictureUrl: "",
              });
            }}
            className={`px-4 py-2 rounded-l-lg border border-gray-300 transition-colors ${
              !isRegister
                ? "bg-gray-200 font-semibold"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              form.clearErrors();
              const currentPassword = form.getValues().password;
              form.reset({
                email: form.getValues().email,
                password: currentPassword,
                confirmPassword: currentPassword,
                name: "",
                profilePictureUrl: "",
              });
            }}
            className={`px-4 py-2 rounded-r-lg border border-gray-300 transition-colors ${
              isRegister
                ? "bg-gray-200 font-semibold"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Register
          </button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isRegister && (
              <>
                {/* Hidden confirmPassword field - auto-filled by useEffect */}
                <input type="hidden" {...form.register("confirmPassword")} />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel> {/* Update label too */}
                      <FormControl>
                        <Input
                          placeholder="Your Name"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profilePictureUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? isRegister
                  ? "Registering..."
                  : "Logging in..."
                : isRegister
                ? "Register"
                : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginView;
