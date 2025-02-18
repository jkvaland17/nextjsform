"use client";

import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useState } from "react";

// Validation schema
const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(50, "Designation must be less than 50 characters"),
  department: z.string().min(1, "Please select a department"),
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number"),
  alternativeNumber: z
  .string()
  .regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      return new Date(date) <= eighteenYearsAgo;
    }, "You must be at least 18 years old"),
  presentAddress: z
    .string()
    .min(5, "Present address must be at least 5 characters")
    .max(100, "Present address must be less than 100 characters"),
  permanentAddress: z
    .string()
    .min(5, "Permanent address must be at least 5 characters")
    .max(100, "Permanent address must be less than 100 characters"),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be less than 50 characters"),
  postalCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid postal code"),
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must be less than 50 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Home = () => {
  const [profileImage, setProfileImage] = useState<string>(
    "/api/placeholder/150/150"
  );
  const [activeTab, setActiveTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      designation: "",
      department: "",
      email: "",
      mobileNumber: "",
      alternativeNumber: "",
      dateOfBirth: "",
      presentAddress: "",
      permanentAddress: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
      alert("Profile updated successfully!");
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
   <div className="max-w-4xl mx-auto p-6">
      <div className="flex space-x-8 border-b mb-8">
        <button
          className={`pb-2 px-4 ${
            activeTab === "profile"
              ? "border-b-2 border-blue-500 text-blue-500"
              : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Edit Profile
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === "security"
              ? "border-b-2 border-blue-500 text-blue-500"
              : ""
          }`}
          onClick={() => setActiveTab("security")}
        >
          Security
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={profileImage}
                alt="Profile"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
            <label
              htmlFor="image-upload"
              className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Your Name</label>
            <Input
              {...register("name")}
              placeholder="Your Name"
              className={`w-full ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Designation</label>
            <Input
              {...register("designation")}
              placeholder="Designation"
              className={`w-full ${errors.designation ? "border-red-500" : ""}`}
            />
            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.designation.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Dept./Organization</label>
            <Select
              {...register("department")}
              className={`w-full ${errors.department ? "border-red-500" : ""}`}
            >
              <option value="">Select Department</option>
              <option value="health">Health</option>
              <option value="tech">Tech</option>
              <option value="finance">Finance</option>
            </Select>
            {errors.department && (
              <p className="text-red-500 text-sm mt-1">
                {errors.department.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Email</label>
            <Input
              {...register("email")}
              type="email"
              placeholder="Email"
              className={`w-full ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Mobile Number</label>
            <Input
              {...register("mobileNumber")}
              placeholder="Mobile Number"
              className={`w-full ${
                errors.mobileNumber ? "border-red-500" : ""
              }`}
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobileNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Alternative Number</label>
            <Input
              {...register("alternativeNumber")}
              placeholder="Alternative Number"
              className={`w-full ${
                errors.alternativeNumber ? "border-red-500" : ""
              }`}
            />
            {errors.alternativeNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.alternativeNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Date of Birth</label>
            <Input
              {...register("dateOfBirth")}
              type="date"
              className={`w-full ${errors.dateOfBirth ? "border-red-500" : ""}`}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Present Address</label>
            <Input
              {...register("presentAddress")}
              placeholder="Present Address"
              className={`w-full ${
                errors.presentAddress ? "border-red-500" : ""
              }`}
            />
            {errors.presentAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.presentAddress.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Permanent Address</label>
            <Input
              {...register("permanentAddress")}
              placeholder="Permanent Address"
              className={`w-full ${
                errors.permanentAddress ? "border-red-500" : ""
              }`}
            />
            {errors.permanentAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.permanentAddress.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">City</label>
            <Input
              {...register("city")}
              placeholder="City"
              className={`w-full ${errors.city ? "border-red-500" : ""}`}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Postal Code</label>
            <Input
              {...register("postalCode")}
              placeholder="Postal Code"
              className={`w-full ${errors.postalCode ? "border-red-500" : ""}`}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.postalCode.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-600">Country</label>
            <Input
              {...register("country")}
              placeholder="Country"
              className={`w-full ${errors.country ? "border-red-500" : ""}`}
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">
                {errors.country.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-500 text-white px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Home;
