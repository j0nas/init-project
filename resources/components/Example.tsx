import React, { FunctionComponent } from "react";

interface Props {
  name: string;
}

const Example: FunctionComponent<Props> = ({ name }: { name: string }) => (
  <h1>Hello, {name}</h1>
);

export default Example;
