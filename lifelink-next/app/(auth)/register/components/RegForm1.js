import { laravelBaseUrl } from "@/app/variables";
import {
  Button,
  Card,
  Collapse,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import { useState } from "react";
import PasswordChecklist from "react-password-checklist";

export function RegF1({ onNextStep }) {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState({ email: [], mobile: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const openCheckList = () => setOpen(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        `${laravelBaseUrl}/api/auth/register-step1`,
        {
          email,
          mobile,
          password,
          password_confirmation,
        }
      );

      if (response.data.user_id) {
        document.cookie = `user_id=${response.data.user_id}; secure; SameSite=Strict`;
      }
      console.log(response);
      if (response.status === 200) {
        onNextStep();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const { errors } = error.response.data;
        const emailErrors = errors.email || [];
        const mobileErrors = errors.mobile || [];
        setErrorMessage({ email: emailErrors, mobile: mobileErrors });
      } else {
        setErrorMessage({ email: [error.message], mobile: [error.message] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPasswordMatching = password === password_confirmation;
  const confirmPasswordStyle =
    password_confirmation === ""
      ? "normal"
      : isPasswordMatching
      ? "success"
      : "error";
  const isFormValid =
    email !== "" &&
    mobile !== "" &&
    password !== "" &&
    password_confirmation !== "" &&
    confirmPasswordStyle === "success";

  return (
    <>
      <Typography variant="h4" className="mt-2" color="blue-gray">
        Enter your details for logging in
      </Typography>
      <form
        className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        onSubmit={handleSubmit}
      >
        <div className="mb-6 space-y-6">
          <div
            className={`relative ${
              errorMessage.email.length > 0 ? "mb-1" : ""
            }`}
          >
            <Input
              size="lg"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full ${
                errorMessage.email.length > 0 ? "border-red-500" : ""
              }`}
            />

            {errorMessage.email.length > 0 && (
              <div
                key="emailError"
                className="error-message text-red-600 text-sm"
              >
                {errorMessage.email[0]}
              </div>
            )}
          </div>

          <div
            className={`relative ${
              errorMessage.mobile.length > 0 ? "mb-1" : ""
            }`}
          >
            <Input
              size="lg"
              label="Phone Number"
              value={mobile}
              onChange={(e) => {
                const inputValue = e.target.value;
                const sanitizedValue = inputValue
                  .replace(/[^0-9]/g, "")
                  .slice(0, 11);
                setMobile(sanitizedValue);
              }}
              required
              className={`w-full ${
                errorMessage.mobile.length > 0 ? "border-red-500" : ""
              }`}
            />

            {errorMessage.mobile.length > 0 && (
              <div
                key="mobileError"
                className="error-message text-red-600 text-sm"
              >
                {errorMessage.mobile[0]}
              </div>
            )}
          </div>

          <Input
            type="password"
            size="lg"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onFocus={openCheckList}
            required
            className="mb-1"
          />
          <Collapse open={open} className={open === false ? 'hidden' : ''}>
            <Card shadow={false} className="bg-gray-300 w-full px-4 py-2">
              <PasswordChecklist
                rules={["minLength", "specialChar", "number", "capital"]}
                minLength={8}
                value={password}
              />
            </Card>
          </Collapse>
          <Input
            type="password"
            size="lg"
            label="Confirm Password"
            value={password_confirmation}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            {...(confirmPasswordStyle === "normal"
              ? {}
              : confirmPasswordStyle === "success"
              ? { success: true }
              : { error: true })}
            className="mb-2"
          />
        </div>
        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-5"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? <Spinner size="sm" /> : ""}
            NEXT STEP
          </Button>
        </div>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-gray-900">
            Sign In
          </a>
        </Typography>
      </form>
    </>
  );
}
