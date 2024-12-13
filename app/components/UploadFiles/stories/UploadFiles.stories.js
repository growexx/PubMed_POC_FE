/**
 *
 * UploadFiles.stories.js
 *
 */
import React from "react";
import UploadFiles from "../index";

export default {
  title: "Components/UploadFiles",
  component: UploadFiles
};
const Template = args => <UploadFiles {...args} />;

export const UploadFilesComponent = Template.bind({});
UploadFilesComponent.args = {};

UploadFilesComponent.storyName = "UploadFiles";
