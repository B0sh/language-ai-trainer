import SlSelect from "@shoelace-style/shoelace/dist/react/select";
import SlOption from "@shoelace-style/shoelace/dist/react/option";
import * as React from "react";
import SlRadioGroup from "@shoelace-style/shoelace/dist/react/radio-group";
import SlRadioButton from "@shoelace-style/shoelace/dist/react/radio-button";
import SlInput from "@shoelace-style/shoelace/dist/react/input";

export const Settings: React.FC = () => {
  return (
    <div>
      {/* https://medium.com/@Neopric/add-internationalization-multi-language-translation-in-react-app-35ae8ee13237 */}
      <SlRadioGroup label="Select Lanauge" name="language" value="en">
        <SlRadioButton value="en">English</SlRadioButton>
        <SlRadioButton value="jp">Japanese</SlRadioButton>
      </SlRadioGroup>
      <SlSelect label="Microphone Settings">
        <SlOption value="1">Option 1</SlOption>
      </SlSelect>
      <SlInput label="API Key" type="text"></SlInput>
    </div>
  );
};
