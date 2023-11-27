import { useState } from "react";
import {
  Card,
  Typography,
  Input,
  Button,
  Collapse,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import PasswordChecklist from "react-password-checklist";

export function NewPass({ onNextPage }) {
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [open, setOpen] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const [valid, setValid] = useState(false);

  const handleCheckList = () => setOpen(true);
  const showPassword = () => setShowPass(!showPass);
  const showConfirmPassword = () => setShowConPass(!showConPass);

  const isPasswordMatching = pass === confirmPass;
  const confirmPasswordStyle =
    confirmPass === "" ? "normal" : isPasswordMatching ? "success" : "error";

  return (
    <div className="w-full h-96 grid 2xl:w-1/2">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Input your new password.
      </Typography>
      <div className="flex flex-col items-center gap-3 mb-3">
        <Input
          size="lg"
          type={showPass === true ? "text" : "password"}
          label="New Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onFocus={handleCheckList}
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
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={8}
              value={pass}
              valueAgain={confirmPass}
              onChange={(isValid) => {
                if (isValid === true) {
                  setValid(true);
                } else {
                  setValid(false);
                }
              }}
            />
          </Card>
        </Collapse>
      </div>
      <Input
        size="lg"
        type={showConPass === true ? "text" : "password"}
        label="Confirm New Password"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
        required
        {...(confirmPasswordStyle === "normal"
          ? {}
          : confirmPasswordStyle === "success"
          ? { success: true }
          : { error: true })}
        icon={
          showConPass === true ? (
            <EyeSlashIcon className="w-5 h-5" onClick={showConfirmPassword} />
          ) : (
            <EyeIcon className="w-5 h-5" onClick={showConfirmPassword} />
          )
        }
      />
      <Button
        type="submit"
        variant="gradient"
        className="w-1/2 place-self-center"
        disabled={!isPasswordMatching || !pass || valid === false}
        onClick={onNextPage}
      >
        Submit
      </Button>
    </div>
  );
}
