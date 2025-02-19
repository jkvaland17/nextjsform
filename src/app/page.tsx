"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { profileSchema } from "@/validations/add-profile-validation.schema";

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
    control,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      editSection: {
        name: "",
        designation: "",
        mobileNumber: "",
        alternativeNumber: "",
        dateOfBirth: "",
        presentAddress: "",
        permanentAddress: "",
        city: "",
        postalCode: "",
        country: "",
      },
      detailSection: {
        department: "",
        email: "",
      },
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const formData = { ...data, profileImage };
      console.log(formData);
      alert("Profile updated successfully");
      reset();
      setProfileImage("/api/placeholder/150/150");
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
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:space-x-8 border-b mb-6 sm:mb-8">
          <button
            className={`pb-2 px-4 text-sm sm:text-base ${
              activeTab === "profile"
                ? "border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Edit Profile
          </button>
          <button
            className={`pb-2 px-4 text-sm sm:text-base ${
              activeTab === "security"
                ? "border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        <TabsContent value="profile" className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex justify-center sm:justify-start items-center gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={profileImage} />
                    <AvatarFallback>CR</AvatarFallback>
                  </Avatar>
                </div>
                <label
                  htmlFor="image-upload"
                  className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Form fields with responsive styling */}
              <FormField
                label="Your Name"
                error={errors?.editSection?.name}
                {...register("editSection.name")}
                placeholder="Your Name"
              />
              <FormField
                label="Designation"
                error={errors?.editSection?.designation}
                {...register("editSection.designation")}
                placeholder="Designation"
              />
              <div className="space-y-2">
                <label className="text-base sm:text-lg text-gray-800">
                  Dept./Organization
                </label>
                <Controller
                  name="detailSection.department"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`w-full border-gray-300 rounded-lg ${
                          errors?.detailSection?.department
                            ? "border-red-500"
                            : ""
                        }`}
                      >
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors?.detailSection?.department && (
                  <p className="text-red-500 text-sm">
                    {errors.detailSection.department.message}
                  </p>
                )}
              </div>

              <FormField
                label="Email"
                error={errors?.detailSection?.email}
                {...register("detailSection.email")}
                type="email"
                placeholder="Email"
              />
              <FormField
                label="Mobile Number"
                error={errors?.editSection?.mobileNumber}
                {...register("editSection.mobileNumber")}
                placeholder="Mobile Number"
              />
              <FormField
                label="Alternative Number"
                error={errors?.editSection?.alternativeNumber}
                {...register("editSection.alternativeNumber")}
                placeholder="Alternative Number"
              />
              <FormField
                label="Date of Birth"
                error={errors?.editSection?.dateOfBirth}
                {...register("editSection.dateOfBirth")}
                type="date"
              />
              <FormField
                label="Present Address"
                error={errors?.editSection?.presentAddress}
                {...register("editSection.presentAddress")}
                placeholder="Present Address"
              />
              <FormField
                label="Permanent Address"
                error={errors?.editSection?.permanentAddress}
                {...register("editSection.permanentAddress")}
                placeholder="Permanent Address"
              />
              <FormField
                label="City"
                error={errors?.editSection?.city}
                {...register("editSection.city")}
                placeholder="City"
              />
              <FormField
                label="Postal Code"
                error={errors?.editSection?.postalCode}
                {...register("editSection.postalCode")}
                placeholder="Postal Code"
              />
              <FormField
                label="Country"
                error={errors?.editSection?.country}
                {...register("editSection.country")}
                placeholder="Country"
              />
            </div>
            <div className="flex justify-center sm:justify-end pt-4">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-500 text-white px-8 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </TabsContent>
        <TabsContent value="security">
          <div className="text-center py-8 text-gray-500">
            Security settings will be displayed here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const FormField = ({
  label,
  error,
  ...props
}: {
  label: string;
  error?: any;
  [key: string]: any;
}) => (
  <div className="space-y-2">
    <label className="text-base sm:text-lg text-gray-800">{label}</label>
    <Input
      className={`w-full ${error ? "border-red-500" : "border-gray-300"}`}
      {...props}
    />
    {error && <p className="text-red-500 text-sm">{error.message}</p>}
  </div>
);

export default Home;
