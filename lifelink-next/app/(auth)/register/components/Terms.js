import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";

export function TermsAndCondition({ onAccept }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleAccept = () => {
    onAccept(true);
    setOpen(false); // Close the dialog
  };

  const handleDisagree = () => {
    onAccept(false);
    setOpen(false); // Close the dialog
  };

  return (
    <>
      <Typography
        variant="paragraph"
        color="red"
        onClick={handleOpen}
        className="cursor-pointer hover:text-red-900"
      >
        Terms and Conditions.
      </Typography>
      <Dialog open={open} handler={handleOpen} size="lg">
        <DialogHeader className="bg-red-500 rounded-t-md text-white">
          Terms and Conditions
        </DialogHeader>
        <DialogBody
          divider
          className="h-96 3xl:h-full overflow-y-auto grid gap-3"
        >
          <Typography variant="small" color="gray">
            Welcome to Lifelink. Please read the terms and conditions (“Terms”
            or “Agreement”) prior to completing the registration for an account
            with Lifelink. The following Terms and conditions shall govern how
            your data will be collected and used by the system that you are
            registering into. By registering to Lifelink, you accept and agree
            to be legally bound by these Terms of the service you will be using.
          </Typography>
          <Typography variant="h6" color="blue-gray">
            1. BASIC TERMS
          </Typography>
          <Typography variant="small" color="gray">
            1.1 You must be at least eighteen (18) years of age to register for
            a Lifelink account. By registering, you represent and warrant that
            you are at least eighteen (18) years of age and have the legal
            capacity to agree with these Terms.
          </Typography>
          <Typography variant="h6" color="blue-gray">
            2. REGISTRATION FOR LIFELINK
          </Typography>
          <Typography variant="small" color="gray">
            2.1 When you accept these Terms, you are setting up your Lifelink
            account that is associated with your e-mail and mobile number. You
            will be asked to provide information such as your complete name,
            present and/or permanent address, date of birth, blood type, and
            occupation. We may also verify your registration information through
            a third-party verification partner/service provider, as we may deem
            necessary.
          </Typography>
          <Typography variant="h6" color="blue-gray">
            3. ACCOUNT SECURITY
          </Typography>
          <Typography variant="small" color="gray">
            3.1 You shall keep your Password and other Lifelink Account data
            confidential and secure at all times. These shall not be disclosed
            to anyone without your permission. You shall be responsible for the
            security of your Lifelink account. All transactions made using the
            Lifelink account are conclusively presumed made by you, and you
            shall be liable therefore.
          </Typography>
          <Typography variant="h6" color="blue-gray">
            4. BLOOD UNIT REQUEST TRANSACTION
          </Typography>
          <Typography variant="small" color="gray">
            4.1 All transactions made using the blood network should not be
            disclosed to anyone without your permission. Transactions made under
            your account shall be accountable by you, and you shall be liable
            therefore.
          </Typography>
          <Typography variant="h6" color="blue-gray">
            ACCEPTABLE USE POLICY
          </Typography>
          <Typography variant="h6" color="blue-gray" className="text-sm">
            You agree not to:
          </Typography>
          <Typography variant="small" color="gray">
            1. alter, modify, or cause the alteration or modification of the
            Lifelink Services. You further agree not to use the Lifelink
            Services for any commercial use, without prior written authority
            from Lifelink;
            <br />
            1.2. use any automatic devices, programs, algorithms, or
            methodology, or any similar or equivalent manual process, to access,
            acquire, copy or monitor any part of the Lifelink Services, or in
            any way reproduce its navigational structure or presentation, as
            well as to obtain or attempt to obtain any material, document or
            information through any means not purposely made available through
            the Lifelink Services;
          </Typography>
          <Typography variant="h6" color="blue-gray" className="text-sm">
            You agree to:
          </Typography>
          <Typography variant="small" color="gray">
            1.3 Give permission to Lifelink services to use your information as
            a valid basis for any blood services both Bloodletting and Blood
            transfusion activities.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="filled"
            color="gray"
            onClick={handleDisagree}
            className="mr-1"
          >
            <span>I Disagree</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleAccept}>
            <span>I Accept</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
