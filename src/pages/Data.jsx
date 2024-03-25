
.startquiz-container {
  width: 80%;
  }
/* .startquiz-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  flex-direction: column;
} */

.quiz-title {
  font-size: 34px;
  font-weight: bold;
  color: #333;
  text-align: center;
  width: 100%;
}

.question-container {
  display: flex;
  justify-content: center;
  font-weight: 500;
  font-size: 25px;
  height: auto;
  width: 100%;
  align-items: center;

}

.quiz-box {
  background-color: #fffbf7;
  margin-top: 10px;
  width: 100%;
  height: auto;
  padding: 10px;
  border-radius: 10px;
}

.datacontainer{
  width: 100%;
}
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1%;
}

.exit-button,
.next-button,
.previous-button {
  padding: 5px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}

.exit-button {
  background-color: #ff6347;
  color: #fff;
}

.exit-button:hover {
  background-color: #d32f2f;
}

.next-button {
  background-color: #4caf50;
  color: #fff;
  float: right;
}

.next-button:hover {
  background-color: #388e3c;
}

.previous-button {
  background-color: rgb(113, 157, 171);
  color: #fff;
  float: right;
}

.previous-button:hover {
  background-color: rgb(113, 157, 171);

}

.image-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2%;
}

/* .option {
  display: inline-block;
  margin-left: 35px;
}

.options-container {
  display: flex;
  flex-wrap: wrap;
} */
.option {
  float: left;
  margin-left: 35px;
  width: 100%;
}

.options-container {
  display: flex;
  flex-direction: column;
}



.rdbtn {
  margin-right: 10px;
}
