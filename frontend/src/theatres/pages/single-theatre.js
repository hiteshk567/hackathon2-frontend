import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UI/error-modal";
import LoadingSpinner from "../../shared/components/UI/loadingSpinner";
import Theatreui from "./theatre-UI";

const SingleTheatre = (props) => {
  const hallId = useParams().hallId;
  const [loadedHall, setLoadedHall] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchHall = async () => {
      try {
        let responseData = await sendRequest(
          `https://hidden-hollows-02729.herokuapp.com/api/hall/open/${hallId}`
        ); // fetch url
        console.log(responseData.hall);
        // setLoadedHall({
        //   name: responseData.name,
        //   address: responseData.address,
        //   currentMovie: responseData.currentMovie,
        //   seats: responseData.seats,
        // });
        setLoadedHall(responseData.hall);
        console.log(loadedHall);
      } catch (err) {
        console.log("Single hall failed");
      }
    };
    fetchHall();
  }, [sendRequest, hallId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedHall && (
        <Theatreui
          name={loadedHall.name}
          address={loadedHall.address}
          currentMovie={loadedHall.currentMovie}
          seats={loadedHall.seats}
          hallId={hallId}
        />
      )}
    </React.Fragment>
  );
};

export default SingleTheatre;
