import { laravelBaseUrl } from "@/app/variables";
import {
  Button,
  Card,
  Collapse,
  Input,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import PasswordChecklist from "react-password-checklist";

export function RegF1({ onNextStep }) {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [MobileError, setMobileError] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  const [errorMessage, setErrorMessage] = useState({ email: [], mobile: [] });

  const openCheckList = () => setOpen(true);
  const showPassword = () => setShowPass(!showPass);
  const showConfirmPassword = () => setShowConPass(!showConPass);

  const isValidEmail = (email) => {
    const validDomains = ["@gmail.com", "@hotmail.com", "@yahoo.com"];
    return validDomains.some((domain) => email.includes(domain));
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(isValidEmail(newEmail));
  };

  const handleMobileNumberChange = (e) => {
    let inputValue = e.target.value;

    // Remove non-numeric characters
    inputValue = inputValue.replace(/[^0-9]/g, "");

    // Ensure the first digit is 9 and limit the length to 10 digits
    const sanitizedValue = inputValue.startsWith("9")
      ? inputValue.slice(0, 10)
      : inputValue.slice(0, 9);

    // If the first digit is not 9, reset the input to an empty string
    if (inputValue.length > 0 && inputValue[0] !== "9") {
      setMobile("");
    } else {
      setMobile(sanitizedValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const formattedMobile = `0${mobile}`;
      const response = await axios.post(
        `${laravelBaseUrl}/api/auth/register-step1`,
        {
          email,
          mobile: formattedMobile,
          password,
          password_confirmation,
        }
      );

      if (response.data.user_id) {
        document.cookie = `user_id=${response.data.user_id}; secure; SameSite=Strict`;
      }

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
      console.error("Error:", error);
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
        <div className="mb-6 flex flex-col gap-6">
          <div className="relative">
            <Input
              size="lg"
              label="Email"
              value={email}
              onChange={handleEmailChange}
              required
              error={!isEmailValid && email.trim() !== ""}
              success={isEmailValid}
              maxLength={100}
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
            <Typography variant="small" color="red">
              {!isEmailValid && email.trim() !== "" && "Invalid Email"}
            </Typography>
          </div>
          <div
           
          >
            <div className="w-full relative">
              {inputFocused && (
                <Typography
                  variant="paragraph"
                  style={{
                    position: "absolute",
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-45%)",
                    zIndex: "2",
                    fontSize: "14px",
                  }}
                >
                  +63
                </Typography>
              )}
              <Input
                size="lg"
                label="Mobile Number"
                value={mobile}
                onChange={handleMobileNumberChange}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(mobile.trim() !== "")}
                required
                maxLength={10}
                success={isMobileValid}
                className = "w-full pl-12"
                
              />
             
            </div>
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
            type={showPass === true ? "text" : "password"}
            size="lg"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onFocus={openCheckList}
            required
            icon={
              showPass === true ? (
                <EyeSlashIcon className="w-5 h-5" onClick={showPassword} />
              ) : (
                <EyeIcon className="w-5 h-5" onClick={showPassword} />
              )
            }
            maxLength={128}
          />
          <Collapse open={open} className={open === false ? "hidden" : ""}>
            <Card shadow={false} className="bg-gray-300 w-full px-4 py-2">
              <PasswordChecklist
                rules={["minLength", "specialChar", "number", "capital"]}
                minLength={8}
                value={password}
              />
            </Card>
          </Collapse>
          <Input
            type={showConPass === true ? "text" : "password"}
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
            icon={
              showConPass === true ? (
                <EyeSlashIcon
                  className="w-5 h-5"
                  onClick={showConfirmPassword}
                />
              ) : (
                <EyeIcon className="w-5 h-5" onClick={showConfirmPassword} />
              )
            }
          />
        </div>
        <div className="flex justify-center mt-6">
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-5"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? <Spinner className="h-4 w-4" /> : ""}
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
