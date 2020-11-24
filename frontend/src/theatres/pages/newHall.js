import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UI/loadingSpinner";
import ErrorModal from "../../shared/components/UI/error-modal";
import Input from "../../shared/components/formUI/input";
import Button from "../../shared/components/formUI/button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/validator/validation";
import { useForm } from "../../shared/hooks/form-hook";

import { useHttpClient } from "../../shared/hooks/http-hook";

const makeSeats = () => {
  let seatArray = [];

  for (let i = 0; i < 10; i++) {
    let tempArray = [];
    for (let j = 0; j < 10; j++) {
      tempArray.push({ row: i, col: j, isAvailable: true, bookedBy: "" });
    }
    seatArray.push(tempArray);
  }
  return seatArray;
};

const NewHall = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: "",
        isValid: false,
      },
      currentMovie: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();

  const placeSubmithandler = async (event) => {
    event.preventDefault();
    let seatsArray = makeSeats();
    let hallData = {
      name: formState.inputs.name.value,
      currentMovie: formState.inputs.currentMovie.value,
      address: formState.inputs.address.value,
      seats: seatsArray,
    };

    // const formData = new FormData();
    // formData.append("name", formState.inputs.name.value);
    // formData.append("currentMovie", formState.inputs.currentMovie.value);
    // formData.append("address", formState.inputs.address.value);
    // formData.append("seats", makeSeats());
    // console.log(formState, hallData, formData);
    // formData.append("creator", auth.userId);
    try {
      await sendRequest(
        "https://hidden-hollows-02729.herokuapp.com/api/hall/newHall",
        "POST",
        JSON.stringify(hallData),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/"); //redirect to home page
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmithandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="name"
          element="input"
          type="text"
          label="Hall Name"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Please enter a valid name"
        />

        <Input
          id="currentMovie"
          element="text"
          type="text"
          label="Current Movie"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Please enter a valid movie name"
        />

        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
          errorText="Please enter a valid address"
        />

        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewHall;
