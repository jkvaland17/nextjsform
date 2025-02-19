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

      const formData = {
        ...data,
        profileImage,
      };
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
    <div className="max-w-4xl mx-auto p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
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

        <TabsContent value="profile" className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <Avatar className="h-32 w-32">
                    <AvatarImage
                      src={
                        profileImage ||
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop"
                      }
                    />
                    <AvatarFallback>CR</AvatarFallback>
                  </Avatar>
                </div>
                <label
                  htmlFor="image-upload"
                  className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-full cursor-pointer"
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
                <label className="text-lg text-gray-700">Your Name</label>
                <Input
                  {...register("editSection.name")}
                  placeholder="Your Name"
                  className={`w-full ${
                    errors?.editSection?.name ? "border-red-500" : ""
                  }`}
                />
                {errors?.editSection?.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.editSection.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-lg text-gray-700">Designation</label>
                <Input
                  {...register("editSection.designation")}
                  placeholder="Designation"
                  className={`w-full ${
                    errors?.editSection?.designation ? "border-red-500" : ""
                  }`}
                />
                {errors?.editSection?.designation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.editSection.designation.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-lg text-gray-800">
                  Dept./Organization
                </label>
                <Controller
                  name="detailSection.department"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`w-full border-gray-300 rounded-[10px] text-gray-700 ${
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.detailSection.department.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-lg text-gray-800">Email</label>
                <Input
                  {...register("detailSection.email")}
                  type="email"
                  placeholder="Email"
                  className={`w-full ${
                    errors?.detailSection?.email ? "border-red-500" : ""
                  }`}
                />
                {errors?.detailSection?.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.detailSection.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-lg text-gray-800">Mobile Number</label>
                <Input
                  {...register("editSection.mobileNumber")}
                  placeholder="Mobile Number"
                  className={`w-full ${
                    errors?.editSection?.mobileNumber ? "border-red-500" : ""
                  }`}
                />
                {errors?.editSection?.mobileNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.editSection.mobileNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-lg text-gray-800">
                  Alternative Number
                </label>
                <Input
                  {...register("editSection.alternativeNumber")}
                  placeholder="Alternative Number"
                  className={`w-full ${
                    errors?.editSection?.alternativeNumber
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {errors?.editSection?.alternativeNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.editSection.alternativeNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-lg text-gray-800">Date of Birth</label>
                <Input
                  {...register("editSection.dateOfBirth")}
                  type="date"
                  className={`w-full ${
                    errors?.editSection?.dateOfBirth ? "border-red-500" : ""
                  }`}
                />
                {errors?.editSection?.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.editSection.dateOfBirth.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-lg text-gray-800">Present Address</label>
                <Input
                  {...register("editSection.presentAddress")}
                  placeholder="Present Address"
                  className={`w-full ${
                    errors?.editSection?.presentAddress ? "border-red-500" : ""
                  }`}
                />
                {errors?.editSection?.presentAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.editSection.presentAddress.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-lg text-gray-800">
                  Permanent Address
                </label>
                <Input
                  {...register("editSection.permanentAddress")}
                  placeholder="Permanent Address"
                  className={`w-full ${
                    errors?.editSection?.permanentAddress
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {errors?.editSection?.permanentAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.editSection.permanentAddress.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-lg text-gray-800">City</label>
                <Input
                  {...register("editSection.city")}
                  placeholder="City"
                  className={`w-full ${
                    errors?.editSection?.city ? "border-red-500" : ""
                  }`}
                />
                {errors?.editSection?.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.editSection.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-lg text-gray-800">Postal Code</label>
                <Input
                  {...register("editSection.postalCode")}
                  placeholder="Postal Code"
                  className={`w-full ${
                    errors?.editSection?.postalCode ? "border-red-500" : ""
                  }`}
                />
                {errors?.editSection?.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.editSection.postalCode.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-lg text-gray-800">Country</label>
                <Input
                  {...register("editSection.country")}
                  placeholder="Country"
                  className={`w-full ${
                    errors?.editSection?.country ? "border-red-500" : ""
                  }`}
                />
                {errors?.editSection?.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.editSection.country.message}
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
        </TabsContent>
        <TabsContent value="security">
          <div className="text-center py-8 text-muted-foreground">
            Security settings will be displayed here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
