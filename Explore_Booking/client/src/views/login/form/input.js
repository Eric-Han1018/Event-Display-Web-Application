import React from "react";
import TextField from "@material-ui/core/TextField";

import "./input.css";

class Input extends React.Component {
  render() {
    const { label, value, onChange, name } = this.props;

    return (
      <TextField
        name={name}
        label={label}
        defaultValue={value || ""}
        className="input"
        margin="normal"
        onChange={onChange}
      />
    );
  }
}

export default Input;
