import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";

export function AuthCard({ onAuthenticate }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = () => {
    // Check if the password matches the expected password 'admin123'
    if (password === 'admin123') {
      // Call the onAuthenticate function provided as a prop
      onAuthenticate();
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <Card className="w-96">
      <CardHeader
        variant="gradient"
        color="gray"
        className="p-6 mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h5" color="white" className="text-center">
          Oops! You need Admin password to access this page.
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Input
          label="Password"
          size="lg"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        {error && <Typography variant="body" color="red">{error}</Typography>}
      </CardBody>
      <CardFooter className="pt-0">
        <Button variant="gradient" fullWidth onClick={handleSubmit}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}
