import React, { useContext, useState } from "react";

import ErrorModal from "../../shared/components/UI/error-modal";
import Card from "../../shared/components/UI/card";
import LoadingSpinner from "../../shared/components/UI/loadingSpinner";
import Input from "../../shared/components/formUI/input";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/validator/validation.js";
import Button from "../../shared/components/formUI/button";

import "./auth.css";

const Auth = (props) => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          "https://hidden-hollows-02729.herokuapp.com/api/user/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.userId, responseData.token, responseData.role);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const formData = {
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
          name: formState.inputs.name.value,
        };
        // const formData = new FormData();
        // formData.append("email", formState.inputs.email.value);
        // formData.append("name", formState.inputs.name.value);
        // formData.append("password", formState.inputs.password.value);
        // console.log(formData);
        const responseData = await sendRequest(
          "https://hidden-hollows-02729.herokuapp.com/api/user/signup",
          "POST",
          JSON.stringify(formData),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(responseData.userId, responseData.token, responseData.role);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }

    setIsLoginMode((prevVal) => !prevVal);
  };

  const errorHandler = () => {
    clearError();
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner osOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={submitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter your name"
              onInput={inputHandler}
            />
          )}

          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
            errorText="Please enter a valid email"
          />

          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={inputHandler}
            errorText="Please set a valid password, at least 6 characters.."
          />

          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}{" "}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
