import * as React from "react";

export interface Props {
  name: string;
}

const Example = ({ name }: Props) => <h1>Hello, {name}</h1>;

export default Example;
