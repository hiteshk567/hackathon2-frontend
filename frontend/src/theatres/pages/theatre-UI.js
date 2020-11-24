import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useHistory } from "react-router-dom";

import "./theatre-UI.css";
import Card from "../../shared/components/UI/card";
import Node from "./node";
import LoadingSpinner from "../../shared/components/UI/loadingSpinner";
import ErrorModal from "../../shared/components/UI/error-modal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./theatre-UI.css";

const createNode = (row, col, isAvailable, bookedBy) => {
  return {
    row,
    col,
    isAvailable,
    bookedBy,
    isSelected: false,
  };
};

const initialGrid = (seats) => {
  const grid = [];
  for (let row = 0; row < 10; row++) {
    const currentRow = [];
    for (let col = 0; col < 10; col++) {
      currentRow.push(
        createNode(
          row,
          col,
          seats[row][col].isAvailable,
          seats[row][col].bookedBy
        )
      );
    }
    grid.push(currentRow);
  }
  return grid;
};

const TheatreUI = (props) => {
  const auth = useContext(AuthContext);
  const [grid, setGrid] = useState();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    let getGrid = initialGrid(props.seats);
    setGrid(getGrid);
  }, []);

  const addSeat = (row, col, isSelected) => {
    const newArray = [...grid];
    newArray[row][col].isSelected = true;
    setSelectedSeats((prevVal) => [...prevVal, { row, col, isSelected }]);
    setGrid(newArray);
    setTotalPrice(selectedSeats.length);
  };

  const history = useHistory();

  const removeSeat = (r, c) => {
    const newArray = [...grid];
    newArray[r][c].isSelected = false;
    setSelectedSeats((prevVal) =>
      prevVal.filter((seat) => {
        return r != seat.row && c != seat.col;
      })
    );
    setGrid(newArray);
    setTotalPrice(selectedSeats.length);
  };

  const handleClick = async () => {
    try {
      await sendRequest(
        "https://hidden-hollows-02729.herokuapp.com/api/hall/bookTickets",
        "POST",
        JSON.stringify({ bookedTickets: selectedSeats, hallId: props.hallId }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await sendRequest(
        `https://hidden-hollows-02729.herokuapp.com/api/hall/${props.hallId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      history.push(`/${auth.userId}/tickets`);
    } catch (err) {
      console.log("Something went wrong in frontend while deleting");
    }
  };

  return (
    <Card>
      <h2>{props.name}</h2>
      <hr />
      <h4> Address: {props.address}</h4>
      <h3>Current Movie : {props.currentMovie}</h3>
      {grid && grid.length > 0 && (
        <div className="grid">
          {grid.map((row) => {
            return (
              <div>
                {row.map((node) => {
                  const { row, col, isAvailable, bookedBy, isSelected } = node;
                  return (
                    <Node
                      row={row}
                      col={col}
                      isAvailable={isAvailable}
                      isSelected={isSelected}
                      bookedBy={bookedBy}
                      addSeat={addSeat}
                      removeSeat={removeSeat}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
      <div className="screen">
        <i class="fas fa-desktop fa-6x"></i>
      </div>
      {auth.isLoggedIn && selectedSeats && selectedSeats.length > 0 && (
        <button className="btn" onClick={handleClick}>
          BOOK TICKETS
        </button>
      )}
      {auth.isLoggedIn && auth.role == "admin" && (
        <button className="btn" onClick={handleDelete}>
          DELETE
        </button>
      )}
    </Card>
  );
};

export default TheatreUI;
