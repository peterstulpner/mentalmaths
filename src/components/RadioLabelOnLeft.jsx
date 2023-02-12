import { Radio } from "semantic-ui-react";
import "./radioLabel.css";

export const RadioLabelOnLeft = ({ label, props }) => {
  return (
    <div class="radio-block">
      <label className="radio-label">{label}</label>
      <Radio className="toggle" {...props} />
    </div>
  );
};
